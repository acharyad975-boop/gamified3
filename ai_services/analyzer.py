"""
AI Code Analysis Service.
Uses real API if key is available, otherwise falls back to smart heuristic analysis.
"""
import re
import ast
from django.conf import settings


# ─── Heuristic Analyzer ────────────────────────────────────────────────────

class HeuristicAnalyzer:
    """Heuristic code analysis without an AI API."""

    def analyze(self, source_code, language='python', challenge_title='', is_correct=True):
        """Return a full analysis dict."""
        lines = source_code.strip().split('\n')
        line_count = len(lines)
        char_count = len(source_code)

        # Score components
        correctness = 40 if is_correct else 20
        quality = self._score_quality(source_code, lines, language)
        readability = self._score_readability(source_code, lines, language)
        efficiency = self._score_efficiency(source_code, lines, language)
        best_practices = self._score_best_practices(source_code, language)
        total = correctness + quality + readability + efficiency + best_practices

        time_complexity, space_complexity = self._estimate_complexity(source_code, lines)
        feedback = self._generate_feedback(source_code, lines, language, quality, readability, efficiency)
        suggestions = self._generate_suggestions(source_code, lines, language, quality, readability, efficiency)

        return {
            'correctness_score': correctness,
            'quality_score': quality,
            'readability_score': readability,
            'efficiency_score': efficiency,
            'best_practices_score': best_practices,
            'total_score': total,
            'time_complexity': time_complexity,
            'space_complexity': space_complexity,
            'feedback': feedback,
            'suggestions': suggestions,
        }

    def _score_quality(self, code, lines, lang):
        """Score code quality out of 20."""
        score = 14  # base

        # Has comments?
        comment_lines = sum(1 for l in lines if l.strip().startswith('#') or l.strip().startswith('//') or '"""' in l or "'''" in l)
        if comment_lines >= 2:
            score += 3
        elif comment_lines >= 1:
            score += 1

        # Function/class usage
        if re.search(r'\bdef \w+|\bfunction \w+|\bvoid \w+\b', code):
            score += 2

        # Consistent indentation
        indent_errors = sum(1 for l in lines if l and not l.startswith(' ' * (len(l) - len(l.lstrip()))))
        if indent_errors == 0:
            score += 1

        return min(score, 20)

    def _score_readability(self, code, lines, lang):
        """Score readability out of 15."""
        score = 10

        # Variable names (length check)
        identifiers = re.findall(r'\b([a-zA-Z_]\w*)\b', code)
        single_char = sum(1 for i in identifiers if len(i) == 1 and i not in ['i', 'j', 'k', 'n', 'm', 'x', 'y'])
        if single_char < 3:
            score += 2

        # Long lines
        long_lines = sum(1 for l in lines if len(l) > 100)
        if long_lines == 0:
            score += 2

        # Blank lines for structure
        blank_lines = sum(1 for l in lines if l.strip() == '')
        if blank_lines >= 1:
            score += 1

        return min(score, 15)

    def _score_efficiency(self, code, lines, lang):
        """Score efficiency out of 15."""
        score = 10

        # Nested loops penalty
        nested = len(re.findall(r'for.*:.*\n.*for|while.*:.*\n.*while', code, re.MULTILINE))
        if nested == 0:
            score += 3
        elif nested == 1:
            score += 1

        # Unnecessary operations
        if 'range(len(' not in code:
            score += 1

        # Recursion (advanced — bonus)
        if re.search(r'def (\w+)[^:]+:.*\1\(', code, re.DOTALL):
            score += 1

        return min(score, 15)

    def _score_best_practices(self, code, lang):
        """Score best practices out of 10."""
        score = 6

        if lang == 'python':
            if '__name__ == "__main__"' in code or '__name__ == \'__main__\'' in code:
                score += 1
            if re.search(r'\btry\b.*\bexcept\b', code, re.DOTALL):
                score += 1
            if re.search(r'def \w+\([^)]*\):\s*"""', code, re.DOTALL):
                score += 1
            if 'print(' in code and '=' not in code.split('print(')[0].split('\n')[-1]:
                score += 1

        return min(score, 10)

    def _estimate_complexity(self, code, lines):
        """Estimate time and space complexity."""
        nested_loops = len(re.findall(r'(for|while)[^:]*:[^}]*\n[^}]*(for|while)', code))
        single_loops = len(re.findall(r'\b(for|while)\b', code))
        recursion = bool(re.search(r'def (\w+)[^:]+:.*\1\(', code, re.DOTALL))

        if nested_loops >= 2:
            time_c = 'O(n³)'
        elif nested_loops == 1:
            time_c = 'O(n²)'
        elif recursion:
            time_c = 'O(n log n) – O(n²)'
        elif single_loops > 0:
            time_c = 'O(n)'
        else:
            time_c = 'O(1)'

        # Space
        uses_list = bool(re.search(r'\[.*\]|\blist\(', code))
        uses_dict = bool(re.search(r'\{.*:.*\}|\bdict\(', code))
        if uses_dict or uses_list:
            space_c = 'O(n)'
        else:
            space_c = 'O(1)'

        return time_c, space_c

    def _generate_feedback(self, code, lines, lang, quality, readability, efficiency):
        parts = []
        if quality >= 17:
            parts.append("Excellent code structure and organization.")
        elif quality >= 13:
            parts.append("Good code quality with room for improvement.")
        else:
            parts.append("Code quality needs improvement. Consider adding comments and using functions.")

        if readability >= 13:
            parts.append("Very readable code with clear variable names.")
        elif readability >= 10:
            parts.append("Decent readability. Try using more descriptive variable names.")
        else:
            parts.append("Readability needs work. Use longer, descriptive names and add whitespace.")

        if efficiency >= 12:
            parts.append("Efficient algorithm with good time complexity.")
        else:
            parts.append("Consider optimizing loops or using more efficient data structures.")

        return ' '.join(parts)

    def _generate_suggestions(self, code, lines, lang, quality, readability, efficiency):
        suggestions = []
        comment_lines = sum(1 for l in lines if l.strip().startswith('#'))
        if comment_lines == 0:
            suggestions.append("Add comments to explain your logic, especially for complex sections.")
        if 'def ' not in code and len(lines) > 10:
            suggestions.append("Break your code into functions for better organization and reusability.")
        if 'range(len(' in code and lang == 'python':
            suggestions.append("Use enumerate() instead of range(len(...)) for more Pythonic iteration.")
        if len(lines) > 0 and max(len(l) for l in lines) > 100:
            suggestions.append("Keep lines under 80-100 characters for better readability.")
        if not suggestions:
            suggestions.append("Great work! Consider edge cases and add input validation.")
        return '\n'.join(f"• {s}" for s in suggestions)

    def explain_code(self, source_code, language='python'):
        """Generate a line-by-line explanation."""
        lines = source_code.strip().split('\n')
        explanations = []
        for i, line in enumerate(lines, 1):
            stripped = line.strip()
            if not stripped:
                continue
            explanation = self._explain_line(stripped, language)
            explanations.append(f"Line {i}: `{stripped}`\n→ {explanation}")
        return '\n\n'.join(explanations)

    def _explain_line(self, line, lang):
        """Explain a single line of code."""
        if line.startswith('#') or line.startswith('//'):
            return "This is a comment. Comments explain the code to human readers and are ignored by the computer."
        if re.match(r'def \w+\(', line):
            name = re.search(r'def (\w+)\(', line).group(1)
            return f"This defines a function called '{name}'. A function is a reusable block of code."
        if re.match(r'class \w+', line):
            name = re.search(r'class (\w+)', line).group(1)
            return f"This defines a class called '{name}'. A class is a blueprint for creating objects."
        if re.match(r'\w+ = ', line):
            var = line.split('=')[0].strip()
            return f"This creates a variable called '{var}' and stores a value in it."
        if line.startswith('if ') or line.startswith('elif '):
            return "This is a conditional statement. It checks whether a condition is true before running the next block."
        if line.startswith('else:'):
            return "This 'else' block runs when the previous 'if' condition was false."
        if line.startswith('for '):
            return "This is a for loop. It repeats the indented code below for each item in a sequence."
        if line.startswith('while '):
            return "This is a while loop. It keeps repeating the indented code as long as the condition stays true."
        if line.startswith('return '):
            return "This sends a value back from the function to wherever it was called."
        if line.startswith('print('):
            return "This outputs text or a value to the screen."
        if line.startswith('import ') or line.startswith('from '):
            return "This imports a module (a collection of pre-built code) so you can use its features."
        if line.startswith('try:'):
            return "This starts a try block. Code here runs, and if an error occurs, it's caught by 'except'."
        if line.startswith('except'):
            return "This catches errors (exceptions) that happen inside the 'try' block above."
        return "This line performs an operation or calls a function."

    def optimize_code(self, source_code, language='python'):
        """Suggest optimizations for the code."""
        suggestions = []
        optimized = source_code

        if language == 'python':
            # range(len(x)) → enumerate
            if 'range(len(' in source_code:
                suggestions.append("Replace range(len(x)) with enumerate(x) for cleaner iteration.")
                optimized = re.sub(
                    r'for (\w+) in range\(len\((\w+)\)\):',
                    r'for \1, item in enumerate(\2):',
                    optimized
                )

            # List comprehension hints
            if re.search(r'for .* in .*:\s*\n\s*\w+\.append\(', source_code):
                suggestions.append("Consider using a list comprehension instead of a for loop with .append().")

            # String concatenation in loop
            if re.search(r'for .* in .*:.*\+= .*str', source_code, re.DOTALL):
                suggestions.append("Avoid string concatenation in loops. Use a list and ''.join() instead.")

        original_complexity, _ = HeuristicAnalyzer()._estimate_complexity(source_code, source_code.split('\n'))
        optimized_complexity, _ = HeuristicAnalyzer()._estimate_complexity(optimized, optimized.split('\n'))

        if not suggestions:
            suggestions.append("Your code is already well-optimized! No major improvements found.")

        return {
            'optimized_code': optimized,
            'suggestions': suggestions,
            'original_complexity': original_complexity,
            'optimized_complexity': optimized_complexity,
        }


# ─── Main Service Interface ─────────────────────────────────────────────────

def get_analyzer():
    """Return the appropriate analyzer based on available API keys."""
    # Future: add OpenAI/Google AI analyzers here
    return HeuristicAnalyzer()


def analyze_submission(submission):
    """Analyze a submission and save CodeAnalysis record."""
    from ai_services.models import CodeAnalysis

    analyzer = get_analyzer()
    is_correct = (submission.status == 'ACCEPTED')
    lang = submission.language.slug if submission.language else 'python'

    result = analyzer.analyze(
        source_code=submission.source_code,
        language=lang,
        challenge_title=submission.challenge.title,
        is_correct=is_correct,
    )

    # Save or update analysis
    analysis, created = CodeAnalysis.objects.update_or_create(
        submission=submission,
        defaults={
            'correctness_score': result['correctness_score'],
            'quality_score': result['quality_score'],
            'readability_score': result['readability_score'],
            'efficiency_score': result['efficiency_score'],
            'best_practices_score': result['best_practices_score'],
            'total_score': result['total_score'],
            'time_complexity': result['time_complexity'],
            'space_complexity': result['space_complexity'],
            'feedback': result['feedback'],
            'suggestions': result['suggestions'],
            'ai_provider': 'heuristic',
        }
    )

    # Award bonus XP for high quality code
    if is_correct and result['total_score'] >= 85:
        from gamification.engine import award_xp
        bonus = (result['total_score'] - 84) * 2  # 2 XP per point above 84
        try:
            award_xp(
                student=submission.student,
                amount=bonus,
                source='CODE_QUALITY',
                description=f"High code quality bonus ({result['total_score']}/100)",
                reference_id=submission.id,
            )
        except Exception:
            pass

    return analysis


def explain_code(source_code, language='python'):
    """Return a line-by-line explanation of code."""
    analyzer = get_analyzer()
    return analyzer.explain_code(source_code, language)


def optimize_code(source_code, language='python'):
    """Return optimization suggestions for code."""
    analyzer = get_analyzer()
    return analyzer.optimize_code(source_code, language)
