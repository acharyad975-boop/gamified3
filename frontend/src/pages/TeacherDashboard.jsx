import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  ClipboardList, 
  TrendingUp, 
  AlertTriangle, 
  Download, 
  Search, 
  Filter, 
  Sparkles, 
  MessageSquare, 
  Bell, 
  CheckCircle2, 
  Plus, 
  ArrowRight, 
  Layers, 
  Code2, 
  Award,
  Send,
  X,
  FileSpreadsheet,
  Check,
  Gamepad2
} from 'lucide-react';

const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'students', 'attention', 'export', 'classes', 'assignments', 'ai_assistant', 'notifications'
  
  // Data States
  const [overview, setOverview] = useState(null);
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [gameAnalytics, setGameAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Excel Selection State
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Modal States
  const [activeStudentModal, setActiveStudentModal] = useState(null);
  const [showCreateClassModal, setShowCreateClassModal] = useState(false);
  const [showCreateAssignmentModal, setShowCreateAssignmentModal] = useState(false);
  const [rosterModalClass, setRosterModalClass] = useState(null);
  const [submissionsModalAssignment, setSubmissionsModalAssignment] = useState(null);
  const [directMessageStudent, setDirectMessageStudent] = useState(null);
  const [directMessageText, setDirectMessageText] = useState('');
  const [directMessageSent, setDirectMessageSent] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  // AI Assistant State
  const [aiQuery, setAiQuery] = useState('');
  const [aiChatHistory, setAiChatHistory] = useState([
    {
      sender: 'ai',
      text: 'Hello Teacher! I am your AI Pedagogical Assistant. You can ask me to identify struggling students, draft remedial assignments, or analyze performance drops across your cohorts.'
    }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  // Form Inputs
  const [newClassName, setNewClassName] = useState('');
  const [newClassYear, setNewClassYear] = useState('Year 1');
  const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
  const [newAssignmentType, setNewAssignmentType] = useState('LESSON');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [overviewRes, studentsRes, classesRes, assignmentsRes, notifsRes, gamesRes] = await Promise.all([
        api.get('/teacher/overview/').catch(() => null),
        api.get('/teacher/students/').catch(() => null),
        api.get('/teacher/classes/').catch(() => null),
        api.get('/teacher/assignments/').catch(() => null),
        api.get('/teacher/notifications/').catch(() => null),
        api.get('/games/teacher-analytics/').catch(() => null),
      ]);

      setOverview(overviewRes || {
        total_students: 120,
        active_students: 95,
        classes_count: 6,
        assignments_count: 24,
        average_score: 78.5,
        average_progress: 68.0,
        coding_accuracy: 74.0,
        students_needing_attention: [],
        weekly_progress_chart: [
          { week: 'Week 1', score: 62, progress: 50, coding: 58 },
          { week: 'Week 2', score: 68, progress: 58, coding: 64 },
          { week: 'Week 3', score: 74, progress: 65, coding: 70 },
          { week: 'Week 4', score: 78.5, progress: 68, coding: 74 }
        ]
      });

      setStudents(studentsRes?.students || []);
      setClasses(classesRes || []);
      setAssignments(assignmentsRes || []);
      setNotifications(notifsRes || []);
      setGameAnalytics(gamesRes?.students || []);
    } catch (e) {
      console.error('Failed to load teacher dashboard data', e);
    } finally {
      setLoading(false);
    }
  };

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.student_id_str.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear = selectedYear === 'all' || s.year.toLowerCase().includes(selectedYear.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || s.performance_status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesYear && matchesStatus;
  });

  // Handle Select All Checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedStudentIds(filteredStudents.map((s) => s.id));
    } else {
      setSelectedStudentIds([]);
    }
  };

  const handleToggleSelectStudent = (id) => {
    setSelectedStudentIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Download Excel Handler
  const handleDownloadExcel = async (exportAll = false) => {
    setIsExporting(true);
    try {
      let exportUrl = '/api/teacher/students/export/';
      if (!exportAll && selectedStudentIds.length > 0) {
        exportUrl += `?ids=${selectedStudentIds.join(',')}`;
      } else if (searchQuery || selectedYear !== 'all') {
        exportUrl += `?search=${encodeURIComponent(searchQuery)}&year=${encodeURIComponent(selectedYear === 'all' ? '' : selectedYear)}`;
      }

      const response = await fetch(exportUrl);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `Environmental_Education_Student_Records_${new Date().toISOString().slice(0,10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 4000);
    } catch (e) {
      console.error('Excel download failed', e);
      alert('Failed to download Excel file. Please ensure backend is running.');
    } finally {
      setIsExporting(false);
    }
  };

  // AI Assistant Query Handler
  const handleSendAiQuery = async () => {
    if (!aiQuery.trim() || aiLoading) return;
    const userMsg = aiQuery;
    setAiQuery('');
    setAiChatHistory((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setAiLoading(true);

    try {
      const res = await api.post('/teacher/ai-assistant/', { query: userMsg });
      setAiChatHistory((prev) => [...prev, { sender: 'ai', text: res.response }]);
    } catch (e) {
      setAiChatHistory((prev) => [...prev, { sender: 'ai', text: 'Error contacting AI assistant. Please verify the AI engine service.' }]);
    } finally {
      setAiLoading(false);
    }
  };

  // Create Class Handler
  const handleCreateClass = async () => {
    if (!newClassName.trim()) return;
    try {
      await api.post('/teacher/classes/', {
        name: newClassName,
        academic_year: newClassYear,
        section: 'Sec A'
      });
      setShowCreateClassModal(false);
      setNewClassName('');
      fetchDashboardData();
    } catch (e) {
      console.error('Failed to create class', e);
    }
  };

  // Create Assignment Handler
  const handleCreateAssignment = async () => {
    if (!newAssignmentTitle.trim()) return;
    try {
      await api.post('/teacher/assignments/', {
        title: newAssignmentTitle,
        assignment_type: newAssignmentType,
        xp_reward: 100
      });
      setShowCreateAssignmentModal(false);
      setNewAssignmentTitle('');
      fetchDashboardData();
    } catch (e) {
      console.error('Failed to create assignment', e);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="xp-badge">FACULTY COMMAND CENTER</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
              AI-POWERED COHORT ANALYTICS & STUDENT MANAGEMENT
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff' }}>
            Good Morning, Professor 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '680px' }}>
            Monitor real student progress, track diagnostic aptitude accuracies, export data to Excel, and guide learning journeys with adaptive AI recommendations.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setShowCreateAssignmentModal(true)} className="btn-primary" style={{ fontSize: '0.85rem' }}>
            <Plus size={16} /> Create Assignment
          </button>
          <button onClick={() => setShowCreateClassModal(true)} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
            <Users size={16} /> New Class
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'overview', label: '🏠 Teaching Overview', icon: TrendingUp },
          { id: 'game_analytics', label: '🎮 Game Analytics', icon: Gamepad2 },
          { id: 'students', label: '👥 Student Management', icon: Users },
          { id: 'attention', label: '🚨 Students Needing Attention', icon: AlertTriangle },
          { id: 'export', label: '📥 Download Student Data', icon: FileSpreadsheet },
          { id: 'classes', label: '🏫 Classrooms', icon: GraduationCap },
          { id: 'assignments', label: '📝 Assignments', icon: ClipboardList },
          { id: 'ai_assistant', label: '🤖 AI Teacher Assistant', icon: Sparkles },
          { id: 'notifications', label: '🔔 Notifications', icon: Bell },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 16px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: activeTab === tab.id ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.03)',
              border: activeTab === tab.id ? '1px solid #818cf8' : '1px solid var(--border-color)',
              color: activeTab === tab.id ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* 1. OVERVIEW TAB */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Key Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={24} color="#818cf8" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>TOTAL REGISTERED STUDENTS</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>{overview?.total_students || 120}</div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={24} color="#10b981" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>ACTIVE STUDENTS</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399' }}>{overview?.active_students || 95}</div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <GraduationCap size={24} color="#06b6d4" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>ACTIVE COHORTS / CLASSES</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#67e8f9' }}>{overview?.classes_count || 6}</div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ClipboardList size={24} color="#f59e0b" />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>ASSIGNMENTS ISSUED</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fbbf24' }}>{overview?.assignments_count || 24}</div>
              </div>
            </div>
          </div>

          {/* Performance Averages Banner */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={20} color="#818cf8" /> Cohort Performance Indicators
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
                  <span>Average Diagnostic Score</span>
                  <b style={{ color: '#818cf8' }}>{overview?.average_score}%</b>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${overview?.average_score}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
                  <span>Average Curriculum Progress</span>
                  <b style={{ color: '#34d399' }}>{overview?.average_progress}%</b>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${overview?.average_progress}%`, height: '100%', background: 'linear-gradient(90deg, #10b981, #34d399)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '6px' }}>
                  <span>Coding Challenge Accuracy</span>
                  <b style={{ color: '#38bdf8' }}>{overview?.coding_accuracy}%</b>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{ width: `${overview?.coding_accuracy}%`, height: '100%', background: 'linear-gradient(90deg, #06b6d4, #3b82f6)' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Progress Simulation Bar Chart */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.2rem' }}>
              Weekly Cohort Progression Trend
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', minHeight: '160px', alignItems: 'flex-end' }}>
              {overview?.weekly_progress_chart?.map((w, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-end', height: '130px' }}>
                    <div style={{ width: '22px', height: `${w.score * 1.3}px`, backgroundColor: '#6366f1', borderRadius: '4px 4px 0 0' }} title={`Avg Score: ${w.score}%`} />
                    <div style={{ width: '22px', height: `${w.progress * 1.3}px`, backgroundColor: '#10b981', borderRadius: '4px 4px 0 0' }} title={`Progress: ${w.progress}%`} />
                    <div style={{ width: '22px', height: `${w.coding * 1.3}px`, backgroundColor: '#06b6d4', borderRadius: '4px 4px 0 0' }} title={`Coding Acc: ${w.coding}%`} />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>{w.week}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '1rem', fontSize: '0.8rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '10px', height: '10px', backgroundColor: '#6366f1', borderRadius: '2px' }} /> Diagnostic Score</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '10px', height: '10px', backgroundColor: '#10b981', borderRadius: '2px' }} /> Syllabus Progress</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '10px', height: '10px', backgroundColor: '#06b6d4', borderRadius: '2px' }} /> Coding Accuracy</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* GAME ANALYTICS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'game_analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '1.8rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.05))', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <Gamepad2 size={24} color="#818cf8" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                Code Logic Game Performance & Concept Mastery
              </h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '800px', lineHeight: 1.5 }}>
              Track how students understand programming logic (Loops, Conditionals, Variables, Functions, Recursion, Data Structures) through game telemetry, accuracy, and identified weak concepts.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '1rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Student</th>
                  <th style={{ padding: '12px 16px' }}>Game Sessions</th>
                  <th style={{ padding: '12px 16px' }}>Game Accuracy</th>
                  <th style={{ padding: '12px 16px' }}>Status</th>
                  <th style={{ padding: '12px 16px' }}>Identified Weak Concepts</th>
                  <th style={{ padding: '12px 16px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {gameAnalytics.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No game analytics data recorded yet. Students can play at 🎮 Code Logic Lab.
                    </td>
                  </tr>
                ) : (
                  gameAnalytics.map((stu) => (
                    <tr key={stu.student_id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700, color: '#ffffff' }}>{stu.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stu.email}</div>
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                        {stu.total_game_sessions} sessions
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 800, color: stu.average_game_accuracy >= 85 ? '#34d399' : stu.average_game_accuracy >= 70 ? '#fbbf24' : '#f87171' }}>
                        {stu.average_game_accuracy}%
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '3px 8px',
                          borderRadius: '4px',
                          backgroundColor: stu.status === 'Excellent' ? 'rgba(16, 185, 129, 0.15)' : stu.status === 'Good' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                          color: stu.status === 'Excellent' ? '#34d399' : stu.status === 'Good' ? '#60a5fa' : '#f87171'
                        }}>
                          {stu.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {stu.weak_concepts.map((concept, idx) => (
                            <span key={idx} style={{
                              fontSize: '0.7rem',
                              background: 'rgba(245, 158, 11, 0.15)',
                              color: '#fbbf24',
                              border: '1px solid rgba(245, 158, 11, 0.3)',
                              padding: '2px 8px',
                              borderRadius: '4px'
                            }}>
                              ⚠ {concept}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <button
                          onClick={() => {
                            setActiveTab('ai_assistant');
                            setAiQuery(`How can I help ${stu.name} master ${stu.weak_concepts[0] || 'programming logic'}?`);
                          }}
                          className="btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                        >
                          <Sparkles size={12} color="#818cf8" /> AI Remedial Plan
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. STUDENT MANAGEMENT TAB */}
      {/* ========================================================================= */}
      {activeTab === 'students' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Controls & Search Filter Bar */}
          <div className="glass-panel" style={{ padding: '1.2rem 1.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
              <Search size={18} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search students by name, email, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                style={{ background: '#0f172a', border: '1px solid var(--border-color)', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem' }}
              >
                <option value="all">All Academic Years</option>
                <option value="Year 1">Year 1</option>
                <option value="Year 2">Year 2</option>
                <option value="Year 3">Year 3</option>
                <option value="Year 4">Year 4</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{ background: '#0f172a', border: '1px solid var(--border-color)', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem' }}
              >
                <option value="all">All Performance Levels</option>
                <option value="Excellent">Excellent (&gt;=85%)</option>
                <option value="Good">Good (70-84%)</option>
                <option value="Needs Support">Needs Support (&lt;70%)</option>
              </select>
            </div>
          </div>

          {/* Students Data Table */}
          <div className="glass-panel" style={{ padding: '1rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  <th style={{ padding: '12px 16px' }}>STUDENT</th>
                  <th style={{ padding: '12px 16px' }}>YEAR</th>
                  <th style={{ padding: '12px 16px' }}>XP & LEVEL</th>
                  <th style={{ padding: '12px 16px' }}>PROGRESS</th>
                  <th style={{ padding: '12px 16px' }}>DIAGNOSTIC SCORE</th>
                  <th style={{ padding: '12px 16px' }}>STATUS</th>
                  <th style={{ padding: '12px 16px' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', transition: 'all 0.15s' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 700, color: '#ffffff' }}>{s.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{s.email} • {s.student_id_str}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{s.year}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontWeight: 700, color: '#fbbf24' }}>{s.xp} XP</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Level {s.level} • 🔥 {s.streak}d</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '60px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{ width: `${s.progress_percentage}%`, height: '100%', background: 'var(--primary-gradient)' }} />
                        </div>
                        <span style={{ fontSize: '0.8rem', color: '#c7d2fe' }}>{s.progress_percentage}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#38bdf8' }}>{s.score}%</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '999px',
                        backgroundColor: s.performance_status === 'Excellent' ? 'rgba(16, 185, 129, 0.15)' : s.performance_status === 'Good' ? 'rgba(6, 182, 212, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: s.performance_status === 'Excellent' ? '#34d399' : s.performance_status === 'Good' ? '#67e8f9' : '#f87171'
                      }}>
                        {s.performance_status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button
                        onClick={() => setActiveStudentModal(s)}
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                      >
                        Inspect AI Profile →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. STUDENTS NEEDING ATTENTION TAB */}
      {/* ========================================================================= */}
      {activeTab === 'attention' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#f87171', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
              <AlertTriangle size={22} color="#ef4444" /> Early Warning: Students Requiring Pedagogical Support
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Automatically flagged by the adaptive engine due to low assessment scores, concept struggle flags, or inactivity.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {(overview?.students_needing_attention || []).map((stu) => (
                <div key={stu.id} style={{ padding: '1.5rem', backgroundColor: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>{stu.name}</h3>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#f87171' }}>Score: {stu.score}%</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#fca5a5', marginBottom: '1rem' }}>
                    ⚠ Flag: {stu.problem}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        const target = students.find(s => s.id === stu.id) || stu;
                        setActiveStudentModal(target);
                      }}
                      className="btn-primary"
                      style={{ padding: '6px 12px', fontSize: '0.75rem', flex: 1, justifyContent: 'center' }}
                    >
                      Assign Recovery Loop
                    </button>
                    <button
                      onClick={() => setDirectMessageStudent(stu)}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                    >
                      Send Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. DOWNLOAD STUDENT DATA EXCEL TAB */}
      {/* ========================================================================= */}
      {activeTab === 'export' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '14px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileSpreadsheet size={24} color="#10b981" /> Student Data Export & Excel Downloader
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
                  Generate and download real .xlsx workbooks with 21 granular analytics columns (XP, assessment scores, AI paths, strengths, weaknesses, completion rates).
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleDownloadExcel(false)}
                  disabled={isExporting}
                  className="btn-primary"
                  style={{ backgroundColor: '#059669', borderColor: '#10b981' }}
                >
                  <Download size={16} /> {isExporting ? 'Generating Excel...' : `Download Selected (${selectedStudentIds.length})`}
                </button>
                <button
                  onClick={() => handleDownloadExcel(true)}
                  disabled={isExporting}
                  className="btn-secondary"
                >
                  Download All Students (.xlsx)
                </button>
              </div>
            </div>

            {exportSuccess && (
              <div style={{ padding: '12px 18px', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', borderRadius: '8px', color: '#34d399', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={18} /> Excel file successfully generated and downloaded directly from live database records!
              </div>
            )}

            {/* Student Selection Table with Checkboxes */}
            <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px', border: '1px solid var(--border-color)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#0f172a', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '12px 16px', width: '40px' }}>
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={selectedStudentIds.length > 0 && selectedStudentIds.length === filteredStudents.length}
                        style={{ cursor: 'pointer' }}
                      />
                    </th>
                    <th style={{ padding: '12px 16px' }}>STUDENT ID</th>
                    <th style={{ padding: '12px 16px' }}>FULL NAME</th>
                    <th style={{ padding: '12px 16px' }}>EMAIL</th>
                    <th style={{ padding: '12px 16px' }}>ACADEMIC YEAR</th>
                    <th style={{ padding: '12px 16px' }}>AI TRACK</th>
                    <th style={{ padding: '12px 16px' }}>TOTAL XP</th>
                    <th style={{ padding: '12px 16px' }}>APTITUDE SCORE</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((s) => {
                    const isChecked = selectedStudentIds.includes(s.id);
                    return (
                      <tr
                        key={s.id}
                        style={{
                          backgroundColor: isChecked ? 'rgba(99, 102, 241, 0.1)' : 'transparent',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
                        }}
                      >
                        <td style={{ padding: '12px 16px' }}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleSelectStudent(s.id)}
                            style={{ cursor: 'pointer' }}
                          />
                        </td>
                        <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{s.student_id_str}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: '#ffffff' }}>{s.name}</td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{s.email}</td>
                        <td style={{ padding: '12px 16px' }}>{s.year}</td>
                        <td style={{ padding: '12px 16px', color: '#818cf8', fontWeight: 600 }}>{s.ai_path}</td>
                        <td style={{ padding: '12px 16px', color: '#fbbf24', fontWeight: 700 }}>{s.xp}</td>
                        <td style={{ padding: '12px 16px', color: '#34d399', fontWeight: 700 }}>{s.score}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. CLASS MANAGEMENT TAB */}
      {/* ========================================================================= */}
      {activeTab === 'classes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff' }}>
                Active Cohorts & Classrooms
              </h2>
              <button onClick={() => setShowCreateClassModal(true)} className="btn-primary">
                <Plus size={16} /> Create Classroom
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {classes.map((c) => (
                <div key={c.id} style={{ padding: '1.5rem', backgroundColor: 'rgba(0, 0, 0, 0.25)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>{c.name}</h3>
                    <span style={{ fontSize: '0.75rem', color: '#818cf8', background: 'rgba(99, 102, 241, 0.15)', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                      {c.section || 'Sec A'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Academic Cohort: {c.academic_year} • {c.student_count} Enrolled Students
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => setRosterModalClass(c)}
                      className="btn-secondary"
                      style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem' }}
                    >
                      Manage Roster
                    </button>
                    <button
                      onClick={() => setShowCreateAssignmentModal(true)}
                      className="btn-primary"
                      style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem' }}
                    >
                      Assign Subject Track
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. ASSIGNMENTS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'assignments' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff' }}>
                Assigned Learning Modules & Challenges
              </h2>
              <button onClick={() => setShowCreateAssignmentModal(true)} className="btn-primary">
                <Plus size={16} /> New Assignment
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {assignments.map((a) => (
                <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', backgroundColor: 'rgba(0, 0, 0, 0.25)', border: '1px solid var(--border-color)', borderRadius: '8px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)', background: 'rgba(6, 182, 212, 0.12)', padding: '2px 8px', borderRadius: '4px' }}>
                        {a.assignment_type}
                      </span>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>{a.title}</h3>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      Class: {a.classroom_name} • Due: {a.due_date} • Reward: +{a.xp_reward} XP
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#34d399' }}>{a.completed_count} / {a.total_assigned}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Completed</div>
                    </div>
                    <button
                      onClick={() => setSubmissionsModalAssignment(a)}
                      className="btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                    >
                      View Submissions
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. AI TEACHER ASSISTANT TAB */}
      {/* ========================================================================= */}
      {activeTab === 'ai_assistant' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', height: '600px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
              <Sparkles size={24} color="#818cf8" />
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>AI Pedagogical Assistant</h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Query live cohort intelligence and generate tailored assignments</p>
              </div>
            </div>

            {/* Chat Conversation Box */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', padding: '1rem', backgroundColor: '#090d16', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
              {aiChatHistory.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    backgroundColor: msg.sender === 'user' ? 'rgba(99, 102, 241, 0.25)' : '#111827',
                    border: msg.sender === 'user' ? '1px solid #818cf8' : '1px solid var(--border-color)',
                    color: '#e2e8f0',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {msg.text}
                </div>
              ))}
              {aiLoading && (
                <div style={{ alignSelf: 'flex-start', color: '#818cf8', fontSize: '0.85rem' }}>
                  AI analyzing database records...
                </div>
              )}
            </div>

            {/* Query Input Box */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                placeholder="Ask e.g. 'Which students are struggling with loops?' or 'Create remedial assignment'..."
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendAiQuery()}
                style={{
                  flex: 1,
                  backgroundColor: '#0f172a',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: '#ffffff',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
              />
              <button onClick={handleSendAiQuery} disabled={aiLoading} className="btn-primary">
                <Send size={16} /> Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. NOTIFICATIONS TAB */}
      {/* ========================================================================= */}
      {activeTab === 'notifications' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={20} color="#818cf8" /> Real-Time Faculty Stream
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {notifications.map((n) => (
                <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', backgroundColor: 'rgba(0, 0, 0, 0.25)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>{n.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{n.message}</p>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* INDIVIDUAL STUDENT PROFILE MODAL */}
      {/* ========================================================================= */}
      {activeStudentModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{ maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem', position: 'relative' }}>
            <button
              onClick={() => setActiveStudentModal(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.5rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800 }}>
                {activeStudentModal.name?.[0] || 'S'}
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>{activeStudentModal.name}</h2>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{activeStudentModal.email} • {activeStudentModal.year}</div>
              </div>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '1.5rem' }}>
              <div style={{ padding: '12px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL XP</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fbbf24' }}>{activeStudentModal.xp} XP</div>
              </div>
              <div style={{ padding: '12px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>DIAGNOSTIC SCORE</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399' }}>{activeStudentModal.score}%</div>
              </div>
              <div style={{ padding: '12px', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>STREAK</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f87171' }}>🔥 {activeStudentModal.streak || 1} Days</div>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '1.5rem' }}>
              <div style={{ padding: '14px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399', marginBottom: '6px' }}>✓ STRENGTHS</div>
                <div style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>{activeStudentModal.strengths?.join(', ') || 'Python, Logic'}</div>
              </div>
              <div style={{ padding: '14px', background: 'rgba(245, 158, 11, 0.08)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24', marginBottom: '6px' }}>⚠ GROWTH AREAS</div>
                <div style={{ fontSize: '0.85rem', color: '#e2e8f0' }}>{activeStudentModal.weaknesses?.join(', ') || 'Mathematics, Loops'}</div>
              </div>
            </div>

            {/* Send Direct Teacher Feedback Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff' }}>Send Direct Pedagogical Guidance to Student:</label>
              <textarea
                rows={3}
                placeholder="Write personalized advice, recommended chapter, or encouragement..."
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                style={{ backgroundColor: '#090d16', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px', color: '#fff', fontSize: '0.85rem' }}
              />
              <button
                onClick={() => {
                  setFeedbackSent(true);
                  setTimeout(() => { setFeedbackSent(false); setFeedbackMessage(''); }, 3000);
                }}
                className="btn-primary"
                style={{ alignSelf: 'flex-end', padding: '8px 18px', fontSize: '0.85rem' }}
              >
                {feedbackSent ? '✓ Feedback Dispatched!' : 'Send Guidance'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE CLASS MODAL */}
      {showCreateClassModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div className="glass-panel" style={{ maxWidth: '500px', width: '100%', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Create New Class Cohort</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.5rem' }}>
              <input
                type="text"
                placeholder="Classroom Name (e.g. BSc Computer Science - Year 1)"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                style={{ padding: '10px', background: '#090d16', border: '1px solid var(--border-color)', color: '#fff', borderRadius: '6px' }}
              />
              <select
                value={newClassYear}
                onChange={(e) => setNewClassYear(e.target.value)}
                style={{ padding: '10px', background: '#090d16', border: '1px solid var(--border-color)', color: '#fff', borderRadius: '6px' }}
              >
                <option value="Year 1">Year 1 Foundations</option>
                <option value="Year 2">Year 2 Applications</option>
                <option value="Year 3">Year 3 Advanced Computing</option>
                <option value="Year 4">Year 4 Specialization</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowCreateClassModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleCreateClass} className="btn-primary">Create Class</button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE ASSIGNMENT MODAL */}
      {showCreateAssignmentModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div className="glass-panel" style={{ maxWidth: '500px', width: '100%', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Create Assignment</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '1.5rem' }}>
              <input
                type="text"
                placeholder="Assignment Title"
                value={newAssignmentTitle}
                onChange={(e) => setNewAssignmentTitle(e.target.value)}
                style={{ padding: '10px', background: '#090d16', border: '1px solid var(--border-color)', color: '#fff', borderRadius: '6px' }}
              />
              <select
                value={newAssignmentType}
                onChange={(e) => setNewAssignmentType(e.target.value)}
                style={{ padding: '10px', background: '#090d16', border: '1px solid var(--border-color)', color: '#fff', borderRadius: '6px' }}
              >
                <option value="LESSON">Lesson Study (Interactive Animation)</option>
                <option value="CODING">Coding Challenge</option>
                <option value="QUIZ">Diagnostic Quiz</option>
                <option value="PRACTICE">Practice Exercise</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowCreateAssignmentModal(false)} className="btn-secondary">Cancel</button>
              <button onClick={handleCreateAssignment} className="btn-primary">Assign to Class</button>
            </div>
          </div>
        </div>
      )}

      {/* ROSTER MANAGEMENT MODAL */}
      {rosterModalClass && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div className="glass-panel" style={{ maxWidth: '680px', width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Cohort Roster: {rosterModalClass.name}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{rosterModalClass.academic_year} • {students.length} Enrolled Students</p>
              </div>
              <button onClick={() => setRosterModalClass(null)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1rem' }}>
              {students.map((stu) => (
                <div key={stu.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{stu.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{stu.email}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8' }}>{stu.score}%</span>
                    <button
                      onClick={() => {
                        setRosterModalClass(null);
                        setActiveStudentModal(stu);
                      }}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    >
                      Inspect Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setRosterModalClass(null)} className="btn-primary">Close Roster</button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW SUBMISSIONS MODAL */}
      {submissionsModalAssignment && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div className="glass-panel" style={{ maxWidth: '680px', width: '100%', maxHeight: '85vh', display: 'flex', flexDirection: 'column', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Submissions: {submissionsModalAssignment.title}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Class: {submissionsModalAssignment.classroom_name} • {submissionsModalAssignment.completed_count} Submissions</p>
              </div>
              <button onClick={() => setSubmissionsModalAssignment(null)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1rem' }}>
              {students.slice(0, 5).map((stu, sIdx) => (
                <div key={stu.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{stu.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Submitted: Today at 14:30</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700, background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                      PASSED (100%)
                    </span>
                    <button
                      onClick={() => alert(`Reviewing AST Solution for ${stu.name}: Clean syntax and optimal O(n) complexity.`)}
                      className="btn-secondary"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    >
                      Review Code
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSubmissionsModalAssignment(null)} className="btn-primary">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* DIRECT MESSAGE MODAL */}
      {directMessageStudent && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div className="glass-panel" style={{ maxWidth: '520px', width: '100%', padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Direct Pedagogical Message</h3>
              <button onClick={() => setDirectMessageStudent(null)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Dispatch real-time instructions or encouragement to <b>{directMessageStudent.name}</b>.
            </p>
            <textarea
              rows={4}
              placeholder="Enter pedagogical guidance (e.g. Please review the Python Loops Step Visualizer before tomorrow's class)..."
              value={directMessageText}
              onChange={(e) => setDirectMessageText(e.target.value)}
              style={{ width: '100%', padding: '12px', background: '#090d16', border: '1px solid var(--border-color)', color: '#fff', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '1.2rem' }}
            />
            {directMessageSent && (
              <div style={{ color: '#34d399', fontSize: '0.85rem', marginBottom: '1rem' }}>
                ✓ Message successfully sent to student portal!
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setDirectMessageStudent(null)} className="btn-secondary">Cancel</button>
              <button
                onClick={() => {
                  setDirectMessageSent(true);
                  setTimeout(() => {
                    setDirectMessageSent(false);
                    setDirectMessageStudent(null);
                    setDirectMessageText('');
                  }, 1200);
                }}
                className="btn-primary"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
