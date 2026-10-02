import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { ToastContainer } from './components/ToastContainer';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './pages/DashboardView';
import { TasksView } from './pages/TasksView';
import { PlannerView } from './pages/PlannerView';
import { CoursesView } from './pages/CoursesView';
import { AnalyticsView } from './pages/AnalyticsView';
import { ProfileView } from './pages/ProfileView';

import { TaskModal } from './components/TaskModal';
import { CourseModal } from './components/CourseModal';
import { StudyPlannerModal } from './components/StudyPlannerModal';
import { AuthModal } from './components/AuthModal';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);

  const [isPlannerModalOpen, setIsPlannerModalOpen] = useState(false);

  const { isAuthModalOpen, setIsAuthModalOpen } = useAuth();

  const handleOpenTaskModal = (task = null) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  const handleOpenCourseModal = (course = null) => {
    setCourseToEdit(course);
    setIsCourseModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans gradient-bg-main selection:bg-indigo-500 selection:text-white">
      {/* Toast notifications */}
      <ToastContainer />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTaskModal={() => handleOpenTaskModal()}
        onOpenPlannerModal={() => setIsPlannerModalOpen(true)}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      {/* Main Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex items-start">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Dynamic View Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {activeTab === 'dashboard' && (
            <DashboardView
              setActiveTab={setActiveTab}
              onOpenTaskModal={() => handleOpenTaskModal()}
              onOpenPlannerModal={() => setIsPlannerModalOpen(true)}
              onEditTask={(task) => handleOpenTaskModal(task)}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksView
              onOpenTaskModal={() => handleOpenTaskModal()}
              onEditTask={(task) => handleOpenTaskModal(task)}
            />
          )}

          {activeTab === 'planner' && (
            <PlannerView
              onOpenPlannerModal={() => setIsPlannerModalOpen(true)}
            />
          )}

          {activeTab === 'courses' && (
            <CoursesView
              onOpenCourseModal={() => handleOpenCourseModal()}
              onEditCourse={(course) => handleOpenCourseModal(course)}
            />
          )}

          {activeTab === 'analytics' && <AnalyticsView />}

          {activeTab === 'profile' && (
            <ProfileView onOpenAuthModal={() => setIsAuthModalOpen(true)} />
          )}
        </main>
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        taskToEdit={taskToEdit}
      />

      <CourseModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        courseToEdit={courseToEdit}
      />

      <StudyPlannerModal
        isOpen={isPlannerModalOpen}
        onClose={() => setIsPlannerModalOpen(false)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <AppContent />
      </TaskProvider>
    </AuthProvider>
  );
}
