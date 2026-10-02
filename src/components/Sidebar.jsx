import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTask } from '../context/TaskContext';
import {
  LayoutDashboard,
  CheckSquare,
  Sparkles,
  BookOpen,
  BarChart3,
  User,
  AlertTriangle,
  Award,
  BookMarked
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { currentUser } = useAuth();
  const { tasks } = useTask();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks & Deadlines', icon: CheckSquare, badge: tasks.filter(t => !t.completed).length },
    { id: 'planner', label: 'Smart Study Planner', icon: Sparkles, highlight: true },
    { id: 'courses', label: 'Courses & Hub', icon: BookOpen },
    { id: 'analytics', label: 'Analytics & Streak', icon: BarChart3 },
    { id: 'profile', label: 'Profile & Settings', icon: User }
  ];

  // Calculate overdue count
  const todayStr = new Date().toISOString().split('T')[0];
  const overdueCount = tasks.filter(t => !t.completed && t.dueDate < todayStr).length;

  const handleNavClick = (tabId) => {
    setActiveTab(tabId);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  return (
    <aside
      className={`fixed md:sticky top-16 z-30 h-[calc(100vh-4rem)] w-64 glass-panel border-r border-slate-800/80 bg-slate-950/90 transition-all duration-300 ${
        isMobileMenuOpen ? 'left-0' : '-left-64 md:left-0'
      } flex flex-col justify-between p-4 overflow-y-auto shrink-0`}
    >
      <div className="space-y-6">
        {/* Navigation Menu */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Main Menu
          </p>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/30'
                    : item.highlight
                    ? 'text-indigo-300 hover:bg-indigo-950/40 hover:text-white border border-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-indigo-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Warning Banner if Overdue */}
        {overdueCount > 0 && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex flex-col gap-2">
            <div className="flex items-center gap-2 font-semibold text-rose-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{overdueCount} Overdue {overdueCount === 1 ? 'Task' : 'Tasks'}</span>
            </div>
            <p className="text-[11px] text-rose-200/80 leading-relaxed">
              Action required to maintain your academic momentum!
            </p>
            <button
              onClick={() => handleNavClick('tasks')}
              className="text-[11px] font-bold text-rose-300 hover:underline text-left mt-1"
            >
              View Overdue Tasks →
            </button>
          </div>
        )}
      </div>

      {/* Student Profile Card in Sidebar Footer */}
      {currentUser && (
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-semibold text-slate-200 truncate">
                {currentUser.name}
              </h4>
              <p className="text-[10px] text-slate-400 truncate">
                {currentUser.major}
              </p>
              <div className="flex items-center gap-1 mt-1 text-[10px] text-indigo-400 font-medium">
                <Award className="w-3 h-3" />
                <span>Target GPA: {currentUser.gpaTarget}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
