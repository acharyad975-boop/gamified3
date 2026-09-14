"""Seed complete Subject → Module → Chapter → Multimodal Lesson database."""
import sys
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
import django
django.setup()

from subjects.models import Subject, ProgrammingLanguage
from curriculum.models import Module, Chapter, Lesson, Quiz, Question
from coding.models import CodingChallenge

SUBJECTS_HIERARCHY = [
    {
        'name': 'Python Programming',
        'slug': 'python-programming',
        'description': 'Master Python 3 from foundations, variables, control flow, functions, OOP, and data structures.',
        'icon': 'code',
        'color': '#3b82f6',
        'modules': [
            {
                'number': 1,
                'title': 'Python Fundamentals & Syntax',
                'chapters': [
                    {
                        'number': 1,
                        'title': 'First Steps & print() Execution',
                        'lessons': [
                            {
                                'title': 'The print() Function & Output Stream',
                                'description': 'Learn how Python executes code and sends output to the console stream.',
                                'content': 'Python programs are executed line-by-line by the Python interpreter. The built-in print() function takes string literals or expressions and writes them to stdout.',
                                'code_example': 'print("Hello, Adaptive CS World!")',
                                'code_language': 'python',
                                'animation_type': 'variable',
                                'animation_config': {
                                    'title': 'Python Interpreter Execution',
                                    'steps': [
                                        {'line': 1, 'code': 'msg = "Hello World"', 'action': 'alloc', 'var': 'msg', 'val': '"Hello World"', 'output': ''},
                                        {'line': 2, 'code': 'print(msg)', 'action': 'print', 'var': 'msg', 'val': '"Hello World"', 'output': 'Hello World'}
                                    ]
                                },
                                'visual_diagram_desc': '[Python Interpreter] ──reads──> [Source Code] ──evaluates──> [Output Stream Console]',
                                'audio_transcript': 'When Python encounters a print statement, it evaluates the argument and routes the resulting string to the system output console.'
                            }
                        ]
                    },
                    {
                        'number': 2,
                        'title': 'Variables & Memory Allocation',
                        'lessons': [
                            {
                                'title': 'Variables, Types & Memory Boxes',
                                'description': 'How Python binds names to dynamically allocated objects in memory.',
                                'content': 'In Python, a variable is a label pointing to an object in memory. Assigning a value binds the identifier to that memory location.',
                                'code_example': 'name = "Ada"\nage = 20\nage = 21',
                                'code_language': 'python',
                                'animation_type': 'variable',
                                'animation_config': {
                                    'title': 'Memory Box Variable Allocation',
                                    'steps': [
                                        {'line': 1, 'code': 'name = "Ada"', 'action': 'alloc', 'var': 'name', 'val': '"Ada"', 'output': ''},
                                        {'line': 2, 'code': 'age = 20', 'action': 'alloc', 'var': 'age', 'val': '20', 'output': ''},
                                        {'line': 3, 'code': 'age = 21', 'action': 'update', 'var': 'age', 'val': '21', 'output': ''}
                                    ]
                                },
                                'visual_diagram_desc': 'Variables as memory boxes with name tags: [name | "Ada"] and [age | 20 -> 21]',
                                'audio_transcript': 'Variables in Python behave like labeled boxes in memory. Reassigning a variable updates the object stored at that label.'
                            }
                        ]
                    }
                ]
            },
            {
                'number': 2,
                'title': 'Control Flow & Loops',
                'chapters': [
                    {
                        'number': 1,
                        'title': 'For Loops & Iteration Mechanics',
                        'lessons': [
                            {
                                'title': 'Step-by-Step For Loop Execution',
                                'description': 'Understand loop counters, range() generators, and iteration state.',
                                'content': 'A for loop iterates over items of any sequence (a list or string) in the order that they appear, executing the indented block once per element.',
                                'code_example': 'for i in range(3):\n    print(i)',
                                'code_language': 'python',
                                'animation_type': 'python_loop',
                                'animation_config': {
                                    'title': 'For Loop Step-by-Step Visualization',
                                    'range': 3
                                },
                                'visual_diagram_desc': '[i = 0] -> [Execute Body] -> [i = 1] -> [Execute Body] -> [i = 2] -> [Exit Loop]',
                                'audio_transcript': 'During each iteration of a for loop, the loop variable takes the next value generated by range, executes the inner block, and advances.'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        'name': 'Data Structures & Algorithms',
        'slug': 'data-structures-algorithms',
        'description': 'Linear structures, Stacks, Queues, Binary Search, Trees, Graphs, and Sorting algorithms.',
        'icon': 'layers',
        'color': '#8b5cf6',
        'modules': [
            {
                'number': 1,
                'title': 'Linear Data Structures',
                'chapters': [
                    {
                        'number': 1,
                        'title': 'Stacks (LIFO) & Queues (FIFO)',
                        'lessons': [
                            {
                                'title': 'Stack LIFO Push and Pop Mechanics',
                                'description': 'Understand Last-In First-Out operations and stack pointer management.',
                                'content': 'A Stack is a linear data structure that follows the LIFO (Last In First Out) principle. Elements can only be inserted (Push) and removed (Pop) from the top.',
                                'code_example': 'stack = []\nstack.append(10)\nstack.append(20)\ntop = stack.pop()',
                                'code_language': 'python',
                                'animation_type': 'stack',
                                'animation_config': {
                                    'title': 'Interactive Stack Push & Pop',
                                    'operations': ['push(10)', 'push(20)', 'pop()', 'push(30)']
                                },
                                'visual_diagram_desc': 'Vertical stack container: Push adds on top, Pop removes from top.',
                                'audio_transcript': 'Stacks operate strictly on the top element, making them ideal for undo operations, syntax parsing, and browser history.'
                            },
                            {
                                'title': 'Queue FIFO Enqueue and Dequeue',
                                'description': 'Understand First-In First-Out operations with Head and Tail pointers.',
                                'content': 'A Queue is a linear data structure following FIFO (First In First Out). Elements are added at the rear (Enqueue) and removed from the front (Dequeue).',
                                'code_example': 'from collections import deque\nq = deque()\nq.append(1)\nq.append(2)\nfront = q.popleft()',
                                'code_language': 'python',
                                'animation_type': 'queue',
                                'animation_config': {
                                    'title': 'Interactive FIFO Queue',
                                    'operations': ['enqueue(1)', 'enqueue(2)', 'dequeue()']
                                },
                                'visual_diagram_desc': 'Horizontal queue pipe: Items enter from Rear and exit from Front.',
                                'audio_transcript': 'Queues process requests in strict arrival order, essential for operating system schedulers and printer spoolers.'
                            }
                        ]
                    },
                    {
                        'number': 2,
                        'title': 'Searching & Sorting Algorithms',
                        'lessons': [
                            {
                                'title': 'Bubble Sort Step-by-Step Visualization',
                                'description': 'Visualizing adjacent pairwise comparisons and element swaps.',
                                'content': 'Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. Time complexity is O(n^2).',
                                'code_example': 'def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]',
                                'code_language': 'python',
                                'animation_type': 'sorting',
                                'animation_config': {
                                    'title': 'Bubble Sort Swapping Animation',
                                    'initial_array': [5, 2, 4, 1]
                                },
                                'visual_diagram_desc': 'Comparison [5] <-> [2] -> Swap -> [2, 5, 4, 1] -> Compare [5] <-> [4] -> Swap -> [2, 4, 5, 1]',
                                'audio_transcript': 'In Bubble Sort, the largest unsorted element bubbles up to its correct position at the end of each pass.'
                            },
                            {
                                'title': 'Binary Search Divide & Conquer',
                                'description': 'O(log n) logarithmic search by halving sorted search intervals.',
                                'content': 'Binary search compares the target value to the middle element of a sorted array. If they are not equal, the half in which the target cannot lie is eliminated.',
                                'code_example': 'low, high = 0, len(arr) - 1\nwhile low <= high:\n    mid = (low + high) // 2\n    if arr[mid] == target: return mid\n    elif arr[mid] < target: low = mid + 1\n    else: high = mid - 1',
                                'code_language': 'python',
                                'animation_type': 'binary_search',
                                'animation_config': {
                                    'title': 'Binary Search Halving Animation',
                                    'array': [2, 5, 8, 12, 16, 23, 38, 56, 72, 91],
                                    'target': 23
                                },
                                'visual_diagram_desc': '[Low...Mid...High] -> discard half -> [New Low...New Mid...High]',
                                'audio_transcript': 'Binary Search achieves logarithmic time complexity by cutting the search space in half with every single comparison.'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        'name': 'Web Development & React',
        'slug': 'web-development-react',
        'description': 'HTML5 semantics, modern CSS Flexbox/Grid, JavaScript ES6+, and React state/lifecycle components.',
        'icon': 'globe',
        'color': '#06b6d4',
        'modules': [
            {
                'number': 1,
                'title': 'React State & Lifecycle Visualization',
                'chapters': [
                    {
                        'number': 1,
                        'title': 'Component State & DOM Re-Rendering',
                        'lessons': [
                            {
                                'title': 'React useState Lifecycle & DOM Diffing',
                                'description': 'How state triggers virtual DOM reconciliation and user interface updates.',
                                'content': 'When component state changes in React via a setter function, React schedules a re-render, computes the virtual DOM diff, and patches only the modified DOM nodes.',
                                'code_example': 'const [count, setCount] = useState(0);\n<button onClick={() => setCount(count + 1)}>Increment</button>',
                                'code_language': 'javascript',
                                'animation_type': 'react_state',
                                'animation_config': {
                                    'title': 'React State Change & DOM Reconciliation'
                                },
                                'visual_diagram_desc': '[State Change] ──> [Virtual DOM Diff] ──> [Reconciliation] ──> [Real DOM Update]',
                                'audio_transcript': 'React keeps rendering fast by comparing virtual DOM snapshots and updating only the elements that actually changed.'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        'name': 'SQL & Relational Databases',
        'slug': 'sql-databases',
        'description': 'Relational schema, SQL queries, table filtering, aggregate grouping, and transactions.',
        'icon': 'database',
        'color': '#10b981',
        'modules': [
            {
                'number': 1,
                'title': 'SQL Query Filtering & Execution Order',
                'chapters': [
                    {
                        'number': 1,
                        'title': 'SELECT, FROM & WHERE Filtering',
                        'lessons': [
                            {
                                'title': 'SQL Query Engine Execution Order',
                                'description': 'Watch SQL filter rows step-by-step from table to result set.',
                                'content': 'SQL queries do not execute top-to-bottom. The database first evaluates the FROM clause, filters matching rows with WHERE, groups with GROUP BY, and finally projects columns with SELECT.',
                                'code_example': 'SELECT name, xp FROM students WHERE xp > 500;',
                                'code_language': 'sql',
                                'animation_type': 'sql_query',
                                'animation_config': {
                                    'title': 'SQL Table Filtering Engine'
                                },
                                'visual_diagram_desc': '[Source Table] ──[WHERE filter]──> [Filtered Dataset] ──[SELECT columns]──> [Result Set]',
                                'audio_transcript': 'The database query planner starts at the table source in the FROM clause, filters rows satisfying the WHERE condition, and extracts the requested columns.'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        'name': 'Artificial Intelligence & ML',
        'slug': 'ai-machine-learning',
        'description': 'Supervised learning, deep neural networks, heuristics, prompt engineering, and LLMs.',
        'icon': 'cpu',
        'color': '#ec4899',
        'modules': [
            {
                'number': 1,
                'title': 'Deep Learning & Neural Networks',
                'chapters': [
                    {
                        'number': 1,
                        'title': 'Forward Propagation in Neural Networks',
                        'lessons': [
                            {
                                'title': 'Forward Propagation & Neuron Activations',
                                'description': 'Visualizing input signals, weighted sum calculations, and non-linear activation.',
                                'content': 'In a feedforward neural network, input features pass through weighted connections to hidden layer neurons, where an activation function (like ReLU) introduces non-linearity before output prediction.',
                                'code_example': 'import torch.nn as nn\nmodel = nn.Sequential(nn.Linear(2, 4), nn.ReLU(), nn.Linear(4, 1))',
                                'code_language': 'python',
                                'animation_type': 'neural_network',
                                'animation_config': {
                                    'title': 'Neural Network Signal Flow'
                                },
                                'visual_diagram_desc': '[Inputs: X1, X2] ──weights──> [Hidden Neurons + ReLU] ──weights──> [Output: Y]',
                                'audio_transcript': 'Inputs are multiplied by learned synaptic weights, summed with a bias term, and activated to produce predictions.'
                            }
                        ]
                    }
                ]
            }
        ]
    }
]

def seed():
    # Clean previous modules
    Module.objects.all().delete()
    
    for s_data in SUBJECTS_HIERARCHY:
        subject, _ = Subject.objects.get_or_create(
            slug=s_data['slug'],
            defaults={
                'name': s_data['name'],
                'description': s_data['description'],
                'icon': s_data['icon'],
                'color': s_data['color'],
            }
        )

        for m_data in s_data.get('modules', []):
            module, _ = Module.objects.get_or_create(
                subject=subject,
                number=m_data['number'],
                defaults={
                    'title': m_data['title'],
                    'description': f"Module {m_data['number']}: {m_data['title']}",
                    'order': m_data['number']
                }
            )

            for c_data in m_data.get('chapters', []):
                chapter, _ = Chapter.objects.get_or_create(
                    module=module,
                    number=c_data['number'],
                    defaults={
                        'title': c_data['title'],
                        'description': f"Chapter {c_data['number']}: {c_data['title']}",
                        'order': c_data['number']
                    }
                )

                for les_data in c_data.get('lessons', []):
                    Lesson.objects.get_or_create(
                        chapter=chapter,
                        title=les_data['title'],
                        defaults={
                            'description': les_data['description'],
                            'content': les_data['content'],
                            'code_example': les_data.get('code_example', ''),
                            'code_language': les_data.get('code_language', 'python'),
                            'animation_type': les_data.get('animation_type', 'none'),
                            'animation_config': les_data.get('animation_config', {}),
                            'visual_diagram_desc': les_data.get('visual_diagram_desc', ''),
                            'audio_transcript': les_data.get('audio_transcript', ''),
                            'xp_reward': 60
                        }
                    )

    print(f"Seeding complete! Subjects: {Subject.objects.count()}, Modules: {Module.objects.count()}, Chapters: {Chapter.objects.count()}, Lessons: {Lesson.objects.count()}")

if __name__ == '__main__':
    seed()
