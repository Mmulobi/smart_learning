import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, createRoutesFromElements, Route } from 'react-router-dom';
import App from './App';
import './index.css';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { TutorDashboard } from './components/dashboard/TutorDashboard';
import { StudentAuth } from './components/auth/StudentAuth';
import { TutorAuth } from './components/auth/TutorAuth';
import { CombinedAuth } from './components/auth/CombinedAuth';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="dashboard">
        <Route path="student" element={<StudentDashboard />} />
        <Route path="tutor" element={<TutorDashboard />} />
      </Route>
      <Route path="auth">
        <Route index element={<CombinedAuth />} />
        <Route path="student" element={<StudentAuth />} />
        <Route path="tutor" element={<TutorAuth />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
