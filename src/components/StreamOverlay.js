import React, { useState, useEffect, useCallback } from 'react';
import { useSocket } from '../hooks/useSocket';
import './StreamOverlay.css';

const StreamOverlay = () => {
  const [questionTimer, setQuestionTimer] = useState(0);
  const [showQuestion, setShowQuestion] = useState(true);
  
  const {
    isConnected,
    gameState,
    selectAnswer
  } = useSocket();

  // Timer para mostrar la pregunta
  useEffect(() => {
    if (showQuestion && gameState.isActive) {
      const interval = setInterval(() => {
        setQuestionTimer(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [showQuestion, gameState.isActive]);

  // Reset timer cuando cambia la pregunta
  useEffect(() => {
    setQuestionTimer(0);
  }, [gameState.currentQuestionIndex]);

  const handleAnswerSelect = useCallback((answerIndex) => {
    if (gameState.isActive) {
      selectAnswer(answerIndex);
    }
  }, [gameState.isActive, selectAnswer]);

  // Exponer funciones globalmente para control externo (mantener compatibilidad)
  useEffect(() => {
    window.streamOverlay = {
      nextQuestion: () => {}, // Ahora se maneja por WebSocket
      previousQuestion: () => {}, // Ahora se maneja por WebSocket
      setQuestionIndex: () => {}, // Ahora se maneja por WebSocket
      toggleQuestion: () => setShowQuestion(prev => !prev),
      getCurrentQuestion: () => gameState.questions[gameState.currentQuestionIndex] || null,
      getQuestionCount: () => gameState.questions.length,
      showAnswer: () => {}, // Ahora se maneja por WebSocket
      hideAnswer: () => {}, // Ahora se maneja por WebSocket
      resetQuestion: () => {}, // Ahora se maneja por WebSocket
      selectAnswer: handleAnswerSelect
    };
  }, [gameState, handleAnswerSelect]);

  // Si no hay juego activo, mostrar mensaje de espera
  if (!gameState.isActive) {
    return (
      <div className="stream-overlay">
        <div className="waiting-message">
          <h1>🎮 Trivia Los 8 Escalones</h1>
          <p>Esperando inicio de partida...</p>
          <p>Estado de conexión: {isConnected ? '✅ Conectado' : '❌ Desconectado'}</p>
        </div>
      </div>
    );
  }

  if (!showQuestion) {
    return null;
  }

  const currentQuestion = gameState.questions[gameState.currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <div className="stream-overlay">
        <div className="error-message">
          <h1>❌ Error</h1>
          <p>No se encontró la pregunta actual</p>
        </div>
      </div>
    );
  }

  const getOptionClass = (optionIndex) => {
    if (!gameState.showAnswer) {
      return gameState.selectedAnswer === optionIndex ? 'selected' : '';
    }

    if (optionIndex === currentQuestion.correctAnswer) {
      return 'correct';
    } else if (gameState.selectedAnswer === optionIndex && optionIndex !== currentQuestion.correctAnswer) {
      return 'incorrect';
    }
    return '';
  };

  return (
    <div className="stream-overlay">
      {/* Área central con pregunta */}
      <div className="question-area">
        {/* Barra de progreso dentro del question-area */}
        <div className="progress-bar">
          <div className="progress-circles">
            {gameState.questions.map((_, index) => (
              <div 
                key={index} 
                className={`progress-circle ${
                  index < gameState.currentQuestionIndex 
                    ? 'completed' 
                    : index === gameState.currentQuestionIndex 
                      ? 'current' 
                      : 'pending'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>

        <div className="question-box">
          <h2 className="question-text">
            {currentQuestion.question}
          </h2>
        </div>
        
        {/* Opciones de respuesta */}
        <div className="options-container">
          <div className="options-grid">
            {currentQuestion.options.map((option, index) => (
              <div 
                key={index} 
                className={`option-box ${getOptionClass(index)}`}
                onClick={() => handleAnswerSelect(index)}
              >
                <div className="option-letter">
                  {String.fromCharCode(65 + index)}
                </div>
                <div className="option-text">
                  {option}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="overlay-info">
        <div className="question-number">
          PREGUNTA {gameState.currentQuestionIndex + 1} DE {gameState.questions.length}
        </div>
        <div className="question-timer">
          {Math.floor(questionTimer / 60)}:{(questionTimer % 60).toString().padStart(2, '0')}
        </div>
      </div>
    </div>
  );
};

export default StreamOverlay; 