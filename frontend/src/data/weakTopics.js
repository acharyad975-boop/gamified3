const LOG_KEY = 'adaptive_skill_log';

const TAG_ALIASES = [
  { id: 'loops', match: /loop|\brange\s*\(/i, title: 'Python loops & range()' },
  { id: 'lists', match: /list|array/i, title: 'List indexing' },
  { id: 'functions', match: /function/i, title: 'Functions & return values' },
  { id: 'sql', match: /sql|database|foreign key/i, title: 'SQL & databases' },
  { id: 'http', match: /http|api/i, title: 'HTTP & APIs' },
  { id: 'binary', match: /binary/i, title: 'Binary & number systems' },
  { id: 'logic', match: /logic|boolean/i, title: 'Boolean logic' },
  { id: 'math', match: /math|percent/i, title: 'Quantitative reasoning' },
  { id: 'conditions', match: /condition/i, title: 'If / elif / else' },
  { id: 'stacks', match: /stack/i, title: 'Stacks' },
  { id: 'dicts', match: /dictionary|key-value|data structure/i, title: 'Dictionaries' },
  { id: 'trees', match: /tree/i, title: 'Trees & BST' },
  { id: 'networks', match: /network|udp|tcp/i, title: 'Networks' },
  { id: 'security', match: /security|injection/i, title: 'Application security' },
  { id: 'recursion', match: /recursion/i, title: 'Recursion' },
  { id: 'git', match: /git/i, title: 'Git' },
  { id: 'algorithms', match: /complex|sort|graph|pattern|puzzle/i, title: 'Algorithms' },
  { id: 'web', match: /web|css|react/i, title: 'Web development' },
  { id: 'debugging', match: /debug|trac/i, title: 'Debugging & tracing' },
  { id: 'systems', match: /hardware|os|process|system/i, title: 'Systems' },
];

export function topicIdFromQuestion(question) {
  const blob = `${question.subject_tag || ''} ${question.prompt || ''} ${question.title || ''}`;
  const hit = TAG_ALIASES.find((row) => row.match.test(blob));
  if (hit) return hit.id;
  return String(question.subject_tag || 'general').toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

export function topicTitle(topicId, fallbackTag = '') {
  return TAG_ALIASES.find((row) => row.id === topicId)?.title || fallbackTag || topicId;
}

function loadLog() {
  try {
    const raw = localStorage.getItem(LOG_KEY);
    if (!raw) return { attempts: [], mastered: {} };
    const parsed = JSON.parse(raw);
    return { attempts: parsed.attempts || [], mastered: parsed.mastered || {} };
  } catch {
    return { attempts: [], mastered: {} };
  }
}

function saveLog(log) {
  localStorage.setItem(LOG_KEY, JSON.stringify(log));
}

export function recordAssessmentAttempt({ question, selected, isCorrect, day }) {
  const log = loadLog();
  const topicId = topicIdFromQuestion(question);
  log.attempts.push({
    topicId,
    tag: question.subject_tag || 'CS',
    prompt: question.prompt,
    selected,
    correctAnswer: question.correct_answer,
    explanation: question.explanation || '',
    code_snippet: question.code_snippet || '',
    options: question.options || [],
    isCorrect: !!isCorrect,
    day,
    at: Date.now(),
  });
  if (!isCorrect) {
    delete log.mastered[topicId];
  }
  saveLog(log);
  return topicId;
}

export function getWeakTopics() {
  const log = loadLog();
  const byId = {};
  log.attempts.forEach((attempt) => {
    if (!byId[attempt.topicId]) {
      byId[attempt.topicId] = {
        id: attempt.topicId,
        title: topicTitle(attempt.topicId, attempt.tag),
        attempted: 0,
        missed: 0,
        lastMiss: null,
      };
    }
    const row = byId[attempt.topicId];
    row.attempted += 1;
    if (!attempt.isCorrect) {
      row.missed += 1;
      row.lastMiss = attempt;
    }
  });

  return Object.values(byId)
    .filter((row) => row.missed > 0 && !log.mastered[row.id])
    .map((row) => ({
      ...row,
      accuracy: Math.round(((row.attempted - row.missed) / row.attempted) * 100),
      missedNote: row.lastMiss
        ? `You chose “${row.lastMiss.selected}” on: ${String(row.lastMiss.prompt).slice(0, 90)}`
        : 'Missed during the diagnostic.',
      recoveryPath: `/weak-topic-loop?topic=${encodeURIComponent(row.id)}`,
    }))
    .sort((a, b) => a.accuracy - b.accuracy || b.missed - a.missed);
}

export function getMasteredCount() {
  return Object.keys(loadLog().mastered).length;
}

export function markTopicMastered(topicId) {
  const log = loadLog();
  log.mastered[topicId] = Date.now();
  saveLog(log);
}

export function getTopicLesson(topicId) {
  const weak = getWeakTopics().find((row) => row.id === topicId);
  const log = loadLog();
  const last = [...log.attempts].reverse().find((a) => a.topicId === topicId && !a.isCorrect)
    || weak?.lastMiss
    || null;

  const canned = LESSONS[topicId];
  const title = topicTitle(topicId, last?.tag);
  const options = last?.options?.length
    ? last.options
    : canned?.quizOptions || ['Need to review this', 'I understand the idea', 'Not sure yet'];
  const quizAnswer = last?.correctAnswer || canned?.quizAnswer || options[0];

  return {
    id: topicId,
    title: canned?.title || title,
    accuracy: weak?.accuracy ?? 0,
    missed: weak?.missed ?? 1,
    attempted: weak?.attempted ?? 1,
    diagnosis: canned?.diagnosis || (last
      ? `On the diagnostic you missed this ${title.toLowerCase()} item.`
      : `This topic was flagged from your assessment.`),
    mistake: last
      ? `Your answer: ${last.selected}. Correct: ${last.correctAnswer}.`
      : (canned?.mistake || 'The engine saw a gap on this concept.'),
    explanation: last?.explanation || canned?.explanation || 'Re-read the idea, then try a tiny example.',
    visual: last?.code_snippet || canned?.visual || `${title}\nReview the missed question, then explain the correct answer in one sentence.`,
    prompt: last?.prompt || canned?.prompt || `Recheck: ${title}`,
    quizOptions: options,
    quizAnswer,
    starterCode: canned?.starterCode || '# Retry the idea in code or comments\nprint("I can explain this topic")\n',
    expectedOutput: canned?.expectedOutput || 'I can explain this topic',
  };
}

const LESSONS = {
  loops: {
    title: 'Python loops & range()',
    diagnosis: 'Loop-boundary items were missed. range() stops before the end value.',
    mistake: 'Off-by-one: treating range(start, stop) as inclusive of stop.',
    explanation: 'range(start, stop) starts at start and stops before stop. range(1, 4) is 1, 2, 3.',
    visual: 'NUMBER LINE:\n  [1]  [2]  [3]  |4| excluded\nrange(1, 4) → 1, 2, 3',
    prompt: 'How many times does for x in range(2, 6) run?',
    quizOptions: ['6 times (2 through 6)', '4 times (2, 3, 4, 5)', '3 times'],
    quizAnswer: '4 times (2, 3, 4, 5)',
    starterCode: 'total = 0\nfor i in range(1, 4):\n    total += i\nprint(total)',
    expectedOutput: '6',
  },
  lists: {
    title: 'List indexing',
    diagnosis: 'Index questions were missed. The first item is index 0.',
    mistake: 'Using 1 as the first index.',
    explanation: 'In Python, nums[0] is the first value. nums[1] is the second.',
    visual: "nums = [10, 20, 30]\n index    0    1    2",
    starterCode: 'nums = [10, 20, 30]\nprint(nums[1])',
    expectedOutput: '20',
  },
  sql: {
    title: 'SQL foreign keys',
    diagnosis: 'Relational integrity items were missed.',
    mistake: 'Mixing up keys, indexes, and encryption.',
    explanation: 'A foreign key points at another table’s primary key so related rows stay valid.',
    visual: 'students.id  <──  enrollments.student_id  (foreign key)',
    starterCode: '# Conceptual check\nprint("foreign keys enforce referential integrity")',
    expectedOutput: 'foreign keys enforce referential integrity',
  },
  functions: {
    title: 'Functions & return',
    diagnosis: 'Return vs print was mixed up.',
    mistake: 'Thinking a function with no return still gives 0 or False.',
    explanation: 'If there is no return, Python returns None. print() only shows text; it does not send a value back.',
    visual: 'def f():\n    print(3)   # displays 3\n    # returns None',
    starterCode: 'def add(a, b):\n    return a + b\nprint(add(2, 3))',
    expectedOutput: '5',
  },
  http: {
    title: 'HTTP & APIs',
    diagnosis: 'Status-code or GET semantics were missed.',
    mistake: 'Confusing 200/201/401/404.',
    explanation: 'GET should read without changing data. 201 means created. 401 means not authenticated.',
    visual: 'GET /users     → read\nPOST /users    → create → 201\nNo token       → 401',
    starterCode: 'print("GET reads, POST creates")',
    expectedOutput: 'GET reads, POST creates',
  },
};
