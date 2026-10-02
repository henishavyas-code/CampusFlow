import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import {
  Search,
  Filter,
  Plus,
  CheckSquare,
  Clock,
  Trash2,
  Edit,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Tag,
  BookOpen
} from 'lucide-react';

export const TasksView = ({ onOpenTaskModal, onEditTask }) => {
  const { tasks, courses, toggleTaskComplete, toggleSubtask, deleteTask } = useTask();

  const [activeTab, setActiveTab] = useState('all'); // 'all', 'pending', 'completed', 'overdue', 'today'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedTasks, setExpandedTasks] = useState({});

  const todayStr = new Date().toISOString().split('T')[0];

  const toggleExpand = (id) => {
    setExpandedTasks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filtering Logic
  const filteredTasks = tasks.filter(task => {
    // Tab filter
    if (activeTab === 'pending' && task.completed) return false;
    if (activeTab === 'completed' && !task.completed) return false;
    if (activeTab === 'overdue' && (task.completed || task.dueDate >= todayStr)) return false;
    if (activeTab === 'today' && (task.completed || task.dueDate !== todayStr)) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchNotes = task.notes && task.notes.toLowerCase().includes(q);
      if (!matchTitle && !matchNotes) return false;
    }

    // Course filter
    if (selectedCourse !== 'all' && task.courseId !== selectedCourse) return false;

    // Priority filter
    if (selectedPriority !== 'all' && task.priority !== selectedPriority) return false;

    // Category filter
    if (selectedCategory !== 'all' && task.category !== selectedCategory) return false;

    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-indigo-400" />
            <span>Academic Tasks & Deadlines</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Manage your assignments, practicals, exams, and projects efficiently.
          </p>
        </div>

        <button
          onClick={onOpenTaskModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Create Task</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Tasks', count: tasks.length },
              { id: 'pending', label: 'Pending', count: tasks.filter(t => !t.completed).length },
              { id: 'overdue', label: 'Overdue', count: tasks.filter(t => !t.completed && t.dueDate < todayStr).length, alert: true },
              { id: 'today', label: 'Due Today', count: tasks.filter(t => !t.completed && t.dueDate === todayStr).length },
              { id: 'completed', label: 'Completed', count: tasks.filter(t => t.completed).length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : tab.alert && tab.count > 0
                    ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 text-[10px] rounded-full font-bold ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Sub-Filters: Course, Priority, Category */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800/80">
          <div>
            <label className="block text-[10px] font-semibold text-slate-400 mb-1">Filter by Course</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Courses</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.code} - {c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 mb-1">Filter by Priority</label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Priorities</option>
              <option value="High">🔥 High Priority</option>
              <option value="Medium">⚡ Medium Priority</option>
              <option value="Low">🌱 Low Priority</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-400 mb-1">Filter by Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Categories</option>
              <option value="Assignment">Assignment</option>
              <option value="Practical">Practical / Lab</option>
              <option value="Project">Project</option>
              <option value="Exam Prep">Exam Prep</option>
              <option value="Quiz">Quiz</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl border border-slate-800 space-y-3">
            <CheckSquare className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-slate-300">No tasks found matching your filters</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search query or tab selection to view academic work.
            </p>
            <button
              onClick={onOpenTaskModal}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white"
            >
              + Create New Task
            </button>
          </div>
        ) : (
          filteredTasks.map(task => {
            const courseObj = courses.find(c => c.id === task.courseId);
            const isOverdue = !task.completed && task.dueDate < todayStr;
            const isToday = !task.completed && task.dueDate === todayStr;
            const isExpanded = expandedTasks[task.id];

            const completedSubCount = task.subtasks ? task.subtasks.filter(st => st.completed).length : 0;
            const totalSubCount = task.subtasks ? task.subtasks.length : 0;

            return (
              <div
                key={task.id}
                className={`glass-card glass-card-hover p-4 sm:p-5 rounded-2xl border transition-all ${
                  task.completed
                    ? 'border-slate-800/60 bg-slate-950/40 opacity-75'
                    : isOverdue
                    ? 'border-rose-500/30 bg-rose-950/10'
                    : 'border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left Checkbox & Main Info */}
                  <div className="flex items-start gap-3.5 min-w-0">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskComplete(task.id)}
                      className="custom-checkbox mt-1 shrink-0"
                    />

                    <div className="min-w-0 space-y-1">
                      {/* Badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {courseObj && (
                          <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                            {courseObj.code}
                          </span>
                        )}
                        <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-slate-800 text-slate-300">
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

                      {/* Title */}
                      <h3
                        onClick={() => onEditTask(task)}
                        className={`text-sm sm:text-base font-bold cursor-pointer transition-colors ${
                          task.completed
                            ? 'line-through text-slate-400'
                            : 'text-slate-100 hover:text-indigo-300'
                        }`}
                      >
                        {task.title}
                      </h3>

                      {/* Notes snippet */}
                      {task.notes && (
                        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {task.notes}
                        </p>
                      )}

                      {/* Subtasks Progress Bar */}
                      {totalSubCount > 0 && (
                        <div className="pt-2">
                          <button
                            onClick={() => toggleExpand(task.id)}
                            className="flex items-center gap-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                          >
                            <span>Subtasks ({completedSubCount}/{totalSubCount})</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>

                          {/* Expanded subtask list */}
                          {isExpanded && (
                            <div className="mt-2 space-y-1.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                              {task.subtasks.map(st => (
                                <div key={st.id} className="flex items-center gap-2 text-xs text-slate-300">
                                  <input
                                    type="checkbox"
                                    checked={st.completed}
                                    onChange={() => toggleSubtask(task.id, st.id)}
                                    className="custom-checkbox w-3.5 h-3.5"
                                  />
                                  <span className={st.completed ? 'line-through text-slate-500' : ''}>
                                    {st.text}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Actions & Due Date */}
                  <div className="flex flex-col items-end gap-3 shrink-0">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-xl ${
                        task.completed
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : isOverdue
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : isToday
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-900 text-slate-300 border border-slate-800'
                      }`}
                    >
                      {task.completed
                        ? 'Done'
                        : isOverdue
                        ? 'Overdue'
                        : isToday
                        ? 'Due Today'
                        : task.dueDate}
                    </span>

                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-xs font-medium">{task.estimatedHours} hrs</span>
                    </div>

                    {/* Edit & Delete Controls */}
                    <div className="flex items-center gap-1 pt-1">
                      <button
                        onClick={() => onEditTask(task)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors"
                        title="Edit Task"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
