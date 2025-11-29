import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/loginJS/Login';
import Register from './components/loginJS/Register';
import FuncionarioList from './components/FuncionarioJS/FuncionarioList';
import FuncionarioForm from './components/FuncionarioJS/FuncionarioForm';
import TestConnection from './components/TestConnection';
import './App.css';

// Componente de rota protegida
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/test" element={<TestConnection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/funcionarios"
          element={
            <ProtectedRoute>
              <FuncionarioList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/funcionarios/novo"
          element={
            <ProtectedRoute>
              <FuncionarioForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/funcionarios/editar/:id"
          element={
            <ProtectedRoute>
              <FuncionarioForm />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
