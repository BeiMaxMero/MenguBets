// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {Login} from './pages/auth/Login.jsx';
import {Dashboard} from './pages/dashboard/index.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;