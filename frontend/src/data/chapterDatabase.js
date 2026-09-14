/**
 * Master Chapter Registry for Individual Interactive Learning Experiences
 * Every chapter has its own unique animation, AI explanation tiers, visual diagram, practical sandbox code, audio narration, and multi-tier exercises.
 */

export const CHAPTER_DATABASE = {
  'python-print': {
    id: 'python-print',
    slug: 'python-print',
    title: 'First Steps & print() Execution',
    subject: 'Python Programming',
    module: 'Module 1: Python Fundamentals',
    chapter: 'Chapter 1: The print() Function',
    animationType: 'python_print',
    aiExplanations: {
      beginner: 'In Python, the print() function sends any text or numbers inside its parentheses straight to your computer screen or terminal console.',
      intermediate: 'print(*objects, sep=" ", end="\\n", file=sys.stdout, flush=False) evaluates its arguments into string representations and flushes them to stdout.',
      advanced: 'CPython dispatches the PRINT_EXPR or CALL_FUNCTION opcode, which invokes PyFile_WriteString() on the active sys.stdout file descriptor with standard line buffering.'
    },
    visualDiagram: `┌───────────────────────┐
│ Source: print("Hello")│
└───────────┬───────────┘
            │ Tokenize & Parse
            v
┌───────────────────────┐
│ CPython Interpreter   │
└───────────┬───────────┘
            │ Evaluate Arguments
            v
┌───────────────────────┐
│ STDOUT Stream Buffer  │
└───────────┬───────────┘
            │ Flush
            v
   [ Console: Hello ]`,
    starterCode: `print("Hello, Adaptive CS World!")\nprint("Welcome to Chapter 1")`,
    audioTranscript: 'Welcome to Chapter 1. When Python executes a print statement, the interpreter parses the string argument and flushes the characters directly to your console stream.',
    exercises: {
      easy: { title: 'Easy: Print Your Name', prompt: 'Write a program that prints your name on the first line and your major on the second line.', hint: 'Use two separate print() calls.' },
      medium: { title: 'Medium: Custom Separators', prompt: 'Use print() with the sep=" - " parameter to print: Python - Java - C++.', hint: 'Pass three string arguments and sep=" - ".' },
      hard: { title: 'Hard: End Parameter Loop', prompt: 'Print numbers 1, 2, 3 on the same line separated by spaces using the end=" " argument.', hint: 'Set end=" " on each print.' }
    },
    quiz: {
      question: 'What is the default end character appended by Python\'s print() function?',
      options: ['\\n (Newline)', '\\t (Tab)', 'Space (" ")', 'Nothing (Empty string)'],
      correctAnswer: '\\n (Newline)',
      explanation: 'By default, Python print() has end="\\n", which automatically moves the cursor to a new line after printing.'
    },
    xpReward: 50
  },

  'python-variables-memory': {
    id: 'python-variables-memory',
    slug: 'python-variables-memory',
    title: 'Variables & Memory Allocation',
    subject: 'Python Programming',
    module: 'Module 1: Python Fundamentals',
    chapter: 'Chapter 2: Variables & Types',
    animationType: 'variables_memory',
    aiExplanations: {
      beginner: 'A variable is like a labeled storage box in your computer\'s memory. You write the name on the box and store numbers or text inside.',
      intermediate: 'In Python, variables are dynamic references (pointers) to objects in heap memory. Reassigning a variable rebinds the label to a new memory object.',
      advanced: 'Python utilizes PyObject pointers with reference counting (ob_refcnt). Immutable types like integers and strings allocate new memory upon modification rather than mutating in place.'
    },
    visualDiagram: `VARIABLE LABELS               RAM HEAP OBJECTS
┌───────────────┐              ┌────────────────┐
│     name      ├─────────────>│ "John" (str)   │
└───────────────┘              └────────────────┘

┌───────────────┐              ┌────────────────┐
│     age       ├─────────┬───>│ 20 (int) [Old] │
└───────────────┘         │    └────────────────┘
                          │    ┌────────────────┐
                          └───>│ 21 (int) [New] │
                               └────────────────┘`,
    starterCode: `name = "John"\nage = 20\n\n# Reassign age\nage = 21\nprint(f"{name} is {age} years old")`,
    audioTranscript: 'In Python, assigning a variable creates a label pointing to an object in memory. Changing a variable updates the pointer to reference the new value.',
    exercises: {
      easy: { title: 'Easy: Variable Assignment', prompt: 'Declare a variable called current_year and set it to 2026. Print it.', hint: 'current_year = 2026' },
      medium: { title: 'Medium: Variable Swapping', prompt: 'Given x = 5 and y = 10, swap their values in one line without a temporary variable.', hint: 'Use Python tuple unpacking: x, y = y, x' },
      hard: { title: 'Hard: Type Inspection', prompt: 'Create variables of type int, float, str, and bool. Print their types using type().', hint: 'print(type(val))' }
    },
    quiz: {
      question: 'What happens in memory when you execute age = 20 followed by age = 21 in Python?',
      options: [
        'A new integer object 21 is created and age points to it',
        'The existing memory cell 20 is overwritten in place',
        'An error occurs because age is already defined',
        'A second variable called age_2 is created automatically'
      ],
      correctAnswer: 'A new integer object 21 is created and age points to it',
      explanation: 'Integers in Python are immutable. Reassignment binds the name to a new PyLongObject in memory.'
    },
    xpReward: 50
  },

  'python-for-loops': {
    id: 'python-for-loops',
    slug: 'python-for-loops',
    title: 'For Loops & Iteration Mechanics',
    subject: 'Python Programming',
    module: 'Module 2: Control Flow & Loops',
    chapter: 'Chapter 1: For Loops',
    animationType: 'for_loops',
    aiExplanations: {
      beginner: 'A for loop lets you repeat a block of code multiple times without typing it over and over. range(3) will run your code 3 times: for 0, 1, and 2.',
      intermediate: 'Python for loops implement the iterator protocol (__iter__ and __next__). On each cycle, next() fetches the subsequent value until StopIteration is caught.',
      advanced: 'CPython compiles for loops into FOR_ITER bytecode instructions that directly interface with sequence iterators on the evaluation frame stack.'
    },
    visualDiagram: `┌──────────────┐     Has Next Item?
│ for i in     ├──────────────────────────┐
│ range(3)     │                          │ True
└──────┬───────┘                          v
       │                        ┌───────────────────────┐
       │ False                  │ Execute Loop Body     │
       v                        │ print(i)              │
[ Exit Loop ] <─────────────────┴───────────┬───────────┘
                                            │ Advance iterator
                                            └─> [ i = 0 -> 1 -> 2 ]`,
    starterCode: `for i in range(3):\n    print(f"Current iteration index: {i}")`,
    audioTranscript: 'The for loop begins with the iterator at index zero. Python executes the print statement and automatically advances to the next value until range is exhausted.',
    exercises: {
      easy: { title: 'Easy: Print 1 to 5', prompt: 'Write a for loop that prints numbers from 1 to 5 inclusive.', hint: 'Use range(1, 6).' },
      medium: { title: 'Medium: Sum of First 10 Numbers', prompt: 'Calculate and print the sum of integers from 1 to 10 using a loop.', hint: 'total = 0; total += i' },
      hard: { title: 'Hard: Multiplication Table', prompt: 'Use nested for loops to generate a 3x3 multiplication grid.', hint: 'Outer loop i in range(1,4), inner loop j in range(1,4).' }
    },
    quiz: {
      question: 'What is the exact sequence of numbers produced by range(1, 5)?',
      options: ['1, 2, 3, 4', '1, 2, 3, 4, 5', '0, 1, 2, 3, 4', '2, 3, 4, 5'],
      correctAnswer: '1, 2, 3, 4',
      explanation: 'In Python range(start, stop), the stop bound is exclusive, so range(1, 5) stops before 5.'
    },
    xpReward: 50
  },

  'python-while-loops': {
    id: 'python-while-loops',
    slug: 'python-while-loops',
    title: 'While Loops & Conditional Iteration',
    subject: 'Python Programming',
    module: 'Module 2: Control Flow & Loops',
    chapter: 'Chapter 2: While Loops',
    animationType: 'while_loops',
    aiExplanations: {
      beginner: 'A while loop keeps running again and again as long as a condition stays True. Make sure you increase your counter so it doesn\'t run forever!',
      intermediate: 'A while loop evaluates a boolean expression prior to each iteration. If the expression evaluates to True, the block executes; if False, execution branches to the loop exit.',
      advanced: 'Compiled as POP_JUMP_IF_FALSE opcodes. Must guard against infinite loops by ensuring state mutations within the loop body eventually negate the predicate.'
    },
    visualDiagram: `      ┌────────────────┐
      │   count = 0    │
      └───────┬────────┘
              v
       /──────────────\\
      < count < 3 ?    >
       \\──────────────/
         │ True      │ False
         v           v
┌─────────────────┐ [ End Loop ]
│ print(count)    │
│ count += 1      │
└────────┬────────┘
         │
         └───────────> (Repeat check)`,
    starterCode: `count = 0\nwhile count < 3:\n    print(f"Count is: {count}")\n    count += 1`,
    audioTranscript: 'Before each cycle, the while loop checks if the count is less than three. Since count increments on each pass, it terminates when count reaches three.',
    exercises: {
      easy: { title: 'Easy: Countdown', prompt: 'Write a while loop that counts down from 5 to 1 and then prints "Blast off!".', hint: 'timer = 5; while timer > 0: timer -= 1' },
      medium: { title: 'Medium: Power of Two', prompt: 'Find the smallest power of 2 greater than 1000 using a while loop.', hint: 'val = 1; while val <= 1000: val *= 2' },
      hard: { title: 'Hard: Collatz Conjecture', prompt: 'Implement the 3n + 1 sequence for n = 6 until n reaches 1.', hint: 'If n is even n //= 2 else n = 3*n + 1' }
    },
    quiz: {
      question: 'What happens if you omit the `count += 1` line inside a `while count < 3:` loop?',
      options: ['The loop runs infinitely because count never changes', 'Python throws a SyntaxError', 'The loop executes once and stops', 'count automatically increments by default'],
      correctAnswer: 'The loop runs infinitely because count never changes',
      explanation: 'Without updating the loop condition variable, count remains 0, causing the condition 0 < 3 to remain True indefinitely.'
    },
    xpReward: 50
  },

  'python-break-continue': {
    id: 'python-break-continue',
    slug: 'python-break-continue',
    title: 'Break and Continue Statements',
    subject: 'Python Programming',
    module: 'Module 2: Control Flow & Loops',
    chapter: 'Chapter 3: Jump Statements',
    animationType: 'break_continue',
    aiExplanations: {
      beginner: 'break stops the entire loop immediately and leaves. continue skips only the current step and jumps straight to the next round.',
      intermediate: 'break executes an early escape jump outside the enclosing loop block. continue aborts the remainder of the active iteration and transfers control to the next iterator step.',
      advanced: 'break triggers the JUMP_ABSOLUTE or BREAK_LOOP bytecode, terminating loop frames. continue performs a jump to the loop header instruction without clearing loop state.'
    },
    visualDiagram: `BREAK FLOW:
[0] ──> [1] ──> [2] ──> [3: if i == 3: break] ──X [TERMINATED] (4 never reached)

CONTINUE FLOW:
[0] ──> [1] ──> [2: if i == 2: continue] ──↷ (skip print) ──> [3] ──> [4]`,
    starterCode: `# Demonstrate Break\nfor i in range(5):\n    if i == 3:\n        break\n    print("Break demo:", i)\n\n# Demonstrate Continue\nfor j in range(5):\n    if j == 2:\n        continue\n    print("Continue demo:", j)`,
    audioTranscript: 'Notice how break immediately exits the loop when i equals 3. In contrast, continue skips only iteration two and proceeds directly to iteration three.',
    exercises: {
      easy: { title: 'Easy: Stop at First Negative', prompt: 'Loop through [4, 8, -2, 10, 5] and break when you encounter the first negative number.', hint: 'if x < 0: break' },
      medium: { title: 'Medium: Skip Vowels', prompt: 'Iterate through a string and print only consonant characters using continue.', hint: 'if char.lower() in "aeiou": continue' },
      hard: { title: 'Hard: Prime Number Finder', prompt: 'Check if a number is prime using a for-else loop and break.', hint: 'break if divisible; else clause executes if no break.' }
    },
    quiz: {
      question: 'In a loop running from 0 to 4, if `if i == 2: continue` executes, which values are printed?',
      options: ['0, 1, 3, 4', '0, 1', '2, 3, 4', '0, 1, 2, 3, 4'],
      correctAnswer: '0, 1, 3, 4',
      explanation: 'The continue statement skips the rest of the loop body when i == 2, so 2 is skipped and 0, 1, 3, 4 are printed.'
    },
    xpReward: 50
  },

  'python-functions-params': {
    id: 'python-functions-params',
    slug: 'python-functions-params',
    title: 'Defining Functions & Parameters',
    subject: 'Python Programming',
    module: 'Module 3: Functions & Scope',
    chapter: 'Chapter 1: Function Definitions',
    animationType: 'functions_params',
    aiExplanations: {
      beginner: 'A function is a reusable block of code that does a specific job. You can pass inputs called parameters to customize its behavior.',
      intermediate: 'Functions encapsulate reusable logic with isolated local namespaces. When called, a new stack frame is pushed to allocate parameter bindings.',
      advanced: 'CPython creates a PyCodeObject. Calling a function builds a PyFrameObject with f_localsplus array storing fast local variable slots.'
    },
    visualDiagram: `CALL STACK EXECUTION:
1. Global Scope: greet("John") called
   ┌────────────────────────────────────────┐
   │ [greet() Stack Frame]                  │
   │ Local Parameter: name = "John"         │
   │ Body: print("Hello", name)             │
   └────────────────────────────────────────┘
2. Execution finishes -> Frame popped -> Back to Global Scope`,
    starterCode: `def greet(name):\n    """Greets the user by name."""\n    print(f"Hello, {name}!")\n\ngreet("John")\ngreet("Ada")`,
    audioTranscript: 'When greet is called with argument John, Python pushes a new stack frame, assigns parameter name to John, executes the function body, and pops the frame.',
    exercises: {
      easy: { title: 'Easy: Square Function', prompt: 'Write a function square(n) that takes a number and prints its square.', hint: 'print(n * n)' },
      medium: { title: 'Medium: Default Parameters', prompt: 'Create a function greet_user(name, greeting="Welcome") with a default argument.', hint: 'def greet_user(name, greeting="Welcome"):' },
      hard: { title: 'Hard: Variable Arguments', prompt: 'Write a function sum_all(*args) that calculates the sum of any number of passed arguments.', hint: 'return sum(args)' }
    },
    quiz: {
      question: 'Where are local variables stored when a Python function is executing?',
      options: ['In a stack frame on the call stack', 'Directly in the global namespace', 'On the hard disk', 'In a static file'],
      correctAnswer: 'In a stack frame on the call stack',
      explanation: 'Every function call creates an independent stack frame containing its local variables and parameters.'
    },
    xpReward: 50
  },

  'python-return-callstack': {
    id: 'python-return-callstack',
    slug: 'python-return-callstack',
    title: 'Return Values & Call Stack Resolution',
    subject: 'Python Programming',
    module: 'Module 3: Functions & Scope',
    chapter: 'Chapter 2: Return Statements',
    animationType: 'return_callstack',
    aiExplanations: {
      beginner: 'The return keyword sends an answer back from the function to the place where it was called, allowing you to store it in a variable.',
      intermediate: 'return yields a computed object reference back to the caller frame and terminates function execution immediately.',
      advanced: 'CPython executes RETURN_VALUE opcode which pops the top value from the value stack and transfers it to the calling frame.'
    },
    visualDiagram: `1. Call: result = add(5, 3)
2. Frame: a = 5, b = 3 -> 5 + 3 = 8
3. Return: return 8
4. Result: result = 8 in Global RAM`,
    starterCode: `def add(a, b):\n    return a + b\n\nresult = add(5, 3)\nprint(f"Calculated sum: {result}")`,
    audioTranscript: 'The add function computes 5 plus 3, returns 8 to the caller, and stores the answer into the variable result in global memory.',
    exercises: {
      easy: { title: 'Easy: Area Calculator', prompt: 'Write a function calculate_area(length, width) that returns the product.', hint: 'return length * width' },
      medium: { title: 'Medium: Multiple Returns', prompt: 'Write a function min_max(numbers) that returns both the smallest and largest values as a tuple.', hint: 'return min(numbers), max(numbers)' },
      hard: { title: 'Hard: Recursive Factorial', prompt: 'Implement factorial(n) recursively with a base case of n <= 1.', hint: 'return n * factorial(n - 1)' }
    },
    quiz: {
      question: 'What is returned by a Python function that does not have an explicit `return` statement?',
      options: ['None', '0', 'False', 'An empty string ""'],
      correctAnswer: 'None',
      explanation: 'If a Python function reaches the end of its body without a return statement, it implicitly returns None.'
    },
    xpReward: 50
  },

  'python-lists-tuples': {
    id: 'python-lists-tuples',
    slug: 'python-lists-tuples',
    title: 'Lists, Tuples & Zero-Indexed Arrays',
    subject: 'Python Programming',
    module: 'Module 4: Data Structures',
    chapter: 'Chapter 1: Lists & Tuples',
    animationType: 'lists_tuples',
    aiExplanations: {
      beginner: 'A list holds an ordered collection of items in square brackets [10, 20, 30]. The first item is at index 0, the second at index 1, and so on.',
      intermediate: 'Python lists are dynamic arrays (pointers to PyObjects). Appending is amortized O(1), and indexing is O(1). Tuples are immutable equivalents.',
      advanced: 'List growth follows a geometric reallocation formula (0, 4, 8, 16, 25, 35...) to guarantee amortized constant time appends.'
    },
    visualDiagram: `INDEX:     [0]       [1]       [2]
VALUES:  ┌─────┐   ┌─────┐   ┌─────┐
         │ 10  │   │ 20  │   │ 30  │
         └─────┘   └─────┘   └─────┘`,
    starterCode: `numbers = [10, 20, 30]\n\n# Access index 1\nprint("Index 1:", numbers[1])\n\n# Append item\nnumbers.append(40)\nprint("After append:", numbers)`,
    audioTranscript: 'In Python, list elements are accessed using zero-based indices. Accessing numbers bracket 1 returns the second element, 20.',
    exercises: {
      easy: { title: 'Easy: List Operations', prompt: 'Create a list of 3 fruits. Add a fourth fruit using .append() and print the list.', hint: 'fruits.append("mango")' },
      medium: { title: 'Medium: List Slicing', prompt: 'Given nums = [0, 1, 2, 3, 4, 5], extract [1, 2, 3] using slice notation.', hint: 'nums[1:4]' },
      hard: { title: 'Hard: List Comprehension', prompt: 'Create a list of squares of even numbers from 1 to 10 using a list comprehension.', hint: '[x**2 for x in range(1, 11) if x % 2 == 0]' }
    },
    quiz: {
      question: 'What is the main difference between a list and a tuple in Python?',
      options: ['Lists are mutable (can be changed); tuples are immutable', 'Tuples are faster for searching by name', 'Lists can only store numbers', 'Tuples use square brackets'],
      correctAnswer: 'Lists are mutable (can be changed); tuples are immutable',
      explanation: 'Lists can have elements added, removed, or modified after creation; tuples cannot be modified once created.'
    },
    xpReward: 50
  },

  'python-dicts-sets': {
    id: 'python-dicts-sets',
    slug: 'python-dicts-sets',
    title: 'Dictionaries & Sets (Hash Tables)',
    subject: 'Python Programming',
    module: 'Module 4: Data Structures',
    chapter: 'Chapter 2: Hash Structures',
    animationType: 'dicts_sets',
    aiExplanations: {
      beginner: 'A dictionary stores information in key-value pairs, like looking up a word in a real dictionary: "name" gives you "John". Sets store unique items with no duplicates.',
      intermediate: 'Dictionaries and sets are hash tables. Keys must be hashable and immutable. Lookup, insertion, and deletion operate in average O(1) time complexity.',
      advanced: 'Python 3.7+ uses compact dictionaries with a separate sparse hash index array and a dense entries table, preserving insertion order with minimal memory overhead.'
    },
    visualDiagram: `DICTIONARY HASH MAP:
"name" ──hash──> [Slot 0] ──> "John"
"age"  ──hash──> [Slot 1] ──> 20

SET DEDUPLICATION:
{1, 2, 2, 3} ──deduplicate──> {1, 2, 3}`,
    starterCode: `student = {\n    "name": "John",\n    "age": 20\n}\n\nprint("Name:", student["name"])\n\n# Sets remove duplicates automatically\nunique_nums = {1, 2, 2, 3, 3}\nprint("Unique set:", unique_nums)`,
    audioTranscript: 'Dictionaries pair unique keys with values for lightning-fast hash lookups. Sets automatically eliminate duplicate entries.',
    exercises: {
      easy: { title: 'Easy: Dictionary Lookup', prompt: 'Create a dictionary with keys "math" and "cs" containing your grades. Print the "cs" grade.', hint: 'grades["cs"]' },
      medium: { title: 'Medium: Word Count Frequency', prompt: 'Count occurrences of each word in a list using a dictionary.', hint: 'counts[word] = counts.get(word, 0) + 1' },
      hard: { title: 'Hard: Set Operations', prompt: 'Find the common elements (intersection) between two lists using sets.', hint: 'set(list_a) & set(list_b)' }
    },
    quiz: {
      question: 'What is the average time complexity to look up a key in a Python dictionary?',
      options: ['O(1) Constant Time', 'O(n) Linear Time', 'O(log n) Logarithmic Time', 'O(n²) Quadratic Time'],
      correctAnswer: 'O(1) Constant Time',
      explanation: 'Because Python dictionaries use hash tables, key lookups happen in average O(1) constant time.'
    },
    xpReward: 50
  },

  'ds-stacks': {
    id: 'ds-stacks',
    slug: 'ds-stacks',
    title: 'Stack Data Structure (LIFO Mechanics)',
    subject: 'Data Structures & Algorithms',
    module: 'Module 1: Linear Data Structures',
    chapter: 'Chapter 1: Stacks',
    animationType: 'stack',
    aiExplanations: {
      beginner: 'A stack is like a stack of plates in a cafeteria. You can only put a new plate on top (Push), and take the top plate off (Pop).',
      intermediate: 'A Stack is a Last-In, First-Out (LIFO) abstract data type. Push and Pop operate strictly at the top pointer in O(1) constant time.',
      advanced: 'Essential for runtime execution call stacks, expression evaluation (Shunting-yard algorithm), and backtrack state parsing.'
    },
    visualDiagram: `VERTICAL STACK CONTAINER:
┌─────┐
│ 20  │ <── Top (Last In, First Out)
├─────┤
│ 10  │
└─────┘`,
    starterCode: `stack = []\n\n# Push elements\nstack.append(10)\nstack.append(20)\n\n# Pop top element\ntop = stack.pop()\nprint("Popped item:", top)\nprint("Remaining stack:", stack)`,
    audioTranscript: 'The stack operates on the Last-In First-Out principle. Pushing adds to the top, and popping removes the topmost element.',
    exercises: {
      easy: { title: 'Easy: Stack Push/Pop', prompt: 'Push elements 1, 2, 3 onto a stack and pop them one by one. Observe the reversed order.', hint: 'stack.append(), stack.pop()' },
      medium: { title: 'Medium: Balanced Parentheses', prompt: 'Use a stack to check if a string of brackets like "({[]})" is valid and balanced.', hint: 'Push opening brackets; pop and match on closing.' },
      hard: { title: 'Hard: Min Stack in O(1)', prompt: 'Implement a Stack that supports push, pop, and retrieving the minimum element in O(1) time.', hint: 'Maintain an auxiliary stack of minimums.' }
    },
    quiz: {
      question: 'Which principle governs the order of operations in a Stack?',
      options: ['LIFO (Last-In, First-Out)', 'FIFO (First-In, First-Out)', 'Priority Order', 'Random Access'],
      correctAnswer: 'LIFO (Last-In, First-Out)',
      explanation: 'Stacks strictly follow LIFO: the most recently inserted item is the first one removed.'
    },
    xpReward: 50
  },

  'ds-sorting': {
    id: 'ds-sorting',
    slug: 'ds-sorting',
    title: 'Bubble Sort & Pairwise Comparisons',
    subject: 'Data Structures & Algorithms',
    module: 'Module 2: Sorting Algorithms',
    chapter: 'Chapter 1: Bubble Sort',
    animationType: 'sorting',
    aiExplanations: {
      beginner: 'Bubble sort steps through a list, compares neighboring items, and swaps them if they are in the wrong order until the entire list is sorted.',
      intermediate: 'Bubble sort has a worst and average-case time complexity of O(n²). On each pass, the largest unsorted element bubbles up to its final position.',
      advanced: 'An adaptive optimization sets a swapped flag to terminate early in O(n) time if the array is already sorted on pass 1.'
    },
    visualDiagram: `PASS 1:
[5, 2, 4, 1] ──compare (5 > 2)──> Swap ──> [2, 5, 4, 1]
[2, 5, 4, 1] ──compare (5 > 4)──> Swap ──> [2, 4, 5, 1]
[2, 4, 5, 1] ──compare (5 > 1)──> Swap ──> [2, 4, 1, 5] (5 LOCKED)`,
    starterCode: `def bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n    return arr\n\nprint(bubble_sort([5, 2, 4, 1]))`,
    audioTranscript: 'Watch adjacent elements compare and swap. The largest remaining number bubbles to the end of the array on every complete pass.',
    exercises: {
      easy: { title: 'Easy: Sort 4 Numbers', prompt: 'Trace the number of swaps needed to sort [4, 3, 2, 1].', hint: '6 total swaps.' },
      medium: { title: 'Medium: Optimized Bubble Sort', prompt: 'Add a boolean flag swapped to stop the algorithm early if no swaps occurred.', hint: 'if not swapped: break' },
      hard: { title: 'Hard: Count Swaps', prompt: 'Write a function that counts how many total element swaps were executed during sorting.', hint: 'Increment a counter variable inside the if swap block.' }
    },
    quiz: {
      question: 'What is the worst-case time complexity of standard Bubble Sort?',
      options: ['O(n²)', 'O(n log n)', 'O(n)', 'O(1)'],
      correctAnswer: 'O(n²)',
      explanation: 'With two nested loops over n elements, Bubble Sort requires O(n²) comparisons in the worst case.'
    },
    xpReward: 50
  },

  'ds-binary-search': {
    id: 'ds-binary-search',
    slug: 'ds-binary-search',
    title: 'Binary Search (Divide & Conquer)',
    subject: 'Data Structures & Algorithms',
    module: 'Module 2: Searching Algorithms',
    chapter: 'Chapter 2: Binary Search',
    animationType: 'binary_search',
    aiExplanations: {
      beginner: 'Binary search looks for a number in a sorted list by checking the exact middle item and discarding half the list with every single step!',
      intermediate: 'Binary Search operates on sorted sequences in O(log n) logarithmic time by halving the search space [low..high] on each step.',
      advanced: 'Must avoid integer overflow in midpoint calculation using mid = low + (high - low) // 2 instead of (low + high) // 2 in strict memory environments.'
    },
    visualDiagram: `ARRAY: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]  (Target = 23)
Step 1: Mid = 16 < 23 ➔ Discard Left Half [2..16]
Step 2: Mid = 56 > 23 ➔ Discard Right Half [56..91]
Step 3: Mid = 23 == 23 ➔ FOUND in 3 steps!`,
    starterCode: `def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\narr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]\nprint("Found at index:", binary_search(arr, 23))`,
    audioTranscript: 'Binary Search cuts the sorted search interval in half with every comparison, finding the target 23 in only three steps.',
    exercises: {
      easy: { title: 'Easy: Search Trace', prompt: 'How many maximum comparisons does Binary Search need for a list of 16 items?', hint: 'log2(16) = 4.' },
      medium: { title: 'Medium: First Occurrence', prompt: 'Modify binary search to find the first occurrence of a duplicate number.', hint: 'When found, continue searching the left half.' },
      hard: { title: 'Hard: Rotated Sorted Array', prompt: 'Search for a target in a sorted array that has been rotated at an unknown pivot.', hint: 'Determine which half is cleanly sorted on each step.' }
    },
    quiz: {
      question: 'What is a strict prerequisite before applying Binary Search on a dataset?',
      options: ['The dataset must be sorted', 'The dataset must contain only even numbers', 'The dataset size must be a power of 2', 'The dataset must be stored in a linked list'],
      correctAnswer: 'The dataset must be sorted',
      explanation: 'Binary Search relies on sorted order to guarantee that half of the elements can be safely eliminated.'
    },
    xpReward: 50
  },

  'sql-select-where': {
    id: 'sql-select-where',
    slug: 'sql-select-where',
    title: 'SQL Query Engine & WHERE Filtering',
    subject: 'SQL & Relational Databases',
    module: 'Module 1: Query Filtering Engine',
    chapter: 'Chapter 1: Query Execution Order',
    animationType: 'sql_query',
    aiExplanations: {
      beginner: 'SQL queries ask questions to a database table. FROM chooses the table, WHERE filters matching rows, and SELECT picks which columns you want to see.',
      intermediate: 'SQL logical query execution order: 1. FROM (table source), 2. WHERE (predicate filtering), 3. GROUP BY (aggregation), 4. HAVING, 5. SELECT (column projection).',
      advanced: 'The query planner utilizes B-Tree indexes on WHERE columns to avoid sequential table scans and execute index range lookups.'
    },
    visualDiagram: `QUERY PIPELINE:
[ FROM students (4 rows) ]
            │
            v
[ WHERE xp > 500 (Filter evaluated per row) ]
            │
            v
[ SELECT name, xp (Extract matching columns for Ada, Charlie) ]`,
    starterCode: `SELECT name, xp\nFROM students\nWHERE xp > 500;`,
    audioTranscript: 'The database engine first reads the students table in the FROM clause, tests each row against the WHERE condition, and returns the selected columns.',
    exercises: {
      easy: { title: 'Easy: Simple SELECT', prompt: 'Write a query to select all columns from a table named courses.', hint: 'SELECT * FROM courses;' },
      medium: { title: 'Medium: Multiple Conditions', prompt: 'Select name and grade for students with grade >= 80 AND status = "Active".', hint: 'WHERE grade >= 80 AND status = "Active"' },
      hard: { title: 'Hard: ORDER BY & LIMIT', prompt: 'Retrieve the top 3 highest scoring students in the database.', hint: 'ORDER BY score DESC LIMIT 3;' }
    },
    quiz: {
      question: 'In what logical order does a relational database execute a query containing SELECT, FROM, and WHERE?',
      options: ['FROM → WHERE → SELECT', 'SELECT → FROM → WHERE', 'WHERE → SELECT → FROM', 'FROM → SELECT → WHERE'],
      correctAnswer: 'FROM → WHERE → SELECT',
      explanation: 'The database first identifies the table in the FROM clause, filters rows with WHERE, and finally projects the requested columns with SELECT.'
    },
    xpReward: 50
  },

  'react-state-lifecycle': {
    id: 'react-state-lifecycle',
    slug: 'react-state-lifecycle',
    title: 'React useState Lifecycle & DOM Diffing',
    subject: 'Web Development & React',
    module: 'Module 1: React State & Lifecycle',
    chapter: 'Chapter 1: State Re-rendering',
    animationType: 'react_state',
    aiExplanations: {
      beginner: 'State is the memory of a React component. When you update state with setCount(), React automatically updates only the part of the webpage that changed.',
      intermediate: 'Calling a state setter schedules a re-render. React invokes the component function, computes the Virtual DOM diff, and commits minimal DOM updates during reconciliation.',
      advanced: 'React 18 Fiber architecture utilizes concurrent scheduling and lane prioritization to batch state transitions and avoid main-thread blocking.'
    },
    visualDiagram: `STATE CHANGE PIPELINE:
[ setCount(count + 1) ] ──> [ Virtual DOM Re-render ] ──> [ Diffing ] ──> [ Minimal DOM Patch ]`,
    starterCode: `import React, { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+1</button>\n    </div>\n  );\n}`,
    audioTranscript: 'When the button is clicked, setCount schedules an update. React creates a new Virtual DOM snapshot, computes the difference, and updates the real webpage.',
    exercises: {
      easy: { title: 'Easy: Toggle State', prompt: 'Create a boolean state isOn initialized to false with a button to toggle it.', hint: 'setIsOn(!isOn)' },
      medium: { title: 'Medium: Input Binding', prompt: 'Create a controlled input text box that updates a text state in real time.', hint: 'onChange={(e) => setText(e.target.value)}' },
      hard: { title: 'Hard: Functional Updates', prompt: 'Why is setCount(prev => prev + 1) safer than setCount(count + 1) in async handlers?', hint: 'Functional updates guarantee access to the latest state value.' }
    },
    quiz: {
      question: 'What is the Virtual DOM in React?',
      options: ['A lightweight in-memory representation of the real DOM tree', 'A separate web browser process', 'A database stored on the server', 'An HTML file on disk'],
      correctAnswer: 'A lightweight in-memory representation of the real DOM tree',
      explanation: 'The Virtual DOM is an in-memory tree that React uses to compute minimal diffs before updating the real browser DOM.'
    },
    xpReward: 50
  },

  'ai-neural-forward': {
    id: 'ai-neural-forward',
    slug: 'ai-neural-forward',
    title: 'Forward Propagation & Neuron Activations',
    subject: 'Artificial Intelligence & ML',
    module: 'Module 1: Deep Neural Networks',
    chapter: 'Chapter 1: Forward Propagation',
    animationType: 'neural_network',
    aiExplanations: {
      beginner: 'In an AI neural network, inputs pass through connected digital neurons. Each connection has a strength (weight), and neurons calculate an output prediction.',
      intermediate: 'Forward propagation computes z = W · x + b followed by non-linear activation f(z) across consecutive layers to predict class probabilities.',
      advanced: 'Matrix multiplication is vectorized across GPU tensor cores with non-linear activation (e.g. ReLU, GELU) preventing collapse into linear transformations.'
    },
    visualDiagram: `INPUTS (X1, X2) ──weights──> HIDDEN NEURONS (ReLU) ──weights──> OUTPUT (Sigmoid 94%)`,
    starterCode: `import torch\nimport torch.nn as nn\n\n# Define 2-layer neural network\nmodel = nn.Sequential(\n    nn.Linear(2, 3),\n    nn.ReLU(),\n    nn.Linear(3, 1),\n    nn.Sigmoid()\n)\n\nx = torch.tensor([[1.5, 0.8]])\noutput = model(x)\nprint("Predicted probability:", output.item())`,
    audioTranscript: 'Input features multiply with synaptic weights, pass through hidden ReLU activation neurons, and yield the final output probability.',
    exercises: {
      easy: { title: 'Easy: ReLU Activation', prompt: 'Calculate the output of ReLU(z) for z = -3.5 and z = 4.2.', hint: 'ReLU(z) = max(0, z): 0 and 4.2.' },
      medium: { title: 'Medium: Weighted Sum', prompt: 'Given inputs [2, 3] and weights [0.5, -0.2] with bias 1, compute z = w1*x1 + w2*x2 + b.', hint: '2*0.5 + 3*(-0.2) + 1 = 1 - 0.6 + 1 = 1.4.' },
      hard: { title: 'Hard: Sigmoid Range', prompt: 'Explain why Sigmoid is preferred for binary classification outputs instead of pure linear units.', hint: 'Sigmoid bounds output between 0 and 1, representing a probability.' }
    },
    quiz: {
      question: 'What is the primary purpose of an activation function (like ReLU) in a deep neural network?',
      options: ['To introduce non-linearity so the network can learn complex patterns', 'To speed up file reading from disk', 'To convert code from Python to C++', 'To sort the training dataset'],
      correctAnswer: 'To introduce non-linearity so the network can learn complex patterns',
      explanation: 'Without non-linear activation functions, stacking multiple layers would collapse into a simple linear regression model.'
    },
    xpReward: 50
  }
};

export const getChapterData = (slugOrId) => {
  if (!slugOrId) return CHAPTER_DATABASE['python-for-loops'];
  const key = String(slugOrId).toLowerCase().trim();
  if (CHAPTER_DATABASE[key]) return CHAPTER_DATABASE[key];

  // Fallback mappings by ID or topic substring
  if (key === '1' || key.includes('print')) return CHAPTER_DATABASE['python-print'];
  if (key === '2' || key.includes('variable') || key.includes('memory')) return CHAPTER_DATABASE['python-variables-memory'];
  if (key === '3' || key.includes('for') || key.includes('loop')) return CHAPTER_DATABASE['python-for-loops'];
  if (key.includes('while')) return CHAPTER_DATABASE['python-while-loops'];
  if (key.includes('break') || key.includes('continue')) return CHAPTER_DATABASE['python-break-continue'];
  if (key.includes('func') || key.includes('param')) return CHAPTER_DATABASE['python-functions-params'];
  if (key.includes('return') || key.includes('stack')) return CHAPTER_DATABASE['python-return-callstack'];
  if (key.includes('list') || key.includes('tuple')) return CHAPTER_DATABASE['python-lists-tuples'];
  if (key.includes('dict') || key.includes('set')) return CHAPTER_DATABASE['python-dicts-sets'];
  if (key.includes('sort')) return CHAPTER_DATABASE['ds-sorting'];
  if (key.includes('binary')) return CHAPTER_DATABASE['ds-binary-search'];
  if (key.includes('sql')) return CHAPTER_DATABASE['sql-select-where'];
  if (key.includes('react')) return CHAPTER_DATABASE['react-state-lifecycle'];
  if (key.includes('neural') || key.includes('ai')) return CHAPTER_DATABASE['ai-neural-forward'];

  return CHAPTER_DATABASE['python-for-loops'];
};
