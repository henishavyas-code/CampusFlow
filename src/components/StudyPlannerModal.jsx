import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Calendar, Clock, BookOpen, X, Cpu, Zap, Check } from 'lucide-react';

export const StudyPlannerModal = ({ isOpen, onClose }) => {
  const { tasks, courses, addStudySession, generateSmartStudyPlan } = useTask();
  const { currentUser } = useAuth();

  const [mode, setMode] = useState('ai'); // 'ai' or 'manual'

  // AI Generator state
  const [aiHours, setAiHours] = useState(currentUser?.preferredStudyHoursPerDay || 4);
  const [aiPace, setAiPace] = useState(currentUser?.preferredStudyPace || 'Balanced');
  const [aiDate, setAiDate] = useState(new Date().toISOString().split('T')[0]);

  // Manual Session state
  const [manualTitle, setManualTitle] = useState('');
  const [manualTaskId, setManualTaskId] = useState('');
  const [manualCourseId, setManualCourseId] = useState('');
  const [manualDuration, setManualDuration] = useState(60);
  const [manualStartTime, setManualStartTime] = useState('16:00');
  const [manualEndTime, setManualEndTime] = useState('17:00');
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
  const [manualTechnique, setManualTechnique] = useState('Pomodoro (25/5)');

  if (!isOpen) return null;

  const handleGenerateAI = (e) => {
    e.preventDefault();
    generateSmartStudyPlan({
      hoursPerDay: aiHours,
      pace: aiPace,
      targetDate: aiDate
    });
    onClose();
  };

  const handleCreateManual = (e) => {
    e.preventDefault();
    if (!manualTitle.trim()) return;

    addStudySession({
      title: manualTitle,
      taskId: manualTaskId,
      courseId: manualCourseId || courses[0]?.id,
      durationMinutes: manualDuration,
      startTime: manualStartTime,
      endTime: manualEndTime,
      date: manualDate,
      technique: manualTechnique
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-indigo-500/30 shadow-2xl p-6 my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Smart Study Planner</h3>
              <p className="text-[11px] text-slate-400">Convert upcoming academic work into focused study sessions</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 gap-2 my-4 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <button
            type="button"
            onClick={() => setMode('ai')}
            className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              mode === 'ai'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4 text-indigo-300" />
            <span>AI Auto-Generate</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('manual')}
            className={`py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              mode === 'manual'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Manual Session</span>
          </button>
        </div>

        {mode === 'ai' ? (
          <form onSubmit={handleGenerateAI} className="space-y-4">
            <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200 leading-relaxed">
              🤖 <span className="font-semibold text-indigo-300">Smart Algorithm:</span> Analyzes your pending assignments, practicals, and exams by priority & deadline proximity to build an optimized timetable.
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Study Date
              </label>
              <input
                type="date"
                required
                value={aiDate}
                onChange={(e) => setAiDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Max Daily Available Hours ({aiHours} hrs)
              </label>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={aiHours}
                onChange={(e) => setAiHours(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>1 hr</span>
                <span>4 hrs</span>
                <span>8 hrs</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Study Pace & Interval Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Balanced', label: 'Balanced', desc: '45m sessions' },
                  { id: 'Intensive', label: 'Intensive', desc: '60m sessions' },
                  { id: 'Sprint', label: 'Sprint', desc: '30m bursts' }
                ].map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setAiPace(p.id)}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      aiPace === p.id
                        ? 'border-indigo-500 bg-indigo-600/20 text-white'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{p.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>Generate Smart Schedule</span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCreateManual} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Session Focus / Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Data Structures B-Tree Code Review"
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Link to Task (Optional)
                </label>
                <select
                  value={manualTaskId}
                  onChange={(e) => {
                    const tid = e.target.value;
                    setManualTaskId(tid);
                    const selected = tasks.find(t => t.id === tid);
                    if (selected) {
                      setManualCourseId(selected.courseId);
                      setManualTitle(`Study: ${selected.title}`);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- No specific task --</option>
                  {tasks.filter(t => !t.completed).map(t => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Course / Subject
                </label>
                <select
                  value={manualCourseId}
                  onChange={(e) => setManualCourseId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={manualDate}
                  onChange={(e) => setManualDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={manualStartTime}
                  onChange={(e) => setManualStartTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={manualEndTime}
                  onChange={(e) => setManualEndTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Study Method / Technique
              </label>
              <select
                value={manualTechnique}
                onChange={(e) => setManualTechnique(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="Pomodoro (25/5)">Pomodoro (25m Focus / 5m Break)</option>
                <option value="Active Recall">Active Recall & Self-Quizzing</option>
                <option value="Feynman Technique">Feynman Technique (Explain Concept Out Loud)</option>
                <option value="Spaced Repetition">Spaced Repetition & Flashcards</option>
                <option value="Deep Work Sprint">90-minute Deep Work Sprint</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
              >
                Schedule Session
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
