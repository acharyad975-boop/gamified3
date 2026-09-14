export const ROLES = {
  ADMIN: 'ADMIN',
  TEACHER: 'TEACHER',
  STUDENT: 'STUDENT',
};

export const ROLE_LABELS = {
  ADMIN: 'Admin',
  TEACHER: 'Teacher',
  STUDENT: 'Student',
};

export function homePathForRole(role) {
  if (role === ROLES.ADMIN) return '/admin';
  if (role === ROLES.TEACHER) return '/teacher';
  return '/dashboard';
}

export const DEMO_ACCOUNTS = [
  { role: 'STUDENT', email: 'student@example.com', password: 'Password123!', label: 'Student demo' },
  { role: 'TEACHER', email: 'teacher@example.com', password: 'Password123!', label: 'Teacher demo' },
  { role: 'ADMIN', email: 'admin@example.com', password: 'Password123!', label: 'Admin demo' },
];
