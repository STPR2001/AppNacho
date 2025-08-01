const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Servir archivos estáticos desde la carpeta build
app.use(express.static(path.join(__dirname, 'build')));

// Manejar todas las rutas para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Almacenar el estado del juego
let gameState = {
  isActive: false,
  currentQuestionIndex: 0,
  showAnswer: false,
  selectedAnswer: null,
  questions: [],
  gameStarted: false
};

// Manejar conexiones WebSocket
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);

  // Enviar estado actual al cliente que se conecta
  socket.emit('gameState', gameState);

  // Manejar inicio de partida
  socket.on('startGame', (questions) => {
    console.log('Iniciando partida con', questions.length, 'preguntas');
    gameState = {
      isActive: true,
      currentQuestionIndex: 0,
      showAnswer: false,
      selectedAnswer: null,
      questions: questions,
      gameStarted: true
    };
    
    // Notificar a todos los clientes
    io.emit('gameState', gameState);
    io.emit('gameStarted', gameState);
  });

  // Manejar fin de partida
  socket.on('endGame', () => {
    console.log('Finalizando partida');
    gameState.isActive = false;
    gameState.gameStarted = false;
    io.emit('gameState', gameState);
    io.emit('gameEnded');
  });

  // Manejar cambio de pregunta
  socket.on('nextQuestion', () => {
    if (gameState.isActive && gameState.currentQuestionIndex < gameState.questions.length - 1) {
      gameState.currentQuestionIndex++;
      gameState.showAnswer = false;
      gameState.selectedAnswer = null;
      console.log('Siguiente pregunta:', gameState.currentQuestionIndex);
      io.emit('gameState', gameState);
      io.emit('questionChanged', gameState.currentQuestionIndex);
    }
  });

  socket.on('previousQuestion', () => {
    if (gameState.isActive && gameState.currentQuestionIndex > 0) {
      gameState.currentQuestionIndex--;
      gameState.showAnswer = false;
      gameState.selectedAnswer = null;
      console.log('Pregunta anterior:', gameState.currentQuestionIndex);
      io.emit('gameState', gameState);
      io.emit('questionChanged', gameState.currentQuestionIndex);
    }
  });

  socket.on('setQuestion', (index) => {
    if (gameState.isActive && index >= 0 && index < gameState.questions.length) {
      gameState.currentQuestionIndex = index;
      gameState.showAnswer = false;
      gameState.selectedAnswer = null;
      console.log('Pregunta establecida:', index);
      io.emit('gameState', gameState);
      io.emit('questionChanged', index);
    }
  });

  // Manejar selección de respuesta
  socket.on('selectAnswer', (answerIndex) => {
    if (gameState.isActive) {
      gameState.selectedAnswer = answerIndex;
      gameState.showAnswer = true;
      console.log('Respuesta seleccionada:', answerIndex);
      io.emit('gameState', gameState);
      io.emit('answerSelected', answerIndex);
    }
  });

  // Manejar mostrar/ocultar respuesta
  socket.on('showAnswer', () => {
    if (gameState.isActive) {
      gameState.showAnswer = true;
      io.emit('gameState', gameState);
      io.emit('answerShown');
    }
  });

  socket.on('hideAnswer', () => {
    if (gameState.isActive) {
      gameState.showAnswer = false;
      gameState.selectedAnswer = null;
      io.emit('gameState', gameState);
      io.emit('answerHidden');
    }
  });

  // Manejar reset de pregunta
  socket.on('resetQuestion', () => {
    if (gameState.isActive) {
      gameState.showAnswer = false;
      gameState.selectedAnswer = null;
      io.emit('gameState', gameState);
      io.emit('questionReset');
    }
  });

  // Manejar mostrar/ocultar overlay
  socket.on('showOverlay', () => {
    io.emit('overlayShown');
  });

  socket.on('hideOverlay', () => {
    io.emit('overlayHidden');
  });

  // Manejar desconexión
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Servidor WebSocket ejecutándose en puerto ${PORT}`);
  console.log(`Aplicación disponible en http://localhost:${PORT}`);
}); 