import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GamificationProvider } from './context/GamificationContext';
import { homePathForRole, ROLE_LABELS } from './auth/roles';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import AssessmentDashboard from './pages/AssessmentDashboard';
import AssessmentDayPage from './pages/AssessmentDayPage';
import AIProfilePage from './pages/AIProfilePage';
import CurriculumBrowser from './pages/CurriculumBrowser';
import CodingWorkspace from './pages/CodingWorkspace';
import AnalyticsPage from './pages/AnalyticsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LessonDetailPage from './pages/LessonDetailPage';
import WeakTopicLoopPage from './pages/WeakTopicLoopPage';
import RoadmapView from './pages/RoadmapView';
import PracticeLabPage from './pages/PracticeLabPage';
import GameHubPage from './games/pages/GameHubPage';
import GameDetailPage from './games/pages/GameDetailPage';
import GameLeaderboardPage from './games/pages/GameLeaderboardPage';

// Protected layout container
const AppLayout = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Loading Gamified Environmental Education...</div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="app-container">
        {user && <Sidebar />}
        <main className="main-content">
          <div className="page-wrapper">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// 403 Forbidden Screen Component
const AccessDeniedScreen = ({ title, message, redirectPath, redirectLabel }) => (
  <div className="glass-panel" style={{ padding: '3.5rem', maxWidth: '640px', margin: '3rem auto', textAlign: 'center' }}>
    <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
      <ShieldAlert size={36} color="#ef4444" />
    </div>
    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f87171', textTransform: 'uppercase', marginBottom: '4px' }}>403 Unauthorized Access</div>
    <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.8rem' }}>
      {title}
    </h2>
    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
      {message}
    </p>
    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
      <Link to={redirectPath} className="btn-primary">
        <ArrowLeft size={16} /> {redirectLabel}
      </Link>
      <Link to="/login" className="btn-secondary">
        Switch Account
      </Link>
    </div>
  </div>
);

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to={homePathForRole(user.role)} replace />;
  return children;
};

const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const RoleRoute = ({ allow, children, title }) => {
  const { user } = useAuth();
  if (!allow.includes(user.role)) {
    return (
      <AccessDeniedScreen
        title={title}
        message={`You do not have permission to open this area. Your account (${user.email}) is registered as ${ROLE_LABELS[user.role] || user.role}.`}
        redirectPath={homePathForRole(user.role)}
        redirectLabel={`Go to ${ROLE_LABELS[user.role] || user.role} Dashboard`}
      />
    );
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <GamificationProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
              <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

              <Route path="/dashboard" element={<RequireAuth><RoleRoute allow={['STUDENT']} title="Student Portal Required"><StudentDashboard /></RoleRoute></RequireAuth>} />
              <Route path="/student/dashboard" element={<RequireAuth><RoleRoute allow={['STUDENT']} title="Student Portal Required"><StudentDashboard /></RoleRoute></RequireAuth>} />
              <Route path="/assessment" element={<RequireAuth><RoleRoute allow={['STUDENT']} title="Student Portal Required"><AssessmentDashboard /></RoleRoute></RequireAuth>} />
              <Route path="/assessment/day/:day" element={<RequireAuth><RoleRoute allow={['STUDENT']} title="Student Portal Required"><AssessmentDayPage /></RoleRoute></RequireAuth>} />
              <Route path="/ai-profile" element={<RequireAuth><RoleRoute allow={['STUDENT']} title="Student Portal Required"><AIProfilePage /></RoleRoute></RequireAuth>} />
              <Route path="/curriculum" element={<RequireAuth><CurriculumBrowser /></RequireAuth>} />
              <Route path="/lesson/:id" element={<RequireAuth><LessonDetailPage /></RequireAuth>} />
              <Route path="/weak-topic-loop" element={<RequireAuth><RoleRoute allow={['STUDENT']} title="Student Portal Required"><WeakTopicLoopPage /></RoleRoute></RequireAuth>} />
              <Route path="/coding" element={<RequireAuth><CodingWorkspace /></RequireAuth>} />
              <Route path="/games" element={<RequireAuth><RoleRoute allow={['STUDENT', 'TEACHER', 'ADMIN']} title="Games Portal"><GameHubPage /></RoleRoute></RequireAuth>} />
              <Route path="/games/leaderboard" element={<RequireAuth><RoleRoute allow={['STUDENT', 'TEACHER', 'ADMIN']} title="Game Leaderboard"><GameLeaderboardPage /></RoleRoute></RequireAuth>} />
              <Route path="/games/:slug" element={<RequireAuth><RoleRoute allow={['STUDENT', 'TEACHER', 'ADMIN']} title="Code Logic Game"><GameDetailPage /></RoleRoute></RequireAuth>} />
              <Route path="/roadmap" element={<RequireAuth><RoleRoute allow={['STUDENT']} title="Student Portal Required"><RoadmapView /></RoleRoute></RequireAuth>} />
              <Route path="/practice" element={<RequireAuth><RoleRoute allow={['STUDENT']} title="Student Portal Required"><PracticeLabPage /></RoleRoute></RequireAuth>} />
              <Route path="/portfolio" element={<Navigate to="/practice" replace />} />
              <Route path="/analytics" element={<RequireAuth><AnalyticsPage /></RequireAuth>} />
              <Route path="/leaderboard" element={<RequireAuth><LeaderboardPage /></RequireAuth>} />

              <Route path="/teacher" element={<RequireAuth><RoleRoute allow={['TEACHER', 'ADMIN']} title="Faculty Privilege Required"><TeacherDashboard /></RoleRoute></RequireAuth>} />
              <Route path="/teacher/dashboard" element={<RequireAuth><RoleRoute allow={['TEACHER', 'ADMIN']} title="Faculty Privilege Required"><TeacherDashboard /></RoleRoute></RequireAuth>} />

              <Route path="/admin" element={<RequireAuth><RoleRoute allow={['ADMIN']} title="Administrator Privilege Required"><AdminDashboard /></RoleRoute></RequireAuth>} />
              <Route path="/admin/dashboard" element={<RequireAuth><RoleRoute allow={['ADMIN']} title="Administrator Privilege Required"><AdminDashboard /></RoleRoute></RequireAuth>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </GamificationProvider>
    </AuthProvider>
  );
}

export default App;
