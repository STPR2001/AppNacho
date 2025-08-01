import React from 'react';
import TriviaGame from './components/TriviaGame';
import StreamPage from './pages/StreamPage';
import StreamOverlayPage from './pages/StreamOverlayPage';
import ParticleBackground from './components/ParticleBackground';
import './App.css';

function App() {
  // Detectar si estamos en modo overlay (URL contiene /stream)
  const isStreamMode = window.location.pathname.includes('/stream');
  const isOverlayOnly = window.location.pathname.includes('/overlay');

  if (isOverlayOnly) {
    return <StreamOverlayPage />;
  }

  if (isStreamMode) {
    return <StreamPage />;
  }

  return (
    <div className="App">
      <ParticleBackground />
      <TriviaGame />
    </div>
  );
}

export default App; 