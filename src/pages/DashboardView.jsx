import React from 'react';
import { useTask } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import {
  CheckSquare,
  Clock,
  Sparkles,
  AlertCircle,
  TrendingUp,
  BookOpen,
  Calendar,
  CheckCircle2,
  Plus,
  ArrowRight,
  Flame,
  Target
} from 'lucide-react';

export const DashboardView = ({ setActiveTab, onOpenTaskModal, onOpenPlannerModal, onEditTask }) => {
  const { tasks, courses, studySessions, toggleTaskComplete, toggleStudySessionComplete } = useTask();
  const { currentUser } = useAuth();

  const todayStr = new Date().toISOString().split('T')[0];

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const overdueTasks = pendingTasks.filter(t => t.dueDate < todayStr);
  const dueTodayTasks = pendingTasks.filter(t => t.dueDate === todayStr);

  const totalEstHours = pendingTasks.reduce((sum, t) => sum + (Number(t.estimatedHours) || 0), 0);
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  // Filter study sessions for today
  const todaySessions = studySessions.filter(s => s.date === todayStr);

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl glass-panel border border-indigo-500/20 p-6 md:p-8 bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-purple-950/50">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>3-Day Study Streak • {currentUser?.university}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="gradient-text">{currentUser?.name || 'Student'}</span> 👋
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-xl leading-relaxed">
              You have <span className="text-indigo-300 font-semibold">{pendingTasks.length} pending academic tasks</span> ({totalEstHours} hrs estimated work) across {courses.length} courses.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenPlannerModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Study Planner</span>
            </button>
            <button
              onClick={onOpenTaskModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition-all"
            >
              <Plus className="w-4 h-4 text-indigo-400" />
              <span>+ Add Task</span>
            </button>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Overdue Alert Banner if present */}
      {overdueTasks.length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-rose-300">
                Action Needed: {overdueTasks.length} Overdue {overdueTasks.length === 1 ? 'Assignment' : 'Assignments'}
              </h4>
              <p className="text-[11px] text-rose-200/80">
                "{overdueTasks[0].title}" was due on {overdueTasks[0].dueDate}. Tackle it first to protect your grade!
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('tasks')}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white shrink-0 transition-colors"
          >
            Review Now
          </button>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="glass-card glass-card-hover p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Pending Work</p>
            <h3 className="text-2xl font-extrabold text-slate-100 mt-1">{pendingTasks.length}</h3>
            <p className="text-[10px] text-indigo-400 mt-0.5">{dueTodayTasks.length} due today</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="glass-card glass-card-hover p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Completion Rate</p>
            <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">{completionRate}%</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">{completedTasks.length} tasks finished</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="glass-card glass-card-hover p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Est. Effort</p>
            <h3 className="text-2xl font-extrabold text-purple-400 mt-1">{totalEstHours} <span className="text-sm font-normal text-slate-400">hrs</span></h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Across remaining tasks</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4 */}
        <div className="glass-card glass-card-hover p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Target GPA</p>
            <h3 className="text-2xl font-extrabold text-amber-400 mt-1">{currentUser?.gpaTarget || '3.90'}</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">{courses.length} active courses</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Target className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Urgent Tasks & Smart Study Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Academic Priority Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-indigo-400" />
              <span>Upcoming Academic Work</span>
            </h3>
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View All ({tasks.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {pendingTasks.slice(0, 4).map(task => {
              const courseObj = courses.find(c => c.id === task.courseId);
              const isOverdue = task.dueDate < todayStr;
              const isToday = task.dueDate === todayStr;

              return (
                <div
                  key={task.id}
                  className="glass-card glass-card-hover p-4 rounded-2xl border border-slate-800/80 flex items-start justify-between gap-4 group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskComplete(task.id)}
                      className="custom-checkbox mt-1"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {courseObj && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                            {courseObj.code}
                          </span>
                        )}
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-slate-800 text-slate-300">
                          {task.category}
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${
                            task.priority === 'High'
                              ? 'badge-urgent'
                              : task.priority === 'Medium'
                              ? 'badge-high'
                              : 'badge-low'
                          }`}
                        >
                          {task.priority} Priority
                        </span>
                      </div>

                      <h4
                        onClick={() => onEditTask(task)}
                        className="text-xs sm:text-sm font-bold text-slate-100 hover:text-indigo-300 cursor-pointer truncate"
                      >
                        {task.title}
                      </h4>

                      {task.notes && (
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                          {task.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex flex-col items-end gap-1">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                        isOverdue
                          ? 'bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30'
                          : isToday
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                          : 'text-slate-400 bg-slate-900 border border-slate-800'
                      }`}
                    >
                      {isOverdue ? 'Overdue' : isToday ? 'Due Today' : task.dueDate}
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {task.estimatedHours} hrs
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Today's Smart Study Plan */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>Today's Study Plan</span>
            </h3>
            <button
              onClick={() => setActiveTab('planner')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Planner →
            </button>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-3">
            {todaySessions.length === 0 ? (
              <div className="text-center py-6 px-2 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="text-xs font-bold text-slate-200">No sessions scheduled today</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Let the Smart AI Study Planner structure your day automatically!
                </p>
                <button
                  onClick={onOpenPlannerModal}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 w-full"
                >
                  Generate Today's Plan
                </button>
              </div>
            ) : (
              todaySessions.map(session => {
                const courseObj = courses.find(c => c.id === session.courseId);
                return (
                  <div
                    key={session.id}
                    className={`p-3 rounded-xl border transition-all ${
                      session.completed
                        ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                        : 'bg-slate-900 border-slate-800 hover:border-indigo-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={session.completed}
                          onChange={() => toggleStudySessionComplete(session.id)}
                          className="custom-checkbox"
                        />
                        <div>
                          <h4 className={`text-xs font-bold ${session.completed ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                            {session.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                            <span>{session.startTime} - {session.endTime}</span>
                            <span>•</span>
                            <span className="text-indigo-400">{session.technique}</span>
                          </div>
                        </div>
                      </div>
                      {courseObj && (
                        <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shrink-0">
                          {courseObj.code}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Tip Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900/30 to-purple-900/20 border border-indigo-500/20 text-xs space-y-1">
            <h4 className="font-bold text-indigo-300 flex items-center gap-1.5">
              <span>💡 Academic Efficiency Tip</span>
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Use the <span className="text-indigo-200 font-semibold">Active Recall</span> technique for lab practicals to boost long-term memory retention by 40%.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
