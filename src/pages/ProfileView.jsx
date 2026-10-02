import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';
import { User, GraduationCap, Award, BookOpen, Clock, Save, UserCheck, LogOut } from 'lucide-react';

export const ProfileView = ({ onOpenAuthModal }) => {
  const { currentUser, updateProfile, switchDemoUser, demoUsers, logout } = useAuth();
  const { addToast } = useTask();

  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [semester, setSemester] = useState('');
  const [gpaTarget, setGpaTarget] = useState('3.90');
  const [hours, setHours] = useState(4);
  const [pace, setPace] = useState('Balanced');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setUniversity(currentUser.university || '');
      setMajor(currentUser.major || '');
      setSemester(currentUser.semester || '');
      setGpaTarget(currentUser.gpaTarget || '3.90');
      setHours(currentUser.preferredStudyHoursPerDay || 4);
      setPace(currentUser.preferredStudyPace || 'Balanced');
    }
  }, [currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      name,
      university,
      major,
      semester,
      gpaTarget,
      preferredStudyHoursPerDay: Number(hours),
      preferredStudyPace: pace
    });
    addToast('Profile preferences updated successfully!', 'success');
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-indigo-400" />
          <span>Student Profile & Preferences</span>
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Customize your academic goal settings and study schedule preferences.
        </p>
      </div>

      {/* Switch Demo Account Quick Banner */}
      <div className="glass-panel p-4 rounded-2xl border border-indigo-500/20 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-indigo-400" />
            <span>Switch Student Persona (Hackathon Demo)</span>
          </h3>
          <button
            onClick={onOpenAuthModal}
            className="text-xs font-semibold text-indigo-400 hover:underline"
          >
            All Accounts →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {demoUsers.map(u => {
            const active = currentUser?.id === u.id;
            return (
              <button
                key={u.id}
                onClick={() => switchDemoUser(u.id)}
                className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  active
                    ? 'border-indigo-500 bg-indigo-600/20 ring-1 ring-indigo-500'
                    : 'border-slate-800 bg-slate-900/60 hover:bg-slate-900'
                }`}
              >
                <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-200 truncate">{u.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{u.major}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
        <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3">
          Academic Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">University / College</label>
            <input
              type="text"
              required
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Major / Degree Program</label>
            <input
              type="text"
              required
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Target GPA</label>
            <input
              type="text"
              value={gpaTarget}
              onChange={(e) => setGpaTarget(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <h3 className="text-sm font-bold text-slate-100 border-b border-slate-800 pb-3 pt-2">
          Study Planner Preferences
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Daily Available Study Hours ({hours} hrs)</label>
            <input
              type="range"
              min="1"
              max="8"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Study Pace</label>
            <select
              value={pace}
              onChange={(e) => setPace(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="Balanced">Balanced (45 min sessions)</option>
              <option value="Intensive">Intensive (60 min sessions)</option>
              <option value="Sprint">Sprint (30 min sessions)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={logout}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20 hover:bg-rose-500/20 flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
