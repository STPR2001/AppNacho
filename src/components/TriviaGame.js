import React, { useState, useEffect } from 'react';
import { questions as defaultQuestions } from '../data/questions';
import QuestionManager from './QuestionManager';
import './TriviaGame.css';

const TriviaGame = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showQuestionManager, setShowQuestionManager] = useState(false);
  const [questions, setQuestions] = useState(defaultQuestions);

  // Cargar progreso desde localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('triviaProgress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setCurrentQuestionIndex(progress.currentQuestionIndex);
      setScore(progress.score);
      setGameCompleted(progress.gameCompleted);
    }
  }, []);

  // Guardar progreso en localStorage
  useEffect(() => {
    const progress = {
      currentQuestionIndex,
      score,
      gameCompleted
    };
    localStorage.setItem('triviaProgress', JSON.stringify(progress));
  }, [currentQuestionIndex, score, gameCompleted]);

  // Efectos de sonido (simulados con vibración en móviles)
  const playCorrectSound = () => {
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
  };

  const playIncorrectSound = () => {
    if (navigator.vibrate) {
      navigator.vibrate([200, 100, 200, 100, 200]);
    }
  };

  const playGameCompleteSound = () => {
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 100, 50, 100]);
    }
  };

  const handleQuestionsUpdate = (newQuestions) => {
    if (newQuestions.length > 0) {
      setQuestions(newQuestions);
    } else {
      setQuestions(defaultQuestions);
    }
    // Resetear el juego cuando se actualizan las preguntas
    setCurrentQuestionIndex(0);
    setScore(0);
    setGameCompleted(false);
    setSelectedAnswer(null);
    setShowResult(false);
    setAnswered(false);
    setShowConfetti(false);
  };

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answerIndex) => {
    if (answered) return; // Evitar múltiples selecciones

    setSelectedAnswer(answerIndex);
    setAnswered(true);

    // Verificar si la respuesta es correcta
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
      playCorrectSound();
    } else {
      playIncorrectSound();
    }

    // Mostrar resultado
    setShowResult(true);

    // Avanzar a la siguiente pregunta después de 2 segundos
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setAnswered(false);
      } else {
        setGameCompleted(true);
        playGameCompleteSound();
        if (score + (isCorrect ? 1 : 0) === questions.length) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3000);
        }
      }
    }, 2000);
  };

  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setGameCompleted(false);
    setAnswered(false);
    setShowConfetti(false);
    localStorage.removeItem('triviaProgress');
  };

  const getOptionClass = (optionIndex) => {
    if (!showResult) {
      return selectedAnswer === optionIndex ? 'selected' : '';
    }

    if (optionIndex === currentQuestion.correctAnswer) {
      return 'correct';
    } else if (selectedAnswer === optionIndex && optionIndex !== currentQuestion.correctAnswer) {
      return 'incorrect';
    }
    return '';
  };

  if (showQuestionManager) {
    return (
      <QuestionManager 
        onQuestionsUpdate={handleQuestionsUpdate}
        onClose={() => setShowQuestionManager(false)}
      />
    );
  }

  if (gameCompleted) {
    return (
      <div className="trivia-container">
        {showConfetti && (
          <div className="confetti-container">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${Math.random() * 3 + 2}s`,
                  backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#48bb78'][Math.floor(Math.random() * 5)]
                }}
              />
            ))}
          </div>
        )}
        <div className="game-completed">
          <h1>¡Juego Completado!</h1>
          <div className="final-score">
            <h2>Puntuación Final</h2>
            <p className="score">{score} de {questions.length}</p>
            <p className="percentage">
              {Math.round((score / questions.length) * 100)}%
            </p>
          </div>
          <div className="score-message">
            {score === questions.length && <p>🎉 ¡Perfecto! ¡Dominas Los 8 Escalones! 🎉</p>}
            {score >= questions.length * 0.8 && score < questions.length && <p>🌟 ¡Excelente! Casi perfecto. 🌟</p>}
            {score >= questions.length * 0.6 && score < questions.length * 0.8 && <p>👍 ¡Muy bien! Buen conocimiento. 👍</p>}
            {score < questions.length * 0.6 && <p>📚 ¡Sigue estudiando! Puedes mejorar. 📚</p>}
          </div>
          <div className="game-actions">
            <button className="reset-button" onClick={resetGame}>
              🎮 Jugar de Nuevo
            </button>
            <button className="manager-button" onClick={() => setShowQuestionManager(true)}>
              ⚙️ Gestionar Preguntas
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="trivia-container">
      <div className="header">
        <h1>Los 8 Escalones</h1>
        <div className="progress">
          <span>Pregunta {currentQuestionIndex + 1} de {questions.length}</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="header-actions">
          <div className="score-display">
            🏆 Puntuación: {score}
          </div>
          <button className="manager-toggle" onClick={() => setShowQuestionManager(true)}>
            ⚙️
          </button>
        </div>
      </div>

      <div className="question-container">
        <h2 className="question">{currentQuestion.question}</h2>
        
        <div className="options">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`option ${getOptionClass(index)}`}
              onClick={() => handleAnswerSelect(index)}
              disabled={answered}
            >
              {option}
            </button>
          ))}
        </div>

        {showResult && (
          <div className="result">
            <div className={`result-message ${selectedAnswer === currentQuestion.correctAnswer ? 'correct' : 'incorrect'}`}>
              {selectedAnswer === currentQuestion.correctAnswer ? '✅ ¡Correcto!' : '❌ ¡Incorrecto!'}
            </div>
            <div className="explanation">
              <p>{currentQuestion.explanation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TriviaGame; 