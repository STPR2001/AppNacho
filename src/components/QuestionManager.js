import React, { useState, useEffect } from 'react';
import './QuestionManager.css';

const QuestionManager = ({ onQuestionsUpdate, onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: ''
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Cargar preguntas guardadas al iniciar
  useEffect(() => {
    const savedQuestions = localStorage.getItem('customQuestions');
    if (savedQuestions) {
      const parsedQuestions = JSON.parse(savedQuestions);
      setQuestions(parsedQuestions);
      onQuestionsUpdate(parsedQuestions);
    }
  }, [onQuestionsUpdate]);

  const saveQuestions = (updatedQuestions) => {
    localStorage.setItem('customQuestions', JSON.stringify(updatedQuestions));
    setQuestions(updatedQuestions);
    onQuestionsUpdate(updatedQuestions);
  };

  const handleAddQuestion = () => {
    if (!newQuestion.question.trim() || newQuestion.options.some(opt => !opt.trim())) {
      alert('Por favor completa todos los campos');
      return;
    }

    const questionToAdd = {
      id: Date.now(),
      ...newQuestion
    };

    const updatedQuestions = [...questions, questionToAdd];
    saveQuestions(updatedQuestions);
    
    // Resetear formulario
    setNewQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    });
    setShowForm(false);
  };

  const handleEditQuestion = (index) => {
    setNewQuestion(questions[index]);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleUpdateQuestion = () => {
    if (!newQuestion.question.trim() || newQuestion.options.some(opt => !opt.trim())) {
      alert('Por favor completa todos los campos');
      return;
    }

    const updatedQuestions = [...questions];
    updatedQuestions[editingIndex] = {
      ...questions[editingIndex],
      ...newQuestion
    };
    
    saveQuestions(updatedQuestions);
    
    // Resetear formulario
    setNewQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    });
    setEditingIndex(null);
    setShowForm(false);
  };

  const handleDeleteQuestion = (index) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta pregunta?')) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      saveQuestions(updatedQuestions);
    }
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...newQuestion.options];
    updatedOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: updatedOptions });
  };

  const resetToDefault = () => {
    if (window.confirm('¿Estás seguro de que quieres restaurar las preguntas por defecto? Esto eliminará todas las preguntas personalizadas.')) {
      localStorage.removeItem('customQuestions');
      setQuestions([]);
      onQuestionsUpdate([]);
    }
  };

  return (
    <div className="question-manager">
      <div className="manager-header">
        <h2>🎯 Gestor de Preguntas</h2>
        <button className="close-button" onClick={onClose}>✕</button>
      </div>

      <div className="manager-content">
        <div className="stats-section">
          <div className="stat-card">
            <span className="stat-number">{questions.length}</span>
            <span className="stat-label">Preguntas Cargadas</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{questions.filter(q => q.explanation).length}</span>
            <span className="stat-label">Con Explicación</span>
          </div>
        </div>

        <div className="actions-section">
          <button 
            className="action-button primary" 
            onClick={() => setShowForm(true)}
          >
            ➕ Agregar Nueva Pregunta
          </button>
          <button 
            className="action-button secondary" 
            onClick={resetToDefault}
          >
            🔄 Restaurar Preguntas por Defecto
          </button>
        </div>

        {showForm && (
          <div className="question-form">
            <h3>{editingIndex !== null ? '✏️ Editar Pregunta' : '➕ Nueva Pregunta'}</h3>
            
            <div className="form-group">
              <label>Pregunta:</label>
              <textarea
                value={newQuestion.question}
                onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                placeholder="Escribe tu pregunta aquí..."
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Opciones:</label>
              {newQuestion.options.map((option, index) => (
                <div key={index} className="option-input-group">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={newQuestion.correctAnswer === index}
                    onChange={() => setNewQuestion({ ...newQuestion, correctAnswer: index })}
                    className="correct-radio"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Opción ${String.fromCharCode(65 + index)}`}
                    className="option-input"
                  />
                </div>
              ))}
            </div>

            <div className="form-group">
              <label>Explicación (opcional):</label>
              <textarea
                value={newQuestion.explanation}
                onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                placeholder="Explica por qué esta es la respuesta correcta..."
                rows="2"
              />
            </div>

            <div className="form-actions">
              <button 
                className="form-button primary"
                onClick={editingIndex !== null ? handleUpdateQuestion : handleAddQuestion}
              >
                {editingIndex !== null ? '💾 Actualizar' : '➕ Agregar'}
              </button>
              <button 
                className="form-button secondary"
                onClick={() => {
                  setShowForm(false);
                  setEditingIndex(null);
                  setNewQuestion({
                    question: '',
                    options: ['', '', '', ''],
                    correctAnswer: 0,
                    explanation: ''
                  });
                }}
              >
                ❌ Cancelar
              </button>
            </div>
          </div>
        )}

        <div className="questions-list">
          <h3>📋 Preguntas Cargadas ({questions.length})</h3>
          {questions.length === 0 ? (
            <div className="empty-state">
              <p>📝 No hay preguntas cargadas</p>
              <p>Agrega tu primera pregunta para comenzar</p>
            </div>
          ) : (
            questions.map((question, index) => (
              <div key={question.id || index} className="question-item">
                <div className="question-content">
                  <h4>{question.question}</h4>
                  <div className="question-options">
                    {question.options.map((option, optIndex) => (
                      <span 
                        key={optIndex} 
                        className={`option-preview ${optIndex === question.correctAnswer ? 'correct' : ''}`}
                      >
                        {String.fromCharCode(65 + optIndex)}) {option}
                      </span>
                    ))}
                  </div>
                  {question.explanation && (
                    <p className="explanation-preview">💡 {question.explanation}</p>
                  )}
                </div>
                <div className="question-actions">
                  <button 
                    className="action-btn edit"
                    onClick={() => handleEditQuestion(index)}
                  >
                    ✏️
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => handleDeleteQuestion(index)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionManager; 