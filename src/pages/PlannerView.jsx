import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle2,
  Trash2,
  Plus,
  Zap,
  Flame,
  BrainCircuit,
  Award
} from 'lucide-react';

export const PlannerView = ({ onOpenPlannerModal }) => {
  const { studySessions, courses, tasks, toggleStudySessionComplete, deleteStudySession } = useTask();
  const { currentUser } = useAuth();

  const [selectedDateFilter, setSelectedDateFilter] = useState('all');

  const todayStr = new Date().toISOString().split('T')[0];

  // Group study sessions by Date
  const groupedSessions = studySessions.reduce((acc, session) => {
    const d = session.date || todayStr;
    if (!acc[d]) acc[d] = [];
    acc[d].push(session);
    return acc;
  }, {});

  const dateKeys = Object.keys(groupedSessions).sort();

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel border border-indigo-500/30 p-6 md:p-8 bg-gradient-to-r from-slate-900 via-indigo-950/80 to-purple-950/60">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider">
              <BrainCircuit className="w-4 h-4 text-indigo-400" />
              <span>Smart Study Engine</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Personalized <span className="gradient-text">Study Planner</span>
            </h1>
            <p className="text-slate-300 text-xs md:text-sm max-w-xl leading-relaxed">
              CampusFlow converts your upcoming academic deadlines, lab practicals, and exams into actionable, high-impact study sessions.
            </p>
          </div>

          <button
            onClick={onOpenPlannerModal}
            className="flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 shrink-0"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Generate Smart Schedule</span>
          </button>
        </div>
      </div>

      {/* Study Techniques Quick Reference */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { title: 'Pomodoro (25/5)', desc: '25m intense focus followed by 5m recovery break.', color: 'indigo' },
          { title: 'Active Recall', desc: 'Self-quizzing without looking at source materials.', color: 'emerald' },
          { title: 'Feynman Method', desc: 'Explain complex concepts out loud in simple terms.', color: 'purple' },
          { title: 'Spaced Repetition', desc: 'Review flashcard concepts at expanding intervals.', color: 'amber' }
        ].map((tech, idx) => (
          <div key={idx} className="glass-card p-3.5 rounded-2xl border border-slate-800 space-y-1">
            <h4 className="text-xs font-bold text-slate-200">{tech.title}</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">{tech.desc}</p>
          </div>
        ))}
      </div>

      {/* Scheduled Study Timeline */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <span>Scheduled Study Sessions</span>
          </h2>
          <button
            onClick={onOpenPlannerModal}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Session</span>
          </button>
        </div>

        {dateKeys.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 space-y-3">
            <Sparkles className="w-10 h-10 text-indigo-400 mx-auto animate-pulse" />
            <h3 className="text-sm font-bold text-slate-300">No study sessions currently scheduled</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click below to let the AI Planner convert your pending tasks into structured sessions.
            </p>
            <button
              onClick={onOpenPlannerModal}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow-md"
            >
              Generate AI Schedule Now
            </button>
          </div>
        ) : (
          dateKeys.map(dateKey => {
            const sessionsForDate = groupedSessions[dateKey];
            const isToday = dateKey === todayStr;

            return (
              <div key={dateKey} className="space-y-3">
                {/* Date Heading */}
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-xl text-xs font-bold ${
                    isToday
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {isToday ? 'Today' : dateKey}
                  </span>
                  <span className="text-xs text-slate-500">
                    ({sessionsForDate.length} {sessionsForDate.length === 1 ? 'session' : 'sessions'})
                  </span>
                </div>

                {/* Grid of Sessions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sessionsForDate.map(session => {
                    const courseObj = courses.find(c => c.id === session.courseId);
                    const linkedTask = tasks.find(t => t.id === session.taskId);

                    return (
                      <div
                        key={session.id}
                        className={`glass-card glass-card-hover p-4 rounded-2xl border transition-all space-y-3 ${
                          session.completed
                            ? 'border-slate-800/60 bg-slate-950/40 opacity-75'
                            : 'border-slate-800 hover:border-indigo-500/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={session.completed}
                              onChange={() => toggleStudySessionComplete(session.id)}
                              className="custom-checkbox mt-1 shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-2 flex-wrap mb-1">
                                {courseObj && (
                                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                                    {courseObj.code}
                                  </span>
                                )}
                                <span className="px-2 py-0.5 text-[10px] font-medium rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                                  {session.technique}
                                </span>
                              </div>
                              <h4 className={`text-sm font-bold ${session.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                                {session.title}
                              </h4>
                            </div>
                          </div>

                          <button
                            onClick={() => deleteStudySession(session.id)}
                            className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Details Footer */}
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{session.startTime} - {session.endTime} ({session.durationMinutes}m)</span>
                          </div>
                          {linkedTask && (
                            <span className="text-[10px] text-slate-400 font-medium truncate max-w-[140px]">
                              Task: {linkedTask.title}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
