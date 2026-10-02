import React, { useState, useEffect } from 'react';
import { useTask } from '../context/TaskContext';
import { X } from 'lucide-react';

export const CourseModal = ({ isOpen, onClose, courseToEdit = null }) => {
  const { addCourse, updateCourse } = useTask();

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    instructor: '',
    color: 'indigo',
    room: '',
    credits: 3,
    gradeTarget: 'A'
  });

  useEffect(() => {
    if (courseToEdit) {
      setFormData({
        code: courseToEdit.code || '',
        name: courseToEdit.name || '',
        instructor: courseToEdit.instructor || '',
        color: courseToEdit.color || 'indigo',
        room: courseToEdit.room || '',
        credits: courseToEdit.credits || 3,
        gradeTarget: courseToEdit.gradeTarget || 'A'
      });
    } else {
      setFormData({
        code: '',
        name: '',
        instructor: '',
        color: 'indigo',
        room: '',
        credits: 3,
        gradeTarget: 'A'
      });
    }
  }, [courseToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code.trim() || !formData.name.trim()) return;

    if (courseToEdit) {
      updateCourse(courseToEdit.id, formData);
    } else {
      addCourse(formData);
    }
    onClose();
  };

  const colors = [
    { id: 'indigo', label: 'Indigo', bg: 'bg-indigo-500' },
    { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-500' },
    { id: 'amber', label: 'Amber', bg: 'bg-amber-500' },
    { id: 'rose', label: 'Rose', bg: 'bg-rose-500' },
    { id: 'purple', label: 'Purple', bg: 'bg-purple-500' },
    { id: 'cyan', label: 'Cyan', bg: 'bg-cyan-500' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md glass-panel rounded-2xl border border-slate-800 shadow-2xl p-6 my-8 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-slate-100">
            {courseToEdit ? 'Edit Course Details' : 'Add New Course'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Course Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. CS 301"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Course Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Data Structures & Algorithms"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Instructor
              </label>
              <input
                type="text"
                placeholder="Prof. Marcus Vance"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Room / Hall
              </label>
              <input
                type="text"
                placeholder="Gates Bldg Rm 104"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Credits
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Grade
              </label>
              <select
                value={formData.gradeTarget}
                onChange={(e) => setFormData({ ...formData, gradeTarget: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Badge Theme Color
            </label>
            <div className="flex items-center gap-3">
              {colors.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: c.id })}
                  className={`w-7 h-7 rounded-full ${c.bg} transition-all ${
                    formData.color === c.id ? 'ring-4 ring-white/30 scale-110' : 'opacity-60 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
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
              {courseToEdit ? 'Save Changes' : 'Add Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
