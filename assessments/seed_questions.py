"""Seed questions for the 7-day onboarding assessment with shuffled, balanced options (A, B, C, D)."""
import sys
import os
import random
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
import django
django.setup()

from assessments.models import AssessmentQuestion

RAW_QUESTIONS = [
    # =========================================================================
    # DAY 1 — BASIC APTITUDE (Math, Fundamentals, English, Logic)
    # =========================================================================
    {
        'day_number': 1,
        'subject_tag': 'Computer Fundamentals',
        'question_type': 'MCQ',
        'title': 'Binary to Decimal Conversion',
        'prompt': 'What is the decimal equivalent of the 8-bit binary number 00010110?',
        'correct_text': '22',
        'distractor_texts': ['18', '26', '14'],
        'explanation': '0*128 + 0*64 + 0*32 + 1*16 + 0*8 + 1*4 + 1*2 + 0*1 = 16 + 4 + 2 = 22.',
        'difficulty': 'Beginner',
        'order': 1
    },
    {
        'day_number': 1,
        'subject_tag': 'Computer Fundamentals',
        'question_type': 'MCQ',
        'title': 'Memory Hierarchy Latency',
        'prompt': 'Which type of computer memory offers the fastest read/write access speed for the CPU?',
        'correct_text': 'CPU Registers and L1 Cache',
        'distractor_texts': ['RAM (Main Memory)', 'NVMe Solid State Drive (SSD)', 'Magnetic Hard Disk Drive (HDD)'],
        'explanation': 'CPU registers and L1 cache are built directly onto the CPU die, delivering sub-nanosecond access latency.',
        'difficulty': 'Beginner',
        'order': 2
    },
    {
        'day_number': 1,
        'subject_tag': 'Mathematics',
        'question_type': 'MCQ',
        'title': 'Modular Arithmetic',
        'prompt': 'What is the remainder when 37 is divided by 5 (i.e. 37 % 5)?',
        'correct_text': '2',
        'distractor_texts': ['7', '1', '4'],
        'explanation': '37 divided by 5 equals 7 with a remainder of 2 (37 = 7 * 5 + 2).',
        'difficulty': 'Beginner',
        'order': 3
    },
    {
        'day_number': 1,
        'subject_tag': 'Analytical Reasoning',
        'question_type': 'MCQ',
        'title': 'Boolean Logic Evaluation',
        'prompt': 'If A = True, B = False, and C = True, what is the boolean value of: (A AND B) OR (NOT B AND C)?',
        'correct_text': 'True',
        'distractor_texts': ['False', 'Undefined', 'Null'],
        'explanation': '(True AND False) evaluates to False. NOT B is True, so (True AND True) is True. False OR True evaluates to True.',
        'difficulty': 'Beginner',
        'order': 4
    },
    {
        'day_number': 1,
        'subject_tag': 'English & Communication',
        'question_type': 'MCQ',
        'title': 'Technical Precision in Documentation',
        'prompt': 'Which statement communicates an API timeout specification with the highest technical clarity?',
        'correct_text': 'The client aborts the HTTP connection if the backend server does not respond within 5000 milliseconds.',
        'distractor_texts': [
            'The client will stop working if the server takes kind of too long to reply.',
            'Sometimes the server takes a bit of time, so the client quits waiting.',
            'Waiting indefinitely for server packets might cause hanging.'
        ],
        'explanation': 'Technical documentation requires specific units of measurement (5000 ms) and unambiguous cause-and-effect terminology.',
        'difficulty': 'Beginner',
        'order': 5
    },

    # =========================================================================
    # DAY 2 — PROGRAMMING LOGIC (Variables, Conditions, Loops, Functions)
    # =========================================================================
    {
        'day_number': 2,
        'subject_tag': 'Programming Logic',
        'question_type': 'CODE_SNIPPET',
        'title': 'Variable Reassignment and Scope',
        'prompt': 'What will be the printed output of the following Python code snippet?',
        'code_snippet': 'x = 10\ny = x\nx = 25\nprint(y)',
        'correct_text': '10',
        'distractor_texts': ['25', '35', 'Error'],
        'explanation': 'In Python, y is bound to the integer object 10. Reassigning x = 25 does not alter y, which remains 10.',
        'difficulty': 'Beginner',
        'order': 1
    },
    {
        'day_number': 2,
        'subject_tag': 'Programming Logic',
        'question_type': 'CODE_SNIPPET',
        'title': 'Loop Boundary and Accumulation',
        'prompt': 'What is the final value printed by this loop?',
        'code_snippet': 'total = 0\nfor i in range(1, 4):\n    total += i\nprint(total)',
        'correct_text': '6',
        'distractor_texts': ['10', '3', '4'],
        'explanation': 'range(1, 4) iterates over 1, 2, and 3. total = 0 + 1 + 2 + 3 = 6.',
        'difficulty': 'Beginner',
        'order': 2
    },
    {
        'day_number': 2,
        'subject_tag': 'Programming Logic',
        'question_type': 'CODE_SNIPPET',
        'title': 'Conditional Short-Circuit Evaluation',
        'prompt': 'What does the following conditional statement print?',
        'code_snippet': 'score = 75\nif score >= 90:\n    print("A")\nelif score >= 70:\n    print("B")\nelse:\n    print("C")',
        'correct_text': 'B',
        'distractor_texts': ['A', 'C', 'B and C'],
        'explanation': 'score is 75. score >= 90 is False. The elif condition 75 >= 70 is True, printing "B".',
        'difficulty': 'Beginner',
        'order': 3
    },
    {
        'day_number': 2,
        'subject_tag': 'Programming Logic',
        'question_type': 'MCQ',
        'title': 'Key-Value Data Structure',
        'prompt': 'Which Python data structure stores associative pairs accessed by unique keys?',
        'correct_text': 'Dictionary',
        'distractor_texts': ['List', 'Tuple', 'Set'],
        'explanation': 'Dictionaries store key-value associations where values are retrieved via unique hashable keys in O(1) time.',
        'difficulty': 'Beginner',
        'order': 4
    },

    # =========================================================================
    # DAY 3 — SUBJECT EXPLORATION (Web, Database, Algorithms, Systems)
    # =========================================================================
    {
        'day_number': 3,
        'subject_tag': 'Web Development',
        'question_type': 'MCQ',
        'title': 'HTTP Protocol Status Codes',
        'prompt': 'Which HTTP status code signifies that a requested resource was successfully created on the server?',
        'correct_text': '201 Created',
        'distractor_texts': ['200 OK', '404 Not Found', '500 Internal Server Error'],
        'explanation': 'HTTP 201 Created is the standard response sent following successful resource creation via POST or PUT.',
        'difficulty': 'Intermediate',
        'order': 1
    },
    {
        'day_number': 3,
        'subject_tag': 'SQL & Databases',
        'question_type': 'MCQ',
        'title': 'Relational Foreign Keys',
        'prompt': 'What is the primary architectural purpose of a Foreign Key in a relational database table?',
        'correct_text': 'To enforce referential integrity between records in two related tables',
        'distractor_texts': [
            'To automatically encrypt sensitive database columns',
            'To accelerate text search across unindexed tables',
            'To allow duplicate primary key entries in the same table'
        ],
        'explanation': 'A Foreign Key points to the Primary Key of another table, guaranteeing referential consistency.',
        'difficulty': 'Intermediate',
        'order': 2
    },
    {
        'day_number': 3,
        'subject_tag': 'Computer Networks',
        'question_type': 'MCQ',
        'title': 'Transport Layer Protocols',
        'prompt': 'Why is UDP preferred over TCP for live video streaming and real-time multiplayer gaming?',
        'correct_text': 'UDP eliminates connection handshake and retransmission latency overhead',
        'distractor_texts': [
            'UDP guarantees 100% lossless packet delivery',
            'UDP automatically compresses high-resolution video streams',
            'UDP uses 256-bit encryption by default'
        ],
        'explanation': 'UDP is connectionless and prioritizes low transmission latency over packet retransmission guarantees.',
        'difficulty': 'Intermediate',
        'order': 3
    },

    # =========================================================================
    # DAY 4 — CONTENT FORMAT EFFECTIVENESS (Visual, Code, Text, Diagram)
    # =========================================================================
    {
        'day_number': 4,
        'subject_tag': 'Data Structures',
        'question_type': 'FORMAT_TEST',
        'format_type': 'practical_coding',
        'title': 'Stack LIFO Array Operations',
        'prompt': 'If a stack executes push(5), push(9), and then pop(), what is the return value of pop()?',
        'correct_text': '9',
        'distractor_texts': ['5', '14', '0'],
        'explanation': 'Stacks follow Last-In First-Out (LIFO). The last element pushed was 9, so pop() returns 9.',
        'difficulty': 'Beginner',
        'order': 1
    },
    {
        'day_number': 4,
        'subject_tag': 'Algorithms',
        'question_type': 'FORMAT_TEST',
        'format_type': 'visual_diagrams',
        'title': 'Binary Search Tree Traversal',
        'prompt': 'In a Binary Search Tree, where are values smaller than the root node stored?',
        'correct_text': 'In the left subtree of the node',
        'distractor_texts': ['In the right subtree of the node', 'Directly in the parent node', 'In a separate linked list'],
        'explanation': 'By BST definition, all node keys in the left subtree are strictly less than the root key.',
        'difficulty': 'Beginner',
        'order': 2
    },

    # =========================================================================
    # DAY 5 — PROBLEM SOLVING & ALGORITHMIC COMPLEXITY
    # =========================================================================
    {
        'day_number': 5,
        'subject_tag': 'Algorithms',
        'question_type': 'MCQ',
        'title': 'Algorithmic Big-O Time Complexity',
        'prompt': 'What is the average time complexity to find an element in a sorted array of size n using Binary Search?',
        'correct_text': 'O(log n)',
        'distractor_texts': ['O(n)', 'O(n²)', 'O(1)'],
        'explanation': 'Binary Search divides the remaining search interval in half on every step, yielding O(log n) logarithmic complexity.',
        'difficulty': 'Intermediate',
        'order': 1
    },
    {
        'day_number': 5,
        'subject_tag': 'Analytical Reasoning',
        'question_type': 'MCQ',
        'title': 'Number Series Pattern Recognition',
        'prompt': 'What is the next number in the sequence: 2, 6, 12, 20, 30, ___?',
        'correct_text': '42',
        'distractor_texts': ['40', '48', '36'],
        'explanation': 'Differences between consecutive numbers increase by 2: +4, +6, +8, +10, +12. 30 + 12 = 42.',
        'difficulty': 'Intermediate',
        'order': 2
    },
    {
        'day_number': 5,
        'subject_tag': 'Mathematics',
        'question_type': 'MCQ',
        'title': 'Percentage and Rate Calculation',
        'prompt': 'A server cluster processes 800 requests/sec. An optimization improves throughput by 25%. What is the new throughput?',
        'correct_text': '1000 requests/sec',
        'distractor_texts': ['950 requests/sec', '1050 requests/sec', '1200 requests/sec'],
        'explanation': '25% of 800 is 200. 800 + 200 = 1000 requests/second.',
        'difficulty': 'Beginner',
        'order': 3
    },

    # =========================================================================
    # DAY 6 — INTEREST & SPECIALIZATION (AI, Web, Cyber Security, Cloud)
    # =========================================================================
    {
        'day_number': 6,
        'subject_tag': 'Artificial Intelligence',
        'question_type': 'MCQ',
        'title': 'Supervised vs Unsupervised Learning',
        'prompt': 'Which machine learning scenario represents Supervised Learning?',
        'correct_text': 'Training a model to predict housing prices using historical records with known sale prices',
        'distractor_texts': [
            'Grouping customer purchases into clusters without existing category labels',
            'Compressing images using principal component dimensionality reduction',
            'Training a robot to balance via trial-and-error reward penalties'
        ],
        'explanation': 'Supervised learning trains models on labeled input-output pairs where ground truth target values are provided.',
        'difficulty': 'Intermediate',
        'order': 1
    },
    {
        'day_number': 6,
        'subject_tag': 'Cyber Security',
        'question_type': 'MCQ',
        'title': 'SQL Injection Defense',
        'prompt': 'What is the most effective engineering defense against SQL Injection vulnerabilities in backend web applications?',
        'correct_text': 'Using Parameterized Queries and Prepared Statements (or ORM abstractions)',
        'distractor_texts': [
            'Storing user passwords in client-side localStorage',
            'Increasing database connection timeout limits',
            'Disabling database indexing on user tables'
        ],
        'explanation': 'Parameterized queries treat user input strictly as literal data rather than executable SQL syntax commands.',
        'difficulty': 'Intermediate',
        'order': 2
    },

    # =========================================================================
    # DAY 7 — COMPREHENSIVE SYNTHESIS & APPLIED CS LOGIC
    # =========================================================================
    {
        'day_number': 7,
        'subject_tag': 'Software Engineering',
        'question_type': 'MCQ',
        'title': 'Git Version Control Branching',
        'prompt': 'In Git version control, which command creates and immediately switches to a new feature branch?',
        'correct_text': 'git checkout -b feature/auth (or git switch -c feature/auth)',
        'distractor_texts': [
            'git push --force origin master',
            'git merge --abort',
            'git rebase --skip'
        ],
        'explanation': 'The -b flag with git checkout creates a new branch and points HEAD to it simultaneously.',
        'difficulty': 'Intermediate',
        'order': 1
    },
    {
        'day_number': 7,
        'subject_tag': 'Programming Logic',
        'question_type': 'CODE_SNIPPET',
        'title': 'Recursive Function Termination',
        'prompt': 'What is the output of the recursive countdown function call countdown(3)?',
        'code_snippet': 'def countdown(n):\n    if n <= 0:\n        return "Done"\n    return str(n) + " " + countdown(n - 1)\n\nprint(countdown(3))',
        'correct_text': '3 2 1 Done',
        'distractor_texts': ['Done 1 2 3', '3 2 1', 'Error: Stack Overflow'],
        'explanation': 'countdown(3) concatenates "3 " + countdown(2), which concatenates "2 " + countdown(1), which concatenates "1 " + "Done" = "3 2 1 Done".',
        'difficulty': 'Intermediate',
        'order': 2
    }
]

def seed_shuffled_assessment_questions():
    # Use deterministic random seed for repeatable, perfectly balanced distribution
    rng = random.Random(42)

    AssessmentQuestion.objects.all().delete()

    letter_counts = {'A': 0, 'B': 0, 'C': 0, 'D': 0}

    # Desired balanced letter targets
    target_letters = ['B', 'D', 'A', 'C', 'B', 'A', 'D', 'C', 'C', 'B', 'A', 'D', 'B', 'C', 'A', 'D', 'B', 'C', 'A', 'D']

    for idx, q_data in enumerate(RAW_QUESTIONS):
        correct_text = q_data['correct_text']
        distractors = list(q_data['distractor_texts'])

        # Pick target position from balanced distribution
        target_pos = target_letters[idx % len(target_letters)]
        target_idx = ['A', 'B', 'C', 'D'].index(target_pos)

        # Shuffle distractors
        rng.shuffle(distractors)

        # Construct options placing correct_text at target_idx
        options_list = list(distractors)
        options_list.insert(target_idx, correct_text)

        # Format options with letter prefixes "A. ...", "B. ...", "C. ...", "D. ..."
        labels = ['A', 'B', 'C', 'D']
        formatted_options = []
        correct_answer_str = None

        for opt_idx, text in enumerate(options_list):
            lbl = labels[opt_idx]
            formatted = f"{lbl}. {text}"
            formatted_options.append(formatted)
            if opt_idx == target_idx:
                correct_answer_str = formatted
                letter_counts[lbl] += 1

        AssessmentQuestion.objects.create(
            day_number=q_data['day_number'],
            subject_tag=q_data['subject_tag'],
            question_type=q_data.get('question_type', 'MCQ'),
            format_type=q_data.get('format_type', 'none'),
            title=q_data['title'],
            prompt=q_data['prompt'],
            code_snippet=q_data.get('code_snippet', ''),
            options=formatted_options,
            correct_answer=correct_answer_str,
            explanation=q_data['explanation'],
            points=10,
            difficulty=q_data.get('difficulty', 'Beginner'),
            order=q_data['order']
        )

    total_q = AssessmentQuestion.objects.count()
    print(f"Seeded {total_q} diagnostic questions with balanced shuffled distribution across A, B, C, D:")
    for letter, count in sorted(letter_counts.items()):
        pct = (count / total_q) * 100
        print(f"  Option {letter}: {count} questions ({pct:.1f}%)")

if __name__ == '__main__':
    seed_shuffled_assessment_questions()
