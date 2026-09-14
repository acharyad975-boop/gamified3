import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from django.test import Client
from accounts.models import User

client = Client()

print("--- 1. Testing Unauthenticated Access ---")
resp = client.get('/login/')
assert resp.status_code in (301, 302), f"Login returned {resp.status_code}"
print("[PASS] Login page redirects to React app")

resp = client.get('/register/')
assert resp.status_code == 200, f"Register returned {resp.status_code}"
print("[PASS] Register page returns 200 OK")

print("\n--- 2. Testing Student Portal ---")
student = User.objects.get(email='student@demo.com')
client.force_login(student)

student_urls = [
    '/student/dashboard/',
    '/student/learning/',
    '/student/learning/python-programming/',
    '/student/coding/',
    '/student/coding/hello-world-python/',
    '/student/quiz/',
    '/student/progress/',
    '/student/settings/',
    '/student/leaderboard/',
    '/student/achievements/',
    '/student/rewards/',
    '/student/xp-history/',
    '/competitions/',
    '/subjects/',
    '/profile/demo_student/',
]

for url in student_urls:
    resp = client.get(url)
    assert resp.status_code == 200, f"Failed GET {url} with status {resp.status_code}"
    print(f"[PASS] {url} -> 200 OK")

print("\n--- 3. Testing Code Execution & Sandbox ---")
run_resp = client.post(
    '/student/coding/hello-world-python/run/',
    data=json.dumps({'code': 'print("Hello, World!")', 'language': 'python', 'input': ''}),
    content_type='application/json'
)
assert run_resp.status_code == 200, f"Run code failed: {run_resp.status_code}"
run_json = run_resp.json()
assert run_json.get('success') == True, f"Run code response: {run_json}"
print(f"[PASS] Code Sandbox Execution: Output='{run_json.get('output', '').strip()}' (Time: {run_json.get('execution_time_ms')}ms)")

print("\n--- 4. Testing Challenge Submission & XP Engine ---")
sub_resp = client.post(
    '/student/coding/hello-world-python/submit/',
    data=json.dumps({'code': 'print("Hello, World!")', 'language': 'python'}),
    content_type='application/json'
)
assert sub_resp.status_code == 200, f"Submit code failed: {sub_resp.status_code}"
sub_json = sub_resp.json()
assert sub_json.get('status') == 'ACCEPTED', f"Submit code status: {sub_json}"
print(f"[PASS] Challenge Submission Evaluation: {sub_json.get('status')} - XP Earned: {sub_json.get('xp_earned')}")

print("\n--- 5. Testing AI Analysis Engine ---")
ai_resp = client.post(
    '/api/ai/analyze/',
    data=json.dumps({'code': 'def solve(n):\n    return sum(range(n))', 'language': 'python'}),
    content_type='application/json'
)
assert ai_resp.status_code == 200, f"AI analyze failed: {ai_resp.status_code}"
ai_json = ai_resp.json()
assert ai_json.get('success') == True, f"AI response: {ai_json}"
print(f"[PASS] AI Code Analyzer: Score={ai_json.get('overall_score')}/100, Time Complexity={ai_json.get('time_complexity')}")

print("\n--- 6. Testing Teacher Portal ---")
teacher = User.objects.get(email='teacher@demo.com')
client.force_login(teacher)

teacher_urls = [
    '/teacher/dashboard/',
    '/teacher/lessons/',
    '/teacher/quizzes/',
    '/teacher/challenges/',
    '/teacher/students/',
]
for url in teacher_urls:
    resp = client.get(url)
    assert resp.status_code == 200, f"Teacher URL {url} failed: {resp.status_code}"
    print(f"[PASS] Teacher GET {url} -> 200 OK")

print("\n--- 7. Testing Admin Portal ---")
admin = User.objects.get(email='admin@demo.com')
client.force_login(admin)

admin_urls = [
    '/admin-dashboard/',
    '/admin-dashboard/users/',
]
for url in admin_urls:
    resp = client.get(url)
    assert resp.status_code == 200, f"Admin URL {url} failed: {resp.status_code}"
    print(f"[PASS] Admin GET {url} -> 200 OK")

print("\n=======================================================")
print("[SUCCESS] ALL 7 TEST SUITES PASSED WITH 100% SUCCESS RATE!")
print("=======================================================")
