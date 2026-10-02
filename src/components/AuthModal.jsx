import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, UserCheck, ShieldCheck, Sparkles, GraduationCap } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose }) => {
  const { currentUser, switchDemoUser, loginUser, registerUser, demoUsers } = useAuth();
  const [tab, setTab] = useState('demo'); // 'demo', 'login', 'register'

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUni, setRegUni] = useState('');
  const [regMajor, setRegMajor] = useState('');
  const [regGpa, setRegGpa] = useState('3.90');

  if (!isOpen) return null;

  const handleDemoSelect = (userId) => {
    switchDemoUser(userId);
    onClose();
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    loginUser(email, password);
    onClose();
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regEmail || !regName) return;
    registerUser({
      name: regName,
      email: regEmail,
      university: regUni || 'State University',
      major: regMajor || 'Computer Science',
      gpaTarget: regGpa
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md glass-panel rounded-2xl border border-slate-800 shadow-2xl p-6 my-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-slate-100">Student Account</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-3 gap-1 my-4 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setTab('demo')}
            className={`py-2 rounded-lg transition-all ${
              tab === 'demo' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Demo Accounts
          </button>
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`py-2 rounded-lg transition-all ${
              tab === 'login' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`py-2 rounded-lg transition-all ${
              tab === 'register' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Register
          </button>
        </div>

        {tab === 'demo' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400 leading-relaxed">
              Instant test logins for hackathon evaluation. Select a student profile to test personalized data:
            </p>
            {demoUsers.map(u => {
              const isSelected = currentUser?.id === u.id;
              return (
                <div
                  key={u.id}
                  onClick={() => handleDemoSelect(u.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-600/15 ring-1 ring-indigo-500'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/40"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        {u.name}
                        {isSelected && <UserCheck className="w-3.5 h-3.5 text-indigo-400" />}
                      </h4>
                      <p className="text-[10px] text-slate-400">{u.major} • {u.university}</p>
                      <p className="text-[10px] text-indigo-300 font-medium mt-0.5">Target GPA: {u.gpaTarget}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-indigo-400">Select →</span>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Student Email
              </label>
              <input
                type="email"
                required
                placeholder="alex.chen@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
            >
              Sign In to CampusFlow
            </button>
          </form>
        )}

        {tab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Maya Lin"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                University Email
              </label>
              <input
                type="email"
                required
                placeholder="maya.lin@mit.edu"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  University / College
                </label>
                <input
                  type="text"
                  placeholder="MIT"
                  value={regUni}
                  onChange={(e) => setRegUni(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Major
                </label>
                <input
                  type="text"
                  placeholder="Bioengineering"
                  value={regMajor}
                  onChange={(e) => setRegMajor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 mt-2"
            >
              Create Account & Start Planning
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
