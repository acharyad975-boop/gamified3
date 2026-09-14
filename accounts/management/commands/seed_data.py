"""
Seed the database with initial data for Gamified Code Academy.
Usage: python manage.py seed_data
"""
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from django.utils import timezone
import random


class Command(BaseCommand):
    help = 'Seeds the database with sample subjects, lessons, quizzes, challenges, achievements, and rewards.'

    def add_arguments(self, parser):
        parser.add_argument('--clear', action='store_true', help='Clear existing data before seeding')
        parser.add_argument('--admin', action='store_true', help='Create a superuser admin account')

    def handle(self, *args, **options):
        if options['clear']:
            self.clear_data()

        self.stdout.write('Seeding database...\n')
        self.seed_languages()
        self.seed_subjects()
        self.seed_achievements()
        self.seed_rewards()
        if options['admin']:
            self.create_admin()
        self.create_demo_users()
        self.stdout.write(self.style.SUCCESS('\n[OK] Database seeded successfully!\n'))
        self.stdout.write('  Run: python manage.py runserver\n')
        self.stdout.write('  Demo student login: student@demo.com / Demo@1234\n')
        self.stdout.write('  Demo teacher login: teacher@demo.com / Demo@1234\n')
        if options['admin']:
            self.stdout.write('  Admin login: admin@demo.com / Admin@1234\n')

    def clear_data(self):
        self.stdout.write('Clearing existing data...')
        from subjects.models import Subject, ProgrammingLanguage
        from curriculum.models import Level, Lesson, Quiz, Question
        from coding.models import CodingChallenge, TestCase
        from gamification.models import Achievement, Reward, XPTransaction, StudentAchievement
        from accounts.models import User, StudentProfile, TeacherProfile
        Subject.objects.all().delete()
        ProgrammingLanguage.objects.all().delete()
        Achievement.objects.all().delete()
        Reward.objects.all().delete()
        XPTransaction.objects.all().delete()
        StudentAchievement.objects.all().delete()
        User.objects.all().delete()
        self.stdout.write(' Done.\n')

    def seed_languages(self):
        from subjects.models import ProgrammingLanguage
        languages = [
            {'name': 'Python', 'slug': 'python', 'extension': 'py',
             'icon': '🐍', 'color': '#3776AB'},
            {'name': 'JavaScript', 'slug': 'javascript', 'extension': 'js',
             'icon': '🟨', 'color': '#F7DF1E'},
            {'name': 'C', 'slug': 'c', 'extension': 'c',
             'icon': '🔷', 'color': '#A8B9CC'},
            {'name': 'Java', 'slug': 'java', 'extension': 'java',
             'icon': '☕', 'color': '#007396'},
        ]
        for lang_data in languages:
            lang, created = ProgrammingLanguage.objects.get_or_create(
                slug=lang_data['slug'], defaults=lang_data
            )
            if created:
                self.stdout.write(f'  [+] Language: {lang.name}')

    def seed_subjects(self):
        from subjects.models import Subject
        from curriculum.models import Level, Lesson, Quiz, Question
        from coding.models import CodingChallenge, TestCase
        from subjects.models import ProgrammingLanguage

        python_lang = ProgrammingLanguage.objects.filter(slug='python').first()

        subjects_data = [
            {
                'name': 'Python Programming',
                'slug': 'python-programming',
                'icon': 'ðŸ',
                'description': 'Master Python from basics to advanced topics',
                'bg_gradient': 'linear-gradient(135deg, #3776AB, #FFD43B)',
                'order': 1,
                'color': '#3776AB',
                'levels': [
                    {
                        'number': 1, 'title': 'Python Fundamentals',
                        'description': 'Variables, data types, input/output',
                        'lessons': [
                            {
                                'title': 'Introduction to Python',
                                'description': 'What is Python and why learn it?',
                                'content': '''<h2>Welcome to Python! ðŸ</h2>
<p>Python is one of the world's most popular programming languages. It's used in:</p>
<ul>
  <li>ðŸŒ Web development (Django, Flask)</li>
  <li>ðŸ¤– Artificial Intelligence &amp; Machine Learning</li>
  <li>ðŸ“Š Data Science &amp; Analytics</li>
  <li>ðŸ”§ Automation &amp; Scripting</li>
</ul>
<h3>Why Python?</h3>
<p>Python is known for its <strong>clean, readable syntax</strong> that reads almost like English. This makes it perfect for beginners and experts alike.</p>
<h3>Your First Python Program</h3>
<p>The classic first program in any language is "Hello, World!" â€” a simple program that prints a message to the screen.</p>''',
                                'code_example': 'print("Hello, World!")\nprint("Welcome to Python!")',
                                'code_language': 'python',
                                'xp_reward': 50, 'order': 1,
                            },
                            {
                                'title': 'Variables and Data Types',
                                'description': 'Store and work with different kinds of data',
                                'content': '''<h2>Variables in Python ðŸ“¦</h2>
<p>A <strong>variable</strong> is like a labeled box that stores a value. In Python, you create a variable simply by assigning a value to it:</p>
<h3>Python Data Types</h3>
<ul>
  <li><code>int</code> â€” whole numbers like <code>42</code>, <code>-10</code></li>
  <li><code>float</code> â€” decimal numbers like <code>3.14</code></li>
  <li><code>str</code> â€” text strings like <code>"Hello"</code></li>
  <li><code>bool</code> â€” <code>True</code> or <code>False</code></li>
</ul>
<p>Use <code>type(variable)</code> to check the type of any variable.</p>''',
                                'code_example': 'name = "Alice"\nage = 16\ngpa = 3.85\nis_student = True\n\nprint(f"Name: {name}")\nprint(f"Age: {age}")\nprint(f"Type of age: {type(age)}")',
                                'code_language': 'python',
                                'xp_reward': 60, 'order': 2,
                            },
                            {
                                'title': 'Input and Output',
                                'description': 'Get user input and display results',
                                'content': '''<h2>Input &amp; Output ðŸ–¥ï¸</h2>
<p>Programs become interactive when they can communicate with the user.</p>
<h3>Output with print()</h3>
<p>The <code>print()</code> function displays text on screen. You can print multiple values using commas or f-strings.</p>
<h3>Input with input()</h3>
<p>The <code>input()</code> function pauses the program and waits for the user to type something. It always returns a <strong>string</strong>, so convert it if you need a number.</p>''',
                                'code_example': 'name = input("Enter your name: ")\nyear = int(input("Enter your birth year: "))\nage = 2024 - year\nprint(f"Hello, {name}! You are {age} years old.")',
                                'code_language': 'python',
                                'xp_reward': 60, 'order': 3,
                            },
                        ],
                        'quiz': {
                            'title': 'Python Fundamentals Quiz',
                            'difficulty': 'BEGINNER',
                            'xp_reward': 100,
                            'time_limit_minutes': 10,
                            'passing_score': 60,
                            'questions': [
                                {
                                    'text': 'What does print() do in Python?',
                                    'type': 'MCQ',
                                    'options': [
                                        ('A', 'Displays output on screen'),
                                        ('B', 'Gets user input'),
                                        ('C', 'Creates a variable'),
                                        ('D', 'Imports a module'),
                                    ],
                                    'correct': 'A',
                                    'explanation': 'print() displays text or values on the screen.',
                                    'points': 10, 'order': 1,
                                },
                                {
                                    'text': 'Which of these is a valid Python variable name?',
                                    'type': 'MCQ',
                                    'options': [
                                        ('A', '2myVar'),
                                        ('B', 'my-var'),
                                        ('C', 'my_var'),
                                        ('D', 'my var'),
                                    ],
                                    'correct': 'C',
                                    'explanation': 'Variable names can contain letters, numbers, and underscores, but cannot start with a number or contain spaces/hyphens.',
                                    'points': 10, 'order': 2,
                                },
                                {
                                    'text': 'What data type is the value 3.14?',
                                    'type': 'MCQ',
                                    'options': [
                                        ('A', 'int'),
                                        ('B', 'str'),
                                        ('C', 'bool'),
                                        ('D', 'float'),
                                    ],
                                    'correct': 'D',
                                    'explanation': '3.14 is a decimal number, which is a float in Python.',
                                    'points': 10, 'order': 3,
                                },
                                {
                                    'text': 'How do you get user input in Python?',
                                    'type': 'MCQ',
                                    'options': [
                                        ('A', 'get()'),
                                        ('B', 'input()'),
                                        ('C', 'read()'),
                                        ('D', 'scan()'),
                                    ],
                                    'correct': 'B',
                                    'explanation': 'The input() function reads a line of text from the user.',
                                    'points': 10, 'order': 4,
                                },
                                {
                                    'text': 'Python is a case-sensitive language.',
                                    'type': 'TF',
                                    'options': [('True', 'True'), ('False', 'False')],
                                    'correct': 'True',
                                    'explanation': 'Python is case-sensitive: myVar and myvar are different variables.',
                                    'points': 10, 'order': 5,
                                },
                            ],
                        },
                        'challenges': [
                            {
                                'title': 'Hello World',
                                'slug': 'hello-world-python',
                                'description': 'Write a Python program that prints exactly "Hello, World!" to the screen.',
                                'difficulty': 'EASY',
                                'xp_reward': 50,
                                'time_limit_seconds': 5,
                                'memory_limit_mb': 64,
                                'starter_code': '# Write your solution here\nprint()',
                                'solution_code': 'print("Hello, World!")',
                                'hints': 'Use the print() function.',
                                'test_cases': [
                                    {'input': '', 'output': 'Hello, World!', 'hidden': False, 'order': 1},
                                ],
                            },
                            {
                                'title': 'Sum of Two Numbers',
                                'slug': 'sum-two-numbers',
                                'description': 'Read two integers from input and print their sum.\n\nInput: Two integers a and b on separate lines.\nOutput: The sum a + b.',
                                'difficulty': 'EASY',
                                'xp_reward': 80,
                                'time_limit_seconds': 5,
                                'memory_limit_mb': 64,
                                'starter_code': 'a = int(input())\nb = int(input())\n# Print the sum',
                                'solution_code': 'a = int(input())\nb = int(input())\nprint(a + b)',
                                'hints': 'Read each number with input() and convert to int.',
                                'test_cases': [
                                    {'input': '3\n5', 'output': '8', 'hidden': False, 'order': 1},
                                    {'input': '10\n20', 'output': '30', 'hidden': False, 'order': 2},
                                    {'input': '-5\n5', 'output': '0', 'hidden': True, 'order': 3},
                                ],
                            },
                        ],
                    },
                    {
                        'number': 2, 'title': 'Control Flow',
                        'description': 'Conditional statements and loops',
                        'lessons': [
                            {
                                'title': 'If Statements',
                                'description': 'Make decisions in your code',
                                'content': '''<h2>Conditional Logic ðŸ”€</h2>
<p>Programs often need to make decisions based on conditions. Python uses <code>if</code>, <code>elif</code>, and <code>else</code> for this.</p>
<h3>Comparison Operators</h3>
<ul>
  <li><code>==</code> Equal to</li>
  <li><code>!=</code> Not equal to</li>
  <li><code>&gt;</code> Greater than</li>
  <li><code>&lt;</code> Less than</li>
  <li><code>&gt;=</code> Greater than or equal</li>
  <li><code>&lt;=</code> Less than or equal</li>
</ul>''',
                                'code_example': 'score = int(input("Enter your score: "))\n\nif score >= 90:\n    grade = "A"\nelif score >= 80:\n    grade = "B"\nelif score >= 70:\n    grade = "C"\nelse:\n    grade = "F"\n\nprint(f"Your grade: {grade}")',
                                'code_language': 'python',
                                'xp_reward': 75, 'order': 1,
                            },
                            {
                                'title': 'For Loops',
                                'description': 'Repeat actions a fixed number of times',
                                'content': '''<h2>For Loops ðŸ”</h2>
<p>A <code>for</code> loop repeats a block of code for each item in a sequence. Combined with <code>range()</code>, it's perfect for counting loops.</p>
<h3>The range() Function</h3>
<ul>
  <li><code>range(5)</code> â†’ 0, 1, 2, 3, 4</li>
  <li><code>range(1, 6)</code> â†’ 1, 2, 3, 4, 5</li>
  <li><code>range(0, 10, 2)</code> â†’ 0, 2, 4, 6, 8</li>
</ul>''',
                                'code_example': '# Print a multiplication table\nn = 5\nfor i in range(1, 11):\n    print(f"{n} x {i} = {n * i}")',
                                'code_language': 'python',
                                'xp_reward': 80, 'order': 2,
                            },
                        ],
                        'quiz': None,
                        'challenges': [
                            {
                                'title': 'FizzBuzz',
                                'slug': 'fizzbuzz-python',
                                'description': 'Print numbers from 1 to N.\n- Print "Fizz" for multiples of 3\n- Print "Buzz" for multiples of 5\n- Print "FizzBuzz" for multiples of both\n\nInput: N (integer)\nOutput: One word/number per line.',
                                'difficulty': 'EASY',
                                'xp_reward': 100,
                                'time_limit_seconds': 5,
                                'memory_limit_mb': 64,
                                'starter_code': 'n = int(input())\nfor i in range(1, n+1):\n    # Your logic here\n    pass',
                                'solution_code': 'n = int(input())\nfor i in range(1, n+1):\n    if i % 15 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)',
                                'hints': 'Check divisibility by 15 first (both 3 and 5), then 3, then 5.',
                                'test_cases': [
                                    {'input': '5', 'output': '1\n2\nFizz\n4\nBuzz', 'hidden': False, 'order': 1},
                                    {'input': '15', 'output': '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz', 'hidden': True, 'order': 2},
                                ],
                            },
                            {
                                'title': 'Sum of N Numbers',
                                'slug': 'sum-n-numbers',
                                'description': 'Given N, calculate the sum of all integers from 1 to N inclusive.\n\nInput: Integer N\nOutput: Sum of 1 + 2 + ... + N',
                                'difficulty': 'EASY',
                                'xp_reward': 80,
                                'time_limit_seconds': 5,
                                'memory_limit_mb': 64,
                                'starter_code': 'n = int(input())\ntotal = 0\n# Add numbers from 1 to n\nprint(total)',
                                'solution_code': 'n = int(input())\nprint(n * (n + 1) // 2)',
                                'hints': 'There is a mathematical formula: n * (n+1) / 2. Or use a for loop.',
                                'test_cases': [
                                    {'input': '5', 'output': '15', 'hidden': False, 'order': 1},
                                    {'input': '100', 'output': '5050', 'hidden': True, 'order': 2},
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                'name': 'Web Development',
                'slug': 'web-development',
                'icon': 'ðŸŒ',
                'description': 'Build beautiful websites with HTML, CSS & JavaScript',
                'bg_gradient': 'linear-gradient(135deg, #E34F26, #264DE4)',
                'order': 2,
                'color': '#E34F26',
                'levels': [
                    {
                        'number': 1, 'title': 'HTML Basics',
                        'description': 'Structure web pages with HTML',
                        'lessons': [
                            {
                                'title': 'What is HTML?',
                                'description': 'Introduction to HyperText Markup Language',
                                'content': '''<h2>HTML â€” The Skeleton of the Web ðŸŒ</h2>
<p><strong>HTML</strong> (HyperText Markup Language) defines the structure and content of web pages. Every website you visit is built with HTML.</p>
<h3>HTML Structure</h3>
<p>An HTML document is made up of <strong>elements</strong> wrapped in <strong>tags</strong>:</p>
<ul>
  <li>Opening tag: <code>&lt;p&gt;</code></li>
  <li>Content: "Hello!"</li>
  <li>Closing tag: <code>&lt;/p&gt;</code></li>
</ul>
<h3>Basic HTML Document</h3>
<p>Every HTML page has a standard structure with <code>&lt;html&gt;</code>, <code>&lt;head&gt;</code>, and <code>&lt;body&gt;</code> sections.</p>''',
                                'code_example': '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>My First Page</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n  <p>This is my first web page.</p>\n</body>\n</html>',
                                'code_language': 'html',
                                'xp_reward': 50, 'order': 1,
                            },
                        ],
                        'quiz': None,
                        'challenges': [],
                    },
                ],
            },
            {
                'name': 'Data Structures',
                'slug': 'data-structures',
                'icon': 'ðŸ—‚ï¸',
                'description': 'Arrays, linked lists, stacks, queues, trees, and graphs',
                'bg_gradient': 'linear-gradient(135deg, #6C63FF, #00D4FF)',
                'order': 3,
                'color': '#6C63FF',
                'levels': [
                    {
                        'number': 1, 'title': 'Lists and Arrays',
                        'description': 'Store and manipulate sequences of data',
                        'lessons': [
                            {
                                'title': 'Python Lists',
                                'description': 'The most versatile data structure in Python',
                                'content': '''<h2>Python Lists ðŸ“‹</h2>
<p>A <strong>list</strong> is an ordered, mutable collection of items. Lists can store any type of data and are one of Python's most used data structures.</p>
<h3>List Operations</h3>
<ul>
  <li><code>append(item)</code> â€” Add to end</li>
  <li><code>insert(index, item)</code> â€” Insert at position</li>
  <li><code>remove(item)</code> â€” Remove first occurrence</li>
  <li><code>pop()</code> â€” Remove and return last item</li>
  <li><code>len(list)</code> â€” Get length</li>
  <li><code>list[i]</code> â€” Access by index (0-based)</li>
</ul>''',
                                'code_example': 'fruits = ["apple", "banana", "cherry"]\n\n# Add items\nfruits.append("date")\nfruits.insert(1, "avocado")\n\n# Access items\nprint(fruits[0])   # apple\nprint(fruits[-1])  # date (last)\n\n# Loop through list\nfor fruit in fruits:\n    print(f"I like {fruit}")\n\nprint(f"Total: {len(fruits)} fruits")',
                                'code_language': 'python',
                                'xp_reward': 80, 'order': 1,
                            },
                        ],
                        'quiz': None,
                        'challenges': [
                            {
                                'title': 'Find Maximum',
                                'slug': 'find-maximum',
                                'description': 'Given a list of N integers, find and print the maximum value.\n\nInput:\n- First line: N (number of integers)\n- Second line: N space-separated integers\n\nOutput: The maximum value.',
                                'difficulty': 'EASY',
                                'xp_reward': 80,
                                'time_limit_seconds': 5,
                                'memory_limit_mb': 64,
                                'starter_code': 'n = int(input())\nnums = list(map(int, input().split()))\n# Find maximum without using max()',
                                'solution_code': 'n = int(input())\nnums = list(map(int, input().split()))\nprint(max(nums))',
                                'hints': 'You can use the built-in max() function, or iterate through the list keeping track of the largest seen so far.',
                                'test_cases': [
                                    {'input': '5\n3 1 4 1 5', 'output': '5', 'hidden': False, 'order': 1},
                                    {'input': '4\n-1 -5 -2 -8', 'output': '-1', 'hidden': True, 'order': 2},
                                ],
                            },
                            {
                                'title': 'Reverse a List',
                                'slug': 'reverse-list',
                                'description': 'Read a list of N integers and print them in reverse order.\n\nInput:\n- First line: N\n- Second line: N space-separated integers\n\nOutput: Space-separated reversed list.',
                                'difficulty': 'EASY',
                                'xp_reward': 80,
                                'time_limit_seconds': 5,
                                'memory_limit_mb': 64,
                                'starter_code': 'n = int(input())\nnums = list(map(int, input().split()))\n# Print in reverse',
                                'solution_code': 'n = int(input())\nnums = list(map(int, input().split()))\nprint(*nums[::-1])',
                                'hints': 'Use slicing with [::-1] or the reversed() function.',
                                'test_cases': [
                                    {'input': '5\n1 2 3 4 5', 'output': '5 4 3 2 1', 'hidden': False, 'order': 1},
                                    {'input': '3\n10 20 30', 'output': '30 20 10', 'hidden': True, 'order': 2},
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                'name': 'Algorithms',
                'slug': 'algorithms',
                'icon': 'âš™ï¸',
                'description': 'Sorting, searching, recursion, dynamic programming',
                'bg_gradient': 'linear-gradient(135deg, #FF6B6B, #FF8C00)',
                'order': 4,
                'color': '#FF6B6B',
                'levels': [
                    {
                        'number': 1, 'title': 'Sorting Algorithms',
                        'description': 'Bubble sort, selection sort, merge sort',
                        'lessons': [
                            {
                                'title': 'Introduction to Sorting',
                                'description': 'Why sorting matters and different approaches',
                                'content': '''<h2>Sorting Algorithms âš™ï¸</h2>
<p>Sorting is the process of arranging elements in a specific order (ascending or descending). It's one of the most fundamental problems in computer science.</p>
<h3>Why Does Sorting Matter?</h3>
<ul>
  <li>Makes searching faster (binary search requires sorted data)</li>
  <li>Helps find duplicates easily</li>
  <li>Required in many real-world applications</li>
</ul>
<h3>Bubble Sort</h3>
<p>Bubble sort repeatedly steps through the list, compares adjacent elements and swaps them if they're in the wrong order. Time complexity: <strong>O(nÂ²)</strong>.</p>''',
                                'code_example': 'def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n    return arr\n\nnumbers = [64, 34, 25, 12, 22, 11, 90]\nresult = bubble_sort(numbers)\nprint("Sorted:", result)',
                                'code_language': 'python',
                                'xp_reward': 100, 'order': 1,
                            },
                        ],
                        'quiz': None,
                        'challenges': [
                            {
                                'title': 'Fibonacci Sequence',
                                'slug': 'fibonacci-sequence',
                                'description': 'Print the first N numbers of the Fibonacci sequence.\nThe sequence starts: 0, 1, 1, 2, 3, 5, 8, 13...\nEach number is the sum of the two preceding ones.\n\nInput: N (number of terms)\nOutput: Space-separated Fibonacci numbers.',
                                'difficulty': 'MEDIUM',
                                'xp_reward': 150,
                                'time_limit_seconds': 5,
                                'memory_limit_mb': 64,
                                'starter_code': 'n = int(input())\n# Generate first n Fibonacci numbers',
                                'solution_code': 'n = int(input())\na, b = 0, 1\nresult = []\nfor _ in range(n):\n    result.append(a)\n    a, b = b, a + b\nprint(*result)',
                                'hints': 'Keep track of two variables: the current and previous Fibonacci numbers.',
                                'test_cases': [
                                    {'input': '7', 'output': '0 1 1 2 3 5 8', 'hidden': False, 'order': 1},
                                    {'input': '1', 'output': '0', 'hidden': False, 'order': 2},
                                    {'input': '10', 'output': '0 1 1 2 3 5 8 13 21 34', 'hidden': True, 'order': 3},
                                ],
                            },
                            {
                                'title': 'Binary Search',
                                'slug': 'binary-search',
                                'description': 'Given a sorted list of N integers and a target value, find the index of the target using binary search. If not found, print -1.\n\nInput:\n- N (size of list)\n- N space-separated sorted integers\n- Target value\n\nOutput: Index (0-based) or -1.',
                                'difficulty': 'MEDIUM',
                                'xp_reward': 200,
                                'time_limit_seconds': 5,
                                'memory_limit_mb': 64,
                                'starter_code': 'n = int(input())\narr = list(map(int, input().split()))\ntarget = int(input())\n# Implement binary search\n# Print the index, or -1 if not found',
                                'solution_code': 'n = int(input())\narr = list(map(int, input().split()))\ntarget = int(input())\n\nleft, right = 0, n - 1\nresult = -1\nwhile left <= right:\n    mid = (left + right) // 2\n    if arr[mid] == target:\n        result = mid\n        break\n    elif arr[mid] < target:\n        left = mid + 1\n    else:\n        right = mid - 1\nprint(result)',
                                'hints': 'Use two pointers: left and right. Find the middle, compare with target, and eliminate half the search space.',
                                'test_cases': [
                                    {'input': '7\n1 3 5 7 9 11 13\n7', 'output': '3', 'hidden': False, 'order': 1},
                                    {'input': '5\n2 4 6 8 10\n5', 'output': '-1', 'hidden': True, 'order': 2},
                                ],
                            },
                        ],
                    },
                ],
            },
        ]

        for s_data in subjects_data:
            levels_data = s_data.pop('levels')
            subject, created = Subject.objects.get_or_create(
                slug=s_data['slug'],
                defaults=s_data,
            )
            if created:
                self.stdout.write(f'  [+] Subject: {subject.name}')

            for l_data in levels_data:
                lessons_data = l_data.pop('lessons')
                quiz_data = l_data.pop('quiz', None)
                challenges_data = l_data.pop('challenges', [])

                level, _ = Level.objects.get_or_create(
                    subject=subject,
                    number=l_data['number'],
                    defaults={**l_data, 'subject': subject},
                )

                for lesson_data in lessons_data:
                    lesson, _ = Lesson.objects.get_or_create(
                        level=level,
                        title=lesson_data['title'],
                        defaults={**lesson_data, 'level': level},
                    )

                if quiz_data and quiz_data.get('questions'):
                    questions_data = quiz_data.pop('questions')
                    quiz, created_quiz = Quiz.objects.get_or_create(
                        title=quiz_data['title'],
                        defaults={**quiz_data, 'level': level},
                    )
                    if created_quiz:
                        for q_data in questions_data:
                            options = q_data.pop('options')
                            q_type = q_data.pop('type', 'MCQ')
                            q_correct = q_data.pop('correct', 'A')
                            option_fields = {}
                            for key, (opt_key, opt_val) in zip(
                                ['option_a', 'option_b', 'option_c', 'option_d'],
                                options
                            ):
                                option_fields[key] = opt_val
                            Question.objects.create(
                                quiz=quiz,
                                question_type=q_type,
                                correct_answer=q_correct,
                                **option_fields,
                                **q_data,
                            )

                for c_data in challenges_data:
                    test_cases = c_data.pop('test_cases', [])
                    c_data.pop('solution_code', None)
                    challenge, created_ch = CodingChallenge.objects.get_or_create(
                        slug=c_data['slug'],
                        defaults={**c_data, 'subject': subject, 'level': level, 'language': python_lang},
                    )
                    if created_ch:
                        for tc in test_cases:
                            TestCase.objects.create(
                                challenge=challenge,
                                input_data=tc['input'],
                                expected_output=tc['output'],
                                is_hidden=tc['hidden'],
                                order=tc['order'],
                            )

    def seed_achievements(self):
        from gamification.models import Achievement
        achievements = [
            {'name': 'First Step', 'icon': '👣', 'description': 'Complete your first lesson',
             'condition_type': 'LESSONS_COMPLETED', 'condition_value': 1, 'xp_reward': 50},
            {'name': 'Bookworm', 'icon': '📚', 'description': 'Complete 10 lessons',
             'condition_type': 'LESSONS_COMPLETED', 'condition_value': 10, 'xp_reward': 150},
            {'name': 'Scholar', 'icon': '🎓', 'description': 'Complete 50 lessons',
             'condition_type': 'LESSONS_COMPLETED', 'condition_value': 50, 'xp_reward': 500},
            {'name': 'Code Rookie', 'icon': '💻', 'description': 'Solve your first coding challenge',
             'condition_type': 'CHALLENGES_COMPLETED', 'condition_value': 1, 'xp_reward': 100},
            {'name': 'Problem Solver', 'icon': '🧩', 'description': 'Solve 10 challenges',
             'condition_type': 'CHALLENGES_COMPLETED', 'condition_value': 10, 'xp_reward': 300},
            {'name': 'Code Wizard', 'icon': '🔮', 'description': 'Solve 50 challenges',
             'condition_type': 'CHALLENGES_COMPLETED', 'condition_value': 50, 'xp_reward': 1000},
            {'name': 'Quiz Taker', 'icon': '📝', 'description': 'Complete your first quiz',
             'condition_type': 'QUIZZES_COMPLETED', 'condition_value': 1, 'xp_reward': 75},
            {'name': 'Quiz Master', 'icon': '🎯', 'description': 'Complete 20 quizzes',
             'condition_type': 'QUIZZES_COMPLETED', 'condition_value': 20, 'xp_reward': 400},
            {'name': 'XP Collector', 'icon': '⚡', 'description': 'Earn 1,000 XP',
             'condition_type': 'TOTAL_XP', 'condition_value': 1000, 'xp_reward': 100},
            {'name': 'XP Hunter', 'icon': '🏹', 'description': 'Earn 5,000 XP',
             'condition_type': 'TOTAL_XP', 'condition_value': 5000, 'xp_reward': 250},
            {'name': 'XP Legend', 'icon': '🌟', 'description': 'Earn 25,000 XP',
             'condition_type': 'TOTAL_XP', 'condition_value': 25000, 'xp_reward': 1000},
            {'name': 'On Fire', 'icon': '🔥', 'description': 'Maintain a 7-day streak',
             'condition_type': 'STREAK_DAYS', 'condition_value': 7, 'xp_reward': 200},
            {'name': 'Unstoppable', 'icon': '💪', 'description': 'Maintain a 30-day streak',
             'condition_type': 'STREAK_DAYS', 'condition_value': 30, 'xp_reward': 1000},
        ]
        for a_data in achievements:
            a, created = Achievement.objects.get_or_create(
                name=a_data['name'], defaults=a_data
            )
            if created:
                self.stdout.write(f'  [+] Achievement: {a.name}')

    def seed_rewards(self):
        from gamification.models import Reward
        rewards = [
            {'name': 'Dark Theme Pro', 'icon': '🌙', 'description': 'Unlock a sleek obsidian dark theme',
             'reward_type': 'THEME', 'xp_cost': 500},
            {'name': 'Neon Theme', 'icon': '✨', 'description': 'Bright neon colors for your dashboard',
             'reward_type': 'THEME', 'xp_cost': 800},
            {'name': 'Dragon Avatar Item', 'icon': '🐉', 'description': 'Dragon frame for your avatar',
             'reward_type': 'AVATAR_ITEM', 'xp_cost': 1500},
            {'name': 'Gold Avatar Item', 'icon': '🥇', 'description': 'Shimmering gold avatar border',
             'reward_type': 'AVATAR_ITEM', 'xp_cost': 1000},
            {'name': 'Rainbow Badge', 'icon': '🌈', 'description': 'Exclusive rainbow profile badge',
             'reward_type': 'BADGE', 'xp_cost': 2000},
            {'name': 'Secret Challenge Access', 'icon': '📜', 'description': 'Unlock a secret master coding challenge',
             'reward_type': 'SPECIAL_CHALLENGE', 'xp_cost': 3000},
            {'name': 'Extra Quiz Attempt', 'icon': '🚀', 'description': 'Extra attempt on any quiz to boost your score',
             'reward_type': 'EXTRA_ATTEMPT', 'xp_cost': 500},
            {'name': 'Hint Token x5', 'icon': '💡', 'description': '5 hints for coding challenges',
             'reward_type': 'HINT', 'xp_cost': 300},
        ]
        for r_data in rewards:
            r, created = Reward.objects.get_or_create(name=r_data['name'], defaults=r_data)
            if created:
                self.stdout.write(f'  [+] Reward: {r.name}')

    def create_admin(self):
        from accounts.models import User
        if not User.objects.filter(email='admin@demo.com').exists():
            user = User.objects.create_superuser(
                username='admin',
                email='admin@demo.com',
                password='Admin@1234',
                first_name='Admin',
                last_name='User',
                role='ADMIN',
                is_email_verified=True,
            )
            self.stdout.write(f'  [ADMIN] admin@demo.com / Admin@1234')

    def create_demo_users(self):
        from accounts.models import User, StudentProfile, TeacherProfile
        from gamification.engine import award_xp

        # Demo student
        if not User.objects.filter(email='student@demo.com').exists():
            student = User.objects.create_user(
                username='demo_student',
                email='student@demo.com',
                password='Demo@1234',
                first_name='Alex',
                last_name='Coder',
                role='STUDENT',
                is_email_verified=True,
            )
            profile, _ = StudentProfile.objects.get_or_create(user=student)
            profile.school_class = 'Grade 10'
            profile.bio = 'Aspiring programmer! Love solving problems.'
            profile.current_streak = 5
            profile.longest_streak = 12
            profile.save()
            # Give some XP
            award_xp(student, 1250, 'LOGIN', 'Demo starting XP')
            self.stdout.write(f'  [STUDENT] student@demo.com / Demo@1234')

        # Demo teacher
        if not User.objects.filter(email='teacher@demo.com').exists():
            teacher = User.objects.create_user(
                username='demo_teacher',
                email='teacher@demo.com',
                password='Demo@1234',
                first_name='Ms. Sarah',
                last_name='Johnson',
                role='TEACHER',
                is_email_verified=True,
            )
            TeacherProfile.objects.get_or_create(user=teacher)
            self.stdout.write(f'  [TEACHER] teacher@demo.com / Demo@1234')

        # More demo students for leaderboard
        for i in range(1, 6):
            username = f'student_{i}'
            if not User.objects.filter(username=username).exists():
                s = User.objects.create_user(
                    username=username,
                    email=f'student{i}@demo.com',
                    password='Demo@1234',
                    first_name=random.choice(['Jordan', 'Taylor', 'Riley', 'Morgan', 'Casey']),
                    last_name=f'Student{i}',
                    role='STUDENT',
                    is_email_verified=True,
                )
                profile, _ = StudentProfile.objects.get_or_create(user=s)
                profile.current_streak = random.randint(0, 20)
                profile.challenges_completed = random.randint(0, 15)
                profile.quizzes_completed = random.randint(0, 10)
                profile.lessons_completed = random.randint(0, 20)
                profile.save()
                xp_amount = random.randint(200, 5000)
                award_xp(s, xp_amount, 'LOGIN', 'Demo XP')

