export const DEMO_USERS = [
  {
    id: 'user_alex',
    name: 'Alex Chen',
    email: 'alex.chen@university.edu',
    university: 'Stanford University',
    major: 'Computer Science',
    semester: 'Fall 2026 (Junior)',
    gpaTarget: '3.90',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    preferredStudyHoursPerDay: 4,
    preferredStudyPace: 'Balanced'
  },
  {
    id: 'user_maya',
    name: 'Maya Lin',
    email: 'maya.lin@university.edu',
    university: 'MIT',
    major: 'Bioengineering & Pre-Med',
    semester: 'Fall 2026 (Senior)',
    gpaTarget: '3.95',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
    preferredStudyHoursPerDay: 5,
    preferredStudyPace: 'Intensive'
  },
  {
    id: 'user_jordan',
    name: 'Jordan Smith',
    email: 'jordan.s@university.edu',
    university: 'UC Berkeley',
    major: 'Electrical Engineering',
    semester: 'Fall 2026 (Sophomore)',
    gpaTarget: '3.75',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    preferredStudyHoursPerDay: 3,
    preferredStudyPace: 'Sprint'
  }
];

export const INITIAL_COURSES = [
  {
    id: 'course_cs301',
    code: 'CS 301',
    name: 'Data Structures & Algorithms',
    instructor: 'Prof. Marcus Vance',
    color: 'indigo',
    room: 'Gates Building Rm 104',
    credits: 4,
    gradeTarget: 'A'
  },
  {
    id: 'course_math240',
    code: 'MATH 240',
    name: 'Linear Algebra & Differential Eqs',
    instructor: 'Dr. Elena Rostova',
    color: 'emerald',
    room: 'Science Quad Hall B',
    credits: 3,
    gradeTarget: 'A-'
  },
  {
    id: 'course_phys150',
    code: 'PHYS 150',
    name: 'University Physics II Lab',
    instructor: 'Prof. David Huang',
    color: 'amber',
    room: 'Physics Lab 3B',
    credits: 4,
    gradeTarget: 'A'
  },
  {
    id: 'course_eng102',
    code: 'ENG 102',
    name: 'Technical Writing & Communication',
    instructor: 'Dr. Sarah Jenkins',
    color: 'rose',
    room: 'Humanities 201',
    credits: 3,
    gradeTarget: 'A+'
  }
];

// Calculate relative dates so sample data stays fresh relative to today
const getRelativeDate = (daysOffset) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
};

export const INITIAL_TASKS = [
  {
    id: 'task_1',
    title: 'B-Tree & Red-Black Tree Implementation',
    courseId: 'course_cs301',
    category: 'Assignment',
    priority: 'High',
    dueDate: getRelativeDate(-1), // Overdue by 1 day
    estimatedHours: 4,
    completed: false,
    notes: 'Implement insertion, deletion, and balancing algorithms in C++. Include unit tests for edge cases.',
    subtasks: [
      { id: 'sub_1', text: 'Define Node structure & rotation logic', completed: true },
      { id: 'sub_2', text: 'Implement insertion fixup algorithm', completed: false },
      { id: 'sub_3', text: 'Write automated benchmark tests', completed: false }
    ]
  },
  {
    id: 'task_2',
    title: 'Physics Lab #4: Electromagnetic Induction Report',
    courseId: 'course_phys150',
    category: 'Practical',
    priority: 'High',
    dueDate: getRelativeDate(0), // Due Today
    estimatedHours: 3,
    completed: false,
    notes: 'Analyze Oscilloscope voltage wave logs and compute Faraday law error percentages.',
    subtasks: [
      { id: 'sub_4', text: 'Plot frequency response curves in Matplotlib', completed: true },
      { id: 'sub_5', text: 'Draft discussion and error source section', completed: false }
    ]
  },
  {
    id: 'task_3',
    title: 'Midterm Exam Prep: Eigenvalues & Vector Spaces',
    courseId: 'course_math240',
    category: 'Exam Prep',
    priority: 'High',
    dueDate: getRelativeDate(2), // Due in 2 days
    estimatedHours: 5,
    completed: false,
    notes: 'Review Chapters 4 & 5. Solve practice set 8-B problems 1 through 15.',
    subtasks: [
      { id: 'sub_6', text: 'Review Diagonalization theorems', completed: true },
      { id: 'sub_7', text: 'Solve past midterm 2024 problem set', completed: false }
    ]
  },
  {
    id: 'task_4',
    title: 'Technical White Paper: Cloud Architecture Efficiency',
    courseId: 'course_eng102',
    category: 'Project',
    priority: 'Medium',
    dueDate: getRelativeDate(5),
    estimatedHours: 6,
    completed: false,
    notes: 'Draft a 5-page IEEE format proposal on serverless microservices for student portals.',
    subtasks: [
      { id: 'sub_8', text: 'Outline architecture diagram', completed: true },
      { id: 'sub_9', text: 'Draft Abstract and Methodology', completed: true },
      { id: 'sub_10', text: 'Gather citations & IEEE reference formatting', completed: false }
    ]
  },
  {
    id: 'task_5',
    title: 'Dynamic Programming Practice (LeetCode 75)',
    courseId: 'course_cs301',
    category: 'Quiz',
    priority: 'Medium',
    dueDate: getRelativeDate(4),
    estimatedHours: 2,
    completed: true,
    notes: 'Focus on memoization vs tabular DP approaches.',
    subtasks: [
      { id: 'sub_11', text: 'Solve Coin Change & Longest Common Subsequence', completed: true }
    ]
  },
  {
    id: 'task_6',
    title: 'Matrix Transformations & Gram-Schmidt Lab',
    courseId: 'course_math240',
    category: 'Practical',
    priority: 'Low',
    dueDate: getRelativeDate(7),
    estimatedHours: 2,
    completed: false,
    notes: 'Complete MATLAB script submission on canvas portal.',
    subtasks: []
  }
];

export const INITIAL_STUDY_SESSIONS = [
  {
    id: 'session_1',
    title: 'Data Structures: Red-Black Tree Balancing Focus',
    taskId: 'task_1',
    courseId: 'course_cs301',
    durationMinutes: 90,
    startTime: '16:00',
    endTime: '17:30',
    date: getRelativeDate(0),
    technique: 'Pomodoro (25/5)',
    notes: 'Break down node rotations step-by-step on white board before coding.',
    completed: false
  },
  {
    id: 'session_2',
    title: 'Physics Lab #4 Error Analysis & Graphing',
    taskId: 'task_2',
    courseId: 'course_phys150',
    durationMinutes: 60,
    startTime: '19:00',
    endTime: '20:00',
    date: getRelativeDate(0),
    technique: 'Active Recall',
    notes: 'Calculate standard deviation for B-field coil measurements.',
    completed: false
  },
  {
    id: 'session_3',
    title: 'Linear Algebra: Eigenvalue Problem Set Review',
    taskId: 'task_3',
    courseId: 'course_math240',
    durationMinutes: 120,
    startTime: '10:00',
    endTime: '12:00',
    date: getRelativeDate(1),
    technique: 'Feynman Technique',
    notes: 'Explain Gram-Schmidt orthogonalization out loud to verify comprehension.',
    completed: false
  }
];
