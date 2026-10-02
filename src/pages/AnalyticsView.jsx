import React from 'react';
import { useTask } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { BarChart3, TrendingUp, Flame, Award, CheckCircle2, Clock, Zap } from 'lucide-react';

export const AnalyticsView = () => {
  const { tasks, courses, studySessions } = useTask();
  const { currentUser } = useAuth();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const overallCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalSessionsCompleted = studySessions.filter(s => s.completed).length;

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-400" />
          <span>Productivity & Analytics Hub</span>
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Track your academic momentum, study session consistency, and subject distribution.
        </p>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Overall Completion Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-emerald-400">{overallCompletionRate}%</h2>
          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${overallCompletionRate}%` }}
            />
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Active Study Streak</span>
            <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
          </div>
          <h2 className="text-3xl font-extrabold text-amber-400">3 Days 🔥</h2>
          <p className="text-[11px] text-slate-400">Consistent daily study sessions recorded</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Smart Sessions Completed</span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-purple-400">{totalSessionsCompleted} Sessions</h2>
          <p className="text-[11px] text-slate-400">High-focus study blocks finished</p>
        </div>
      </div>

      {/* Course Workload Breakdown Bars */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Award className="w-4 h-4 text-indigo-400" />
          <span>Course Task Distribution & Progress</span>
        </h3>

        <div className="space-y-4 pt-2">
          {courses.map(c => {
            const courseTasks = tasks.filter(t => t.courseId === c.id);
            const done = courseTasks.filter(t => t.completed).length;
            const pct = courseTasks.length > 0 ? Math.round((done / courseTasks.length) * 100) : 0;

            return (
              <div key={c.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-200">{c.code}: {c.name}</span>
                  <span className="text-indigo-400">{done}/{courseTasks.length} Done ({pct}%)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-violet-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements & Badges */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-slate-100">Academic Badges</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: 'Early Bird Submitter', desc: 'Finished 3 assignments before deadline.', icon: '⚡' },
            { title: 'Lab Master', desc: 'Completed Physics & CS practical reports.', icon: '🔬' },
            { title: 'Planner Pro', desc: 'Generated 5 AI smart study schedules.', icon: '🤖' }
          ].map((b, i) => (
            <div key={i} className="glass-card p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
              <span className="text-2xl">{b.icon}</span>
              <div>
                <h4 className="text-xs font-bold text-slate-200">{b.title}</h4>
                <p className="text-[10px] text-slate-400">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
