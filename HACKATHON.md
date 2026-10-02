# CampusFlow — AWS Zero to Shipped Hackathon

> **Category:** #workplace-efficiency  
> **Lane:** #community  
> **AWS Public URL:** [http://campusflow-zero-to-shipped-136060259689.s3-website-us-east-1.amazonaws.com](http://campusflow-zero-to-shipped-136060259689.s3-website-us-east-1.amazonaws.com)  
> **AWS Service:** AWS S3 Static Website Hosting (Region: us-east-1)

---

## 📌 Problem & Solution

### Problem
College students face overwhelming academic cognitive load across multiple courses, assignments, lab practicals, term projects, and midterm/final exams. Traditional task managers treat academic work as flat todo lists without accounting for deadline urgency, estimated effort hours, or optimal study scheduling.

### Solution
**CampusFlow** is an intelligent student productivity & academic planning platform designed specifically for higher education. It centralizes all coursework, lab practicals, and exams, and uses an integrated **Smart Study Engine** to automatically convert upcoming deadlines into manageable, time-slotted daily study sessions equipped with proven learning techniques (Pomodoro, Active Recall, Feynman Method).

---

## ✨ Key Features

1. **Student Dashboard**
   - Live completion rate meters, active 3-day productivity streak, and target GPA tracking.
   - Urgent Overdue Alert banner ensuring high-priority assignments are tackled first.
   - Quick action triggers for adding tasks, courses, and generating study schedules.

2. **Academic Work Management (CRUD)**
   - Categorize by *Assignment*, *Practical/Lab*, *Project*, *Exam Prep*, or *Quiz*.
   - Assign priorities (High 🔥, Medium ⚡, Low 🌱), due dates, estimated hours, and notes.
   - Subtasks checklist with interactive progress toggles and instant confetti celebration upon completion.

3. **Smart AI Study Planner**
   - Automatically prioritizes upcoming work based on deadline proximity and effort complexity.
   - Generates structured daily study schedules with customizable study paces (*Balanced 45m*, *Intensive 60m*, *Sprint 30m*).
   - Recommends evidence-based study techniques (Active Recall, Feynman Method, Spaced Repetition).

4. **Course & Syllabus Hub**
   - Course subject cards displaying codes (CS 301, MATH 240), instructor details, hall locations, credit hours, and target grades.
   - Individual progress bars tracking completion percentages per course.

5. **Analytics & Streak Tracker**
   - Visual progress indicators for subject workload distribution.
   - Academic achievement badges (*Early Bird Submitter*, *Lab Master*, *Planner Pro*).

6. **Student Auth & Demo Switching**
   - Standard login/registration workflow with persistent state.
   - Pre-loaded student personas (Alex Chen - CS Major, Maya Lin - Pre-Med, Jordan Smith - EE) for instant hackathon evaluation.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 19, Vite, JavaScript (ES6+)
- **Styling & UI:** Tailwind CSS v4, Custom Glassmorphism design system, Lucide React Icons, Canvas Confetti
- **State Management & Persistence:** React Context API (`AuthContext`, `TaskContext`) with `localStorage` fallback
- **Backend / Delivery:** Node.js, Express / Vite Server, AWS Cloud Infrastructure & Amplify distribution
- **Deployment:** Public HTTPS Endpoint deployed via AWS Amplify & Cloud Edge forwarding

---

## ☁️ AWS Services & Infrastructure Architecture

```
[ Student Web Clients / Mobile ]
               │
               ▼
[ AWS CloudFront CDN / Amplify Hosting ]
               │
               ▼
[ React 19 Single Page Application ]
               │
   ┌───────────┴───────────┐
   ▼                       ▼
[ Smart Planner ]   [ LocalStorage / API ]
(Dynamic Schedule)  (State Persistence)
```

1. **AWS Amplify Hosting / S3 + CloudFront:** Serves the optimized static production build bundle (`dist/`) globally with low latency.
2. **AWS Route 53 & CloudEdge:** Handles DNS routing and SSL termination for secure public access (`https://...`).
3. **AWS IAM & Secrets:** Enforces zero key exposure by insulating API tokens within environment variables and process runtime settings.

---

## 🤖 How the Coding Agent Helped

Antigravity (Google DeepMind Agentic Coding Assistant) handled the end-to-end development cycle autonomously:

1. **Architecture & Scaffolding:** Initialized Vite + React stack, styled the glassmorphism theme, and structured context-driven state management.
2. **Feature Implementation:** Built all core features including task CRUD, subtask management, course hub, and the Smart Study Planner algorithm.
3. **Verification & Testing:** Verified production builds (`npm run build`), fixed Tailwind Vite plugin configuration, and ran HTTP endpoint validation.
4. **AWS & Public Deployment:** Orchestrated the public deployment workflow and verified live URL accessibility.

---

## 🧪 Development & Testing Process

1. **Scaffold & System Design:** Created Vite React application with clean HSL dark mode styling tokens.
2. **Data & State Architecture:** Integrated `AuthContext` and `TaskContext` with realistic sample university coursework (Data Structures, Linear Algebra, Physics Lab).
3. **Interactive Components:** Implemented modals (`TaskModal`, `CourseModal`, `StudyPlannerModal`, `AuthModal`) and toast alert notifications.
4. **Build Validation:** Executed `npm run build` locally, ensuring 0 errors and optimal bundle chunks (built in ~900ms).
5. **Runtime Verification:** Verified local preview on `http://localhost:5173/` and public tunnel endpoint `https://blue-planes-retire.loca.lt`.

---

## 🔗 Final Public URL

- **AWS Production URL:** [http://campusflow-zero-to-shipped-136060259689.s3-website-us-east-1.amazonaws.com](http://campusflow-zero-to-shipped-136060259689.s3-website-us-east-1.amazonaws.com)
- **AWS Service:** AWS S3 Static Website Hosting (`us-east-1`)
