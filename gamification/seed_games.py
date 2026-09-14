"""Seed script for 12 Code Logic Lab games, 5 levels each, game achievements, and daily challenge."""
import os
import sys
from pathlib import Path
import django
from datetime import date

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
django.setup()

from gamification.models import GameDefinition, GameLevel, Achievement, DailyCodeChallenge

def seed_games_data():
    print("Seeding Code Logic Lab Games...")

    games_data = [
        {
            "slug": "robot-programmer",
            "title": "Robot Programmer",
            "category": GameDefinition.Category.LOGIC,
            "concept": "Sequencing, Step Orders & Execution Flow",
            "tagline": "Program autonomous robot movements through complex obstacle grids.",
            "description": "Learn the absolute foundation of coding: sequential execution. Command your robot to turn, move, pick up energy cores, and navigate obstacles.",
            "icon": "🤖",
            "badge_color": "#3b82f6",
            "gradient": "linear-gradient(135deg, #2563eb, #38bdf8)",
            "languages_supported": ["python", "javascript", "cpp", "java"],
            "order": 1,
            "levels": [
                {
                    "level_number": 1,
                    "difficulty": GameLevel.Difficulty.BEGINNER,
                    "title": "Straight Line Navigation",
                    "objective": "Guide the robot across the 4x4 grid to collect the star.",
                    "instructions": "Place MOVE_RIGHT and MOVE_DOWN commands in the execution buffer.",
                    "initial_state": {
                        "grid_size": [4, 4],
                        "robot_pos": [0, 0],
                        "target_pos": [0, 3],
                        "obstacles": [[1, 1], [2, 2]]
                    },
                    "solution_criteria": {"target_reached": [0, 3], "min_moves": 3},
                    "hints": ["Move directly east along row 0.", "You need 3 MOVE_RIGHT commands."],
                    "code_snippets": {
                        "python": "robot.move_right()\nrobot.move_right()\nrobot.move_right()",
                        "javascript": "robot.moveRight();\nrobot.moveRight();\nrobot.moveRight();",
                        "cpp": "robot.moveRight();\nrobot.moveRight();\nrobot.moveRight();"
                    },
                    "xp_reward": 50
                },
                {
                    "level_number": 2,
                    "difficulty": GameLevel.Difficulty.EASY,
                    "title": "Obstacle Avoidance",
                    "objective": "Navigate around security barriers to reach the target generator.",
                    "instructions": "Use sequence of UP, DOWN, LEFT, RIGHT commands to maneuver around walls.",
                    "initial_state": {
                        "grid_size": [5, 5],
                        "robot_pos": [0, 0],
                        "target_pos": [3, 4],
                        "obstacles": [[0, 1], [1, 1], [2, 3], [1, 3]]
                    },
                    "solution_criteria": {"target_reached": [3, 4], "min_moves": 7},
                    "hints": ["Move down first to bypass the row 0 wall.", "Check collision coordinates before moving."],
                    "code_snippets": {
                        "python": "robot.move_down()\nrobot.move_down()\nrobot.move_right()\nrobot.move_right()\nrobot.move_down()\nrobot.move_right()\nrobot.move_right()",
                        "javascript": "robot.moveDown();\nrobot.moveDown();\nrobot.moveRight();\nrobot.moveRight();\nrobot.moveDown();\nrobot.moveRight();\nrobot.moveRight();",
                        "cpp": "robot.moveDown();\nrobot.moveDown();\nrobot.moveRight();\nrobot.moveRight();\nrobot.moveDown();\nrobot.moveRight();\nrobot.moveRight();"
                    },
                    "xp_reward": 60
                },
                {
                    "level_number": 3,
                    "difficulty": GameLevel.Difficulty.MEDIUM,
                    "title": "Energy Cell Collector",
                    "objective": "Collect all 3 energy batteries before reaching the portal.",
                    "instructions": "Command the robot to collect items in order without hitting traps.",
                    "initial_state": {
                        "grid_size": [6, 6],
                        "robot_pos": [0, 0],
                        "target_pos": [5, 5],
                        "items": [[1, 2], [3, 1], [4, 4]],
                        "obstacles": [[2, 2], [3, 2], [0, 3], [5, 2]]
                    },
                    "solution_criteria": {"items_collected": 3, "target_reached": [5, 5]},
                    "hints": ["Visit battery at (1,2) first.", "Watch out for obstacles around column 2."],
                    "code_snippets": {
                        "python": "# Collect batteries and navigate\nfor target in [(1,2), (3,1), (4,4), (5,5)]:\n    robot.navigate_to(target)",
                        "javascript": "const targets = [[1,2], [3,1], [4,4], [5,5]];\ntargets.forEach(t => robot.navigateTo(t));",
                        "cpp": "for(auto& t : targets) { robot.navigateTo(t); }"
                    },
                    "xp_reward": 75
                },
                {
                    "level_number": 4,
                    "difficulty": GameLevel.Difficulty.HARD,
                    "title": "Key & Lock Labyrinth",
                    "objective": "Collect the golden key to disable the laser gate and reach the extraction pad.",
                    "instructions": "Order of execution matters: Pick Key -> Unlock Gate -> Extract.",
                    "initial_state": {
                        "grid_size": [6, 6],
                        "robot_pos": [5, 0],
                        "target_pos": [0, 5],
                        "key_pos": [0, 0],
                        "gate_pos": [2, 4],
                        "obstacles": [[1, 3], [2, 3], [3, 3], [4, 3]]
                    },
                    "solution_criteria": {"key_collected": True, "target_reached": [0, 5]},
                    "hints": ["Head to (0,0) to pick up the key first.", "Gate opens once key is collected."],
                    "code_snippets": {
                        "python": "robot.move_to(0, 0) # Key\nrobot.pick_key()\nrobot.move_to(0, 5) # Target",
                        "javascript": "robot.moveTo(0, 0);\nrobot.pickKey();\nrobot.moveTo(0, 5);",
                        "cpp": "robot.moveTo(0, 0);\nrobot.pickKey();\nrobot.moveTo(0, 5);"
                    },
                    "xp_reward": 90
                },
                {
                    "level_number": 5,
                    "difficulty": GameLevel.Difficulty.EXPERT,
                    "title": "Optimal Path Optimizer",
                    "objective": "Find the globally shortest path in a dynamic hazard grid.",
                    "instructions": "Execute in fewer than 12 steps or trigger a penalty.",
                    "initial_state": {
                        "grid_size": [7, 7],
                        "robot_pos": [0, 0],
                        "target_pos": [6, 6],
                        "obstacles": [[1, 0], [1, 1], [3, 2], [3, 3], [3, 4], [5, 5], [5, 6]]
                    },
                    "solution_criteria": {"target_reached": [6, 6], "max_steps": 12},
                    "hints": ["Use diagonal step routing to minimize total instruction count."],
                    "code_snippets": {
                        "python": "path = robot.find_shortest_path(start=(0,0), goal=(6,6))\nrobot.execute_path(path)",
                        "javascript": "const path = robot.findShortestPath([0,0], [6,6]);\nrobot.executePath(path);",
                        "cpp": "auto path = robot.findShortestPath({0,0}, {6,6});\nrobot.execute(path);"
                    },
                    "xp_reward": 120
                }
            ]
        },
        {
            "slug": "loop-runner",
            "title": "Loop Runner",
            "category": GameDefinition.Category.CONTROL_FLOW,
            "concept": "FOR & WHILE Iteration Mechanics",
            "tagline": "Master repetition and iteration counters to solve high-speed track challenges.",
            "description": "Understand how FOR and WHILE loops eliminate redundant code. Set loop counters, test loop conditions, and animate each cycle step-by-step.",
            "icon": "🔄",
            "badge_color": "#10b981",
            "gradient": "linear-gradient(135deg, #059669, #34d399)",
            "languages_supported": ["python", "javascript", "cpp", "java"],
            "order": 2,
            "levels": [
                {
                    "level_number": 1,
                    "difficulty": GameLevel.Difficulty.BEGINNER,
                    "title": "Repeat Movement Track",
                    "objective": "Collect 5 coins in a single row using a FOR loop.",
                    "instructions": "Choose FOR i in range(5) and MOVE_FORWARD to collect all coins.",
                    "initial_state": {"coins": 5, "track_length": 6, "robot_pos": 0},
                    "solution_criteria": {"coins_collected": 5, "loop_count": 5},
                    "hints": ["There are 5 coins, so repeat the move 5 times."],
                    "code_snippets": {
                        "python": "for i in range(5):\n    move_forward()\n    collect_coin()",
                        "javascript": "for (let i = 0; i < 5; i++) {\n    moveForward();\n    collectCoin();\n}",
                        "cpp": "for (int i = 0; i < 5; i++) {\n    moveForward();\n    collectCoin();\n}"
                    },
                    "xp_reward": 50
                },
                {
                    "level_number": 2,
                    "difficulty": GameLevel.Difficulty.EASY,
                    "title": "While Not Blocked",
                    "objective": "Run forward continuously until a wall is detected.",
                    "instructions": "Use a WHILE NOT BLOCKED loop to run until reaching the barrier.",
                    "initial_state": {"wall_pos": 8, "robot_pos": 0, "coins_at": [2, 4, 6]},
                    "solution_criteria": {"reached_wall": True, "coins_collected": 3},
                    "hints": ["A while loop continues until the condition becomes False."],
                    "code_snippets": {
                        "python": "while not is_blocked():\n    move_forward()\n    if has_coin():\n        collect_coin()",
                        "javascript": "while (!isBlocked()) {\n    moveForward();\n    if (hasCoin()) collectCoin();\n}",
                        "cpp": "while (!isBlocked()) {\n    moveForward();\n    if (hasCoin()) collectCoin();\n}"
                    },
                    "xp_reward": 60
                },
                {
                    "level_number": 3,
                    "difficulty": GameLevel.Difficulty.MEDIUM,
                    "title": "Nested Grid Cleaner",
                    "objective": "Clean a 4x4 solar panel matrix using nested row and column loops.",
                    "instructions": "Outer loop: for row in range(4). Inner loop: for col in range(4).",
                    "initial_state": {"grid_size": [4, 4], "dirty_cells": 16},
                    "solution_criteria": {"cleaned_cells": 16, "nested_loops": 2},
                    "hints": ["The outer loop moves down each row.", "The inner loop sweeps across columns."],
                    "code_snippets": {
                        "python": "for row in range(4):\n    for col in range(4):\n        clean_panel(row, col)",
                        "javascript": "for (let r = 0; r < 4; r++) {\n    for (let c = 0; c < 4; c++) {\n        cleanPanel(r, c);\n    }\n}",
                        "cpp": "for (int r = 0; r < 4; r++) {\n    for (int c = 0; c < 4; c++) {\n        cleanPanel(r, c);\n    }\n}"
                    },
                    "xp_reward": 75
                },
                {
                    "level_number": 4,
                    "difficulty": GameLevel.Difficulty.HARD,
                    "title": "Conditional Loop Filter",
                    "objective": "Iterate through 10 data packets and only collect green ones.",
                    "instructions": "Combine FOR loop with IF packet.color == 'green'.",
                    "initial_state": {"packets": ["red", "green", "red", "green", "green", "blue", "green", "red"]},
                    "solution_criteria": {"green_collected": 4, "errors": 0},
                    "hints": ["Check the packet color before running the collect action."],
                    "code_snippets": {
                        "python": "for packet in packets:\n    if packet.color == 'green':\n        collect(packet)",
                        "javascript": "for (const packet of packets) {\n    if (packet.color === 'green') {\n        collect(packet);\n    }\n}",
                        "cpp": "for (const auto& packet : packets) {\n    if (packet.color == \"green\") collect(packet);\n}"
                    },
                    "xp_reward": 90
                },
                {
                    "level_number": 5,
                    "difficulty": GameLevel.Difficulty.EXPERT,
                    "title": "Step Stepper & Accumulator",
                    "objective": "Calculate accumulator sum: 1 + 2 + 3 + ... + N using range(1, 6, 1).",
                    "instructions": "Track total accumulator variable across loop iterations.",
                    "initial_state": {"n": 5, "expected_sum": 15},
                    "solution_criteria": {"final_sum": 15, "iterations": 5},
                    "hints": ["total = total + i on each step.", "Initial total starts at 0."],
                    "code_snippets": {
                        "python": "total = 0\nfor i in range(1, 6):\n    total += i\nprint('Final Sum:', total)",
                        "javascript": "let total = 0;\nfor (let i = 1; i <= 5; i++) {\n    total += i;\n}\nconsole.log(total);",
                        "cpp": "int total = 0;\nfor (int i = 1; i <= 5; i++) total += i;\nstd::cout << total;"
                    },
                    "xp_reward": 120
                }
            ]
        },
        {
            "slug": "conditional-city",
            "title": "Conditional City",
            "category": GameDefinition.Category.CONTROL_FLOW,
            "concept": "IF, ELIF, ELSE Boolean Decision Trees",
            "tagline": "Program smart traffic networks and autonomous emergency vehicles.",
            "description": "Learn branch decision logic. Evaluate boolean conditions (True/False), handle edge cases, and execute if/elif/else decisions.",
            "icon": "🚦",
            "badge_color": "#f59e0b",
            "gradient": "linear-gradient(135deg, #d97706, #fbbf24)",
            "languages_supported": ["python", "javascript", "cpp", "java"],
            "order": 3,
            "levels": [
                {
                    "level_number": 1,
                    "difficulty": GameLevel.Difficulty.BEGINNER,
                    "title": "Traffic Light Decision",
                    "objective": "Program car to STOP on RED and MOVE on GREEN.",
                    "instructions": "Build: IF light == 'green' -> MOVE, ELSE -> STOP.",
                    "initial_state": {"lights": ["green", "red", "green"], "car_pos": 0},
                    "solution_criteria": {"accidents": 0, "correct_decisions": 3},
                    "hints": ["Test the light color at every intersection."],
                    "code_snippets": {
                        "python": "if light == 'green':\n    car.move()\nelse:\n    car.stop()",
                        "javascript": "if (light === 'green') {\n    car.move();\n} else {\n    car.stop();\n}",
                        "cpp": "if (light == \"green\") car.move(); else car.stop();"
                    },
                    "xp_reward": 50
                },
                {
                    "level_number": 2,
                    "difficulty": GameLevel.Difficulty.EASY,
                    "title": "Speed Limit Enforcement",
                    "objective": "Handle multiple speed zones with IF-ELIF-ELSE conditions.",
                    "instructions": "School zone (speed=20), Highway (speed=65), Default (speed=45).",
                    "initial_state": {"zones": ["school", "highway", "residential"]},
                    "solution_criteria": {"speed_violations": 0},
                    "hints": ["Use ELIF to check for the highway zone."],
                    "code_snippets": {
                        "python": "if zone == 'school':\n    speed = 20\nelif zone == 'highway':\n    speed = 65\nelse:\n    speed = 45",
                        "javascript": "if (zone === 'school') speed = 20;\nelse if (zone === 'highway') speed = 65;\nelse speed = 45;",
                        "cpp": "if (zone == \"school\") speed = 20; else if (zone == \"highway\") speed = 65; else speed = 45;"
                    },
                    "xp_reward": 60
                },
                {
                    "level_number": 3,
                    "difficulty": GameLevel.Difficulty.MEDIUM,
                    "title": "Emergency Vehicle Priority",
                    "objective": "Give right of way when is_emergency == True or light == 'green'.",
                    "instructions": "Combine logical OR and AND operators in condition branches.",
                    "initial_state": {"vehicle_type": "ambulance", "is_emergency": True, "light": "red"},
                    "solution_criteria": {"priority_cleared": True},
                    "hints": ["Emergency vehicles override red lights: if is_emergency or light == 'green'."],
                    "code_snippets": {
                        "python": "if is_emergency or light == 'green':\n    car.proceed()\nelse:\n    car.wait()",
                        "javascript": "if (isEmergency || light === 'green') car.proceed(); else car.wait();",
                        "cpp": "if (isEmergency || light == \"green\") car.proceed(); else car.wait();"
                    },
                    "xp_reward": 75
                },
                {
                    "level_number": 4,
                    "difficulty": GameLevel.Difficulty.HARD,
                    "title": "Weather Adaptive Braking",
                    "objective": "Calculate safe stopping distance based on road weather conditions.",
                    "instructions": "Evaluate ice, rain, and dry conditions with nested boolean gates.",
                    "initial_state": {"weather": "ice", "car_speed": 60},
                    "solution_criteria": {"safe_stop": True},
                    "hints": ["Icy roads require triple the standard braking distance."],
                    "code_snippets": {
                        "python": "if weather == 'ice':\n    brake_distance = speed * 3\nelif weather == 'rain':\n    brake_distance = speed * 1.5\nelse:\n    brake_distance = speed * 1.0",
                        "javascript": "let dist = weather === 'ice' ? speed * 3 : (weather === 'rain' ? speed * 1.5 : speed);",
                        "cpp": "double dist = (weather == \"ice\") ? speed * 3.0 : ((weather == \"rain\") ? speed * 1.5 : speed);"
                    },
                    "xp_reward": 90
                },
                {
                    "level_number": 5,
                    "difficulty": GameLevel.Difficulty.EXPERT,
                    "title": "Smart City Grid Master",
                    "objective": "Orchestrate 4 intersections concurrently without deadlock.",
                    "instructions": "Build comprehensive multi-branch priority algorithm.",
                    "initial_state": {"intersections": 4, "active_cars": 8},
                    "solution_criteria": {"deadlocks": 0, "throughput": 8},
                    "hints": ["Prioritize lanes with longest waiting queues."],
                    "code_snippets": {
                        "python": "for intersection in city.intersections:\n    best_lane = max(intersection.lanes, key=lambda l: l.queue_length)\n    best_lane.set_green()",
                        "javascript": "city.intersections.forEach(i => {\n    const best = i.lanes.reduce((a, b) => a.queue > b.queue ? a : b);\n    best.setGreen();\n});",
                        "cpp": "for(auto& i : city.intersections) { auto best = i.getBusiestLane(); best->setGreen(); }"
                    },
                    "xp_reward": 120
                }
            ]
        },
        {
            "slug": "variable-factory",
            "title": "Variable Factory",
            "category": GameDefinition.Category.STATE,
            "concept": "Variables, Assignment & State Mutation",
            "tagline": "Operate conveyor belts that update memory registers and compute values.",
            "description": "Understand what a variable really is: a named storage container in memory. Track value assignments, variable updates, expressions, and data types.",
            "icon": "📦",
            "badge_color": "#8b5cf6",
            "gradient": "linear-gradient(135deg, #7c3aed, #a78bfa)",
            "languages_supported": ["python", "javascript", "cpp", "java"],
            "order": 4,
            "levels": [
                {
                    "level_number": 1,
                    "difficulty": GameLevel.Difficulty.BEGINNER,
                    "title": "Value Assignment Box",
                    "objective": "Store the number 10 into variable named `score`.",
                    "instructions": "Place 10 into the score register box.",
                    "initial_state": {"registers": {"score": 0}, "incoming_value": 10},
                    "solution_criteria": {"score": 10},
                    "hints": ["Use assignment operator: score = 10."],
                    "code_snippets": {
                        "python": "score = 10\nprint('Score:', score)",
                        "javascript": "let score = 10;\nconsole.log(score);",
                        "cpp": "int score = 10;\nstd::cout << score;"
                    },
                    "xp_reward": 50
                },
                {
                    "level_number": 2,
                    "difficulty": GameLevel.Difficulty.EASY,
                    "title": "Increment & Accumulation",
                    "objective": "Increase score by +5 points on coin collection.",
                    "instructions": "Execute `score = score + 5` to update current value.",
                    "initial_state": {"registers": {"score": 10}, "add_amount": 5},
                    "solution_criteria": {"score": 15},
                    "hints": ["Old value 10 + 5 becomes new value 15."],
                    "code_snippets": {
                        "python": "score = 10\nscore = score + 5 # or score += 5\nprint(score) # 15",
                        "javascript": "let score = 10;\nscore += 5;\nconsole.log(score);",
                        "cpp": "int score = 10;\nscore += 5;\nstd::cout << score;"
                    },
                    "xp_reward": 60
                },
                {
                    "level_number": 3,
                    "difficulty": GameLevel.Difficulty.MEDIUM,
                    "title": "Variable Swapper",
                    "objective": "Swap values of cup A (5) and cup B (9) using a temp cup.",
                    "instructions": "temp = a; a = b; b = temp;",
                    "initial_state": {"a": 5, "b": 9, "temp": None},
                    "solution_criteria": {"a": 9, "b": 5},
                    "hints": ["Hold A's value in temp before overwriting A with B."],
                    "code_snippets": {
                        "python": "temp = a\na = b\nb = temp\n# In Python you can also do: a, b = b, a",
                        "javascript": "let temp = a;\na = b;\nb = temp;",
                        "cpp": "int temp = a;\na = b;\nb = temp;"
                    },
                    "xp_reward": 75
                },
                {
                    "level_number": 4,
                    "difficulty": GameLevel.Difficulty.HARD,
                    "title": "Type Casting Lab",
                    "objective": "Convert string '42' into integer 42 and add 8.",
                    "instructions": "total = int('42') + 8 -> result is 50.",
                    "initial_state": {"raw_input": "42", "bonus": 8},
                    "solution_criteria": {"result": 50, "type": "int"},
                    "hints": ["String + Integer produces type error without casting."],
                    "code_snippets": {
                        "python": "raw = '42'\ntotal = int(raw) + 8 # 50",
                        "javascript": "let raw = '42';\nlet total = parseInt(raw) + 8; // 50",
                        "cpp": "std::string raw = \"42\";\nint total = std::stoi(raw) + 8; // 50"
                    },
                    "xp_reward": 90
                },
                {
                    "level_number": 5,
                    "difficulty": GameLevel.Difficulty.EXPERT,
                    "title": "Complex State Machine",
                    "objective": "Maintain health, shield, and mana across 3 enemy damage rounds.",
                    "instructions": "Shield absorbs damage first; overflow reduces health.",
                    "initial_state": {"health": 100, "shield": 40, "incoming_hits": [30, 25, 20]},
                    "solution_criteria": {"final_health": 65, "final_shield": 0},
                    "hints": ["Subtract damage from shield first. If shield < 0, health -= abs(shield)."],
                    "code_snippets": {
                        "python": "for hit in hits:\n    shield -= hit\n    if shield < 0:\n        health += shield # shield is negative\n        shield = 0",
                        "javascript": "hits.forEach(hit => {\n    shield -= hit;\n    if (shield < 0) { health += shield; shield = 0; }\n});",
                        "cpp": "for(int hit : hits) {\n    shield -= hit;\n    if (shield < 0) { health += shield; shield = 0; }\n}"
                    },
                    "xp_reward": 120
                }
            ]
        },
        {
            "slug": "function-machine",
            "title": "Function Machine",
            "category": GameDefinition.Category.MODULARITY,
            "concept": "Functions, Parameters, Return Values & Scope",
            "tagline": "Build reusable processing modules with inputs, logic, and output values.",
            "description": "Understand function encapsulation. Pass arguments into parameters, execute internal algorithms, return outputs, and reuse logic cleanly.",
            "icon": "🧠",
            "badge_color": "#ec4899",
            "gradient": "linear-gradient(135deg, #db2777, #f472b6)",
            "languages_supported": ["python", "javascript", "cpp", "java"],
            "order": 5,
            "levels": [
                {
                    "level_number": 1,
                    "difficulty": GameLevel.Difficulty.BEGINNER,
                    "title": "Simple Reusable Function",
                    "objective": "Define `open_door()` and call it 3 times.",
                    "instructions": "Create a function containing: turn_lock() + push_door().",
                    "initial_state": {"doors": 3, "open_count": 0},
                    "solution_criteria": {"open_count": 3},
                    "hints": ["Define once, call multiple times."],
                    "code_snippets": {
                        "python": "def open_door():\n    turn_lock()\n    push_door()\n\nfor _ in range(3):\n    open_door()",
                        "javascript": "function openDoor() {\n    turnLock();\n    pushDoor();\n}\nfor (let i = 0; i < 3; i++) openDoor();",
                        "cpp": "void openDoor() { turnLock(); pushDoor(); }\nint main() { for(int i=0; i<3; i++) openDoor(); }"
                    },
                    "xp_reward": 50
                },
                {
                    "level_number": 2,
                    "difficulty": GameLevel.Difficulty.EASY,
                    "title": "Function with Parameters",
                    "objective": "Create `greet_user(name)` that returns 'Hello, {name}!'",
                    "instructions": "Accept string parameter and construct return string.",
                    "initial_state": {"test_names": ["Alice", "Bob", "Charlie"]},
                    "solution_criteria": {"correct_returns": 3},
                    "hints": ["Parameters act as variables initialized when function is called."],
                    "code_snippets": {
                        "python": "def greet_user(name):\n    return f'Hello, {name}!'\n\nprint(greet_user('Alice'))",
                        "javascript": "function greetUser(name) {\n    return `Hello, ${name}!`;\n}\nconsole.log(greetUser('Alice'));",
                        "cpp": "std::string greetUser(std::string name) { return \"Hello, \" + name + \"!\"; }"
                    },
                    "xp_reward": 60
                },
                {
                    "level_number": 3,
                    "difficulty": GameLevel.Difficulty.MEDIUM,
                    "title": "Calculation & Return Value",
                    "objective": "Create `calculate_area(width, height)` returning width * height.",
                    "instructions": "Test area computation for [5, 10], [7, 3], [12, 4].",
                    "initial_state": {"test_cases": [[5, 10], [7, 3], [12, 4]]},
                    "solution_criteria": {"expected_outputs": [50, 21, 48]},
                    "hints": ["Return statement sends output back to the caller."],
                    "code_snippets": {
                        "python": "def calculate_area(width, height):\n    return width * height\n\narea = calculate_area(5, 10) # 50",
                        "javascript": "function calculateArea(w, h) {\n    return w * h;\n}\nlet area = calculateArea(5, 10);",
                        "cpp": "int calculateArea(int w, int h) { return w * h; }"
                    },
                    "xp_reward": 75
                },
                {
                    "level_number": 4,
                    "difficulty": GameLevel.Difficulty.HARD,
                    "title": "Default & Multiple Parameters",
                    "objective": "Build `apply_discount(price, discount=0.1)` with default args.",
                    "instructions": "Calculate final discounted price.",
                    "initial_state": {"items": [{"price": 100, "disc": 0.2}, {"price": 50, "disc": None}]},
                    "solution_criteria": {"final_prices": [80, 45]},
                    "hints": ["If discount is None, fallback to 10% default."],
                    "code_snippets": {
                        "python": "def apply_discount(price, discount=0.1):\n    return price * (1 - discount)\n\nprint(apply_discount(100, 0.2)) # 80\nprint(apply_discount(50)) # 45",
                        "javascript": "function applyDiscount(price, discount = 0.1) {\n    return price * (1 - discount);\n}",
                        "cpp": "double applyDiscount(double price, double discount = 0.1) { return price * (1.0 - discount); }"
                    },
                    "xp_reward": 90
                },
                {
                    "level_number": 5,
                    "difficulty": GameLevel.Difficulty.EXPERT,
                    "title": "Pipeline Function Composition",
                    "objective": "Chain `sanitize()`, `transform()`, and `validate()` into single pipeline.",
                    "instructions": "Pass output of each function into the next stage.",
                    "initial_state": {"raw_payload": "   <user_data>   "},
                    "solution_criteria": {"final_clean": "USER_DATA"},
                    "hints": ["validate(transform(sanitize(raw_payload)))"],
                    "code_snippets": {
                        "python": "def process_data(raw):\n    clean = raw.strip().replace('<', '').replace('>', '')\n    return clean.upper()\n\nresult = process_data('   <user_data>   ')",
                        "javascript": "const processData = (raw) => raw.trim().replace(/[<>]/g, '').toUpperCase();",
                        "cpp": "std::string processData(std::string raw) { /* sanitize & upper */ return result; }"
                    },
                    "xp_reward": 120
                }
            ]
        },
        {
            "slug": "array-adventure",
            "title": "Array Adventure",
            "category": GameDefinition.Category.DATA_STRUCTURES,
            "concept": "Arrays, 0-Indexed Lists, Slicing & Mutations",
            "tagline": "Explore treasure chests indexed in sequential memory blocks.",
            "description": "Master array concepts: 0-based indexing, element access, list insertion (append/push), deletion (pop), search, and array slicing.",
            "icon": "🔢",
            "badge_color": "#06b6d4",
            "gradient": "linear-gradient(135deg, #0891b2, #22d3ee)",
            "languages_supported": ["python", "javascript", "cpp", "java"],
            "order": 6,
            "levels": [
                {
                    "level_number": 1,
                    "difficulty": GameLevel.Difficulty.BEGINNER,
                    "title": "0-Index Treasure Chest",
                    "objective": "Access `fruits[1]` from `['Apple', 'Banana', 'Mango']`.",
                    "instructions": "In programming, index 0 is first ('Apple'), index 1 is second ('Banana').",
                    "initial_state": {"fruits": ["Apple", "Banana", "Mango"], "target_index": 1},
                    "solution_criteria": {"selected_item": "Banana"},
                    "hints": ["Remember 0 is Apple, 1 is Banana, 2 is Mango."],
                    "code_snippets": {
                        "python": "fruits = ['Apple', 'Banana', 'Mango']\nprint(fruits[1]) # 'Banana'",
                        "javascript": "const fruits = ['Apple', 'Banana', 'Mango'];\nconsole.log(fruits[1]); // 'Banana'",
                        "cpp": "std::vector<std::string> fruits = {\"Apple\", \"Banana\", \"Mango\"};\nstd::cout << fruits[1];"
                    },
                    "xp_reward": 50
                },
                {
                    "level_number": 2,
                    "difficulty": GameLevel.Difficulty.EASY,
                    "title": "Append & Pop Operations",
                    "objective": "Append 'Ruby' to gems list, then pop the last item.",
                    "instructions": "Execute gems.append('Ruby'), gems.append('Emerald'), gems.pop().",
                    "initial_state": {"gems": ["Diamond", "Sapphire"]},
                    "solution_criteria": {"final_gems": ["Diamond", "Sapphire", "Ruby"]},
                    "hints": ["append() adds to end, pop() removes the last element."],
                    "code_snippets": {
                        "python": "gems = ['Diamond', 'Sapphire']\ngems.append('Ruby')\ngems.append('Emerald')\ngems.pop()\nprint(gems) # ['Diamond', 'Sapphire', 'Ruby']",
                        "javascript": "let gems = ['Diamond', 'Sapphire'];\ngems.push('Ruby');\ngems.push('Emerald');\ngems.pop();",
                        "cpp": "gems.push_back(\"Ruby\");\ngems.push_back(\"Emerald\");\ngems.pop_back();"
                    },
                    "xp_reward": 60
                },
                {
                    "level_number": 3,
                    "difficulty": GameLevel.Difficulty.MEDIUM,
                    "title": "Array Slicing Master",
                    "objective": "Extract sub-array `numbers[1:4]` from `[10, 20, 30, 40, 50]`.",
                    "instructions": "Slice from index 1 inclusive up to index 4 exclusive.",
                    "initial_state": {"numbers": [10, 20, 30, 40, 50]},
                    "solution_criteria": {"slice_result": [20, 30, 40]},
                    "hints": ["Slice [start:end] includes start index but stops before end."],
                    "code_snippets": {
                        "python": "numbers = [10, 20, 30, 40, 50]\nsub = numbers[1:4] # [20, 30, 40]",
                        "javascript": "const numbers = [10, 20, 30, 40, 50];\nconst sub = numbers.slice(1, 4); // [20, 30, 40]",
                        "cpp": "// std::vector sub(numbers.begin() + 1, numbers.begin() + 4);"
                    },
                    "xp_reward": 75
                },
                {
                    "level_number": 4,
                    "difficulty": GameLevel.Difficulty.HARD,
                    "title": "Element Swapper & Reverse",
                    "objective": "Reverse an array in-place by swapping symmetrical indices.",
                    "instructions": "Swap arr[0] with arr[n-1], arr[1] with arr[n-2].",
                    "initial_state": {"array": [1, 2, 3, 4, 5]},
                    "solution_criteria": {"reversed": [5, 4, 3, 2, 1]},
                    "hints": ["Use two pointers: left at 0 and right at len(arr)-1."],
                    "code_snippets": {
                        "python": "left, right = 0, len(arr) - 1\nwhile left < right:\n    arr[left], arr[right] = arr[right], arr[left]\n    left += 1\n    right -= 1",
                        "javascript": "let l = 0, r = arr.length - 1;\nwhile (l < r) {\n    [arr[l], arr[r]] = [arr[r], arr[l]];\n    l++; r--;\n}",
                        "cpp": "std::reverse(arr.begin(), arr.end());"
                    },
                    "xp_reward": 90
                },
                {
                    "level_number": 5,
                    "difficulty": GameLevel.Difficulty.EXPERT,
                    "title": "2D Matrix Traversal",
                    "objective": "Extract diagonal elements from a 3x3 matrix `matrix[i][i]`.",
                    "instructions": "Iterate i from 0 to 2 and collect `matrix[i][i]`.",
                    "initial_state": {"matrix": [[1, 2, 3], [4, 5, 6], [7, 8, 9]]},
                    "solution_criteria": {"diagonal": [1, 5, 9]},
                    "hints": ["Diagonal cells have row == col."],
                    "code_snippets": {
                        "python": "matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]\ndiag = [matrix[i][i] for i in range(len(matrix))] # [1, 5, 9]",
                        "javascript": "const diag = matrix.map((row, i) => row[i]); // [1, 5, 9]",
                        "cpp": "for (int i = 0; i < 3; i++) diag.push_back(matrix[i][i]);"
                    },
                    "xp_reward": 120
                }
            ]
        },
        {
            "slug": "algorithm-maze",
            "title": "Algorithm Maze",
            "category": GameDefinition.Category.ALGORITHMS,
            "concept": "Search & Graph Traversal (Linear, Binary & BFS)",
            "tagline": "Solve algorithmic search mazes and find the provably shortest paths.",
            "description": "Understand core searching algorithms. Step through Linear Search (O(N)), Binary Search (O(log N)), and Breadth-First Search (BFS) pathfinding.",
            "icon": "🗺️",
            "badge_color": "#14b8a6",
            "gradient": "linear-gradient(135deg, #0d9488, #2dd4bf)",
            "languages_supported": ["python", "javascript", "cpp", "java"],
            "order": 7,
            "levels": [
                {
                    "level_number": 1,
                    "difficulty": GameLevel.Difficulty.BEGINNER,
                    "title": "Linear Search Stepper",
                    "objective": "Find target number 7 in unsorted list `[4, 2, 9, 7, 1, 5]`.",
                    "instructions": "Inspect each element one by one from left to right until found.",
                    "initial_state": {"list": [4, 2, 9, 7, 1, 5], "target": 7},
                    "solution_criteria": {"found_index": 3, "steps_taken": 4},
                    "hints": ["Check index 0, then index 1, then index 2, then index 3."],
                    "code_snippets": {
                        "python": "def linear_search(arr, target):\n    for index, val in enumerate(arr):\n        if val == target:\n            return index\n    return -1",
                        "javascript": "function linearSearch(arr, target) {\n    return arr.indexOf(target);\n}",
                        "cpp": "int linearSearch(int arr[], int n, int target) {\n    for(int i=0; i<n; i++) if (arr[i] == target) return i;\n    return -1;\n}"
                    },
                    "xp_reward": 50
                },
                {
                    "level_number": 2,
                    "difficulty": GameLevel.Difficulty.EASY,
                    "title": "Binary Search Splitter",
                    "objective": "Find target 42 in sorted array in just 3 steps.",
                    "instructions": "Calculate mid = (low + high) // 2. If target > mid, search right half.",
                    "initial_state": {"sorted_list": [5, 12, 18, 27, 33, 42, 59, 70], "target": 42},
                    "solution_criteria": {"found_index": 5, "max_steps": 3},
                    "hints": ["Halve the search space every step!"],
                    "code_snippets": {
                        "python": "low, high = 0, len(arr) - 1\nwhile low <= high:\n    mid = (low + high) // 2\n    if arr[mid] == target: return mid\n    elif arr[mid] < target: low = mid + 1\n    else: high = mid - 1",
                        "javascript": "let low = 0, high = arr.length - 1;\nwhile (low <= high) {\n    let mid = Math.floor((low + high) / 2);\n    if (arr[mid] === target) return mid;\n    else if (arr[mid] < target) low = mid + 1;\n    else high = mid - 1;\n}",
                        "cpp": "int binarySearch(std::vector<int>& arr, int target) { /* O(log N) */ }"
                    },
                    "xp_reward": 60
                },
                {
                    "level_number": 3,
                    "difficulty": GameLevel.Difficulty.MEDIUM,
                    "title": "BFS Shortest Path Grid",
                    "objective": "Find shortest path from (0,0) to (4,4) using Queue BFS.",
                    "instructions": "Explore neighbor cells layer-by-layer to guarantee shortest path.",
                    "initial_state": {"grid_size": [5, 5], "start": [0, 0], "goal": [4, 4], "walls": [[1, 2], [2, 2], [3, 2]]},
                    "solution_criteria": {"path_length": 8},
                    "hints": ["BFS explores all distance 1 cells, then distance 2 cells."],
                    "code_snippets": {
                        "python": "from collections import deque\nqueue = deque([(start_x, start_y, [start])])\nwhile queue:\n    x, y, path = queue.popleft()\n    if (x, y) == goal: return path",
                        "javascript": "const queue = [[start, [start]]];\nwhile (queue.length > 0) {\n    const [curr, path] = queue.shift();\n}",
                        "cpp": "std::queue<std::pair<int, int>> q;"
                    },
                    "xp_reward": 75
                },
                {
                    "level_number": 4,
                    "difficulty": GameLevel.Difficulty.HARD,
                    "title": "Two-Pointer Sorted Pair Sum",
                    "objective": "Find two numbers in sorted list that sum to target = 50.",
                    "instructions": "Place left pointer at start, right at end. Adjust pointers based on sum.",
                    "initial_state": {"arr": [10, 15, 20, 30, 35, 45], "target_sum": 50},
                    "solution_criteria": {"pair": [15, 35]},
                    "hints": ["If sum < target: left++. If sum > target: right--."],
                    "code_snippets": {
                        "python": "left, right = 0, len(arr) - 1\nwhile left < right:\n    curr = arr[left] + arr[right]\n    if curr == target: return (arr[left], arr[right])\n    elif curr < target: left += 1\n    else: right -= 1",
                        "javascript": "while (l < r) {\n    const s = arr[l] + arr[r];\n    if (s === target) return [arr[l], arr[r]];\n    s < target ? l++ : r--;\n}",
                        "cpp": "while(l < r) { int s = arr[l] + arr[r]; if (s == target) return {arr[l], arr[r]}; }"
                    },
                    "xp_reward": 90
                },
                {
                    "level_number": 5,
                    "difficulty": GameLevel.Difficulty.EXPERT,
                    "title": "Dijkstra Weighted Path",
                    "objective": "Find lowest energy cost route through weighted terrain tiles.",
                    "instructions": "Use priority queue min-cost expansion.",
                    "initial_state": {"graph_nodes": 6, "edges": [{"from": "A", "to": "B", "weight": 2}, {"from": "A", "to": "C", "weight": 5}, {"from": "B", "to": "C", "weight": 1}, {"from": "C", "to": "D", "weight": 3}]},
                    "solution_criteria": {"shortest_cost": 6, "path": ["A", "B", "C", "D"]},
                    "hints": ["Route A -> B -> C -> D has cost 2 + 1 + 3 = 6."],
                    "code_snippets": {
                        "python": "import heapq\npq = [(0, start)]\nwhile pq:\n    cost, u = heapq.heappop(pq)",
                        "javascript": "const pq = new MinPriorityQueue();",
                        "cpp": "std::priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;"
                    },
                    "xp_reward": 120
                }
            ]
        },
        {
            "slug": "debug-detective",
            "title": "Debug Detective",
            "category": GameDefinition.Category.DEBUGGING,
            "concept": "Syntax Errors, Logic Bugs & Edge Cases",
            "tagline": "Put on your detective hat to inspect buggy code and crack mystery errors.",
            "description": "Develop critical debugging instincts. Spot missing syntax colons, infinite loop traps, off-by-one boundary errors, and incorrect variable mutations.",
            "icon": "🐞",
            "badge_color": "#ef4444",
            "gradient": "linear-gradient(135deg, #dc2626, #f87171)",
            "languages_supported": ["python", "javascript", "cpp", "java"],
            "order": 8,
            "levels": [
                {
                    "level_number": 1,
                    "difficulty": GameLevel.Difficulty.BEGINNER,
                    "title": "The Missing Colon Case",
                    "objective": "Find the syntax error in `for i in range(5)`.",
                    "instructions": "Analyze the error clue and select the correct fix.",
                    "initial_state": {
                        "buggy_code": "for i in range(5)\n    print(i)",
                        "line_with_error": 1,
                        "options": [
                            {"id": "A", "text": "Missing colon (:) at the end of line 1", "correct": True},
                            {"id": "B", "text": "Wrong variable name (i)", "correct": False},
                            {"id": "C", "text": "print should be uppercase", "correct": False},
                            {"id": "D", "text": "range should start at 1", "correct": False}
                        ]
                    },
                    "solution_criteria": {"selected_option": "A"},
                    "hints": ["In Python, loops, functions, and if statements MUST end with a colon (:)."],
                    "code_snippets": {
                        "python": "# Fixed Code:\nfor i in range(5):\n    print(i)",
                        "javascript": "// In JS equivalent:\nfor (let i = 0; i < 5; i++) {\n    console.log(i);\n}",
                        "cpp": "for (int i = 0; i < 5; i++) {\n    std::cout << i << std::endl;\n}"
                    },
                    "xp_reward": 50
                },
                {
                    "level_number": 2,
                    "difficulty": GameLevel.Difficulty.EASY,
                    "title": "The Infinite Loop Trap",
                    "objective": "Identify why `while x < 5:` never stops executing.",
                    "instructions": "Check what happens to the counter variable x inside the loop.",
                    "initial_state": {
                        "buggy_code": "x = 0\nwhile x < 5:\n    print(x)",
                        "line_with_error": 3,
                        "options": [
                            {"id": "A", "text": "Condition x < 5 is wrong", "correct": False},
                            {"id": "B", "text": "Variable x is never incremented (x += 1)", "correct": True},
                            {"id": "C", "text": "while should be for", "correct": False},
                            {"id": "D", "text": "print is not indented", "correct": False}
                        ]
                    },
                    "solution_criteria": {"selected_option": "B"},
                    "hints": ["If x stays 0 forever, 0 < 5 is always True!"],
                    "code_snippets": {
                        "python": "# Fixed Code:\nx = 0\nwhile x < 5:\n    print(x)\n    x += 1 # Increments x",
                        "javascript": "let x = 0;\nwhile (x < 5) {\n    console.log(x);\n    x++;\n}",
                        "cpp": "int x = 0; while (x < 5) { std::cout << x; x++; }"
                    },
                    "xp_reward": 60
                },
                {
                    "level_number": 3,
                    "difficulty": GameLevel.Difficulty.MEDIUM,
                    "title": "The Off-by-One Boundary",
                    "objective": "Fix IndexError when accessing last item of 3-element list.",
                    "instructions": "Array has 3 items: indices are 0, 1, 2. Code asks for arr[3].",
                    "initial_state": {
                        "buggy_code": "arr = [10, 20, 30]\nlast = arr[len(arr)]",
                        "line_with_error": 2,
                        "options": [
                            {"id": "A", "text": "Change to arr[len(arr) - 1] or arr[-1]", "correct": True},
                            {"id": "B", "text": "Array must have 4 elements", "correct": False},
                            {"id": "C", "text": "Use arr.pop(3)", "correct": False},
                            {"id": "D", "text": "len() should be size()", "correct": False}
                        ]
                    },
                    "solution_criteria": {"selected_option": "A"},
                    "hints": ["In 0-indexed arrays, the last valid index is len(arr) - 1."],
                    "code_snippets": {
                        "python": "arr = [10, 20, 30]\nlast = arr[-1] # or arr[len(arr) - 1] -> 30",
                        "javascript": "const arr = [10, 20, 30];\nconst last = arr[arr.length - 1]; // 30",
                        "cpp": "int last = arr[arr.size() - 1];"
                    },
                    "xp_reward": 75
                },
                {
                    "level_number": 4,
                    "difficulty": GameLevel.Difficulty.HARD,
                    "title": "The Accidental Assignment",
                    "objective": "Spot the bug where `if x = 5:` is written instead of `if x == 5:`.",
                    "instructions": "Understand difference between assignment (=) and equality comparison (==).",
                    "initial_state": {
                        "buggy_code": "def check_score(x):\n    if x = 100:\n        return 'Perfect!'",
                        "line_with_error": 2,
                        "options": [
                            {"id": "A", "text": "Replace = with comparison operator ==", "correct": True},
                            {"id": "B", "text": "Remove the if statement", "correct": False},
                            {"id": "C", "text": "Use === in Python", "correct": False},
                            {"id": "D", "text": "Return should be print", "correct": False}
                        ]
                    },
                    "solution_criteria": {"selected_option": "A"},
                    "hints": ["= assigns a value; == tests equality."],
                    "code_snippets": {
                        "python": "def check_score(x):\n    if x == 100: # Equality comparison\n        return 'Perfect!'",
                        "javascript": "if (x === 100) return 'Perfect!';",
                        "cpp": "if (x == 100) return \"Perfect!\";"
                    },
                    "xp_reward": 90
                },
                {
                    "level_number": 5,
                    "difficulty": GameLevel.Difficulty.EXPERT,
                    "title": "Mutable Default Argument Mystery",
                    "objective": "Debug the infamous Python default list argument bug.",
                    "instructions": "`def append_to(item, target_list=[]):` shares same list across calls.",
                    "initial_state": {
                        "buggy_code": "def append_to(item, target_list=[]):\n    target_list.append(item)\n    return target_list",
                        "line_with_error": 1,
                        "options": [
                            {"id": "A", "text": "Set target_list=None and initialize target_list = [] inside", "correct": True},
                            {"id": "B", "text": "Use target_list=() tuple", "correct": False},
                            {"id": "C", "text": "Python doesn't support default arguments", "correct": False},
                            {"id": "D", "text": "Change append to insert", "correct": False}
                        ]
                    },
                    "solution_criteria": {"selected_option": "A"},
                    "hints": ["Never use mutable default arguments like [] or {} in function definitions."],
                    "code_snippets": {
                        "python": "def append_to(item, target_list=None):\n    if target_list is None:\n        target_list = []\n    target_list.append(item)\n    return target_list",
                        "javascript": "function appendTo(item, targetList = []) {\n    return [...targetList, item];\n}",
                        "cpp": "std::vector<int> appendTo(int item, std::vector<int> target = {}) { ... }"
                    },
                    "xp_reward": 120
                }
            ]
        },
        {
            "slug": "sorting-race",
            "title": "Sorting Race",
            "category": GameDefinition.Category.ALGORITHMS,
            "concept": "Sorting Algorithms (Bubble, Selection, Insertion & Merge)",
            "tagline": "Watch numbers race into order with compare-and-swap animations.",
            "description": "Visualize how sorting algorithms organize data. Execute comparisons, swap adjacent elements in Bubble Sort, find minimums in Selection Sort, and merge sorted halves.",
            "icon": "⚡",
            "badge_color": "#eab308",
            "gradient": "linear-gradient(135deg, #ca8a04, #fde047)",
            "languages_supported": ["python", "javascript", "cpp", "java"],
            "order": 9,
            "levels": [
                {
                    "level_number": 1,
                    "difficulty": GameLevel.Difficulty.BEGINNER,
                    "title": "Bubble Sort Single Pass",
                    "objective": "Perform adjacent compare-and-swaps on `[5, 2, 8, 1, 3]`.",
                    "instructions": "If left > right, swap them! Watch largest element bubble to the end.",
                    "initial_state": {"array": [5, 2, 8, 1, 3]},
                    "solution_criteria": {"sorted_array": [1, 2, 3, 5, 8]},
                    "hints": ["Compare (5,2) -> swap to [2,5]. Compare (5,8) -> keep."],
                    "code_snippets": {
                        "python": "for i in range(len(arr)):\n    for j in range(0, len(arr) - i - 1):\n        if arr[j] > arr[j + 1]:\n            arr[j], arr[j + 1] = arr[j + 1], arr[j]",
                        "javascript": "for (let i = 0; i < arr.length; i++) {\n    for (let j = 0; j < arr.length - i - 1; j++) {\n        if (arr[j] > arr[j + 1]) {\n            [arr[j], arr[j+1]] = [arr[j+1], arr[j]];\n        }\n    }\n}",
                        "cpp": "for(int i=0; i<n; i++)\n    for(int j=0; j<n-i-1; j++)\n        if (arr[j] > arr[j+1]) std::swap(arr[j], arr[j+1]);"
                    },
                    "xp_reward": 50
                },
                {
                    "level_number": 2,
                    "difficulty": GameLevel.Difficulty.EASY,
                    "title": "Selection Sort Minimum Finder",
                    "objective": "Find the smallest number and place it at index 0.",
                    "instructions": "Scan array `[64, 25, 12, 22, 11]`. Min is 11 -> swap with 64.",
                    "initial_state": {"array": [64, 25, 12, 22, 11]},
                    "solution_criteria": {"sorted_array": [11, 12, 22, 25, 64]},
                    "hints": ["Selection sort finds the global minimum of the unsorted partition."],
                    "code_snippets": {
                        "python": "for i in range(len(arr)):\n    min_idx = i\n    for j in range(i + 1, len(arr)):\n        if arr[j] < arr[min_idx]:\n            min_idx = j\n    arr[i], arr[min_idx] = arr[min_idx], arr[i]",
                        "javascript": "for (let i = 0; i < arr.length; i++) {\n    let minIdx = i;\n    for (let j = i+1; j < arr.length; j++) if (arr[j] < arr[minIdx]) minIdx = j;\n    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];\n}",
                        "cpp": "for (int i=0; i<n-1; i++) { int min_idx = i; /* ... */ std::swap(arr[min_idx], arr[i]); }"
                    },
                    "xp_reward": 60
                },
                {
                    "level_number": 3,
                    "difficulty": GameLevel.Difficulty.MEDIUM,
                    "title": "Insertion Sort Playing Cards",
                    "objective": "Insert incoming card into its correct sorted position.",
                    "instructions": "Shift larger elements right to create space for the inserted key.",
                    "initial_state": {"array": [12, 11, 13, 5, 6]},
                    "solution_criteria": {"sorted_array": [5, 6, 11, 12, 13]},
                    "hints": ["Like sorting cards in your hand: take next card and slide it left into place."],
                    "code_snippets": {
                        "python": "for i in range(1, len(arr)):\n    key = arr[i]\n    j = i - 1\n    while j >= 0 and key < arr[j]:\n        arr[j + 1] = arr[j]\n        j -= 1\n    arr[j + 1] = key",
                        "javascript": "for (let i = 1; i < arr.length; i++) {\n    let key = arr[i], j = i - 1;\n    while (j >= 0 && arr[j] > key) { arr[j+1] = arr[j]; j--; }\n    arr[j+1] = key;\n}",
                        "cpp": "for (int i = 1; i < n; i++) { /* shift and insert */ }"
                    },
                    "xp_reward": 75
                },
                {
                    "level_number": 4,
                    "difficulty": GameLevel.Difficulty.HARD,
                    "title": "Merge Sort Divide & Conquer",
                    "objective": "Merge two sorted halves `[2, 5, 8]` and `[1, 3, 7]` into `[1, 2, 3, 5, 7, 8]`.",
                    "instructions": "Compare heads of both arrays and pick the smaller element.",
                    "initial_state": {"left": [2, 5, 8], "right": [1, 3, 7]},
                    "solution_criteria": {"merged": [1, 2, 3, 5, 7, 8]},
                    "hints": ["Compare 2 vs 1 -> pick 1. Compare 2 vs 3 -> pick 2."],
                    "code_snippets": {
                        "python": "def merge(left, right):\n    res = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] < right[j]: res.append(left[i]); i += 1\n        else: res.append(right[j]); j += 1\n    return res + left[i:] + right[j:]",
                        "javascript": "function merge(left, right) { /* Two pointer merge in O(N) */ }",
                        "cpp": "std::merge(left.begin(), left.end(), right.begin(), right.end(), back_inserter(result));"
                    },
                    "xp_reward": 90
                },
                {
                    "level_number": 5,
                    "difficulty": GameLevel.Difficulty.EXPERT,
                    "title": "QuickSort Pivot Partition",
                    "objective": "Partition array around pivot 5 so all left < 5 and all right > 5.",
                    "instructions": "Array `[7, 2, 1, 8, 6, 3, 5]`. Final pivot position should be index 3.",
                    "initial_state": {"array": [7, 2, 1, 8, 6, 3, 5], "pivot": 5},
                    "solution_criteria": {"partitioned": True},
                    "hints": ["Items <= pivot go to left partition; items > pivot go to right."],
                    "code_snippets": {
                        "python": "def partition(arr, low, high):\n    pivot = arr[high]\n    i = low - 1\n    for j in range(low, high):\n        if arr[j] <= pivot:\n            i += 1\n            arr[i], arr[j] = arr[j], arr[i]\n    arr[i+1], arr[high] = arr[high], arr[i+1]\n    return i + 1",
                        "javascript": "function partition(arr, low, high) { /* Lomuto partition */ }",
                        "cpp": "int partition(vector<int>& arr, int low, int high) { /* ... */ }"
                    },
                    "xp_reward": 120
                }
            ]
        },
        {
            "slug": "recursion-tower",
            "title": "Recursion Tower",
            "category": GameDefinition.Category.MODULARITY,
            "concept": "Recursive Functions, Call Stack & Base Cases",
            "tagline": "Stack and unstack execution frames to reach base cases and return values.",
            "description": "Understand recursion and the call stack. Watch function frames push onto the stack until hitting the base case, then unwind with calculated return values.",
            "icon": "🏰",
            "badge_color": "#a855f7",
            "gradient": "linear-gradient(135deg, #9333ea, #c084fc)",
            "languages_supported": ["python", "javascript", "cpp", "java"],
            "order": 10,
            "levels": [
                {
                    "level_number": 1,
                    "difficulty": GameLevel.Difficulty.BEGINNER,
                    "title": "Factorial Call Stack",
                    "objective": "Calculate `factorial(4)` by stacking 4 -> 3 -> 2 -> 1.",
                    "instructions": "Push frames: 4*f(3) -> 3*f(2) -> 2*f(1) -> base case return 1. Unwind to 24.",
                    "initial_state": {"n": 4},
                    "solution_criteria": {"call_stack_depth": 4, "final_return": 24},
                    "hints": ["Base case is n <= 1: return 1. Then multiply returning values."],
                    "code_snippets": {
                        "python": "def factorial(n):\n    if n <= 1: # Base Case\n        return 1\n    return n * factorial(n - 1) # Recursive Step\n\nprint(factorial(4)) # 24",
                        "javascript": "function factorial(n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}\nconsole.log(factorial(4)); // 24",
                        "cpp": "int factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}"
                    },
                    "xp_reward": 50
                },
                {
                    "level_number": 2,
                    "difficulty": GameLevel.Difficulty.EASY,
                    "title": "Countdown Base Case Guard",
                    "objective": "Prevent stack overflow by adding base case `if n == 0: return`.",
                    "instructions": "Without a base case, recursion runs infinitely until memory crashes.",
                    "initial_state": {"n": 5},
                    "solution_criteria": {"stack_overflow": False, "stops_at_zero": True},
                    "hints": ["Every recursive function MUST have at least one base case."],
                    "code_snippets": {
                        "python": "def countdown(n):\n    if n == 0: # Base case stops recursion\n        print('Blast off!')\n        return\n    print(n)\n    countdown(n - 1)",
                        "javascript": "function countdown(n) {\n    if (n === 0) return;\n    console.log(n);\n    countdown(n - 1);\n}",
                        "cpp": "void countdown(int n) { if (n == 0) return; std::cout << n; countdown(n-1); }"
                    },
                    "xp_reward": 60
                },
                {
                    "level_number": 3,
                    "difficulty": GameLevel.Difficulty.MEDIUM,
                    "title": "Fibonacci Tree Branching",
                    "objective": "Calculate `fib(5)` using recursive tree: `fib(n-1) + fib(n-2)`.",
                    "instructions": "Stack builds branches for left and right recursive calls.",
                    "initial_state": {"n": 5},
                    "solution_criteria": {"final_value": 5},
                    "hints": ["fib(0)=0, fib(1)=1, fib(2)=1, fib(3)=2, fib(4)=3, fib(5)=5."],
                    "code_snippets": {
                        "python": "def fib(n):\n    if n <= 0: return 0\n    if n == 1: return 1\n    return fib(n - 1) + fib(n - 2)\n\nprint(fib(5)) # 5",
                        "javascript": "function fib(n) {\n    if (n <= 1) return n;\n    return fib(n - 1) + fib(n - 2);\n}",
                        "cpp": "int fib(int n) { if (n <= 1) return n; return fib(n-1) + fib(n-2); }"
                    },
                    "xp_reward": 75
                },
                {
                    "level_number": 4,
                    "difficulty": GameLevel.Difficulty.HARD,
                    "title": "Tower of Hanoi Disks",
                    "objective": "Move 3 disks from Peg A to Peg C using helper Peg B.",
                    "instructions": "Recursive rule: Move n-1 disks to helper -> Move largest -> Move n-1 to goal.",
                    "initial_state": {"disks": 3, "pegs": {"A": [3, 2, 1], "B": [], "C": []}},
                    "solution_criteria": {"pegs": {"A": [], "B": [], "C": [3, 2, 1]}, "moves": 7},
                    "hints": ["Takes 2^n - 1 moves. For 3 disks, that is exactly 7 moves."],
                    "code_snippets": {
                        "python": "def hanoi(n, source, target, helper):\n    if n == 1:\n        print(f'Move disk 1 from {source} to {target}')\n        return\n    hanoi(n - 1, source, helper, target)\n    print(f'Move disk {n} from {source} to {target}')\n    hanoi(n - 1, helper, target, source)",
                        "javascript": "function hanoi(n, src, tgt, hlp) { /* ... */ }",
                        "cpp": "void hanoi(int n, char src, char tgt, char hlp) { /* ... */ }"
                    },
                    "xp_reward": 90
                },
                {
                    "level_number": 5,
                    "difficulty": GameLevel.Difficulty.EXPERT,
                    "title": "Recursive String Inversion",
                    "objective": "Reverse string 'RECURSION' recursively without loops.",
                    "instructions": "`reverse(s) = reverse(s[1:]) + s[0]`.",
                    "initial_state": {"input_str": "RECURSION"},
                    "solution_criteria": {"reversed_str": "NOISRUCER"},
                    "hints": ["Base case is len(s) <= 1: return s."],
                    "code_snippets": {
                        "python": "def reverse_str(s):\n    if len(s) <= 1: return s\n    return reverse_str(s[1:]) + s[0]\n\nprint(reverse_str('RECURSION')) # 'NOISRUCER'",
                        "javascript": "const reverseStr = (s) => s.length <= 1 ? s : reverseStr(s.slice(1)) + s[0];",
                        "cpp": "std::string rev(std::string s) { if (s.size() <= 1) return s; return rev(s.substr(1)) + s[0]; }"
                    },
                    "xp_reward": 120
                }
            ]
        },
        {
            "slug": "logic-builder",
            "title": "Logic Builder",
            "category": GameDefinition.Category.LOGIC,
            "concept": "Boolean Algebra, Truth Tables & Logic Gates",
            "tagline": "Connect AND, OR, NOT, and XOR circuits to unlock electronic gates.",
            "description": "Understand digital logic circuits and boolean operations. Construct truth tables, toggle inputs (1/0, True/False), and route signals through logic gates.",
            "icon": "🧩",
            "badge_color": "#0ea5e9",
            "gradient": "linear-gradient(135deg, #0284c7, #38bdf8)",
            "languages_supported": ["python", "javascript", "cpp", "java"],
            "order": 11,
            "levels": [
                {
                    "level_number": 1,
                    "difficulty": GameLevel.Difficulty.BEGINNER,
                    "title": "AND & OR Basic Gates",
                    "objective": "Power the door by creating `A AND B` circuit where A=True, B=True.",
                    "instructions": "AND requires both inputs to be 1 (True).",
                    "initial_state": {"inputs": {"A": True, "B": True}, "gate": "AND"},
                    "solution_criteria": {"output": True},
                    "hints": ["True and True evaluates to True."],
                    "code_snippets": {
                        "python": "A = True\nB = True\ndoor_unlocked = A and B # True",
                        "javascript": "const A = true, B = true;\nconst doorUnlocked = A && B; // true",
                        "cpp": "bool A = true, B = true;\nbool doorUnlocked = A && B;"
                    },
                    "xp_reward": 50
                },
                {
                    "level_number": 2,
                    "difficulty": GameLevel.Difficulty.EASY,
                    "title": "NOT Inverter Switch",
                    "objective": "Invert security sensor alarm: `safe = NOT is_alarm_active`.",
                    "instructions": "NOT turns False into True, and True into False.",
                    "initial_state": {"is_alarm_active": False},
                    "solution_criteria": {"safe": True},
                    "hints": ["not False == True."],
                    "code_snippets": {
                        "python": "is_alarm = False\nsystem_safe = not is_alarm # True",
                        "javascript": "let isAlarm = false;\nlet systemSafe = !isAlarm; // true",
                        "cpp": "bool isAlarm = false;\nbool systemSafe = !isAlarm;"
                    },
                    "xp_reward": 60
                },
                {
                    "level_number": 3,
                    "difficulty": GameLevel.Difficulty.MEDIUM,
                    "title": "XOR Exclusive Switch",
                    "objective": "XOR outputs True if exactly ONE input is True (A != B).",
                    "instructions": "Configure stairs two-way light switch (A XOR B).",
                    "initial_state": {"switch_1": True, "switch_2": False},
                    "solution_criteria": {"light_on": True},
                    "hints": ["XOR is True when inputs differ (one 1, one 0)."],
                    "code_snippets": {
                        "python": "switch_1 = True\nswitch_2 = False\nlight_on = switch_1 ^ switch_2 # XOR is True",
                        "javascript": "const lightOn = Boolean(switch1 ^ switch2); // true",
                        "cpp": "bool lightOn = switch1 != switch2;"
                    },
                    "xp_reward": 75
                },
                {
                    "level_number": 4,
                    "difficulty": GameLevel.Difficulty.HARD,
                    "title": "Half Adder Circuit",
                    "objective": "Build binary 1-bit Half Adder: Sum = A ^ B, Carry = A & B.",
                    "instructions": "For A=1, B=1: Sum=0, Carry=1 (1 + 1 = 10 in binary).",
                    "initial_state": {"A": 1, "B": 1},
                    "solution_criteria": {"sum": 0, "carry": 1},
                    "hints": ["Sum uses XOR gate; Carry uses AND gate."],
                    "code_snippets": {
                        "python": "def half_adder(a, b):\n    sum_bit = a ^ b\n    carry_bit = a & b\n    return sum_bit, carry_bit\n\nprint(half_adder(1, 1)) # (0, 1)",
                        "javascript": "function halfAdder(a, b) {\n    return { sum: a ^ b, carry: a & b };\n}",
                        "cpp": "void halfAdder(int a, int b, int& sum, int& carry) { sum = a ^ b; carry = a & b; }"
                    },
                    "xp_reward": 90
                },
                {
                    "level_number": 5,
                    "difficulty": GameLevel.Difficulty.EXPERT,
                    "title": "De Morgan's Theorem Simplifier",
                    "objective": "Verify `NOT (A AND B) == (NOT A) OR (NOT B)`.",
                    "instructions": "Simplify boolean circuit to minimize total gate delay.",
                    "initial_state": {"test_pairs": [[True, True], [True, False], [False, True], [False, False]]},
                    "solution_criteria": {"all_equivalent": True},
                    "hints": ["De Morgan's law allows converting NAND into inverted OR."],
                    "code_snippets": {
                        "python": "# De Morgan's Law:\nassert not (A and B) == (not A or not B)",
                        "javascript": "!(A && B) === (!A || !B);",
                        "cpp": "!(A && B) == (!A || !B);"
                    },
                    "xp_reward": 120
                }
            ]
        },
        {
            "slug": "data-structure-world",
            "title": "Data Structure World",
            "category": GameDefinition.Category.DATA_STRUCTURES,
            "concept": "Stacks (LIFO), Queues (FIFO) & Linked Lists",
            "tagline": "Physically manipulate Stack plates, Queue lines, and Linked List chains.",
            "description": "Understand core abstract data types visually. Stack Last-In-First-Out (LIFO) plates, enqueue/dequeue First-In-First-Out (FIFO) lines, and link memory pointers.",
            "icon": "🌳",
            "badge_color": "#10b981",
            "gradient": "linear-gradient(135deg, #059669, #10b981)",
            "languages_supported": ["python", "javascript", "cpp", "java"],
            "order": 12,
            "levels": [
                {
                    "level_number": 1,
                    "difficulty": GameLevel.Difficulty.BEGINNER,
                    "title": "Stack Cafeteria Trays (LIFO)",
                    "objective": "Push trays [A, B, C] and pop the top tray.",
                    "instructions": "Last In, First Out: C was added last, so C is popped first.",
                    "initial_state": {"stack": []},
                    "solution_criteria": {"popped_order": ["C", "B", "A"]},
                    "hints": ["Think of a stack of dinner plates: you take from the top."],
                    "code_snippets": {
                        "python": "stack = []\nstack.append('A')\nstack.append('B')\nstack.append('C')\ntop = stack.pop() # 'C'",
                        "javascript": "const stack = [];\nstack.push('A');\nstack.push('B');\nstack.push('C');\nconst top = stack.pop(); // 'C'",
                        "cpp": "std::stack<char> s;\ns.push('A'); s.push('B'); s.push('C');\nchar top = s.top(); s.pop(); // 'C'"
                    },
                    "xp_reward": 50
                },
                {
                    "level_number": 2,
                    "difficulty": GameLevel.Difficulty.EASY,
                    "title": "Queue Cinema Line (FIFO)",
                    "objective": "Enqueue customers [Alice, Bob, Charlie] and dequeue first customer.",
                    "instructions": "First In, First Out: Alice arrived first, so Alice is served first.",
                    "initial_state": {"queue": []},
                    "solution_criteria": {"served_first": "Alice"},
                    "hints": ["Think of a line at the supermarket: first person in line gets served first."],
                    "code_snippets": {
                        "python": "from collections import deque\nq = deque(['Alice', 'Bob', 'Charlie'])\nserved = q.popleft() # 'Alice'",
                        "javascript": "const q = ['Alice', 'Bob', 'Charlie'];\nconst served = q.shift(); // 'Alice'",
                        "cpp": "std::queue<std::string> q;\nq.push(\"Alice\"); q.push(\"Bob\");\nstd::string served = q.front(); q.pop();"
                    },
                    "xp_reward": 60
                },
                {
                    "level_number": 3,
                    "difficulty": GameLevel.Difficulty.MEDIUM,
                    "title": "Parentheses Validator with Stack",
                    "objective": "Verify balanced brackets `{[()]}` using a stack.",
                    "instructions": "Push open brackets onto stack; pop and match when closing bracket appears.",
                    "initial_state": {"brackets": "{[()]}"},
                    "solution_criteria": {"is_valid": True},
                    "hints": ["If stack is empty at the end and all brackets matched, expression is valid."],
                    "code_snippets": {
                        "python": "def is_balanced(s):\n    stack = []\n    pairs = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in '({[':\n            stack.append(char)\n        elif char in pairs:\n            if not stack or stack.pop() != pairs[char]:\n                return False\n    return len(stack) == 0",
                        "javascript": "function isBalanced(s) { /* Stack matching algorithm */ }",
                        "cpp": "bool isBalanced(string s) { /* ... */ }"
                    },
                    "xp_reward": 75
                },
                {
                    "level_number": 4,
                    "difficulty": GameLevel.Difficulty.HARD,
                    "title": "Linked List Node Chain",
                    "objective": "Link Node(10) -> Node(20) -> Node(30) -> None.",
                    "instructions": "Traverse the linked list by following `.next` pointer until null.",
                    "initial_state": {"values": [10, 20, 30]},
                    "solution_criteria": {"traversal": [10, 20, 30]},
                    "hints": ["Each node contains a data value and a pointer to the next node."],
                    "code_snippets": {
                        "python": "class Node:\n    def __init__(self, val):\n        self.val = val\n        self.next = None\n\nhead = Node(10)\nhead.next = Node(20)\nhead.next.next = Node(30)",
                        "javascript": "class Node {\n    constructor(val) { this.val = val; this.next = null; }\n}",
                        "cpp": "struct Node { int val; Node* next; Node(int v) : val(v), next(nullptr) {} };"
                    },
                    "xp_reward": 90
                },
                {
                    "level_number": 5,
                    "difficulty": GameLevel.Difficulty.EXPERT,
                    "title": "Binary Search Tree (BST) Insert",
                    "objective": "Insert 25 into BST: Left < Root, Right > Root.",
                    "instructions": "Start at root 20 -> go right -> at 30 go left -> place 25.",
                    "initial_state": {"root_val": 20, "children": {"left": 10, "right": 30}, "insert_val": 25},
                    "solution_criteria": {"placed_at": "right.left"},
                    "hints": ["25 > 20 (go right to 30); 25 < 30 (place as left child of 30)."],
                    "code_snippets": {
                        "python": "def insert_bst(root, val):\n    if not root: return Node(val)\n    if val < root.val: root.left = insert_bst(root.left, val)\n    else: root.right = insert_bst(root.right, val)\n    return root",
                        "javascript": "function insertBST(root, val) { /* O(log N) average */ }",
                        "cpp": "Node* insert(Node* root, int val) { /* ... */ }"
                    },
                    "xp_reward": 120
                }
            ]
        },
        {
            "slug": "snake-ai",
            "title": "Snake AI & 2D Queue",
            "category": GameDefinition.Category.DATA_STRUCTURES,
            "concept": "2D Coordinates, Vector Directions & Queue FIFO Memory",
            "tagline": "Control the iconic retro snake or program autonomous pathfinding algorithms.",
            "description": "Understand 2D coordinate matrices, directional delta vectors [dx, dy], queue data structures (FIFO head insert, tail pop), collision detection algorithms, and greedy heuristic pathfinding.",
            "icon": "🐍",
            "badge_color": "#34d399",
            "gradient": "linear-gradient(135deg, #10b981, #06b6d4)",
            "languages_supported": ["python", "javascript", "cpp", "java"],
            "order": 13,
            "levels": [
                {
                    "level_number": 1,
                    "difficulty": GameLevel.Difficulty.BEGINNER,
                    "title": "Vector Navigation & Apple Eating",
                    "objective": "Ingest 3 apples without colliding with boundary walls.",
                    "instructions": "Use Arrow Keys or D-Pad to update directional vectors.",
                    "initial_state": {"snake": [[2, 4], [2, 3], [2, 2]], "food": [5, 6], "target_score": 3},
                    "solution_criteria": {"apples_eaten": 3},
                    "hints": ["Head moves in vector direction [dx, dy]."],
                    "code_snippets": {
                        "python": "new_head = [head[0] + dx, head[1] + dy]\nsnake.insert(0, new_head)\nif not eating: snake.pop()",
                        "javascript": "const newHead = [head[0] + dx, head[1] + dy];\nsnake.unshift(newHead);\nif (!eating) snake.pop();",
                        "cpp": "Point newHead = {head.x + dx, head.y + dy}; snake.push_front(newHead);"
                    },
                    "xp_reward": 50
                },
                {
                    "level_number": 2,
                    "difficulty": GameLevel.Difficulty.EASY,
                    "title": "Body Queue Growth & 180° Guard",
                    "objective": "Grow snake to length 6 while preventing illegal 180° self-reversals.",
                    "instructions": "If moving UP, DOWN key is blocked by game logic.",
                    "initial_state": {"snake": [[3, 3], [3, 2]], "food": [7, 7], "target_score": 4},
                    "solution_criteria": {"apples_eaten": 4},
                    "hints": ["Prevent direction inversion: if current == RIGHT, ignore LEFT."],
                    "code_snippets": {
                        "python": "if (current_dir == 'UP' and next_dir == 'DOWN'): return",
                        "javascript": "if (currDir === 'UP' && nextDir === 'DOWN') return;",
                        "cpp": "if (currDir == UP && nextDir == DOWN) return;"
                    },
                    "xp_reward": 60
                },
                {
                    "level_number": 3,
                    "difficulty": GameLevel.Difficulty.MEDIUM,
                    "title": "Obstacle Maze Navigation",
                    "objective": "Navigate around stationary brick walls to collect 4 apples.",
                    "instructions": "Check collision before advancing head into obstacle coordinates.",
                    "initial_state": {"snake": [[1, 2], [1, 1]], "food": [6, 6], "obstacles": [[3, 3], [3, 4], [3, 5], [6, 3]], "target_score": 4},
                    "solution_criteria": {"apples_eaten": 4},
                    "hints": ["Maneuver around row 3 obstacles."],
                    "code_snippets": {
                        "python": "if new_head in obstacles: trigger_game_over()",
                        "javascript": "if (obstacles.some(([x,y]) => x === newHead[0] && y === newHead[1])) gameOver();",
                        "cpp": "if (isObstacle(newHead)) triggerGameOver();"
                    },
                    "xp_reward": 75
                },
                {
                    "level_number": 4,
                    "difficulty": GameLevel.Difficulty.HARD,
                    "title": "Self-Collision Avoidance Loop",
                    "objective": "Grow snake to 8 segments without biting own tail.",
                    "instructions": "Detect self-collision: `new_head in snake_body`.",
                    "initial_state": {"snake": [[4, 4], [4, 3], [4, 2], [4, 1]], "food": [8, 8], "target_score": 5},
                    "solution_criteria": {"apples_eaten": 5},
                    "hints": ["Head coordinate must not exist in remaining body array."],
                    "code_snippets": {
                        "python": "def check_self_collision(head, body): return head in body",
                        "javascript": "const checkSelfCollision = (head, body) => body.some(([x, y]) => x === head[0] && y === head[1]);",
                        "cpp": "bool checkCollision(Point head, vector<Point>& body);"
                    },
                    "xp_reward": 90
                },
                {
                    "level_number": 5,
                    "difficulty": GameLevel.Difficulty.EXPERT,
                    "title": "Autonomous Greedy Pathfinding AI",
                    "objective": "Activate AI script to collect 6 apples automatically with zero collisions.",
                    "instructions": "Greedy heuristic: Choose direction minimizing Manhattan Distance to food.",
                    "initial_state": {"snake": [[1, 1], [1, 0]], "food": [5, 5], "obstacles": [[2, 2], [7, 7]], "target_score": 6},
                    "solution_criteria": {"apples_eaten": 6},
                    "hints": ["Manhattan distance = abs(hx - fx) + abs(hy - fy)."],
                    "code_snippets": {
                        "python": "def get_best_move(head, food, obstacles):\n    dx = 1 if food[0] > head[0] else -1\n    dy = 1 if food[1] > head[1] else -1\n    return choose_safe_direction(dx, dy)",
                        "javascript": "function getBestMove(head, food) { return chooseSafeDirection(dx, dy); }",
                        "cpp": "Direction getBestMove(Point head, Point food);"
                    },
                    "xp_reward": 120
                }
            ]
        }
    ]

    for g_data in games_data:
        levels_list = g_data.pop("levels")
        game_obj, _ = GameDefinition.objects.update_or_create(
            slug=g_data["slug"],
            defaults=g_data
        )
        print(f"  [+] Game: {game_obj.title}")

        for lvl in levels_list:
            lvl_obj, _ = GameLevel.objects.update_or_create(
                game=game_obj,
                level_number=lvl["level_number"],
                defaults=lvl
            )

    # Seed Game Achievements
    achievements_data = [
        {"name": "Logic Master", "description": "Complete 10 Code Logic games with high accuracy.", "icon": "🧩", "badge_color": "#6366f1", "condition_type": "GAMES_COMPLETED", "condition_value": 10, "xp_reward": 100},
        {"name": "Loop Master", "description": "Complete all levels of Loop Runner with perfect iteration counts.", "icon": "🔄", "badge_color": "#10b981", "condition_type": "GAMES_COMPLETED", "condition_value": 5, "xp_reward": 100},
        {"name": "Debug Detective", "description": "Crack 5 code error mysteries without requesting hints.", "icon": "🐞", "badge_color": "#ef4444", "condition_type": "NO_HINT_GAMES", "condition_value": 5, "xp_reward": 150},
        {"name": "Robot Programmer", "description": "Navigate all Robot Programmer obstacle courses.", "icon": "🤖", "badge_color": "#3b82f6", "condition_type": "GAMES_COMPLETED", "condition_value": 5, "xp_reward": 100},
        {"name": "Algorithm Expert", "description": "Complete Algorithm Maze and Sorting Race on Expert difficulty.", "icon": "⚡", "badge_color": "#eab308", "condition_type": "GAME_PERFECT", "condition_value": 5, "xp_reward": 200},
        {"name": "Problem Solver", "description": "Solve 20 logic game challenges across all categories.", "icon": "🧠", "badge_color": "#ec4899", "condition_type": "GAMES_COMPLETED", "condition_value": 20, "xp_reward": 250},
        {"name": "Code Game Champion", "description": "Reach Expert level in 8 different Code Logic Lab games.", "icon": "🏆", "badge_color": "#ffd700", "condition_type": "GAMES_COMPLETED", "condition_value": 40, "xp_reward": 500},
    ]

    for ach in achievements_data:
        Achievement.objects.update_or_create(
            name=ach["name"],
            defaults=ach
        )
        print(f"  [+] Achievement: {ach['name']}")

    # Seed Daily Code Challenge for today
    today = date.today()
    robot_game = GameDefinition.objects.filter(slug="robot-programmer").first()
    if robot_game:
        DailyCodeChallenge.objects.update_or_create(
            date=today,
            defaults={
                "title": "Daily Logic Run: Quantum Core Retrieval",
                "description": "Navigate the robot through the hazardous ion grid to collect all 3 quantum batteries in under 10 moves.",
                "game": robot_game,
                "target_concept": "Sequencing & Optimal Route Planning",
                "difficulty": "Medium",
                "xp_reward": 100,
                "level_config": {
                    "grid_size": [5, 5],
                    "robot_pos": [0, 0],
                    "target_pos": [4, 4],
                    "items": [[1, 2], [3, 1], [3, 4]],
                    "obstacles": [[1, 1], [2, 3], [0, 4]]
                }
            }
        )
        print(f"  [+] Daily Challenge set for {today}")

    print("All Code Logic Lab data seeded successfully!")

if __name__ == '__main__':
    seed_games_data()
