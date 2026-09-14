import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, GraduationCap, Code2, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';

const INTEREST_OPTIONS = [
  'Web Development',
  'Artificial Intelligence & ML',
  'Data Science & Analytics',
  'Cyber Security',
  'Cloud Computing',
  'Systems & Algorithms',
  'Mobile App Development',
];

const RegisterPage = () => {
  const [role, setRole] = useState('STUDENT');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [educationalYear, setEducationalYear] = useState('Year 1');
  const [currentSemester, setCurrentSemester] = useState('Semester 1');
  const [programmingExperience, setProgrammingExperience] = useState('Beginner');
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await register({
        role,
        full_name: fullName,
        email,
        password,
        educational_year: educationalYear,
        current_semester: currentSemester,
        programming_experience: programmingExperience,
        interests: selectedInterests,
      });
      if (res?.user?.role === 'TEACHER') {
        navigate('/teacher');
      } else if (res?.user?.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/assessment');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '640px', margin: '2rem auto', padding: '0 1rem' }}>
      <div className="glass-panel" style={{ padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            padding: '8px',
            borderRadius: '12px',
            background: 'var(--primary-gradient)',
            marginBottom: '1rem'
          }}>
            <Sparkles size={24} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
            Create Your Student Profile
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Join the Gamified Environmental Education platform. We will customize your curriculum starting with a 7-day onboarding diagnostic.
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#f87171',
            fontSize: '0.85rem'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Account Role Selection */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '1.5rem', background: '#090d16', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <button
            type="button"
            onClick={() => setRole('STUDENT')}
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: role === 'STUDENT' ? 'var(--primary-gradient)' : 'transparent',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <GraduationCap size={16} /> Register as Student
          </button>
          <button
            type="button"
            onClick={() => setRole('TEACHER')}
            style={{
              padding: '10px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: role === 'TEACHER' ? 'linear-gradient(135deg, #059669, #10b981)' : 'transparent',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Code2 size={16} /> Register as Faculty
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
          {/* Full Name */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Full Name
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ada Lovelace"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 40px',
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
              <User size={18} color="#6b7280" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
              University / Personal Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 40px',
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
              <Mail size={18} color="#6b7280" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '12px 14px 12px 40px',
                  backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
              <Lock size={18} color="#6b7280" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Academic Background Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Educational Year
              </label>
              <select
                value={educationalYear}
                onChange={(e) => setEducationalYear(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px',
                  backgroundColor: '#111827',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              >
                <option value="Year 1">Year 1 (Foundations)</option>
                <option value="Year 2">Year 2 (Core & Web)</option>
                <option value="Year 3">Year 3 (Advanced)</option>
                <option value="Year 4">Year 4 (Specialization)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Current Semester
              </label>
              <select
                value={currentSemester}
                onChange={(e) => setCurrentSemester(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px',
                  backgroundColor: '#111827',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={`Semester ${s}`}>Semester {s}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Prior Experience
              </label>
              <select
                value={programmingExperience}
                onChange={(e) => setProgrammingExperience(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px',
                  backgroundColor: '#111827',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#ffffff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              >
                <option value="None">Complete Beginner (No coding)</option>
                <option value="Beginner">Beginner (Basic loops/vars)</option>
                <option value="Intermediate">Intermediate (Built projects)</option>
                <option value="Advanced">Advanced (Experienced)</option>
              </select>
            </div>
          </div>

          {/* Optional Interests */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--text-secondary)' }}>
              Optional Target Interests (Select any that spark your curiosity)
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {INTEREST_OPTIONS.map((interest) => {
                const selected = selectedInterests.includes(interest);
                return (
                  <button
                    type="button"
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    style={{
                      background: selected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      border: selected ? '1px solid var(--primary-light)' : '1px solid var(--border-color)',
                      color: selected ? '#c7d2fe' : 'var(--text-secondary)',
                      padding: '6px 12px',
                      borderRadius: '999px',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    {interest} {selected ? '✓' : '+'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Creating Profile...' : 'Complete Registration & Start Assessment'} <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Already registered?{' '}
          <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 600, textDecoration: 'none' }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
