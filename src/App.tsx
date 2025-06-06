import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TaskProvider } from './context/TaskContext';
import { TaskList } from './pages/TaskList';
import { TaskDetail } from './pages/TaskDetail';
import { ToastContainer } from './components/ui/Toast';

function App() {
  return (
    <Router>
      <TaskProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<TaskList />} />
            <Route path="/tasks/:id" element={<TaskDetail />} />
            <Route path="*" element={<Navigate to="/\" replace />} />
          </Routes>
          <ToastContainer />
        </div>
      </TaskProvider>
    </Router>
  );
}

export default App;