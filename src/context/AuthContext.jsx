import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_USERS } from '../data/initialData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('campusflow_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved user state', e);
      }
    }
    return DEMO_USERS[0]; // Default to Alex Chen
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('campusflow_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('campusflow_user');
    }
  }, [currentUser]);

  const switchDemoUser = (userId) => {
    const found = DEMO_USERS.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  const loginUser = (email, password) => {
    // Simulated authentication
    const existing = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      setCurrentUser(existing);
    } else {
      const newUser = {
        id: 'user_' + Date.now(),
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email: email,
        university: 'State University',
        major: 'Computer Science',
        semester: 'Fall 2026',
        gpaTarget: '3.80',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
        preferredStudyHoursPerDay: 4,
        preferredStudyPace: 'Balanced'
      };
      setCurrentUser(newUser);
    }
  };

  const registerUser = (userData) => {
    const newUser = {
      id: 'user_' + Date.now(),
      name: userData.name || 'New Student',
      email: userData.email,
      university: userData.university || 'University Student',
      major: userData.major || 'General Studies',
      semester: userData.semester || 'Fall 2026',
      gpaTarget: userData.gpaTarget || '3.80',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      preferredStudyHoursPerDay: userData.preferredStudyHoursPerDay || 4,
      preferredStudyPace: userData.preferredStudyPace || 'Balanced'
    };
    setCurrentUser(newUser);
  };

  const updateProfile = (updatedFields) => {
    setCurrentUser(prev => ({ ...prev, ...updatedFields }));
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        switchDemoUser,
        loginUser,
        registerUser,
        updateProfile,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        demoUsers: DEMO_USERS
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
