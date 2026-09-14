import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Layers, Sparkles, ChevronRight, Play, CheckCircle2, Code2, Database, Cpu, Globe, Shield } from 'lucide-react';

const SUBJECT_CATEGORIES = [
  {
    id: 'programming',
    name: 'Programming & Logic',
    icon: Code2,
    subjects: [
      {
        name: 'Python Programming',
        icon: 'code',
        modulesCount: 16,
        description: 'Master Python 3 from basics, control flow, functions, OOP, and data structures.',
        modules: [
          {
            name: 'Module 1: Python Fundamentals',
            lessons: [
              { name: 'First Steps & print() Execution', slug: 'python-print' },
              { name: 'Variables & Memory Allocation', slug: 'python-variables-memory' }
            ]
          },
          {
            name: 'Module 2: Control Flow & Loops',
            lessons: [
              { name: 'For Loops & Iteration Mechanics', slug: 'python-for-loops' },
              { name: 'While Loops & Conditional Iteration', slug: 'python-while-loops' },
              { name: 'Break and Continue Statements', slug: 'python-break-continue' }
            ]
          },
          {
            name: 'Module 3: Functions & Scope',
            lessons: [
              { name: 'Defining Functions & Parameters', slug: 'python-functions-params' },
              { name: 'Return Values & Call Stack Resolution', slug: 'python-return-callstack' }
            ]
          },
          {
            name: 'Module 4: Data Structures',
            lessons: [
              { name: 'Lists, Tuples & 0-Indexed Arrays', slug: 'python-lists-tuples' },
              { name: 'Dictionaries & Sets (Hash Tables)', slug: 'python-dicts-sets' }
            ]
          }
        ]
      },
      {
        name: 'C / C++ Programming',
        icon: 'code',
        modulesCount: 19,
        description: 'Memory architecture, pointers, structs, and object-oriented C++.',
        modules: [
          {
            name: 'Module 1: C/C++ Memory & Syntax',
            lessons: [
              { name: 'Variables & Memory Addresses', slug: 'python-variables-memory' },
              { name: 'Pointers & Dereferencing', slug: 'python-variables-memory' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'fundamentals',
    name: 'CS Fundamentals & Data Structures',
    icon: Layers,
    subjects: [
      {
        name: 'Data Structures & Algorithms',
        icon: 'layers',
        modulesCount: 13,
        description: 'Stacks, Queues, Linked Lists, Trees, Graphs, Sorting & Binary Search.',
        modules: [
          {
            name: 'Module 1: Linear Data Structures',
            lessons: [
              { name: 'Stack Data Structure (LIFO Mechanics)', slug: 'ds-stacks' },
              { name: 'Queue FIFO Enqueue & Dequeue', slug: 'ds-stacks' }
            ]
          },
          {
            name: 'Module 2: Searching & Sorting',
            lessons: [
              { name: 'Bubble Sort & Pairwise Comparisons', slug: 'ds-sorting' },
              { name: 'Binary Search (Divide & Conquer)', slug: 'ds-binary-search' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'web_db',
    name: 'Web & Database Systems',
    icon: Globe,
    subjects: [
      {
        name: 'Web Development & React',
        icon: 'globe',
        modulesCount: 18,
        description: 'HTML5 semantic tags, CSS Flexbox/Grid, JavaScript ES6+, and React state.',
        modules: [
          {
            name: 'Module 1: React State & Lifecycle',
            lessons: [
              { name: 'React useState Lifecycle & DOM Diffing', slug: 'react-state-lifecycle' }
            ]
          }
        ]
      },
      {
        name: 'SQL & Relational Databases',
        icon: 'database',
        modulesCount: 18,
        description: 'Relational schema design, SELECT, WHERE filtering, JOINs, and indexing.',
        modules: [
          {
            name: 'Module 1: Query Filtering Engine',
            lessons: [
              { name: 'SQL Query Engine & WHERE Filtering', slug: 'sql-select-where' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'ai_data',
    name: 'Artificial Intelligence & ML',
    icon: Cpu,
    subjects: [
      {
        name: 'Artificial Intelligence & Deep Learning',
        icon: 'cpu',
        modulesCount: 14,
        description: 'Supervised learning, deep neural networks, heuristics, and Generative AI.',
        modules: [
          {
            name: 'Module 1: Deep Neural Networks',
            lessons: [
              { name: 'Forward Propagation & Neuron Activations', slug: 'ai-neural-forward' }
            ]
          }
        ]
      }
    ]
  }
];

const CurriculumBrowser = () => {
  const [activeCategory, setActiveCategory] = useState('programming');

  const currentCategoryData = SUBJECT_CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span className="xp-badge">INDIVIDUAL CHAPTER EXPERIENCES</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
            📚 SUBJECTS → 📦 MODULES → 📖 CHAPTERS → 📝 TOPICS
          </span>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.8rem' }}>
          Complete Computer Science Syllabus
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '820px' }}>
          Click any chapter below to open its dedicated interactive learning experience with custom animations, AI explanations, visual diagrams, code sandbox, audio narration, and quizzes.
        </p>
      </div>

      {/* Subject Category Selection Tabs */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {SUBJECT_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                padding: '10px 18px',
                borderRadius: 'var(--radius-sm)',
                background: activeCategory === cat.id ? 'var(--primary-gradient)' : 'rgba(255, 255, 255, 0.05)',
                border: activeCategory === cat.id ? 'none' : '1px solid var(--border-color)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <Icon size={16} /> {cat.name}
            </button>
          );
        })}
      </div>

      {/* Subjects & Interactive Modules List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {currentCategoryData?.subjects.map((sub, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>{sub.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{sub.description}</p>
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700, backgroundColor: 'rgba(6, 182, 212, 0.12)', padding: '4px 12px', borderRadius: '999px' }}>
                {sub.modulesCount} Complete Modules
              </span>
            </div>

            {/* Modules Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '16px' }}>
              {sub.modules.map((m, mIdx) => (
                <div key={mIdx} style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1.2rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#818cf8', marginBottom: '10px' }}>
                    📦 {m.name}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {m.lessons.map((les, lIdx) => (
                      <Link
                        key={lIdx}
                        to={`/lesson/${les.slug}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          textDecoration: 'none',
                          color: '#e2e8f0',
                          fontSize: '0.85rem',
                          border: '1px solid transparent',
                          transition: 'all 0.15s'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.15)'; e.currentTarget.style.borderColor = '#818cf8'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'; e.currentTarget.style.borderColor = 'transparent'; }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Play size={12} color="#06b6d4" /> {les.name}
                        </span>
                        <ChevronRight size={14} color="var(--text-muted)" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurriculumBrowser;
