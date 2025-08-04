import React, { useState, useEffect } from "react";
import { useSocket } from "../hooks/useSocket";
import { questions as defaultQuestions } from "../data/questions";
import "./StreamController.css";

const StreamController = () => {
  const [questions, setQuestions] = useState(defaultQuestions);
  const [gameStarted, setGameStarted] = useState(false);
  const [overlayWindow, setOverlayWindow] = useState(null);
  const [showQuestionManager, setShowQuestionManager] = useState(false);

  const {
    isConnected,
    gameState,
    startGame,
    endGame,
    nextQuestion,
    previousQuestion,
    setQuestion,
    selectAnswer,
    showAnswer,
    hideAnswer,
    resetQuestion,
    showOverlay,
    hideOverlay,
  } = useSocket();

  useEffect(() => {
    // Cargar preguntas personalizadas si existen
    const savedQuestions = localStorage.getItem("customQuestions");
    if (savedQuestions) {
      const parsedQuestions = JSON.parse(savedQuestions);
      if (parsedQuestions.length > 0) {
        setQuestions(parsedQuestions);
      }
    }
  }, []);

  // Función para abrir el overlay en una nueva pestaña
  const openOverlay = () => {
    const overlay = window.open(
      "/overlay",
      "overlay",
      "width=1920,height=1080,scrollbars=no,resizable=yes"
    );
    setOverlayWindow(overlay);

    // Verificar si la ventana se abrió correctamente
    if (overlay) {
      console.log("Overlay abierto en nueva pestaña");
    } else {
      window.alert(
        "Por favor, permite las ventanas emergentes para esta página"
      );
    }
  };

  // Función para cerrar el overlay
  const closeOverlay = () => {
    if (overlayWindow && !overlayWindow.closed) {
      overlayWindow.close();
      setOverlayWindow(null);
    }
  };

  // Función para iniciar partida
  const handleStartGame = () => {
    if (questions.length > 0) {
      startGame(questions);
      setGameStarted(true);
      openOverlay();
    } else {
      window.alert(
        "No hay preguntas disponibles. Agrega algunas preguntas primero."
      );
    }
  };

  // Función para finalizar partida
  const handleEndGame = () => {
    endGame();
    setGameStarted(false);
    closeOverlay();
  };

  // Función para actualizar preguntas
  const handleQuestionsUpdate = (newQuestions) => {
    if (newQuestions.length > 0) {
      setQuestions(newQuestions);
      localStorage.setItem("customQuestions", JSON.stringify(newQuestions));
    } else {
      setQuestions(defaultQuestions);
      localStorage.removeItem("customQuestions");
    }
  };

  // Exponer funciones globalmente para control desde consola
  useEffect(() => {
    window.streamController = {
      startGame: handleStartGame,
      endGame: handleEndGame,
      nextQuestion,
      previousQuestion,
      setQuestion,
      selectAnswer,
      showAnswer,
      hideAnswer,
      resetQuestion,
      showOverlay,
      hideOverlay,
      openOverlay,
      closeOverlay,
      getCurrentQuestion: () =>
        gameState.questions[gameState.currentQuestionIndex] || null,
      getQuestionCount: () => gameState.questions.length,
      getGameState: () => gameState,
      toggleQuestionManager: () => setShowQuestionManager((prev) => !prev),
    };

    console.log(`
🎮 STREAM CONTROLLER - WebSocket Edition
========================================

Comandos disponibles:
• streamController.startGame() - Iniciar partida y abrir overlay
• streamController.endGame() - Finalizar partida
• streamController.nextQuestion() - Siguiente pregunta
• streamController.previousQuestion() - Pregunta anterior
• streamController.setQuestion(index) - Ir a pregunta específica
• streamController.selectAnswer(index) - Seleccionar respuesta (0-3)
• streamController.showAnswer() - Mostrar respuesta correcta
• streamController.hideAnswer() - Ocultar respuesta
• streamController.resetQuestion() - Reiniciar pregunta
• streamController.openOverlay() - Abrir overlay en nueva pestaña
• streamController.closeOverlay() - Cerrar overlay
• streamController.getCurrentQuestion() - Obtener pregunta actual
• streamController.getQuestionCount() - Obtener total de preguntas
• streamController.getGameState() - Obtener estado completo del juego
• streamController.toggleQuestionManager() - Abrir/cerrar gestor de preguntas

Estado de conexión: ${isConnected ? "✅ Conectado" : "❌ Desconectado"}
Partida activa: ${gameState.isActive ? "✅ Sí" : "❌ No"}
Pregunta actual: ${gameState.currentQuestionIndex + 1} de ${
      gameState.questions.length
    }
    `);

    return () => {
      delete window.streamController;
    };
  }, [
    isConnected,
    gameState,
    nextQuestion,
    previousQuestion,
    setQuestion,
    selectAnswer,
    showAnswer,
    hideAnswer,
    resetQuestion,
    showOverlay,
    hideOverlay,
  ]);

  return (
    <div className="stream-controller">
      <div className="controller-panel">
        <h2>🎮 Juego de preguntas y respuestas - TekkoGT</h2>
        <p>Controla el juego en tiempo real desde aquí</p>

        {/* Estado de conexión */}
        <div className="connection-status">
          <p>Estado: {isConnected ? "✅ Conectado" : "❌ Desconectado"}</p>
          <p>Partida: {gameState.isActive ? "✅ Activa" : "❌ Inactiva"}</p>
          {gameState.isActive && (
            <p>
              Pregunta: {gameState.currentQuestionIndex + 1} de{" "}
              {gameState.questions.length}
            </p>
          )}
        </div>

        {/* Botones principales */}
        <div className="controller-buttons">
          {!gameStarted ? (
            <button
              onClick={handleStartGame}
              disabled={!isConnected || questions.length === 0}
              className="start-button"
            >
              🚀 Iniciar Partida
            </button>
          ) : (
            <button onClick={handleEndGame} className="end-button">
              🛑 Finalizar Partida
            </button>
          )}

          <button onClick={openOverlay} disabled={!isConnected}>
            📺 Abrir Overlay
          </button>

          <button onClick={closeOverlay} disabled={!overlayWindow}>
            ❌ Cerrar Overlay
          </button>

          <button
            onClick={() => setShowQuestionManager((prev) => !prev)}
            className="question-manager-button"
          >
            ⚙️ {showQuestionManager ? "Ocultar" : "Gestionar"} Preguntas
          </button>
        </div>

        {/* Gestor de Preguntas */}
        {showQuestionManager && (
          <QuestionManager
            questions={questions}
            onQuestionsUpdate={handleQuestionsUpdate}
            defaultQuestions={defaultQuestions}
          />
        )}

        {/* Control de preguntas */}
        <div className="controller-buttons">
          <button
            onClick={nextQuestion}
            disabled={
              !gameState.isActive ||
              gameState.currentQuestionIndex >= gameState.questions.length - 1
            }
          >
            ⏭️ Siguiente
          </button>

          <button
            onClick={previousQuestion}
            disabled={
              !gameState.isActive || gameState.currentQuestionIndex <= 0
            }
          >
            ⏮️ Anterior
          </button>

          <button onClick={() => setQuestion(0)} disabled={!gameState.isActive}>
            🔄 Primera
          </button>
        </div>

        {/* Control de respuestas */}
        <div className="controller-buttons">
          <button onClick={showAnswer} disabled={!gameState.isActive}>
            ✅ Mostrar Respuesta
          </button>

          <button onClick={hideAnswer} disabled={!gameState.isActive}>
            ❌ Ocultar Respuesta
          </button>

          <button onClick={resetQuestion} disabled={!gameState.isActive}>
            🔄 Reiniciar Pregunta
          </button>
        </div>

        {/* Selección rápida de respuestas */}
        <div className="controller-buttons">
          <button
            onClick={() => selectAnswer(0)}
            disabled={!gameState.isActive}
            className="answer-button"
          >
            A
          </button>

          <button
            onClick={() => selectAnswer(1)}
            disabled={!gameState.isActive}
            className="answer-button"
          >
            B
          </button>

          <button
            onClick={() => selectAnswer(2)}
            disabled={!gameState.isActive}
            className="answer-button"
          >
            C
          </button>

          <button
            onClick={() => selectAnswer(3)}
            disabled={!gameState.isActive}
            className="answer-button"
          >
            D
          </button>
        </div>

        {/* Información del juego */}
        <div className="game-info">
          <p>Preguntas disponibles: {questions.length}</p>
          {gameState.isActive &&
            gameState.questions[gameState.currentQuestionIndex] && (
              <div className="current-question">
                <p>
                  <strong>Pregunta actual:</strong>
                </p>
                <p>
                  {gameState.questions[gameState.currentQuestionIndex].question}
                </p>
              </div>
            )}
        </div>

        {/* Instrucciones */}
        <div className="instructions">
          <p>
            <strong>Instrucciones:</strong>
          </p>
          <p>
            1. Haz clic en "Gestionar Preguntas" para agregar/editar preguntas
          </p>
          <p>2. Haz clic en "Iniciar Partida" para comenzar</p>
          <p>3. El overlay se abrirá automáticamente en una nueva pestaña</p>
          <p>4. Usa los botones para controlar el juego en tiempo real</p>
          <p>5. También puedes usar comandos en la consola del navegador</p>
        </div>
      </div>
    </div>
  );
};

// Componente interno para gestionar preguntas
const QuestionManager = ({
  questions,
  onQuestionsUpdate,
  defaultQuestions,
}) => {
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);

  const handleAddQuestion = () => {
    if (
      newQuestion.question.trim() &&
      newQuestion.options.every((opt) => opt.trim())
    ) {
      const questionToAdd = {
        id: Date.now(),
        ...newQuestion,
      };

      const updatedQuestions = [...questions, questionToAdd];
      onQuestionsUpdate(updatedQuestions);

      // Reset form
      setNewQuestion({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
      });
    } else {
      window.alert("Por favor, completa todos los campos");
    }
  };

  const handleEditQuestion = (index) => {
    const question = questions[index];
    setNewQuestion({
      question: question.question,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
      explanation: question.explanation || "",
    });
    setEditingIndex(index);
  };

  const handleUpdateQuestion = () => {
    if (editingIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingIndex] = {
        ...updatedQuestions[editingIndex],
        ...newQuestion,
      };
      onQuestionsUpdate(updatedQuestions);

      // Reset form
      setNewQuestion({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        explanation: "",
      });
      setEditingIndex(null);
    }
  };

  const handleDeleteQuestion = (index) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar esta pregunta?")
    ) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      onQuestionsUpdate(updatedQuestions);
    }
  };

  const handleRestoreDefaults = () => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres restaurar las preguntas por defecto?"
      )
    ) {
      onQuestionsUpdate(defaultQuestions);
    }
  };

  return (
    <div className="question-manager">
      <h3 style={{ color: "white" }}>📝 Gestor de Preguntas</h3>

      {/* Formulario para agregar/editar pregunta */}
      <div className="question-form">
        <div className="form-group">
          <label style={{ color: "white" }}>Pregunta:</label>
          <textarea
            value={newQuestion.question}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, question: e.target.value })
            }
            placeholder="Escribe tu pregunta aquí..."
            rows="3"
          />
        </div>

        <div className="form-group">
          <label style={{ color: "white" }}>Opciones:</label>
          {newQuestion.options.map((option, index) => (
            <div key={index} className="option-input">
              <input
                type="radio"
                name="correctAnswer"
                checked={newQuestion.correctAnswer === index}
                onChange={() =>
                  setNewQuestion({ ...newQuestion, correctAnswer: index })
                }
              />
              <input
                type="text"
                value={option}
                onChange={(e) => {
                  const newOptions = [...newQuestion.options];
                  newOptions[index] = e.target.value;
                  setNewQuestion({ ...newQuestion, options: newOptions });
                }}
                placeholder={`Opción ${String.fromCharCode(65 + index)}`}
              />
            </div>
          ))}
        </div>

        <div className="form-group">
          <label style={{ color: "white" }}>Explicación (opcional):</label>
          <textarea
            value={newQuestion.explanation}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, explanation: e.target.value })
            }
            placeholder="Explicación de la respuesta correcta..."
            rows="2"
          />
        </div>

        <div className="form-actions">
          {editingIndex !== null ? (
            <>
              <button onClick={handleUpdateQuestion} className="update-button">
                ✏️ Actualizar Pregunta
              </button>
              <button
                onClick={() => {
                  setNewQuestion({
                    question: "",
                    options: ["", "", "", ""],
                    correctAnswer: 0,
                    explanation: "",
                  });
                  setEditingIndex(null);
                }}
                className="cancel-button"
              >
                ❌ Cancelar
              </button>
            </>
          ) : (
            <button onClick={handleAddQuestion} className="add-button">
              ➕ Agregar Pregunta
            </button>
          )}
        </div>
      </div>

      {/* Lista de preguntas existentes */}
      <div className="questions-list">
        <h4 style={{ color: "white" }}>
          Preguntas Actuales ({questions.length})
        </h4>
        {questions.map((question, index) => (
          <div key={question.id || index} className="question-item">
            <div className="question-content">
              <p>
                <strong>
                  {index + 1}. {question.question}
                </strong>
              </p>
              <div className="question-options">
                {question.options.map((option, optIndex) => (
                  <span
                    key={optIndex}
                    className={`option ${
                      optIndex === question.correctAnswer ? "correct" : ""
                    }`}
                    style={
                      optIndex === question.correctAnswer
                        ? { color: "white" }
                        : {}
                    }
                  >
                    {String.fromCharCode(65 + optIndex)}) {option}
                  </span>
                ))}
              </div>
              {question.explanation && (
                <p className="explanation">
                  <em>Explicación: {question.explanation}</em>
                </p>
              )}
            </div>
            <div className="question-actions">
              <button
                onClick={() => handleEditQuestion(index)}
                className="edit-button"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDeleteQuestion(index)}
                className="delete-button"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Acciones adicionales */}
      <div className="manager-actions">
        <button onClick={handleRestoreDefaults} className="restore-button">
          🔄 Restaurar Preguntas por Defecto
        </button>
        <p className="manager-info">
          <strong>Nota:</strong> Los cambios se guardan automáticamente en el
          navegador.
        </p>
      </div>
    </div>
  );
};

export default StreamController;
