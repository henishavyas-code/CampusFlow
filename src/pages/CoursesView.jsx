import React from 'react';
import { useTask } from '../context/TaskContext';
import { BookOpen, Plus, User, MapPin, Award, Trash2, Edit, CheckSquare } from 'lucide-react';

export const CoursesView = ({ onOpenCourseModal, onEditCourse }) => {
  const { courses, tasks, deleteCourse } = useTask();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-400" />
            <span>Course Subjects & Syllabus Hub</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Track your enrolled courses, target grades, instructor contact, and active workload.
          </p>
        </div>

        <button
          onClick={onOpenCourseModal}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Add Course</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map(course => {
          const courseTasks = tasks.filter(t => t.courseId === course.id);
          const pendingCount = courseTasks.filter(t => !t.completed).length;
          const completedCount = courseTasks.filter(t => t.completed).length;
          const progressPercent = courseTasks.length > 0 ? Math.round((completedCount / courseTasks.length) * 100) : 0;

          return (
            <div
              key={course.id}
              className="glass-card glass-card-hover p-6 rounded-2xl border border-slate-800 space-y-4 relative overflow-hidden"
            >
              {/* Top Row */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 text-xs font-extrabold rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {course.code}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-800 text-slate-400">
                      {course.credits} Credits
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {course.name}
                  </h3>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditCourse(course)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-300 hover:bg-slate-800 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteCourse(course.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Course Meta Info */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <User className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">{course.instructor}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">{course.room}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 col-span-2">
                  <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Target Grade Goal: <strong className="text-amber-300">{course.gradeTarget}</strong></span>
                </div>
              </div>

              {/* Workload Progress */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-400">Academic Completion Progress</span>
                  <span className="text-indigo-400">{progressPercent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                  <span>{pendingCount} pending work items</span>
                  <span>{completedCount} completed</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
