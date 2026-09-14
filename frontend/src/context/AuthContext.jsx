import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { DEMO_ACCOUNTS } from '../auth/roles';

const DEMO_TOKEN = 'demo-local-token';

function matchDemoAccount(emailOrUsername, password, role) {
  const email = (emailOrUsername || '').trim().toLowerCase();
  return DEMO_ACCOUNTS.find((account) => {
    const emailMatch = account.email.toLowerCase() === email;
    const passwordMatch = account.password === password;
    const roleMatch = !role || account.role === role;
    return emailMatch && passwordMatch && roleMatch;
  });
}

function demoLoginResponse(account) {
  const names = {
    STUDENT: { full_name: 'Alex Rivera', username: 'student_demo' },
    TEACHER: { full_name: 'Professor Vance', username: 'teacher_demo' },
    ADMIN: { full_name: 'System Admin', username: 'admin_demo' },
  };
  const meta = names[account.role];
  return {
    message: 'Login successful.',
    token: `${DEMO_TOKEN}-${account.role}`,
    user: {
      id: account.role === 'ADMIN' ? 1 : account.role === 'TEACHER' ? 2 : 3,
      username: meta.username,
      email: account.email,
      full_name: meta.full_name,
      role: account.role,
      educational_year: account.role === 'STUDENT' ? 'Year 1' : '',
      current_semester: account.role === 'STUDENT' ? 'Semester 1' : '',
      programming_experience: account.role === 'STUDENT' ? 'Beginner' : '',
      interests: [],
      total_xp: 0,
      current_level: 1,
    },
  };
}

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem('auth_token');
      if (savedToken) {
        api.setToken(savedToken);
        if (savedToken.startsWith(DEMO_TOKEN)) {
          const savedUser = localStorage.getItem('auth_user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
            setLoading(false);
            return;
          }
        }
        try {
          const userData = await api.get('/auth/me/');
          setUser(userData);
        } catch (err) {
          console.error('Failed to load user with stored token:', err);
          api.setToken(null);
          localStorage.removeItem('auth_user');
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (emailOrUsername, password, role) => {
    const payload = {
      email: emailOrUsername,
      password: password,
    };
    if (role) {
      payload.role = role;
    }
    try {
      const res = await api.post('/auth/login/', payload);
      api.setToken(res.token);
      localStorage.setItem('auth_user', JSON.stringify(res.user));
      setUser(res.user);
      return res;
    } catch (err) {
      const demo = matchDemoAccount(emailOrUsername, password, role);
      if (demo) {
        const res = demoLoginResponse(demo);
        api.setToken(res.token);
        localStorage.setItem('auth_user', JSON.stringify(res.user));
        setUser(res.user);
        return res;
      }
      throw err;
    }
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register/', userData);
    api.setToken(res.token);
    localStorage.setItem('auth_user', JSON.stringify(res.user));
    setUser(res.user);
    return res;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout/');
    } catch (err) {
      console.warn('Logout error ignored:', err);
    }
    api.setToken(null);
    localStorage.removeItem('auth_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
