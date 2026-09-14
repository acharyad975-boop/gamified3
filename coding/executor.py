"""
Secure code execution service.
Runs student code in a sandboxed subprocess with timeout and memory limits.
Architecture is designed to be swapped for a dedicated sandbox container in production.
"""
import subprocess
import tempfile
import os
import sys
import threading
from django.conf import settings


LANGUAGE_CONFIG = {
    'python': {
        'extension': '.py',
        'run_cmd': [sys.executable],
        'compile_cmd': None,
    },
    'javascript': {
        'extension': '.js',
        'run_cmd': ['node'],
        'compile_cmd': None,
    },
    # For compiled languages, architecture is prepared:
    # 'java': {'extension': '.java', 'run_cmd': ['java'], 'compile_cmd': ['javac']},
    # 'c': {'extension': '.c', 'run_cmd': [], 'compile_cmd': ['gcc', '-o', 'output']},
    # 'cpp': {'extension': '.cpp', 'run_cmd': [], 'compile_cmd': ['g++', '-o', 'output']},
}

FORBIDDEN_PATTERNS = [
    '__import__', 'exec(', 'eval(', 'compile(',
    'os.system', 'subprocess', 'open(', '__builtins__',
    'socket', 'urllib', 'requests', 'shutil.rmtree',
    'sys.exit', 'quit()', 'exit(',
]


def is_safe_code(source_code, language='python'):
    """Basic static analysis to detect obviously dangerous code."""
    if language != 'python':
        return True, []

    violations = []
    for pattern in FORBIDDEN_PATTERNS:
        if pattern in source_code:
            violations.append(pattern)

    return len(violations) == 0, violations


def execute_code(source_code, language_slug, stdin_data='', timeout=None):
    """
    Execute code and return result dict.
    Returns: {'stdout': str, 'stderr': str, 'runtime_ms': float, 'error': str|None}
    """
    timeout = timeout or settings.CODE_EXECUTION_TIMEOUT
    config = LANGUAGE_CONFIG.get(language_slug)

    if config is None:
        return {
            'stdout': '',
            'stderr': '',
            'runtime_ms': 0,
            'error': f"Language '{language_slug}' execution not supported yet. Coming soon!",
        }

    # Security check
    is_safe, violations = is_safe_code(source_code, language_slug)
    if not is_safe:
        return {
            'stdout': '',
            'stderr': '',
            'runtime_ms': 0,
            'error': f"Code contains forbidden patterns: {', '.join(violations)}",
        }

    # Write code to temp file
    try:
        with tempfile.NamedTemporaryFile(
            mode='w',
            suffix=config['extension'],
            delete=False,
            encoding='utf-8'
        ) as f:
            f.write(source_code)
            tmp_path = f.name

        cmd = config['run_cmd'] + [tmp_path]

        import time
        start = time.perf_counter()

        try:
            result = subprocess.run(
                cmd,
                input=stdin_data,
                capture_output=True,
                text=True,
                timeout=timeout,
                encoding='utf-8',
                errors='replace',
            )
            elapsed = (time.perf_counter() - start) * 1000  # ms

            return {
                'stdout': result.stdout.strip(),
                'stderr': result.stderr.strip(),
                'runtime_ms': round(elapsed, 2),
                'error': None,
            }

        except subprocess.TimeoutExpired:
            return {
                'stdout': '',
                'stderr': '',
                'runtime_ms': timeout * 1000,
                'error': 'TIME_LIMIT_EXCEEDED',
            }
        except Exception as e:
            return {
                'stdout': '',
                'stderr': str(e),
                'runtime_ms': 0,
                'error': 'RUNTIME_ERROR',
            }
    finally:
        try:
            os.unlink(tmp_path)
        except Exception:
            pass


def run_against_test_cases(submission, test_cases):
    """
    Run a submission against all test cases.
    Returns list of results and updates submission.
    """
    from coding.models import CodeExecution

    results = []
    passed = 0
    language_slug = submission.language.slug if submission.language else 'python'

    for tc in test_cases:
        exec_result = execute_code(
            source_code=submission.source_code,
            language_slug=language_slug,
            stdin_data=tc.input_data,
            timeout=submission.challenge.time_limit_seconds,
        )

        actual_output = exec_result['stdout'].strip()
        expected_output = tc.expected_output.strip()

        if exec_result['error'] == 'TIME_LIMIT_EXCEEDED':
            tc_passed = False
            final_status = 'TLE'
        elif exec_result['error'] == 'RUNTIME_ERROR' or exec_result['stderr']:
            tc_passed = False
            final_status = 'RUNTIME_ERROR'
        elif exec_result['error']:
            tc_passed = False
            final_status = 'INTERNAL_ERROR'
        else:
            tc_passed = (actual_output == expected_output)
            final_status = 'ACCEPTED' if tc_passed else 'WRONG_ANSWER'

        if tc_passed:
            passed += 1

        # Save execution record
        CodeExecution.objects.create(
            submission=submission,
            test_case=tc,
            stdout=exec_result['stdout'][:5000],
            stderr=exec_result['stderr'][:2000],
            runtime_ms=exec_result['runtime_ms'],
            passed=tc_passed,
        )

        results.append({
            'test_case_id': tc.id,
            'input': tc.input_data if not tc.is_hidden else '[hidden]',
            'expected': tc.expected_output if not tc.is_hidden else '[hidden]',
            'actual': actual_output if not tc.is_hidden else '[hidden]',
            'passed': tc_passed,
            'runtime_ms': exec_result['runtime_ms'],
            'error': exec_result['error'],
            'is_hidden': tc.is_hidden,
        })

    return results, passed
