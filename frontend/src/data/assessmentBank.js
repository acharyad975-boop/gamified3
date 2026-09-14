export const ASSESSMENT_DAYS = [
  { day: 1, title: 'Foundations', subtitle: 'Logic, math, and how computers work', minutes: 8, color: '#818cf8' },
  { day: 2, title: 'Programming logic', subtitle: 'Variables, loops, conditions, functions', minutes: 10, color: '#38bdf8' },
  { day: 3, title: 'CS landscape', subtitle: 'Web, databases, networks, systems', minutes: 9, color: '#34d399' },
  { day: 4, title: 'How you learn', subtitle: 'Text, diagrams, and code walkthroughs', minutes: 8, color: '#f59e0b' },
  { day: 5, title: 'Problem solving', subtitle: 'Patterns, complexity, and puzzles', minutes: 10, color: '#f472b6' },
  { day: 6, title: 'Interests', subtitle: 'AI, security, cloud, and product', minutes: 8, color: '#22d3ee' },
  { day: 7, title: 'Synthesis', subtitle: 'Apply everything in one short set', minutes: 10, color: '#a78bfa' },
];

export const ASSESSMENT_BANK = {
  1: [
    {
      id: 'd1-1',
      subject_tag: 'Binary',
      difficulty: 'Beginner',
      prompt: 'What is the decimal value of the binary number 00010110?',
      options: ['18', '22', '26', '14'],
      correct_answer: '22',
      explanation: '16 + 4 + 2 = 22. Each 1-bit is a power of two from the right.',
      points: 10,
    },
    {
      id: 'd1-2',
      subject_tag: 'Hardware',
      difficulty: 'Beginner',
      prompt: 'Which memory is closest to the CPU and usually the fastest?',
      options: ['SSD', 'RAM', 'CPU registers / L1 cache', 'Hard disk'],
      correct_answer: 'CPU registers / L1 cache',
      explanation: 'Registers and L1 cache sit on the processor, so access time is measured in nanoseconds.',
      points: 10,
    },
    {
      id: 'd1-3',
      subject_tag: 'Math',
      difficulty: 'Beginner',
      prompt: 'What is 37 % 5 (the remainder when 37 is divided by 5)?',
      options: ['7', '2', '1', '4'],
      correct_answer: '2',
      explanation: '37 = 7 × 5 + 2, so the remainder is 2.',
      points: 10,
    },
    {
      id: 'd1-4',
      subject_tag: 'Logic',
      difficulty: 'Beginner',
      prompt: 'If A is true, B is false, and C is true, what is (A AND B) OR (NOT B AND C)?',
      options: ['False', 'Undefined', 'True', 'Null'],
      correct_answer: 'True',
      explanation: 'A AND B is false. NOT B is true, so NOT B AND C is true. False OR true is true.',
      points: 10,
    },
    {
      id: 'd1-5',
      subject_tag: 'Communication',
      difficulty: 'Beginner',
      prompt: 'Which sentence is the most precise for a timeout spec?',
      options: [
        'The client stops if the server is slow.',
        'The client closes the connection if the server does not respond within 5000 ms.',
        'Sometimes waiting too long is bad.',
        'The server should be reasonably fast.',
      ],
      correct_answer: 'The client closes the connection if the server does not respond within 5000 ms.',
      explanation: 'Specs need a measurable limit and a clear action.',
      points: 10,
    },
    {
      id: 'd1-6',
      subject_tag: 'Logic',
      difficulty: 'Beginner',
      prompt: 'A lock needs 3 correct digits in order, each 0–9. How many combinations are possible?',
      options: ['30', '100', '729', '1000'],
      correct_answer: '1000',
      explanation: '10 × 10 × 10 = 1000 ordered combinations.',
      points: 10,
    },
  ],
  2: [
    {
      id: 'd2-1',
      subject_tag: 'Python',
      difficulty: 'Beginner',
      prompt: 'What does this print?',
      code_snippet: 'x = 10\ny = x\nx = 25\nprint(y)',
      options: ['25', '10', '35', 'Error'],
      correct_answer: '10',
      explanation: 'y still points at 10. Changing x later does not change y.',
      points: 10,
    },
    {
      id: 'd2-2',
      subject_tag: 'Loops',
      difficulty: 'Beginner',
      prompt: 'What is printed?',
      code_snippet: 'total = 0\nfor i in range(1, 4):\n    total += i\nprint(total)',
      options: ['10', '3', '6', '4'],
      correct_answer: '6',
      explanation: 'range(1, 4) is 1, 2, 3. Sum is 6. The stop value is excluded.',
      points: 10,
    },
    {
      id: 'd2-3',
      subject_tag: 'Conditions',
      difficulty: 'Beginner',
      prompt: 'What grade is printed?',
      code_snippet: 'score = 75\nif score >= 90:\n    print("A")\nelif score >= 70:\n    print("B")\nelse:\n    print("C")',
      options: ['A', 'C', 'B and C', 'B'],
      correct_answer: 'B',
      explanation: '75 is not ≥ 90, but it is ≥ 70, so the elif branch runs.',
      points: 10,
    },
    {
      id: 'd2-4',
      subject_tag: 'Data structures',
      difficulty: 'Beginner',
      prompt: 'Which Python type stores values looked up by a unique key?',
      options: ['List', 'Tuple', 'Dictionary', 'Set'],
      correct_answer: 'Dictionary',
      explanation: 'A dict maps keys to values in roughly constant time.',
      points: 10,
    },
    {
      id: 'd2-5',
      subject_tag: 'Functions',
      difficulty: 'Beginner',
      prompt: 'What does a function return if it has no return statement?',
      options: ['0', 'False', 'None', 'An error'],
      correct_answer: 'None',
      explanation: 'Python functions return None unless you return something else.',
      points: 10,
    },
    {
      id: 'd2-6',
      subject_tag: 'Lists',
      difficulty: 'Beginner',
      prompt: 'For nums = [10, 20, 30], what is nums[1]?',
      options: ['10', '20', '30', 'Error'],
      correct_answer: '20',
      explanation: 'Indexing starts at 0, so index 1 is the second item.',
      points: 10,
    },
  ],
  3: [
    {
      id: 'd3-1',
      subject_tag: 'HTTP',
      difficulty: 'Intermediate',
      prompt: 'Which status code means a resource was created?',
      options: ['200 OK', '404 Not Found', '201 Created', '500 Internal Server Error'],
      correct_answer: '201 Created',
      explanation: '201 is the usual response after a successful POST that created something.',
      points: 10,
    },
    {
      id: 'd3-2',
      subject_tag: 'SQL',
      difficulty: 'Intermediate',
      prompt: 'What is the main job of a foreign key?',
      options: [
        'Encrypt a column',
        'Speed up every search automatically',
        'Allow duplicate primary keys',
        'Keep related rows consistent across tables',
      ],
      correct_answer: 'Keep related rows consistent across tables',
      explanation: 'A foreign key points at another table’s primary key so related data stays valid.',
      points: 10,
    },
    {
      id: 'd3-3',
      subject_tag: 'Networks',
      difficulty: 'Intermediate',
      prompt: 'Why is UDP often used for live video or multiplayer games?',
      options: [
        'It always delivers every packet',
        'It skips handshake and retransmission delay',
        'It encrypts by default',
        'It compresses video automatically',
      ],
      correct_answer: 'It skips handshake and retransmission delay',
      explanation: 'UDP is connectionless. Late packets are often worse than dropped ones in realtime apps.',
      points: 10,
    },
    {
      id: 'd3-4',
      subject_tag: 'Web',
      difficulty: 'Beginner',
      prompt: 'What does CSS mainly control in a web page?',
      options: ['Database rows', 'Visual layout and style', 'Server routing', 'DNS records'],
      correct_answer: 'Visual layout and style',
      explanation: 'HTML is structure, CSS is presentation, JavaScript is behavior.',
      points: 10,
    },
    {
      id: 'd3-5',
      subject_tag: 'APIs',
      difficulty: 'Beginner',
      prompt: 'A REST GET request should typically…',
      options: [
        'Delete the resource',
        'Only read data without changing it',
        'Always create a new user',
        'Shut down the server',
      ],
      correct_answer: 'Only read data without changing it',
      explanation: 'GET is a safe, idempotent read. Mutations use POST, PUT, PATCH, or DELETE.',
      points: 10,
    },
    {
      id: 'd3-6',
      subject_tag: 'OS',
      difficulty: 'Beginner',
      prompt: 'What is a process?',
      options: [
        'A saved file on disk',
        'A running program with its own memory space',
        'A CSS class',
        'A GPU shader',
      ],
      correct_answer: 'A running program with its own memory space',
      explanation: 'The OS loads a program into memory and schedules it as a process.',
      points: 10,
    },
  ],
  4: [
    {
      id: 'd4-1',
      subject_tag: 'Stacks',
      difficulty: 'Beginner',
      format_type: 'practical_coding',
      prompt: 'A stack does push(5), push(9), then pop(). What does pop() return?',
      options: ['5', '14', '9', '0'],
      correct_answer: '9',
      explanation: 'Stacks are last-in, first-out. 9 was pushed last, so it comes out first.',
      points: 10,
    },
    {
      id: 'd4-2',
      subject_tag: 'Trees',
      difficulty: 'Beginner',
      format_type: 'visual_diagrams',
      prompt: 'In a binary search tree, where do values smaller than the root go?',
      code_snippet: '        [root]\n       /      \\\n  smaller     larger',
      options: ['Right subtree', 'Left subtree', 'Parent node', 'A separate list'],
      correct_answer: 'Left subtree',
      explanation: 'BST rule: left is smaller, right is larger.',
      points: 10,
    },
    {
      id: 'd4-3',
      subject_tag: 'Learning',
      difficulty: 'Beginner',
      prompt: 'You learn a new loop fastest when you…',
      options: [
        'Only read a definition once',
        'See it run step by step, then write a tiny example',
        'Memorize 20 terms first',
        'Skip practice and watch a long lecture',
      ],
      correct_answer: 'See it run step by step, then write a tiny example',
      explanation: 'This platform favors explain → visualize → try. That loop is how the recovery lab works.',
      points: 10,
    },
    {
      id: 'd4-4',
      subject_tag: 'Tracing',
      difficulty: 'Beginner',
      prompt: 'After this code, what is n?',
      code_snippet: 'n = 1\nn = n + 1\nn = n * 2',
      options: ['1', '2', '4', '3'],
      correct_answer: '4',
      explanation: '1 + 1 = 2, then 2 × 2 = 4.',
      points: 10,
    },
    {
      id: 'd4-5',
      subject_tag: 'Arrays',
      difficulty: 'Beginner',
      prompt: 'Which picture matches a 0-based array of 3 items?',
      options: ['Index 1, 2, 3', 'Index 0, 1, 2', 'Index 0, 2, 4', 'No indexes'],
      correct_answer: 'Index 0, 1, 2',
      explanation: 'The first slot is index 0 in most languages you will use here.',
      points: 10,
    },
    {
      id: 'd4-6',
      subject_tag: 'Debugging',
      difficulty: 'Beginner',
      prompt: 'Best first step when code “does nothing”?',
      options: [
        'Rewrite the whole file',
        'Print or log the values right before the unexpected result',
        'Delete the tests',
        'Change the language',
      ],
      correct_answer: 'Print or log the values right before the unexpected result',
      explanation: 'Inspect state. Guessing a full rewrite wastes time.',
      points: 10,
    },
  ],
  5: [
    {
      id: 'd5-1',
      subject_tag: 'Complexity',
      difficulty: 'Intermediate',
      prompt: 'Average time to find a value in a sorted array with binary search?',
      options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'],
      correct_answer: 'O(log n)',
      explanation: 'Each step cuts the remaining range in half.',
      points: 10,
    },
    {
      id: 'd5-2',
      subject_tag: 'Patterns',
      difficulty: 'Intermediate',
      prompt: 'Next number: 2, 6, 12, 20, 30, ___',
      options: ['40', '42', '48', '36'],
      correct_answer: '42',
      explanation: 'Gaps grow by 2: +4, +6, +8, +10, +12. 30 + 12 = 42.',
      points: 10,
    },
    {
      id: 'd5-3',
      subject_tag: 'Math',
      difficulty: 'Beginner',
      prompt: 'A server handles 800 req/s. Throughput rises 25%. New rate?',
      options: ['950', '1000', '1050', '1200'],
      correct_answer: '1000',
      explanation: '25% of 800 is 200. 800 + 200 = 1000.',
      points: 10,
    },
    {
      id: 'd5-4',
      subject_tag: 'Puzzles',
      difficulty: 'Beginner',
      prompt: 'You can measure exactly 4L using 3L and 5L jugs. Is that true?',
      options: ['No, only even sizes work', 'Yes, because gcd(3, 5) = 1 divides 4', 'Only with a 4L jug', 'Only with a scale'],
      correct_answer: 'Yes, because gcd(3, 5) = 1 divides 4',
      explanation: 'You can measure any multiple of gcd(a, b) that fits in the jugs. gcd(3, 5) is 1, and 4 is reachable.',
      points: 10,
    },
    {
      id: 'd5-5',
      subject_tag: 'Sorting',
      difficulty: 'Beginner',
      prompt: 'Which algorithm repeatedly swaps neighbors if they are out of order?',
      options: ['Binary search', 'Bubble sort', 'Hashing', 'DFS'],
      correct_answer: 'Bubble sort',
      explanation: 'Bubble sort compares adjacent pairs and swaps until the list is sorted.',
      points: 10,
    },
    {
      id: 'd5-6',
      subject_tag: 'Graphs',
      difficulty: 'Beginner',
      prompt: 'BFS explores a graph…',
      options: [
        'By always going as deep as possible first',
        'Level by level from the start node',
        'Only on trees',
        'In random order only',
      ],
      correct_answer: 'Level by level from the start node',
      explanation: 'Breadth-first search uses a queue and visits neighbors before going deeper.',
      points: 10,
    },
  ],
  6: [
    {
      id: 'd6-1',
      subject_tag: 'AI',
      difficulty: 'Intermediate',
      prompt: 'Which is supervised learning?',
      options: [
        'Clustering shoppers with no labels',
        'Predicting house prices from past sales that include the sale price',
        'PCA image compression',
        'A robot learning only from a reward signal',
      ],
      correct_answer: 'Predicting house prices from past sales that include the sale price',
      explanation: 'Supervised learning needs labeled input → output examples.',
      points: 10,
    },
    {
      id: 'd6-2',
      subject_tag: 'Security',
      difficulty: 'Intermediate',
      prompt: 'Best defense against SQL injection?',
      options: [
        'Store passwords in localStorage',
        'Longer DB timeouts',
        'Parameterized queries / ORM binds',
        'Turn off indexes',
      ],
      correct_answer: 'Parameterized queries / ORM binds',
      explanation: 'User input must be data, never spliced into SQL as code.',
      points: 10,
    },
    {
      id: 'd6-3',
      subject_tag: 'Cloud',
      difficulty: 'Beginner',
      prompt: 'What is the main idea of cloud computing for an app team?',
      options: [
        'Renting compute and storage over the internet instead of only owning a closet of servers',
        'Writing CSS only',
        'Never using databases',
        'Turning off HTTPS',
      ],
      correct_answer: 'Renting compute and storage over the internet instead of only owning a closet of servers',
      explanation: 'Cloud is on-demand infrastructure and services, billed as you go.',
      points: 10,
    },
    {
      id: 'd6-4',
      subject_tag: 'Web',
      difficulty: 'Beginner',
      prompt: 'React state is used to…',
      options: [
        'Replace SQL',
        'Hold data that should update the UI when it changes',
        'Configure DNS',
        'Compile Python',
      ],
      correct_answer: 'Hold data that should update the UI when it changes',
      explanation: 'When state changes, React re-renders the components that depend on it.',
      points: 10,
    },
    {
      id: 'd6-5',
      subject_tag: 'Interest',
      difficulty: 'Beginner',
      prompt: 'Which track sounds most like “build products people click every day”?',
      options: ['Kernel drivers only', 'Full-stack web apps', 'Assembly for calculators only', 'Printer firmware only'],
      correct_answer: 'Full-stack web apps',
      explanation: 'Web apps sit at the intersection of UI, APIs, and data — a common student path here.',
      points: 10,
    },
    {
      id: 'd6-6',
      subject_tag: 'Ethics',
      difficulty: 'Beginner',
      prompt: 'You find a classmate’s password in a shared file. You should…',
      options: [
        'Log in as them to “help”',
        'Tell them privately and ask them to change it, and tell a teacher if needed',
        'Post it in the group chat',
        'Ignore it forever',
      ],
      correct_answer: 'Tell them privately and ask them to change it, and tell a teacher if needed',
      explanation: 'Do not use the account. Help them lock it down.',
      points: 10,
    },
  ],
  7: [
    {
      id: 'd7-1',
      subject_tag: 'Git',
      difficulty: 'Intermediate',
      prompt: 'Which command creates a new branch and switches to it?',
      options: [
        'git push --force origin master',
        'git checkout -b feature/auth   (or git switch -c feature/auth)',
        'git merge --abort',
        'git rebase --skip',
      ],
      correct_answer: 'git checkout -b feature/auth   (or git switch -c feature/auth)',
      explanation: '-b / -c creates the branch and moves HEAD there.',
      points: 10,
    },
    {
      id: 'd7-2',
      subject_tag: 'Recursion',
      difficulty: 'Intermediate',
      prompt: 'What does countdown(3) print?',
      code_snippet: 'def countdown(n):\n    if n <= 0:\n        return "Done"\n    return str(n) + " " + countdown(n - 1)\n\nprint(countdown(3))',
      options: ['Done 1 2 3', '3 2 1 Done', '3 2 1', 'Stack overflow'],
      correct_answer: '3 2 1 Done',
      explanation: 'Each call prepends n, then the base case returns Done.',
      points: 10,
    },
    {
      id: 'd7-3',
      subject_tag: 'APIs',
      difficulty: 'Beginner',
      prompt: 'A 401 response usually means…',
      options: ['The page is missing', 'You are not authenticated / token is invalid', 'The server exploded', 'The request is too large'],
      correct_answer: 'You are not authenticated / token is invalid',
      explanation: '401 is unauthorized. 403 is authenticated but not allowed. 404 is missing.',
      points: 10,
    },
    {
      id: 'd7-4',
      subject_tag: 'Testing',
      difficulty: 'Beginner',
      prompt: 'A unit test should mainly…',
      options: [
        'Check one small behavior in isolation',
        'Replace production monitoring',
        'Only run on Fridays',
        'Hit the live payment API',
      ],
      correct_answer: 'Check one small behavior in isolation',
      explanation: 'Unit tests are fast checks of one function or module.',
      points: 10,
    },
    {
      id: 'd7-5',
      subject_tag: 'Debugging',
      difficulty: 'Beginner',
      prompt: 'Off-by-one in range(1, n) often happens because…',
      options: [
        'Python includes n',
        'The stop value is excluded',
        'range cannot use integers',
        'Loops never run',
      ],
      correct_answer: 'The stop value is excluded',
      explanation: 'range(1, n) goes 1 … n-1. That is the bug this academy’s recovery loop targets.',
      points: 10,
    },
    {
      id: 'd7-6',
      subject_tag: 'Systems',
      difficulty: 'Beginner',
      prompt: 'JSON is commonly used to…',
      options: [
        'Compile C++',
        'Exchange structured data between frontend and API',
        'Replace TCP',
        'Format hard disks',
      ],
      correct_answer: 'Exchange structured data between frontend and API',
      explanation: 'JSON is a text format for objects and lists across HTTP APIs.',
      points: 10,
    },
  ],
};

const PROGRESS_KEY = 'assessment_progress';

export function loadAssessmentProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return { currentDay: 1, completedDays: {}, isCompleted: false };
    return JSON.parse(raw);
  } catch {
    return { currentDay: 1, completedDays: {}, isCompleted: false };
  }
}

export function saveAssessmentDayComplete(day, result) {
  const progress = loadAssessmentProgress();
  progress.completedDays = { ...(progress.completedDays || {}), [day]: result };
  progress.currentDay = Math.min(day + 1, 7);
  progress.isCompleted = day >= 7;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  return progress;
}

export function normalizeQuestion(raw, index = 0) {
  let options = raw.options;
  if (!Array.isArray(options)) {
    options = Object.values(options || {});
  }
  options = options.map((opt) => {
    if (typeof opt === 'string') return opt.replace(/^[A-D][.)]\s*/, '');
    return opt?.text || opt?.label || String(opt);
  });
  let correct = raw.correct_answer || raw.correct_text || '';
  correct = String(correct).replace(/^[A-D][.)]\s*/, '');
  return {
    ...raw,
    id: raw.id ?? `q-${index}`,
    options,
    correct_answer: correct,
    points: raw.points || 10,
    prompt: raw.prompt || raw.title || 'Question',
  };
}

export function getLocalQuestions(day) {
  return (ASSESSMENT_BANK[day] || []).map((q, i) => normalizeQuestion(q, i));
}

export function gradeAnswer(question, selected) {
  const pick = String(selected || '').replace(/^[A-D][.)]\s*/, '').trim().toLowerCase();
  const correct = String(question.correct_answer || '').replace(/^[A-D][.)]\s*/, '').trim().toLowerCase();
  const isCorrect = pick === correct || pick.endsWith(correct) || correct.endsWith(pick);
  return {
    is_correct: isCorrect,
    correct_answer: question.correct_answer,
    explanation: question.explanation || '',
    points_earned: isCorrect ? (question.points || 10) : 0,
  };
}

export function formatClock(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
