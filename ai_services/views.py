"""AI Services views."""
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required


@login_required
def analyze_view(request, submission_id):
    from django.shortcuts import get_object_or_404
    from coding.models import Submission
    from ai_services.analyzer import analyze_submission

    submission = get_object_or_404(Submission, pk=submission_id, student=request.user)
    analysis = analyze_submission(submission)

    return JsonResponse({
        'success': True,
        'total_score': analysis.total_score,
        'correctness_score': analysis.correctness_score,
        'quality_score': analysis.quality_score,
        'readability_score': analysis.readability_score,
        'efficiency_score': analysis.efficiency_score,
        'best_practices_score': analysis.best_practices_score,
        'time_complexity': analysis.time_complexity,
        'space_complexity': analysis.space_complexity,
        'feedback': analysis.feedback,
        'suggestions': analysis.suggestions,
    })


@login_required
def analyze_code_direct(request):
    """Directly analyze code without a pre-existing submission."""
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)

    data = json.loads(request.body)
    code = data.get('code', '')
    language = data.get('language', 'python')

    from ai_services.analyzer import HeuristicAnalyzer
    analyzer = HeuristicAnalyzer()
    res = analyzer.analyze(code, language=language)

    return JsonResponse({
        'success': True,
        'overall_score': res['total_score'],
        **res,
    })


@login_required
def explain_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)

    data = json.loads(request.body)
    code = data.get('code', '')
    language = data.get('language', 'python')

    from ai_services.analyzer import explain_code
    explanation = explain_code(code, language)

    return JsonResponse({'success': True, 'explanation': explanation})


@login_required
def optimize_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)

    data = json.loads(request.body)
    code = data.get('code', '')
    language = data.get('language', 'python')

    from ai_services.analyzer import optimize_code
    result = optimize_code(code, language)

    return JsonResponse({
        'success': True,
        'optimized_code': result['optimized_code'],
        'suggestions': result['suggestions'],
        'original_complexity': result['original_complexity'],
        'optimized_complexity': result['optimized_complexity'],
    })
