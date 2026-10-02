import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { INITIAL_COURSES, INITIAL_TASKS, INITIAL_STUDY_SESSIONS } from '../data/initialData';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  // Load tasks from LocalStorage or initial data
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('campusflow_tasks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_TASKS;
  });

  // Load courses
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('campusflow_courses');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_COURSES;
  });

  // Load study sessions
  const [studySessions, setStudySessions] = useState(() => {
    const saved = localStorage.getItem('campusflow_sessions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_STUDY_SESSIONS;
  });

  // Toast Notifications
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('campusflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('campusflow_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('campusflow_sessions', JSON.stringify(studySessions));
  }, [studySessions]);

  // Task Actions
  const addTask = (taskData) => {
    const newTask = {
      id: 'task_' + Date.now(),
      title: taskData.title,
      courseId: taskData.courseId || courses[0]?.id || '',
      category: taskData.category || 'Assignment',
      priority: taskData.priority || 'Medium',
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      estimatedHours: Number(taskData.estimatedHours) || 2,
      completed: false,
      notes: taskData.notes || '',
      subtasks: taskData.subtasks || []
    };
    setTasks(prev => [newTask, ...prev]);
    addToast(`Task "${newTask.title}" created successfully!`, 'success');
  };

  const updateTask = (id, updatedFields) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, ...updatedFields } : task));
    addToast('Task updated successfully.', 'info');
  };

  const deleteTask = (id) => {
    const taskToDelete = tasks.find(t => t.id === id);
    setTasks(prev => prev.filter(t => t.id !== id));
    setStudySessions(prev => prev.filter(s => s.taskId !== id));
    if (taskToDelete) {
      addToast(`Deleted task: "${taskToDelete.title}"`, 'warning');
    }
  };

  const toggleTaskComplete = (id) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const nextState = !task.completed;
        if (nextState) {
          // Trigger confetti!
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.7 }
          });
          addToast(`🎉 Completed "${task.title}"! Great job!`, 'success');
        }
        return { ...task, completed: nextState };
      }
      return task;
    }));
  };

  const toggleSubtask = (taskId, subtaskId) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedSubtasks = task.subtasks.map(st => 
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        return { ...task, subtasks: updatedSubtasks };
      }
      return task;
    }));
  };

  // Course Actions
  const addCourse = (courseData) => {
    const newCourse = {
      id: 'course_' + Date.now(),
      code: courseData.code,
      name: courseData.name,
      instructor: courseData.instructor || 'TBD',
      color: courseData.color || 'indigo',
      room: courseData.room || 'TBD',
      credits: Number(courseData.credits) || 3,
      gradeTarget: courseData.gradeTarget || 'A'
    };
    setCourses(prev => [...prev, newCourse]);
    addToast(`Course ${newCourse.code} added!`, 'success');
  };

  const updateCourse = (id, updatedFields) => {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
    addToast('Course updated.', 'info');
  };

  const deleteCourse = (id) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    addToast('Course deleted.', 'warning');
  };

  // Study Sessions Actions
  const addStudySession = (sessionData) => {
    const newSession = {
      id: 'session_' + Date.now(),
      title: sessionData.title,
      taskId: sessionData.taskId || '',
      courseId: sessionData.courseId || '',
      durationMinutes: Number(sessionData.durationMinutes) || 60,
      startTime: sessionData.startTime || '14:00',
      endTime: sessionData.endTime || '15:00',
      date: sessionData.date || new Date().toISOString().split('T')[0],
      technique: sessionData.technique || 'Pomodoro (25/5)',
      notes: sessionData.notes || '',
      completed: false
    };
    setStudySessions(prev => [newSession, ...prev]);
    addToast('Study session scheduled!', 'success');
  };

  const toggleStudySessionComplete = (id) => {
    setStudySessions(prev => prev.map(s => {
      if (s.id === id) {
        const nextState = !s.completed;
        if (nextState) {
          confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
          addToast('🧠 Study Session completed! Knowledge unlocked.', 'success');
        }
        return { ...s, completed: nextState };
      }
      return s;
    }));
  };

  const deleteStudySession = (id) => {
    setStudySessions(prev => prev.filter(s => s.id !== id));
    addToast('Study session removed.', 'info');
  };

  // Smart AI Study Planner Generator
  const generateSmartStudyPlan = (options = {}) => {
    const pace = options.pace || 'Balanced'; // Balanced, Intensive, Sprint
    const maxHoursPerDay = Number(options.hoursPerDay) || 4;
    const targetDate = options.targetDate || new Date().toISOString().split('T')[0];

    // Filter pending tasks
    const pendingTasks = tasks.filter(t => !t.completed);
    if (pendingTasks.length === 0) {
      addToast('No pending tasks to generate study plan for! All caught up!', 'info');
      return;
    }

    // Sort tasks by priority & due date urgency
    const sortedTasks = [...pendingTasks].sort((a, b) => {
      const priorityWeight = { 'High': 3, 'Medium': 2, 'Low': 1 };
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      
      // Urgent / overdue comes first
      if (dateA !== dateB) return dateA - dateB;
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    });

    const newGeneratedSessions = [];
    let startHour = 14; // Default starting at 2:00 PM (14:00)
    let totalMinutesAllocated = 0;
    const maxMinutes = maxHoursPerDay * 60;

    const techniquesMap = {
      'Assignment': 'Active Recall & Problem Breakdown',
      'Practical': 'Hands-on Lab Simulation & Error Log Review',
      'Exam Prep': 'Feynman Technique (Teach Concept Out Loud)',
      'Project': 'Modular Sprint Coding / Writing',
      'Quiz': 'Spaced Repetition & Flashcard Drill',
      'Reading': 'SQ3R (Survey, Question, Read, Recite, Review)'
    };

    sortedTasks.forEach((task, idx) => {
      if (totalMinutesAllocated >= maxMinutes) return;

      const duration = pace === 'Sprint' ? 30 : pace === 'Intensive' ? 60 : 45;
      if (totalMinutesAllocated + duration > maxMinutes + 15) return;

      const startHStr = String(Math.floor(startHour)).padStart(2, '0');
      const startMStr = Math.floor(startHour) !== startHour ? '30' : '00';
      const startTimeStr = `${startHStr}:${startMStr}`;

      const endHour = startHour + (duration / 60);
      const endHStr = String(Math.floor(endHour)).padStart(2, '0');
      const endMStr = Math.floor(endHour) !== endHour ? '30' : '00';
      const endTimeStr = `${endHStr}:${endMStr}`;

      const sessionTitle = `Smart Session: ${task.title}`;
      const courseObj = courses.find(c => c.id === task.courseId);
      const technique = techniquesMap[task.category] || 'Pomodoro (25/5)';

      newGeneratedSessions.push({
        id: 'session_gen_' + Date.now() + '_' + idx,
        title: sessionTitle,
        taskId: task.id,
        courseId: task.courseId,
        durationMinutes: duration,
        startTime: startTimeStr,
        endTime: endTimeStr,
        date: targetDate,
        technique: technique,
        notes: `AI Generated for ${courseObj ? courseObj.code : 'Course'}. Focus on high-yield subtasks.`,
        completed: false
      });

      startHour = endHour + 0.25; // 15 min break between sessions
      totalMinutesAllocated += duration;
    });

    setStudySessions(prev => [...newGeneratedSessions, ...prev]);
    addToast(`🤖 Smart AI Planner generated ${newGeneratedSessions.length} personalized study sessions!`, 'success');
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        courses,
        studySessions,
        toasts,
        addToast,
        removeToast,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        toggleSubtask,
        addCourse,
        updateCourse,
        deleteCourse,
        addStudySession,
        toggleStudySessionComplete,
        deleteStudySession,
        generateSmartStudyPlan
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTask must be used within TaskProvider');
  return context;
};
