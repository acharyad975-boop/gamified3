/**
 * Complete Code Logic Lab Game Catalog with 12 Games & 60 Progressive Levels (5 Levels each).
 * Real-world software engineering contexts with progressive difficulty tiers.
 */

export const GAME_CATALOG = {
  'robot-programmer': {
    id: 1,
    slug: 'robot-programmer',
    title: 'Robot Programmer',
    category: 'LOGIC',
    concept: 'Sequencing, Step Orders & Execution Flow',
    tagline: 'Program autonomous rover navigation through planetary terrain grids.',
    icon: '🤖',
    badge_color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #2563eb, #38bdf8)',
    languages_supported: ['python', 'javascript', 'cpp'],
    levels: [
      {
        id: 101,
        level_number: 1,
        difficulty: 'BEGINNER',
        difficulty_label: 'Beginner',
        title: 'Straight Line Navigation',
        objective: 'Guide the rover east across the 4x4 sector to sample the mineral deposit.',
        instructions: 'Add MOVE_RIGHT commands to the execution queue and press RUN.',
        initial_state: { grid_size: [4, 4], robot_pos: [0, 0], target_pos: [0, 3], obstacles: [[1, 1], [2, 2]] },
        hints: ['Add 3 MOVE_RIGHT commands.'],
        code_snippets: {
          python: 'robot.move_right()\nrobot.move_right()\nrobot.move_right()',
          javascript: 'robot.moveRight();\nrobot.moveRight();\nrobot.moveRight();',
          cpp: 'robot.moveRight();\nrobot.moveRight();\nrobot.moveRight();'
        },
        xp_reward: 50
      },
      {
        id: 102,
        level_number: 2,
        difficulty: 'EASY',
        difficulty_label: 'Easy',
        title: 'Obstacle Avoidance Circuit',
        objective: 'Maneuver around the crater walls to reach the recharge beacon.',
        instructions: 'Use a combination of DOWN and RIGHT commands to skirt the barriers.',
        initial_state: { grid_size: [5, 5], robot_pos: [0, 0], target_pos: [3, 4], obstacles: [[0, 1], [1, 1], [2, 3]] },
        hints: ['Step down twice first, then route through row 2.'],
        code_snippets: {
          python: 'robot.move_down()\nrobot.move_down()\nrobot.move_right()\nrobot.move_right()',
          javascript: 'robot.moveDown();\nrobot.moveDown();\nrobot.moveRight();\nrobot.moveRight();',
          cpp: 'robot.moveDown();\nrobot.moveDown();\nrobot.moveRight();\nrobot.moveRight();'
        },
        xp_reward: 60
      },
      {
        id: 103,
        level_number: 3,
        difficulty: 'MEDIUM',
        difficulty_label: 'Medium',
        title: 'Multi-Beacon Supply Run',
        objective: 'Collect 3 scattered solar cells before reaching the extraction pad.',
        instructions: 'Optimize movement sequence to minimize battery drain.',
        initial_state: { grid_size: [6, 6], robot_pos: [0, 0], target_pos: [5, 5], obstacles: [[2, 2], [3, 2], [0, 3]] },
        hints: ['Target the closest solar cell at (1,2) first.'],
        code_snippets: {
          python: 'for beacon in [(1,2), (3,1), (4,4)]:\n    robot.navigate_to(beacon)\nrobot.navigate_to((5,5))',
          javascript: 'const beacons = [[1,2], [3,1], [4,4]];\nbeacons.forEach(b => robot.navigateTo(b));',
          cpp: 'for (auto& b : beacons) robot.navigateTo(b);'
        },
        xp_reward: 75
      },
      {
        id: 104,
        level_number: 4,
        difficulty: 'HARD',
        difficulty_label: 'Hard',
        title: 'Keycard & Security Gate',
        objective: 'Acquire security keycard at (0,0) to disarm laser gate before exiting at (0,5).',
        instructions: 'Sequential ordering: Fetch Keycard -> Disarm Gate -> Exit.',
        initial_state: { grid_size: [6, 6], robot_pos: [5, 0], target_pos: [0, 5], obstacles: [[1, 3], [2, 3], [3, 3]] },
        hints: ['Visit keycard coordinate (0,0) first.'],
        code_snippets: {
          python: 'robot.move_to(0, 0) # Keycard\nrobot.pickup_key()\nrobot.move_to(0, 5) # Gate',
          javascript: 'robot.moveTo(0, 0);\nrobot.pickupKey();\nrobot.moveTo(0, 5);',
          cpp: 'robot.moveTo(0, 0); robot.pickupKey(); robot.moveTo(0, 5);'
        },
        xp_reward: 90
      },
      {
        id: 105,
        level_number: 5,
        difficulty: 'EXPERT',
        difficulty_label: 'Expert',
        title: 'Dynamic Shortest Path Routing',
        objective: 'Navigate complex maze in under 12 total commands.',
        instructions: 'Calculate globally optimal path avoiding lava hazards.',
        initial_state: { grid_size: [7, 7], robot_pos: [0, 0], target_pos: [6, 6], obstacles: [[1, 0], [1, 1], [3, 2], [3, 3], [5, 5]] },
        hints: ['Utilize diagonal routing segments to minimize instruction count.'],
        code_snippets: {
          python: 'path = robot.find_shortest_path((0,0), (6,6))\nrobot.execute_path(path)',
          javascript: 'const path = robot.findShortestPath([0,0], [6,6]);\nrobot.executePath(path);',
          cpp: 'auto path = robot.findShortestPath({0,0}, {6,6});'
        },
        xp_reward: 120
      }
    ]
  },

  'loop-runner': {
    id: 2,
    slug: 'loop-runner',
    title: 'Loop Runner',
    category: 'CONTROL_FLOW',
    concept: 'Loops, Bounds & Repetition',
    tagline: 'Automate repetitive track actions using FOR and WHILE loops.',
    icon: '🔁',
    badge_color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
    languages_supported: ['python', 'javascript', 'cpp'],
    levels: [
      {
        id: 201,
        level_number: 1,
        difficulty: 'BEGINNER',
        difficulty_label: 'Beginner',
        title: 'Standard Repetition Loop',
        objective: 'Clear 4 repetitive hurdles using a single loop construct.',
        instructions: 'Set the loop iteration count to 4.',
        initial_state: { hurdles: [1, 3, 5, 7], runner_pos: 0, track_length: 8 },
        hints: ['Loop 4 times with step() and jump().'],
        code_snippets: {
          python: 'for i in range(4):\n    runner.step()\n    runner.jump()',
          javascript: 'for (let i = 0; i < 4; i++) {\n    runner.step();\n    runner.jump();\n}',
          cpp: 'for (int i = 0; i < 4; i++) {\n    runner.step();\n    runner.jump();\n}'
        },
        xp_reward: 50
      },
      {
        id: 202,
        level_number: 2,
        difficulty: 'EASY',
        difficulty_label: 'Easy',
        title: 'WHILE Barrier Scanner',
        objective: 'Run forward until optical sensor detects a boundary wall.',
        instructions: 'Execute while not is_blocked() loop.',
        initial_state: { wall_pos: 8, runner_pos: 0, coins: [2, 4, 6] },
        hints: ['While loop runs until condition becomes False.'],
        code_snippets: {
          python: 'while not is_blocked():\n    runner.step()\n    if has_coin(): runner.collect()',
          javascript: 'while (!isBlocked()) {\n    runner.step();\n    if (hasCoin()) runner.collect();\n}',
          cpp: 'while (!isBlocked()) { runner.step(); }'
        },
        xp_reward: 60
      },
      {
        id: 203,
        level_number: 3,
        difficulty: 'MEDIUM',
        difficulty_label: 'Medium',
        title: 'Nested Matrix Sweeper',
        objective: 'Scan and clean a 4x4 grid using nested row and column loops.',
        instructions: 'Outer loop iterates rows (0..3); inner loop iterates columns (0..3).',
        initial_state: { grid_size: [4, 4], dirty_cells: 16 },
        hints: ['Outer loop moves down rows; inner loop sweeps columns.'],
        code_snippets: {
          python: 'for row in range(4):\n    for col in range(4):\n        clean_cell(row, col)',
          javascript: 'for (let r = 0; r < 4; r++) {\n    for (let c = 0; c < 4; c++) cleanCell(r, c);\n}',
          cpp: 'for (int r=0; r<4; r++) for (int c=0; c<4; c++) cleanCell(r, c);'
        },
        xp_reward: 75
      },
      {
        id: 204,
        level_number: 4,
        difficulty: 'HARD',
        difficulty_label: 'Hard',
        title: 'Conditional Loop Filter',
        objective: 'Iterate through data packets and only ingest verified packets.',
        instructions: 'Combine loop iteration with IF packet.is_verified check.',
        initial_state: { total_packets: 8, verified_indices: [1, 3, 4, 6] },
        hints: ['Check condition before executing ingest action.'],
        code_snippets: {
          python: 'for packet in stream:\n    if packet.is_verified:\n        ingest(packet)',
          javascript: 'for (const p of stream) {\n    if (p.isVerified) ingest(p);\n}',
          cpp: 'for (auto& p : stream) if (p.isVerified) ingest(p);'
        },
        xp_reward: 90
      },
      {
        id: 205,
        level_number: 5,
        difficulty: 'EXPERT',
        difficulty_label: 'Expert',
        title: 'Accumulator Summation Loop',
        objective: 'Compute series sum 1 + 2 + 3 + ... + N with step size 1.',
        instructions: 'Maintain running total accumulator variable across loop iterations.',
        initial_state: { n: 5, expected_sum: 15 },
        hints: ['total += i on each loop step.'],
        code_snippets: {
          python: 'total = 0\nfor i in range(1, 6):\n    total += i # 15',
          javascript: 'let total = 0;\nfor (let i = 1; i <= 5; i++) total += i;',
          cpp: 'int total = 0;\nfor (int i = 1; i <= 5; i++) total += i;'
        },
        xp_reward: 120
      }
    ]
  },

  'conditional-city': {
    id: 3,
    slug: 'conditional-city',
    title: 'Conditional City',
    category: 'CONTROL_FLOW',
    concept: 'Boolean Logic & Branching',
    tagline: 'Orchestrate autonomous city traffic and emergency priority routing.',
    icon: '🚦',
    badge_color: '#10b981',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    languages_supported: ['python', 'javascript', 'cpp'],
    levels: [
      {
        id: 301,
        level_number: 1,
        difficulty: 'BEGINNER',
        difficulty_label: 'Beginner',
        title: 'Traffic Light Navigator',
        objective: 'Program autonomous vehicle to STOP on RED and PROCEED on GREEN.',
        instructions: 'If light == "GREEN" move forward, else halt.',
        initial_state: { signals: ['GREEN', 'RED', 'GREEN'], car_pos: 0 },
        hints: ['Test signal state at each junction.'],
        code_snippets: {
          python: 'if light == "GREEN":\n    car.proceed()\nelse:\n    car.stop()',
          javascript: 'if (light === "GREEN") car.proceed(); else car.stop();',
          cpp: 'if (light == "GREEN") car.proceed(); else car.stop();'
        },
        xp_reward: 50
      },
      {
        id: 302,
        level_number: 2,
        difficulty: 'EASY',
        difficulty_label: 'Easy',
        title: 'Speed Zone Governor',
        objective: 'Handle multiple speed zones with IF-ELIF-ELSE conditions.',
        instructions: 'School zone (20mph), Highway (65mph), Default (45mph).',
        initial_state: { zones: ['school', 'highway', 'residential'] },
        hints: ['Use ELIF for the intermediate highway branch.'],
        code_snippets: {
          python: 'if zone == "school": speed = 20\nelif zone == "highway": speed = 65\nelse: speed = 45',
          javascript: 'if (zone === "school") speed = 20;\nelse if (zone === "highway") speed = 65;\nelse speed = 45;',
          cpp: 'if (zone == "school") speed = 20; else if (zone == "highway") speed = 65; else speed = 45;'
        },
        xp_reward: 60
      },
      {
        id: 303,
        level_number: 3,
        difficulty: 'MEDIUM',
        difficulty_label: 'Medium',
        title: 'Emergency Vehicle Priority',
        objective: 'Grant immediate right-of-way when is_emergency == True or light == "GREEN".',
        instructions: 'Combine boolean OR operator in condition check.',
        initial_state: { vehicle_type: 'ambulance', is_emergency: true, light: 'RED' },
        hints: ['Emergency sirens override red lights: if is_emergency or light == "GREEN".'],
        code_snippets: {
          python: 'if is_emergency or light == "GREEN":\n    car.proceed()\nelse:\n    car.wait()',
          javascript: 'if (isEmergency || light === "GREEN") car.proceed(); else car.wait();',
          cpp: 'if (isEmergency || light == "GREEN") car.proceed(); else car.wait();'
        },
        xp_reward: 75
      },
      {
        id: 304,
        level_number: 4,
        difficulty: 'HARD',
        difficulty_label: 'Hard',
        title: 'Weather-Adaptive Braking System',
        objective: 'Calculate safe stopping distance based on road surface telemetry.',
        instructions: 'Icy surface requires 3x distance, wet requires 1.5x, dry requires 1.0x.',
        initial_state: { weather: 'ice', speed: 60 },
        hints: ['Multiply base speed by weather coefficient.'],
        code_snippets: {
          python: 'if weather == "ice": dist = speed * 3.0\nelif weather == "rain": dist = speed * 1.5\nelse: dist = speed * 1.0',
          javascript: 'let dist = weather === "ice" ? speed * 3 : (weather === "rain" ? speed * 1.5 : speed);',
          cpp: 'double dist = (weather == "ice") ? speed * 3.0 : ((weather == "rain") ? speed * 1.5 : speed);'
        },
        xp_reward: 90
      },
      {
        id: 305,
        level_number: 5,
        difficulty: 'EXPERT',
        difficulty_label: 'Expert',
        title: 'Smart Grid Multi-Intersection Dispatch',
        objective: 'Synchronize 4 traffic nodes simultaneously without gridlock.',
        instructions: 'Dynamically assign green phases to highest queue density.',
        initial_state: { intersections: 4, queue_lengths: [12, 4, 18, 7] },
        hints: ['Select node with max waiting queue for green phase.'],
        code_snippets: {
          python: 'busiest = max(intersections, key=lambda i: i.queue)\nbusiest.set_green()',
          javascript: 'const busiest = intersections.reduce((a, b) => a.queue > b.queue ? a : b);\nbusiest.setGreen();',
          cpp: 'auto busiest = getBusiestIntersection(); busiest->setGreen();'
        },
        xp_reward: 120
      }
    ]
  },

  'variable-factory': {
    id: 4,
    slug: 'variable-factory',
    title: 'Variable Factory',
    category: 'STATE',
    concept: 'Variables & State Memory',
    tagline: 'Track memory registers, perform atomic swaps, and accumulate values.',
    icon: '📦',
    badge_color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    languages_supported: ['python', 'javascript', 'cpp'],
    levels: [
      {
        id: 401,
        level_number: 1,
        difficulty: 'BEGINNER',
        difficulty_label: 'Beginner',
        title: 'Warehouse Item Counter',
        objective: 'Initialize variable `box_count = 0` and increment by 1 for each package.',
        instructions: 'Add box_count += 1 for each incoming box.',
        initial_state: { variables: { box_count: 0 }, target: { box_count: 5 } },
        hints: ['Increment box_count 5 times.'],
        code_snippets: {
          python: 'box_count = 0\nfor _ in range(5):\n    box_count += 1',
          javascript: 'let box_count = 0;\nfor (let i = 0; i < 5; i++) box_count++;',
          cpp: 'int box_count = 0;\nfor(int i=0; i<5; i++) box_count++;'
        },
        xp_reward: 50
      },
      {
        id: 402,
        level_number: 2,
        difficulty: 'EASY',
        difficulty_label: 'Easy',
        title: 'Account Balance Accumulator',
        objective: 'Update `balance` register across credits and debits.',
        instructions: 'Add deposit +100, subtract fee -15.',
        initial_state: { balance: 250, deposit: 100, fee: 15 },
        hints: ['balance = balance + deposit - fee.'],
        code_snippets: {
          python: 'balance = 250\nbalance += 100\nbalance -= 15 # 335',
          javascript: 'let balance = 250;\nbalance += 100;\nbalance -= 15;',
          cpp: 'int balance = 250; balance += 100; balance -= 15;'
        },
        xp_reward: 60
      },
      {
        id: 403,
        level_number: 3,
        difficulty: 'MEDIUM',
        difficulty_label: 'Medium',
        title: 'Temp Variable Swap Chamber',
        objective: 'Swap values of Register A (5) and Register B (9) using a temp buffer.',
        instructions: 'temp = a; a = b; b = temp;',
        initial_state: { a: 5, b: 9, temp: null },
        hints: ['Save A into temp before overwriting A with B.'],
        code_snippets: {
          python: 'temp = a\na = b\nb = temp\n# In Python: a, b = b, a',
          javascript: 'let temp = a;\na = b;\nb = temp;',
          cpp: 'int temp = a; a = b; b = temp;'
        },
        xp_reward: 75
      },
      {
        id: 404,
        level_number: 4,
        difficulty: 'HARD',
        difficulty_label: 'Hard',
        title: 'Type Parsing & Casting',
        objective: 'Convert string input "42" into integer 42 and calculate total + 8.',
        instructions: 'total = int("42") + 8 produces 50.',
        initial_state: { raw_str: "42", bonus: 8 },
        hints: ['Type casting string to int prevents string concatenation bugs.'],
        code_snippets: {
          python: 'raw = "42"\ntotal = int(raw) + 8 # 50',
          javascript: 'let raw = "42";\nlet total = parseInt(raw, 10) + 8;',
          cpp: 'int total = std::stoi("42") + 8;'
        },
        xp_reward: 90
      },
      {
        id: 405,
        level_number: 5,
        difficulty: 'EXPERT',
        difficulty_label: 'Expert',
        title: 'Player Shield & HP State Engine',
        objective: 'Calculate final HP after 3 enemy strikes absorbing damage through shield first.',
        instructions: 'Shield absorbs incoming damage first; overflow damages health.',
        initial_state: { health: 100, shield: 40, hits: [30, 25, 20] },
        hints: ['When shield reaches 0, remaining hit deducts from HP.'],
        code_snippets: {
          python: 'for hit in hits:\n    shield -= hit\n    if shield < 0:\n        health += shield # overflow\n        shield = 0',
          javascript: 'hits.forEach(hit => {\n    shield -= hit;\n    if (shield < 0) { health += shield; shield = 0; }\n});',
          cpp: 'for (int hit : hits) { shield -= hit; if (shield < 0) { health += shield; shield = 0; } }'
        },
        xp_reward: 120
      }
    ]
  },

  'function-machine': {
    id: 5,
    slug: 'function-machine',
    title: 'Function Machine',
    category: 'MODULARITY',
    concept: 'Functions & Return Values',
    tagline: 'Construct reusable processing pipelines transforming inputs to outputs.',
    icon: '⚙️',
    badge_color: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
    languages_supported: ['python', 'javascript', 'cpp'],
    levels: [
      {
        id: 501,
        level_number: 1,
        difficulty: 'BEGINNER',
        difficulty_label: 'Beginner',
        title: 'Number Doubler Function',
        objective: 'Write a function double(x) that returns x * 2.',
        instructions: 'Process test cases [2, 5, 10] to return [4, 10, 20].',
        initial_state: { test_inputs: [2, 5, 10], expected_outputs: [4, 10, 20] },
        hints: ['return x * 2.'],
        code_snippets: {
          python: 'def double(x):\n    return x * 2',
          javascript: 'function double(x) {\n    return x * 2;\n}',
          cpp: 'int doubleNum(int x) {\n    return x * 2;\n}'
        },
        xp_reward: 50
      },
      {
        id: 502,
        level_number: 2,
        difficulty: 'EASY',
        difficulty_label: 'Easy',
        title: 'String Formatter Module',
        objective: 'Create `format_greeting(name)` returning "Welcome, {name}!".',
        instructions: 'Accept string parameter and return formatted template.',
        initial_state: { names: ['Alice', 'Bob', 'Charlie'] },
        hints: ['Use string formatting.'],
        code_snippets: {
          python: 'def format_greeting(name):\n    return f"Welcome, {name}!"',
          javascript: 'function formatGreeting(name) {\n    return `Welcome, ${name}!`;\n}',
          cpp: 'std::string formatGreeting(std::string name) { return "Welcome, " + name + "!"; }'
        },
        xp_reward: 60
      },
      {
        id: 503,
        level_number: 3,
        difficulty: 'MEDIUM',
        difficulty_label: 'Medium',
        title: 'Area Calculator with Validation',
        objective: 'Compute `calculate_area(w, h)` returning w * h with positive validation.',
        instructions: 'If w <= 0 or h <= 0 return 0.',
        initial_state: { pairs: [[5, 10], [-2, 8], [7, 3]] },
        hints: ['Check if w > 0 and h > 0 before computing product.'],
        code_snippets: {
          python: 'def calculate_area(w, h):\n    if w <= 0 or h <= 0: return 0\n    return w * h',
          javascript: 'function calculateArea(w, h) {\n    return (w > 0 && h > 0) ? w * h : 0;\n}',
          cpp: 'int calculateArea(int w, int h) { return (w > 0 && h > 0) ? w * h : 0; }'
        },
        xp_reward: 75
      },
      {
        id: 504,
        level_number: 4,
        difficulty: 'HARD',
        difficulty_label: 'Hard',
        title: 'Discount Pricing with Defaults',
        objective: 'Build `apply_discount(price, rate=0.1)` with fallback default discount rate.',
        instructions: 'Calculate final price factoring in default 10% rate.',
        initial_state: { items: [{ price: 100, rate: 0.2 }, { price: 50, rate: null }] },
        hints: ['Default argument is used when no rate is passed.'],
        code_snippets: {
          python: 'def apply_discount(price, rate=0.1):\n    return price * (1.0 - rate)',
          javascript: 'function applyDiscount(price, rate = 0.1) {\n    return price * (1.0 - rate);\n}',
          cpp: 'double applyDiscount(double price, double rate = 0.1) { return price * (1.0 - rate); }'
        },
        xp_reward: 90
      },
      {
        id: 505,
        level_number: 5,
        difficulty: 'EXPERT',
        difficulty_label: 'Expert',
        title: 'ETL Data Transformation Pipeline',
        objective: 'Chain `clean()`, `transform()`, and `validate()` into single pipeline.',
        instructions: 'Execute sanitize -> uppercase -> parse payload.',
        initial_state: { raw_payload: "   <user_id_42>   " },
        hints: ['validate(transform(clean(raw_payload)))'],
        code_snippets: {
          python: 'def process_payload(raw):\n    clean = raw.strip().replace("<", "").replace(">", "")\n    return clean.upper()\n\nresult = process_payload("   <user_id_42>   ")',
          javascript: 'const processPayload = (raw) => raw.trim().replace(/[<>]/g, "").toUpperCase();',
          cpp: 'std::string processPayload(std::string raw) { /* sanitize & upper */ return result; }'
        },
        xp_reward: 120
      }
    ]
  },

  'array-adventure': {
    id: 6,
    slug: 'array-adventure',
    title: 'Array Adventure',
    category: 'DATA_STRUCTURES',
    concept: 'Zero-Index Arrays',
    tagline: 'Access elements, slice subarrays, and master collection manipulation.',
    icon: '🧱',
    badge_color: '#ec4899',
    gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
    languages_supported: ['python', 'javascript', 'cpp'],
    levels: [
      {
        id: 601,
        level_number: 1,
        difficulty: 'BEGINNER',
        difficulty_label: 'Beginner',
        title: 'Zero-Indexed Inventory',
        objective: 'Select chest at index 2 to obtain the emerald.',
        instructions: 'Remember that indices begin at 0: [0: Bronze, 1: Silver, 2: Emerald].',
        initial_state: { items: ['Bronze', 'Silver', 'Emerald', 'Gold', 'Diamond'], target_index: 2 },
        hints: ['Index 0 is first, index 2 is third item.'],
        code_snippets: {
          python: 'treasure = items[2] # "Emerald"',
          javascript: 'const treasure = items[2]; // "Emerald"',
          cpp: 'string treasure = items[2];'
        },
        xp_reward: 50
      },
      {
        id: 602,
        level_number: 2,
        difficulty: 'EASY',
        difficulty_label: 'Easy',
        title: 'Push & Pop Operations',
        objective: 'Append "Ruby" to gem list, then pop the trailing element.',
        instructions: 'Execute append("Ruby"), append("Sapphire"), pop().',
        initial_state: { gems: ['Diamond', 'Opal'] },
        hints: ['append adds to end; pop removes the final item.'],
        code_snippets: {
          python: 'gems = ["Diamond", "Opal"]\ngems.append("Ruby")\ngems.append("Sapphire")\ngems.pop()\nprint(gems) # ["Diamond", "Opal", "Ruby"]',
          javascript: 'let gems = ["Diamond", "Opal"];\ngems.push("Ruby");\ngems.push("Sapphire");\ngems.pop();',
          cpp: 'gems.push_back("Ruby"); gems.push_back("Sapphire"); gems.pop_back();'
        },
        xp_reward: 60
      },
      {
        id: 603,
        level_number: 3,
        difficulty: 'MEDIUM',
        difficulty_label: 'Medium',
        title: 'Subarray Slicing Chamber',
        objective: 'Extract elements from index 1 inclusive up to index 4 exclusive: `nums[1:4]`.',
        instructions: 'From `[10, 20, 30, 40, 50]`, extract `[20, 30, 40]`.',
        initial_state: { nums: [10, 20, 30, 40, 50] },
        hints: ['Slice [start:end] excludes the end index.'],
        code_snippets: {
          python: 'nums = [10, 20, 30, 40, 50]\nsub = nums[1:4] # [20, 30, 40]',
          javascript: 'const nums = [10, 20, 30, 40, 50];\nconst sub = nums.slice(1, 4);',
          cpp: '// std::vector sub(nums.begin() + 1, nums.begin() + 4);'
        },
        xp_reward: 75
      },
      {
        id: 604,
        level_number: 4,
        difficulty: 'HARD',
        difficulty_label: 'Hard',
        title: 'Two-Pointer Array Reversal',
        objective: 'Reverse array `[1, 2, 3, 4, 5]` in-place using two pointers.',
        instructions: 'Swap left and right pointers moving inward until they meet.',
        initial_state: { arr: [1, 2, 3, 4, 5] },
        hints: ['Swap arr[left] with arr[right], then left++, right--.'],
        code_snippets: {
          python: 'left, right = 0, len(arr) - 1\nwhile left < right:\n    arr[left], arr[right] = arr[right], arr[left]\n    left += 1\n    right -= 1',
          javascript: 'let l = 0, r = arr.length - 1;\nwhile (l < r) {\n    [arr[l], arr[r]] = [arr[r], arr[l]];\n    l++; r--;\n}',
          cpp: 'std::reverse(arr.begin(), arr.end());'
        },
        xp_reward: 90
      },
      {
        id: 605,
        level_number: 5,
        difficulty: 'EXPERT',
        difficulty_label: 'Expert',
        title: '2D Matrix Diagonal Sweep',
        objective: 'Extract main diagonal `[matrix[i][i]]` from a 3x3 grid.',
        instructions: 'Iterate i from 0 to 2 and collect cell where row == col.',
        initial_state: { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] },
        hints: ['Diagonal coordinates are (0,0), (1,1), (2,2) giving [1, 5, 9].'],
        code_snippets: {
          python: 'matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\ndiag = [matrix[i][i] for i in range(3)] # [1, 5, 9]',
          javascript: 'const diag = matrix.map((row, i) => row[i]); // [1, 5, 9]',
          cpp: 'for (int i = 0; i < 3; i++) diag.push_back(matrix[i][i]);'
        },
        xp_reward: 120
      }
    ]
  },

  'algorithm-maze': {
    id: 7,
    slug: 'algorithm-maze',
    title: 'Algorithm Maze',
    category: 'ALGORITHMS',
    concept: 'Search & Graph Traversal',
    tagline: 'Compare Linear vs Binary Search and navigate pathfinding graphs.',
    icon: '🧭',
    badge_color: '#14b8a6',
    gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)',
    languages_supported: ['python', 'javascript', 'cpp'],
    levels: [
      {
        id: 701,
        level_number: 1,
        difficulty: 'BEGINNER',
        difficulty_label: 'Beginner',
        title: 'Linear Search Scanner',
        objective: 'Find target number 7 in unsorted array `[4, 2, 9, 7, 1, 5]`.',
        instructions: 'Inspect each element sequentially from left to right.',
        initial_state: { list: [4, 2, 9, 7, 1, 5], target: 7 },
        hints: ['Check index 0, index 1, index 2, then index 3.'],
        code_snippets: {
          python: 'for i, val in enumerate(arr):\n    if val == target: return i',
          javascript: 'for (let i = 0; i < arr.length; i++) {\n    if (arr[i] === target) return i;\n}',
          cpp: 'for (int i=0; i<n; i++) if (arr[i] == target) return i;'
        },
        xp_reward: 50
      },
      {
        id: 702,
        level_number: 2,
        difficulty: 'EASY',
        difficulty_label: 'Easy',
        title: 'Binary Search Splitter',
        objective: 'Find key 42 in sorted list `[5, 12, 18, 27, 33, 42, 59, 70]` in under 3 probes.',
        instructions: 'Halve the search space by checking middle index at each step.',
        initial_state: { sorted_list: [5, 12, 18, 27, 33, 42, 59, 70], target: 42 },
        hints: ['Check mid. If target > mid, search right half (low = mid + 1).'],
        code_snippets: {
          python: 'low, high = 0, len(arr) - 1\nwhile low <= high:\n    mid = (low + high) // 2\n    if arr[mid] == target: return mid\n    elif arr[mid] < target: low = mid + 1\n    else: high = mid - 1',
          javascript: 'let low = 0, high = arr.length - 1;\nwhile (low <= high) {\n    let mid = Math.floor((low + high) / 2);\n    if (arr[mid] === target) return mid;\n    else if (arr[mid] < target) low = mid + 1;\n    else high = mid - 1;\n}',
          cpp: 'int binarySearch(vector<int>& arr, int target) { /* O(log N) */ }'
        },
        xp_reward: 60
      },
      {
        id: 703,
        level_number: 3,
        difficulty: 'MEDIUM',
        difficulty_label: 'Medium',
        title: 'BFS Shortest Path Grid',
        objective: 'Find shortest path from (0,0) to (4,4) using Queue-based BFS.',
        instructions: 'Explore neighbors layer by layer.',
        initial_state: { grid_size: [5, 5], start: [0, 0], goal: [4, 4], walls: [[1, 2], [2, 2], [3, 2]] },
        hints: ['BFS guarantees shortest unweighted path.'],
        code_snippets: {
          python: 'from collections import deque\nq = deque([(start, [start])])\nwhile q:\n    curr, path = q.popleft()\n    if curr == goal: return path',
          javascript: 'const q = [[start, [start]]];\nwhile (q.length > 0) {\n    const [curr, path] = q.shift();\n}',
          cpp: 'std::queue<pair<int, int>> q;'
        },
        xp_reward: 75
      },
      {
        id: 704,
        level_number: 4,
        difficulty: 'HARD',
        difficulty_label: 'Hard',
        title: 'Two-Pointer Target Pair',
        objective: 'Find two numbers in sorted list that sum to 50: `[10, 15, 20, 30, 35, 45]`.',
        instructions: 'If sum < target: left++. If sum > target: right--.',
        initial_state: { arr: [10, 15, 20, 30, 35, 45], target_sum: 50 },
        hints: ['Pair [15, 35] sums to 50.'],
        code_snippets: {
          python: 'left, right = 0, len(arr) - 1\nwhile left < right:\n    s = arr[left] + arr[right]\n    if s == target: return (arr[left], arr[right])\n    elif s < target: left += 1\n    else: right -= 1',
          javascript: 'while (l < r) {\n    const s = arr[l] + arr[r];\n    if (s === target) return [arr[l], arr[r]];\n    s < target ? l++ : r--;\n}',
          cpp: 'while(l < r) { int s = arr[l] + arr[r]; if (s == target) return {arr[l], arr[r]}; }'
        },
        xp_reward: 90
      },
      {
        id: 705,
        level_number: 5,
        difficulty: 'EXPERT',
        difficulty_label: 'Expert',
        title: 'Dijkstra Min-Cost Routing',
        objective: 'Find min-cost route through weighted graph nodes A -> D.',
        instructions: 'Expand lowest cumulative energy cost nodes first.',
        initial_state: { nodes: ['A', 'B', 'C', 'D'], expected_cost: 6 },
        hints: ['Route A -> B (2) -> C (1) -> D (3) gives min cost 6.'],
        code_snippets: {
          python: 'import heapq\npq = [(0, start)]\nwhile pq:\n    cost, u = heapq.heappop(pq)\n    if u == goal: return cost',
          javascript: 'const pq = new MinPriorityQueue();',
          cpp: 'priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;'
        },
        xp_reward: 120
      }
    ]
  },

  'debug-detective': {
    id: 8,
    slug: 'debug-detective',
    title: 'Debug Detective',
    category: 'DEBUGGING',
    concept: 'Syntax Traps & Logic Bugs',
    tagline: 'Spot bugs, fix off-by-one traps, and disarm infinite loops.',
    icon: '🔍',
    badge_color: '#ef4444',
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    languages_supported: ['python', 'javascript', 'cpp'],
    levels: [
      {
        id: 801,
        level_number: 1,
        difficulty: 'BEGINNER',
        difficulty_label: 'Beginner',
        title: 'The Missing Colon Bug',
        objective: 'Spot the syntax error in `for i in range(5)` header.',
        instructions: 'Select the missing syntax token.',
        initial_state: { bug_line: 1, hint: 'Loops require a colon in Python.' },
        hints: ['Python loop headers require a trailing colon (:).'],
        code_snippets: {
          python: '# Buggy:\nfor i in range(5)\n# Fixed:\nfor i in range(5):',
          javascript: '// JS Equivalent:\nfor (let i = 0; i < 5; i++) { ... }',
          cpp: 'for (int i = 0; i < 5; i++) { ... }'
        },
        xp_reward: 50
      },
      {
        id: 802,
        level_number: 2,
        difficulty: 'EASY',
        difficulty_label: 'Easy',
        title: 'The Infinite Loop Lockup',
        objective: 'Identify why `while x < 5:` locks up without stopping.',
        instructions: 'Notice the missing increment step `x += 1`.',
        initial_state: { bug_type: 'INFINITE_LOOP' },
        hints: ['If x never changes, x < 5 is perpetually True.'],
        code_snippets: {
          python: 'x = 0\nwhile x < 5:\n    print(x)\n    x += 1 # Added increment',
          javascript: 'let x = 0;\nwhile (x < 5) {\n    console.log(x);\n    x++;\n}',
          cpp: 'int x = 0; while (x < 5) { std::cout << x; x++; }'
        },
        xp_reward: 60
      },
      {
        id: 803,
        level_number: 3,
        difficulty: 'MEDIUM',
        difficulty_label: 'Medium',
        title: 'Off-By-One Index Trap',
        objective: 'Fix IndexError accessing last item of 3-element array.',
        instructions: 'Array has 3 items (indices 0, 1, 2); accessing arr[3] causes crash.',
        initial_state: { bug_type: 'OFF_BY_ONE' },
        hints: ['The last element is at arr[len(arr) - 1].'],
        code_snippets: {
          python: 'arr = [10, 20, 30]\nlast = arr[-1] # or arr[len(arr) - 1]',
          javascript: 'const arr = [10, 20, 30];\nconst last = arr[arr.length - 1];',
          cpp: 'int last = arr[arr.size() - 1];'
        },
        xp_reward: 75
      },
      {
        id: 804,
        level_number: 4,
        difficulty: 'HARD',
        difficulty_label: 'Hard',
        title: 'Accidental Assignment in Condition',
        objective: 'Fix bug where `if x = 100:` is written instead of `if x == 100:`.',
        instructions: 'Use double equals (==) for equality comparison.',
        initial_state: { bug_type: 'ASSIGNMENT_VS_EQUALITY' },
        hints: ['= sets a variable; == tests if two values are equal.'],
        code_snippets: {
          python: 'if x == 100:\n    return "Perfect Score!"',
          javascript: 'if (x === 100) return "Perfect Score!";',
          cpp: 'if (x == 100) return "Perfect Score!";'
        },
        xp_reward: 90
      },
      {
        id: 805,
        level_number: 5,
        difficulty: 'EXPERT',
        difficulty_label: 'Expert',
        title: 'Mutable Default Argument Bug',
        objective: 'Fix bug where `def append_to(item, list=[])` shares list across calls.',
        instructions: 'Use `list=None` and initialize `list = []` inside the function.',
        initial_state: { bug_type: 'MUTABLE_DEFAULT' },
        hints: ['Never use mutable objects as default arguments.'],
        code_snippets: {
          python: 'def append_to(item, target=None):\n    if target is None: target = []\n    target.append(item)\n    return target',
          javascript: 'function appendTo(item, target = []) {\n    return [...target, item];\n}',
          cpp: 'vector<int> appendTo(int item, vector<int> target = {}) { ... }'
        },
        xp_reward: 120
      }
    ]
  },

  'sorting-race': {
    id: 9,
    slug: 'sorting-race',
    title: 'Sorting Race',
    category: 'ALGORITHMS',
    concept: 'Sorting Algorithms',
    tagline: 'Race Bubble, Selection, Insertion, and QuickSort algorithms.',
    icon: '📊',
    badge_color: '#f97316',
    gradient: 'linear-gradient(135deg, #f97316, #ea580c)',
    languages_supported: ['python', 'javascript', 'cpp'],
    levels: [
      {
        id: 901,
        level_number: 1,
        difficulty: 'BEGINNER',
        difficulty_label: 'Beginner',
        title: 'Bubble Sort Adjacent Swap',
        objective: 'Sort array `[5, 2, 8, 1, 3]` in ascending order using adjacent swaps.',
        instructions: 'If left element > right element, swap them.',
        initial_state: { array: [5, 2, 8, 1, 3], target_sorted: [1, 2, 3, 5, 8] },
        hints: ['Compare 5 and 2 -> swap to [2, 5].'],
        code_snippets: {
          python: 'for i in range(len(arr)):\n    for j in range(0, len(arr) - i - 1):\n        if arr[j] > arr[j + 1]:\n            arr[j], arr[j + 1] = arr[j + 1], arr[j]',
          javascript: 'for (let i = 0; i < arr.length; i++) {\n    for (let j = 0; j < arr.length - i - 1; j++) {\n        if (arr[j] > arr[j + 1]) {\n            [arr[j], arr[j+1]] = [arr[j+1], arr[j]];\n        }\n    }\n}',
          cpp: 'if (arr[j] > arr[j+1]) std::swap(arr[j], arr[j+1]);'
        },
        xp_reward: 50
      },
      {
        id: 902,
        level_number: 2,
        difficulty: 'EASY',
        difficulty_label: 'Easy',
        title: 'Selection Sort Min Locator',
        objective: 'Find the minimum element in unsorted partition and place at index 0.',
        instructions: 'Scan array `[64, 25, 12, 22, 11]`. Min is 11 -> swap with 64.',
        initial_state: { array: [64, 25, 12, 22, 11] },
        hints: ['Selection sort locates global minimum for each slot.'],
        code_snippets: {
          python: 'for i in range(len(arr)):\n    min_idx = i\n    for j in range(i + 1, len(arr)):\n        if arr[j] < arr[min_idx]: min_idx = j\n    arr[i], arr[min_idx] = arr[min_idx], arr[i]',
          javascript: 'for (let i = 0; i < arr.length; i++) {\n    let minIdx = i;\n    for (let j = i+1; j < arr.length; j++) if (arr[j] < arr[minIdx]) minIdx = j;\n    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];\n}',
          cpp: 'for (int i=0; i<n-1; i++) { int min_idx = i; /* ... */ std::swap(arr[min_idx], arr[i]); }'
        },
        xp_reward: 60
      },
      {
        id: 903,
        level_number: 3,
        difficulty: 'MEDIUM',
        difficulty_label: 'Medium',
        title: 'Insertion Sort Card Sliding',
        objective: 'Insert incoming element into its correct sorted left position.',
        instructions: 'Shift larger elements to the right to create an insertion slot.',
        initial_state: { array: [12, 11, 13, 5, 6] },
        hints: ['Shift 12 right to place 11 at index 0.'],
        code_snippets: {
          python: 'for i in range(1, len(arr)):\n    key = arr[i]\n    j = i - 1\n    while j >= 0 and key < arr[j]:\n        arr[j + 1] = arr[j]\n        j -= 1\n    arr[j + 1] = key',
          javascript: 'for (let i = 1; i < arr.length; i++) {\n    let key = arr[i], j = i - 1;\n    while (j >= 0 && arr[j] > key) { arr[j+1] = arr[j]; j--; }\n    arr[j+1] = key;\n}',
          cpp: 'for (int i = 1; i < n; i++) { /* shift and insert */ }'
        },
        xp_reward: 75
      },
      {
        id: 904,
        level_number: 4,
        difficulty: 'HARD',
        difficulty_label: 'Hard',
        title: 'Merge Sort Two-Way Merge',
        objective: 'Merge two sorted arrays `[2, 5, 8]` and `[1, 3, 7]` into `[1, 2, 3, 5, 7, 8]`.',
        instructions: 'Compare heads of both arrays and append the smaller value.',
        initial_state: { left: [2, 5, 8], right: [1, 3, 7] },
        hints: ['Compare 2 vs 1 -> pick 1. Compare 2 vs 3 -> pick 2.'],
        code_snippets: {
          python: 'def merge(left, right):\n    res = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] < right[j]: res.append(left[i]); i += 1\n        else: res.append(right[j]); j += 1\n    return res + left[i:] + right[j:]',
          javascript: 'function merge(left, right) { /* Two pointer O(N) merge */ }',
          cpp: 'std::merge(left.begin(), left.end(), right.begin(), right.end(), back_inserter(result));'
        },
        xp_reward: 90
      },
      {
        id: 905,
        level_number: 5,
        difficulty: 'EXPERT',
        difficulty_label: 'Expert',
        title: 'QuickSort Pivot Partitioning',
        objective: 'Partition array around pivot 5 so all left < 5 and all right > 5.',
        instructions: 'From `[7, 2, 1, 8, 6, 3, 5]`, place pivot at final sorted position.',
        initial_state: { array: [7, 2, 1, 8, 6, 3, 5], pivot: 5 },
        hints: ['Elements <= 5 move to left partition; elements > 5 move to right.'],
        code_snippets: {
          python: 'def partition(arr, low, high):\n    pivot = arr[high]\n    i = low - 1\n    for j in range(low, high):\n        if arr[j] <= pivot:\n            i += 1\n            arr[i], arr[j] = arr[j], arr[i]\n    arr[i+1], arr[high] = arr[high], arr[i+1]\n    return i + 1',
          javascript: 'function partition(arr, low, high) { /* Lomuto partition */ }',
          cpp: 'int partition(vector<int>& arr, int low, int high) { /* ... */ }'
        },
        xp_reward: 120
      }
    ]
  },

  'recursion-tower': {
    id: 10,
    slug: 'recursion-tower',
    title: 'Recursion Tower',
    category: 'MODULARITY',
    concept: 'Recursion & Call Stack',
    tagline: 'Stack activation frames, protect base cases, and solve Hanoi towers.',
    icon: '🗼',
    badge_color: '#a855f7',
    gradient: 'linear-gradient(135deg, #a855f7, #7e22ce)',
    languages_supported: ['python', 'javascript', 'cpp'],
    levels: [
      {
        id: 1001,
        level_number: 1,
        difficulty: 'BEGINNER',
        difficulty_label: 'Beginner',
        title: 'Factorial Call Stack',
        objective: 'Calculate `factorial(4)` by pushing stack frames 4 -> 3 -> 2 -> 1.',
        instructions: 'Push frames: 4*f(3) -> 3*f(2) -> 2*f(1) -> base case return 1. Unwind to 24.',
        initial_state: { target_n: 4, expected_result: 24 },
        hints: ['Base case is n <= 1 return 1. Multiply values on unwind.'],
        code_snippets: {
          python: 'def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)',
          javascript: 'function factorial(n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}',
          cpp: 'int factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}'
        },
        xp_reward: 50
      },
      {
        id: 1002,
        level_number: 2,
        difficulty: 'EASY',
        difficulty_label: 'Easy',
        title: 'Countdown Base Case Shield',
        objective: 'Prevent stack overflow by enforcing base case `if n == 0: return`.',
        instructions: 'Without a base case, recursion executes indefinitely until memory crashes.',
        initial_state: { n: 5 },
        hints: ['Every recursive function MUST define a base case.'],
        code_snippets: {
          python: 'def countdown(n):\n    if n == 0: return # Base case guard\n    print(n)\n    countdown(n - 1)',
          javascript: 'function countdown(n) {\n    if (n === 0) return;\n    console.log(n);\n    countdown(n - 1);\n}',
          cpp: 'void countdown(int n) { if (n == 0) return; countdown(n-1); }'
        },
        xp_reward: 60
      },
      {
        id: 1003,
        level_number: 3,
        difficulty: 'MEDIUM',
        difficulty_label: 'Medium',
        title: 'Fibonacci Call Tree',
        objective: 'Calculate `fib(5)` using recursive tree: `fib(n-1) + fib(n-2)`.',
        instructions: 'Watch the stack branch into left and right sub-evaluations.',
        initial_state: { n: 5 },
        hints: ['fib(0)=0, fib(1)=1, fib(5)=5.'],
        code_snippets: {
          python: 'def fib(n):\n    if n <= 0: return 0\n    if n == 1: return 1\n    return fib(n - 1) + fib(n - 2)',
          javascript: 'function fib(n) {\n    if (n <= 1) return n;\n    return fib(n - 1) + fib(n - 2);\n}',
          cpp: 'int fib(int n) { if (n <= 1) return n; return fib(n-1) + fib(n-2); }'
        },
        xp_reward: 75
      },
      {
        id: 1004,
        level_number: 4,
        difficulty: 'HARD',
        difficulty_label: 'Hard',
        title: 'Tower of Hanoi 3-Disk Solver',
        objective: 'Move 3 disks from Peg A to Peg C using helper Peg B in exactly 7 moves.',
        instructions: 'Rule: Move n-1 to helper -> Move base disk -> Move n-1 to target.',
        initial_state: { disks: 3, pegs: { A: [3, 2, 1], B: [], C: [] } },
        hints: ['Takes 2^3 - 1 = 7 total moves.'],
        code_snippets: {
          python: 'def hanoi(n, src, tgt, hlp):\n    if n == 1:\n        print(f"Move from {src} to {tgt}")\n        return\n    hanoi(n - 1, src, hlp, tgt)\n    print(f"Move from {src} to {tgt}")\n    hanoi(n - 1, hlp, tgt, src)',
          javascript: 'function hanoi(n, src, tgt, hlp) { /* 7 steps */ }',
          cpp: 'void hanoi(int n, char src, char tgt, char hlp) { /* ... */ }'
        },
        xp_reward: 90
      },
      {
        id: 1005,
        level_number: 5,
        difficulty: 'EXPERT',
        difficulty_label: 'Expert',
        title: 'Recursive String Inversion',
        objective: 'Reverse string "RECURSION" recursively without loops.',
        instructions: 'reverse(s) = reverse(s[1:]) + s[0].',
        initial_state: { input_str: 'RECURSION' },
        hints: ['Base case is len(s) <= 1: return s.'],
        code_snippets: {
          python: 'def reverse_str(s):\n    if len(s) <= 1: return s\n    return reverse_str(s[1:]) + s[0] # "NOISRUCER"',
          javascript: 'const reverseStr = (s) => s.length <= 1 ? s : reverseStr(s.slice(1)) + s[0];',
          cpp: 'std::string rev(std::string s) { if (s.size() <= 1) return s; return rev(s.substr(1)) + s[0]; }'
        },
        xp_reward: 120
      }
    ]
  },

  'logic-builder': {
    id: 11,
    slug: 'logic-builder',
    title: 'Logic Builder',
    category: 'LOGIC',
    concept: 'Boolean Logic Gates',
    tagline: 'Wire AND, OR, NOT, and XOR circuits to power target circuits.',
    icon: '⚡',
    badge_color: '#eab308',
    gradient: 'linear-gradient(135deg, #eab308, #ca8a04)',
    languages_supported: ['python', 'javascript', 'cpp'],
    levels: [
      {
        id: 1101,
        level_number: 1,
        difficulty: 'BEGINNER',
        difficulty_label: 'Beginner',
        title: 'AND Gate Ignition',
        objective: 'Provide True inputs on both switches to activate the engine.',
        instructions: 'Set Switch A = 1 and Switch B = 1.',
        initial_state: { inputs: { a: true, b: true }, gate: 'AND', expected: true },
        hints: ['AND is True only when both inputs are True.'],
        code_snippets: {
          python: 'result = switch_a and switch_b',
          javascript: 'const result = switchA && switchB;',
          cpp: 'bool result = switchA && switchB;'
        },
        xp_reward: 50
      },
      {
        id: 1102,
        level_number: 2,
        difficulty: 'EASY',
        difficulty_label: 'Easy',
        title: 'NOT Inverter Security Sensor',
        objective: 'Invert sensor alarm state: `is_safe = NOT alarm_triggered`.',
        instructions: 'NOT turns False into True, and True into False.',
        initial_state: { alarm_triggered: false },
        hints: ['not False == True.'],
        code_snippets: {
          python: 'alarm = False\nis_safe = not alarm # True',
          javascript: 'let alarm = false;\nlet isSafe = !alarm; // true',
          cpp: 'bool isSafe = !alarm;'
        },
        xp_reward: 60
      },
      {
        id: 1103,
        level_number: 3,
        difficulty: 'MEDIUM',
        difficulty_label: 'Medium',
        title: 'XOR Dual Light Switch',
        objective: 'Configure two-way staircase light switch: `A XOR B`.',
        instructions: 'XOR outputs True if exactly one switch is toggled.',
        initial_state: { switch_1: true, switch_2: false },
        hints: ['XOR is True when inputs differ (1 and 0).'],
        code_snippets: {
          python: 'light_on = switch_1 ^ switch_2 # True',
          javascript: 'const lightOn = Boolean(switch1 ^ switch2);',
          cpp: 'bool lightOn = switch1 != switch2;'
        },
        xp_reward: 75
      },
      {
        id: 1104,
        level_number: 4,
        difficulty: 'HARD',
        difficulty_label: 'Hard',
        title: '1-Bit Binary Half Adder',
        objective: 'Build binary adder: Sum = A ^ B, Carry = A & B.',
        instructions: 'For A=1, B=1: Sum=0, Carry=1 (1 + 1 = 10 in binary).',
        initial_state: { A: 1, B: 1 },
        hints: ['Sum uses XOR gate; Carry uses AND gate.'],
        code_snippets: {
          python: 'def half_adder(a, b):\n    return (a ^ b, a & b) # (0, 1)',
          javascript: 'function halfAdder(a, b) { return { sum: a ^ b, carry: a & b }; }',
          cpp: 'void halfAdder(int a, int b, int& s, int& c) { s = a ^ b; c = a & b; }'
        },
        xp_reward: 90
      },
      {
        id: 1105,
        level_number: 5,
        difficulty: 'EXPERT',
        difficulty_label: 'Expert',
        title: 'De Morgan Theorem Simplifier',
        objective: 'Verify `NOT (A AND B) == (NOT A) OR (NOT B)`.',
        instructions: 'Simplify boolean expressions for high-frequency circuits.',
        initial_state: { test_pairs: [[true, true], [true, false], [false, true], [false, false]] },
        hints: ['De Morgan law transforms inverted AND into inverted OR.'],
        code_snippets: {
          python: 'assert not (A and B) == (not A or not B)',
          javascript: '!(A && B) === (!A || !B);',
          cpp: '!(A && B) == (!A || !B);'
        },
        xp_reward: 120
      }
    ]
  },

  'data-structure-world': {
    id: 12,
    slug: 'data-structure-world',
    title: 'Data Structure World',
    category: 'DATA_STRUCTURES',
    concept: 'Stacks, Queues & Trees',
    tagline: 'Operate LIFO stacks, FIFO queues, and traverse Binary Search Trees.',
    icon: '🌳',
    badge_color: '#06b6d4',
    gradient: 'linear-gradient(135deg, #06b6d4, #0284c7)',
    languages_supported: ['python', 'javascript', 'cpp'],
    levels: [
      {
        id: 1201,
        level_number: 1,
        difficulty: 'BEGINNER',
        difficulty_label: 'Beginner',
        title: 'Stack Warehouse (LIFO)',
        objective: 'Push 3 crates [A, B, C] and pop them in Last-In-First-Out order.',
        instructions: 'Push A, Push B, Push C, then Pop C.',
        initial_state: { stack: ['A', 'B', 'C'], action: 'POP' },
        hints: ['The top crate C was added last, so it pops first.'],
        code_snippets: {
          python: 'stack = []\nstack.append("A")\nstack.append("B")\nstack.append("C")\ntop = stack.pop() # "C"',
          javascript: 'const stack = ["A", "B", "C"];\nconst top = stack.pop(); // "C"',
          cpp: 'std::stack<char> s;\ns.push("A"); s.push("B"); s.push("C");\nchar top = s.top(); s.pop();'
        },
        xp_reward: 50
      },
      {
        id: 1202,
        level_number: 2,
        difficulty: 'EASY',
        difficulty_label: 'Easy',
        title: 'Queue Web Server Queue (FIFO)',
        objective: 'Enqueue requests [Req1, Req2, Req3] and dequeue first arrival.',
        instructions: 'First In, First Out: Req1 arrived first, so Req1 is processed first.',
        initial_state: { queue: ['Req1', 'Req2', 'Req3'] },
        hints: ['First element in queue gets served first.'],
        code_snippets: {
          python: 'from collections import deque\nq = deque(["Req1", "Req2", "Req3"])\nserved = q.popleft() # "Req1"',
          javascript: 'const q = ["Req1", "Req2", "Req3"];\nconst served = q.shift(); // "Req1"',
          cpp: 'std::queue<string> q; q.push("Req1"); q.pop();'
        },
        xp_reward: 60
      },
      {
        id: 1203,
        level_number: 3,
        difficulty: 'MEDIUM',
        difficulty_label: 'Medium',
        title: 'Balanced Brackets Stack Validator',
        objective: 'Verify balanced code brackets `{[()]}` using a stack.',
        instructions: 'Push open brackets; pop and match when closing bracket is reached.',
        initial_state: { brackets: '{[()]}' },
        hints: ['If stack is empty at the end, all brackets match.'],
        code_snippets: {
          python: 'def is_balanced(s):\n    stack = []\n    pairs = {")": "(", "}": "{", "]": "["}\n    for c in s:\n        if c in "({[": stack.append(c)\n        elif c in pairs and (not stack or stack.pop() != pairs[c]):\n            return False\n    return len(stack) == 0',
          javascript: 'function isBalanced(s) { /* Stack matching */ }',
          cpp: 'bool isBalanced(string s) { /* Stack check */ }'
        },
        xp_reward: 75
      },
      {
        id: 1204,
        level_number: 4,
        difficulty: 'HARD',
        difficulty_label: 'Hard',
        title: 'Browser Back/Forward Stack Pair',
        objective: 'Simulate web browser history navigation with dual stacks.',
        instructions: 'Visiting new page pushes onto back_stack and clears forward_stack.',
        initial_state: { back_stack: ['home', 'news', 'docs'], forward_stack: [] },
        hints: ['Clicking Back pops current page to forward_stack.'],
        code_snippets: {
          python: 'back_stack = ["home", "news", "docs"]\nforward_stack = []\n# Click Back:\nforward_stack.append(back_stack.pop())',
          javascript: 'forwardStack.push(backStack.pop());',
          cpp: 'forwardStack.push(backStack.top()); backStack.pop();'
        },
        xp_reward: 90
      },
      {
        id: 1205,
        level_number: 5,
        difficulty: 'EXPERT',
        difficulty_label: 'Expert',
        title: 'Binary Search Tree (BST) Inorder Traversal',
        objective: 'Traverse BST node values in sorted ascending order (Left -> Root -> Right).',
        instructions: 'Inorder traversal of BST guarantees ascending numerical order.',
        initial_state: { bst_root: { val: 4, left: { val: 2, left: { val: 1 }, right: { val: 3 } }, right: { val: 6, left: { val: 5 }, right: { val: 7 } } } },
        hints: ['Visit Left Subtree, then Root, then Right Subtree: [1, 2, 3, 4, 5, 6, 7].'],
        code_snippets: {
          python: 'def inorder(root):\n    return inorder(root.left) + [root.val] + inorder(root.right) if root else []\n\n# Result: [1, 2, 3, 4, 5, 6, 7]',
          javascript: 'const inorder = (n) => n ? [...inorder(n.left), n.val, ...inorder(n.right)] : [];',
          cpp: 'void inorder(Node* r) { if(r) { inorder(r->left); cout << r->val; inorder(r->right); } }'
        },
        xp_reward: 120
      }
    ]
  },

  'snake-ai': {
    id: 13,
    slug: 'snake-ai',
    title: 'Snake AI & 2D Queue',
    category: 'DATA_STRUCTURES',
    concept: '2D Coordinates, Vector Directions & Queue FIFO Memory',
    tagline: 'Control the iconic retro snake or program autonomous pathfinding algorithms.',
    icon: '🐍',
    badge_color: '#34d399',
    gradient: 'linear-gradient(135deg, #10b981, #06b6d4)',
    languages_supported: ['python', 'javascript', 'cpp'],
    levels: [
      {
        id: 1301,
        level_number: 1,
        difficulty: 'BEGINNER',
        difficulty_label: 'Beginner',
        title: 'Vector Navigation & Apple Eating',
        objective: 'Ingest 3 apples without colliding with boundary walls.',
        instructions: 'Use Arrow Keys / D-Pad or run the AI script to navigate.',
        initial_state: { snake: [[2, 4], [2, 3], [2, 2]], food: [5, 6], target_score: 3 },
        hints: ['Head moves in vector direction [dx, dy].'],
        code_snippets: {
          python: '# Snake Head Vector Step:\nnew_head = [head[0] + dx, head[1] + dy]\nsnake.insert(0, new_head)\nif not eating:\n    snake.pop()',
          javascript: 'const newHead = [head[0] + dx, head[1] + dy];\nsnake.unshift(newHead);\nif (!eating) snake.pop();',
          cpp: 'Point newHead = {head.x + dx, head.y + dy};\nsnake.push_front(newHead);\nif (!eating) snake.pop_back();'
        },
        xp_reward: 50
      },
      {
        id: 1302,
        level_number: 2,
        difficulty: 'EASY',
        difficulty_label: 'Easy',
        title: 'Body Queue Growth & 180° Guard',
        objective: 'Grow snake to length 6 while preventing illegal 180° self-reversal.',
        instructions: 'If moving UP, DOWN key is blocked by game logic.',
        initial_state: { snake: [[3, 3], [3, 2]], food: [7, 7], target_score: 4 },
        hints: ['Prevent direction inversion: if current == RIGHT, ignore LEFT.'],
        code_snippets: {
          python: 'if (current_dir == "UP" and next_dir == "DOWN"):\n    return # Block illegal reverse',
          javascript: 'if (currDir === "UP" && nextDir === "DOWN") return;',
          cpp: 'if (currDir == UP && nextDir == DOWN) return;'
        },
        xp_reward: 60
      },
      {
        id: 1303,
        level_number: 3,
        difficulty: 'MEDIUM',
        difficulty_label: 'Medium',
        title: 'Obstacle Maze Navigation',
        objective: 'Navigate around stationary brick walls to collect 4 apples.',
        instructions: 'Check collision before advancing head into obstacle coordinates.',
        initial_state: {
          snake: [[1, 2], [1, 1]],
          food: [6, 6],
          obstacles: [[3, 3], [3, 4], [3, 5], [6, 3]],
          target_score: 4
        },
        hints: ['Maneuver around row 3 obstacles.'],
        code_snippets: {
          python: 'if new_head in obstacles:\n    trigger_game_over()',
          javascript: 'if (obstacles.some(([x,y]) => x === newHead[0] && y === newHead[1])) gameOver();',
          cpp: 'if (isObstacle(newHead)) triggerGameOver();'
        },
        xp_reward: 75
      },
      {
        id: 1304,
        level_number: 4,
        difficulty: 'HARD',
        difficulty_label: 'Hard',
        title: 'Self-Collision Avoidance Loop',
        objective: 'Grow snake to 8 segments without biting own tail.',
        instructions: 'Detect self-collision: `new_head in snake_body`.',
        initial_state: { snake: [[4, 4], [4, 3], [4, 2], [4, 1]], food: [8, 8], target_score: 5 },
        hints: ['Head coordinate must not exist in remaining body array.'],
        code_snippets: {
          python: 'def check_self_collision(head, body):\n    return head in body',
          javascript: 'const checkSelfCollision = (head, body) => body.some(([x, y]) => x === head[0] && y === head[1]);',
          cpp: 'bool checkCollision(Point head, vector<Point>& body);'
        },
        xp_reward: 90
      },
      {
        id: 1305,
        level_number: 5,
        difficulty: 'EXPERT',
        difficulty_label: 'Expert',
        title: 'Autonomous Greedy Pathfinding AI',
        objective: 'Activate AI script to collect 6 apples automatically with zero collisions.',
        instructions: 'Greedy heuristic: Choose direction minimizing Manhattan Distance to food.',
        initial_state: {
          snake: [[1, 1], [1, 0]],
          food: [5, 5],
          obstacles: [[2, 2], [7, 7]],
          target_score: 6
        },
        hints: ['Manhattan distance = abs(hx - fx) + abs(hy - fy).'],
        code_snippets: {
          python: 'def get_best_move(head, food, obstacles):\n    # Manhattan distance calculation\n    dx = 1 if food[0] > head[0] else -1\n    dy = 1 if food[1] > head[1] else -1\n    return choose_safe_direction(dx, dy)',
          javascript: 'function getBestMove(head, food) {\n    const dx = food[0] - head[0];\n    const dy = food[1] - head[1];\n    return chooseSafeDirection(dx, dy);\n}',
          cpp: 'Direction getBestMove(Point head, Point food);'
        },
        xp_reward: 120
      }
    ]
  }
};

