// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Landing from './components/Landing';
import './App.css';
import ArtGallery from './components/ArtGallery';
import Profile from './components/Profile';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing  />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/gallery" element={<ArtGallery />} />
        <Route path="/profile" element={<Profile />} />

        {/* <Route path="/ArtGallery" element={<ArtGallery />} /> */}
      </Routes>
    </Router>
  );
};

export default App;