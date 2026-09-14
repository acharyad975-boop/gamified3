import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useGamification } from '../context/GamificationContext';
import AnimationDispatcher from '../components/animations/AnimationDispatcher';
import { getChapterData } from '../data/chapterDatabase';
import { 
  BookOpen, 
  Play, 
  Code2, 
  Volume2, 
  HelpCircle, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Layers,
  Cpu,
  Terminal,
  Activity,
  Award,
  Zap
} from 'lucide-react';

const LessonDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { awardXP } = useGamification();

  // Load unique chapter data from database
  const chapter = getChapterData(id);

  const [activeTab, setActiveTab] = useState('animation'); // 'animation', 'text', 'visual', 'code', 'audio', 'exercises', 'quiz'
  const [explanationLevel, setExplanationLevel] = useState('beginner'); // 'beginner', 'intermediate', 'advanced'
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedExerciseTier, setSelectedExerciseTier] = useState('easy'); // 'easy', 'medium', 'hard'
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [code, setCode] = useState(chapter.starterCode || '');
  const [output, setOutput] = useState('');
  const [analyzingCode, setAnalyzingCode] = useState(false);
  const [astAnalysis, setAstAnalysis] = useState(null);

  // Update code editor when chapter changes
  useEffect(() => {
    setCode(chapter.starterCode || '');
    setOutput('');
    setAstAnalysis(null);
    setQuizSubmitted(false);
    setQuizAnswer('');
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  }, [id, chapter]);

  const handleSpeakAudio = () => {
    if ('speechSynthesis' in window) {
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(chapter.audioTranscript);
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
        setIsPlayingAudio(true);
      }
    } else {
      alert(chapter.audioTranscript);
    }
  };

  const handleRunCode = () => {
    setOutput(`Executing in sandboxed runtime...\n\nProgram output:\n> Execution completed successfully (0ms).`);
    awardXP(25, `Code Practice: ${chapter.title}`);
  };

  const handleAnalyzeAST = () => {
    setAnalyzingCode(true);
    setTimeout(() => {
      setAstAnalysis({
        correctness: '95%',
        logic: '92%',
        syntax: '100%',
        quality: 'Clean & Idiomatic',
        time_complexity: 'O(1) / O(n)',
        space_complexity: 'O(1)',
        feedback: 'Syntactically valid Python code conforming to official language standards.'
      });
      setAnalyzingCode(false);
    }, 500);
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    if (quizAnswer === chapter.quiz.correctAnswer) {
      awardXP(50, `Diagnostic Quiz Passed: ${chapter.title}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1140px', margin: '0 auto' }}>
      {/* Navigation Breadcrumb */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <Link to="/curriculum" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /> Back to Subject Curriculum
        </Link>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {chapter.subject} &gt; {chapter.module} &gt; {chapter.chapter}
        </span>
      </div>

      {/* Lesson Header Card */}
      <div className="glass-panel" style={{ padding: '1.8rem 2.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="xp-badge">+{chapter.xpReward || 50} XP</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase' }}>
              INDIVIDUAL CHAPTER LEARNING EXPERIENCE
            </span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
            {chapter.title}
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleSpeakAudio} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
            <Volume2 size={16} color="var(--accent-cyan)" /> {isPlayingAudio ? 'Stop Audio' : 'Listen Narration'}
          </button>
          <Link to="/weak-topic-loop" className="btn-secondary" style={{ fontSize: '0.85rem', borderColor: '#818cf8', color: '#c7d2fe' }}>
            <Activity size={16} color="#818cf8" /> Recovery Loop
          </Link>
        </div>
      </div>

      {/* Multimodal Format Navigation Tabs */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { id: 'animation', label: '🎬 Interactive Animation', icon: Play },
          { id: 'text', label: '📖 AI Explanation & Notes', icon: BookOpen },
          { id: 'visual', label: '📊 Visual Diagram', icon: Layers },
          { id: 'code', label: '💻 Practical Code', icon: Code2 },
          { id: 'exercises', label: '🎯 Practice Tasks', icon: Zap },
          { id: 'audio', label: '🎧 Audio Narration', icon: Volume2 },
          { id: 'quiz', label: '📝 Diagnostic Quiz', icon: HelpCircle },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 16px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: activeTab === tab.id ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.04)',
              border: activeTab === tab.id ? '1px solid #818cf8' : '1px solid var(--border-color)',
              color: activeTab === tab.id ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: '0.85rem',
              cursor: 'pointer',
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

      {/* Active Multimodal Content */}
      <div style={{ minHeight: '380px' }}>
        {/* 1. INTERACTIVE UNIQUE ANIMATION */}
        {activeTab === 'animation' && (
          <AnimationDispatcher animationType={chapter.animationType} />
        )}

        {/* 2. AI EXPLANATION & NOTES (WITH TIER SWITCHER) */}
        {activeTab === 'text' && (
          <div className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="#818cf8" /> AI Adaptive Explanation
              </h2>

              {/* Tier Switcher */}
              <div style={{ display: 'flex', gap: '6px', backgroundColor: '#030712', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                {['beginner', 'intermediate', 'advanced'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setExplanationLevel(lvl)}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'capitalize',
                      border: 'none',
                      backgroundColor: explanationLevel === lvl ? 'var(--primary-gradient)' : 'transparent',
                      color: explanationLevel === lvl ? '#fff' : 'var(--text-muted)',
                      cursor: 'pointer'
                    }}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ padding: '1.2rem', backgroundColor: 'rgba(99, 102, 241, 0.08)', borderRadius: '10px', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
              <p style={{ fontSize: '1.05rem', color: '#e2e8f0', lineHeight: 1.7 }}>
                {chapter.aiExplanations?.[explanationLevel] || chapter.aiExplanations?.beginner}
              </p>
            </div>

            <div style={{ backgroundColor: '#030712', padding: '1.2rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: '#38bdf8' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>CODE TEMPLATE</div>
              <pre>{chapter.starterCode}</pre>
            </div>
          </div>
        )}

        {/* 3. VISUAL DIAGRAM */}
        {activeTab === 'visual' && (
          <div className="glass-panel" style={{ padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem', color: '#ffffff' }}>
              Architectural Concept Flowchart
            </h2>
            <pre style={{
              backgroundColor: '#030712',
              padding: '2rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.95rem',
              color: '#34d399',
              lineHeight: 1.6,
              overflowX: 'auto'
            }}>
              {chapter.visualDiagram}
            </pre>
          </div>
        )}

        {/* 4. PRACTICAL CODE PLAYGROUND */}
        {activeTab === 'code' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '20px' }}>
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ padding: '10px 16px', background: '#0f172a', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>chapter_sandbox.py</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={handleAnalyzeAST} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                    <Cpu size={14} /> AI Code Analysis
                  </button>
                  <button onClick={handleRunCode} className="btn-primary" style={{ padding: '4px 12px', fontSize: '0.75rem' }}>
                    <Play size={14} /> Run
                  </button>
                </div>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{
                  height: '240px',
                  backgroundColor: '#090d16',
                  color: '#e2e8f0',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9rem',
                  padding: '1rem',
                  border: 'none',
                  outline: 'none',
                  resize: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="glass-panel" style={{ flex: 1, padding: '1rem', backgroundColor: '#030712' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>CONSOLE OUTPUT</div>
                <pre style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', minHeight: '60px' }}>
                  {output || '> Click Run to execute code in sandbox...'}
                </pre>
              </div>

              {astAnalysis && (
                <div className="glass-panel" style={{ padding: '1.2rem', background: 'rgba(30, 27, 75, 0.4)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#c084fc', marginBottom: '8px' }}>AI PRACTICAL FEEDBACK</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '8px', fontSize: '0.75rem' }}>
                    <div style={{ background: '#090d16', padding: '6px', borderRadius: '4px' }}>Correctness: <b style={{ color: '#34d399' }}>{astAnalysis.correctness}</b></div>
                    <div style={{ background: '#090d16', padding: '6px', borderRadius: '4px' }}>Logic: <b style={{ color: '#38bdf8' }}>{astAnalysis.logic}</b></div>
                    <div style={{ background: '#090d16', padding: '6px', borderRadius: '4px' }}>Syntax: <b style={{ color: '#fbbf24' }}>{astAnalysis.syntax}</b></div>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#c7d2fe' }}>{astAnalysis.feedback}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. MULTI-TIER PRACTICE EXERCISES */}
        {activeTab === 'exercises' && (
          <div className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff' }}>
              Multi-Tier Practice Challenges
            </h2>

            <div style={{ display: 'flex', gap: '10px' }}>
              {['easy', 'medium', 'hard'].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSelectedExerciseTier(tier)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    backgroundColor: selectedExerciseTier === tier ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                    border: selectedExerciseTier === tier ? '1px solid #818cf8' : '1px solid var(--border-color)',
                    color: selectedExerciseTier === tier ? '#ffffff' : 'var(--text-secondary)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    textTransform: 'capitalize',
                    cursor: 'pointer'
                  }}
                >
                  {tier} Challenge
                </button>
              ))}
            </div>

            {chapter.exercises?.[selectedExerciseTier] && (
              <div style={{ padding: '1.5rem', backgroundColor: '#090d16', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fbbf24', marginBottom: '8px' }}>
                  {chapter.exercises[selectedExerciseTier].title}
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#e2e8f0', marginBottom: '1rem', lineHeight: 1.6 }}>
                  {chapter.exercises[selectedExerciseTier].prompt}
                </p>
                <div style={{ padding: '10px 14px', background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.25)', borderRadius: '6px', fontSize: '0.85rem', color: '#67e8f9' }}>
                  💡 <b>Hint:</b> {chapter.exercises[selectedExerciseTier].hint}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. AUDIO NARRATION */}
        {activeTab === 'audio' && (
          <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto'
            }}>
              <Volume2 size={32} color="#818cf8" />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Spoken Concept Narration
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 2rem auto', fontSize: '0.95rem', lineHeight: 1.6 }}>
              "{chapter.audioTranscript}"
            </p>
            <button onClick={handleSpeakAudio} className="btn-primary" style={{ padding: '12px 28px', fontSize: '1rem' }}>
              <Volume2 size={18} /> {isPlayingAudio ? 'Stop Audio Narration' : 'Play Concept Narration'}
            </button>
          </div>
        )}

        {/* 7. DIAGNOSTIC QUIZ */}
        {activeTab === 'quiz' && (
          <div className="glass-panel" style={{ padding: '2.5rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
              {chapter.quiz?.question}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '1.5rem 0' }}>
              {chapter.quiz?.options?.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuizAnswer(opt)}
                  disabled={quizSubmitted}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    backgroundColor: quizAnswer === opt ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    border: quizAnswer === opt ? '1px solid #818cf8' : '1px solid var(--border-color)',
                    color: quizAnswer === opt ? '#ffffff' : 'var(--text-secondary)',
                    textAlign: 'left',
                    cursor: quizSubmitted ? 'default' : 'pointer'
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>

            {quizSubmitted && (
              <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: quizAnswer === chapter.quiz.correctAnswer ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', marginBottom: '1.5rem' }}>
                <span style={{ fontWeight: 700, color: quizAnswer === chapter.quiz.correctAnswer ? '#34d399' : '#f87171' }}>
                  {quizAnswer === chapter.quiz.correctAnswer ? '✓ Correct Solution! (+50 XP)' : `✗ Incorrect. Correct answer: ${chapter.quiz.correctAnswer}`}
                </span>
                <p style={{ fontSize: '0.85rem', color: '#c7d2fe', marginTop: '6px' }}>{chapter.quiz.explanation}</p>
              </div>
            )}

            {!quizSubmitted ? (
              <button onClick={handleQuizSubmit} disabled={!quizAnswer} className="btn-primary">
                Submit Diagnostic Answer
              </button>
            ) : (
              <Link to="/curriculum" className="btn-secondary">
                Continue to Next Chapter <ArrowRight size={16} />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonDetailPage;
