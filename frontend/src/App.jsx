import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignIn from './signin.jsx';
import Verificacion from './verificacion.jsx';
import Index from './index.jsx'; 

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/verificacion" element={<Verificacion />} />
      <Route path="/index" element={<Index />} />
    </Routes>
  );
}
