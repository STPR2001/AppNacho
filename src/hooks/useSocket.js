import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3001';

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState({
    isActive: false,
    currentQuestionIndex: 0,
    showAnswer: false,
    selectedAnswer: null,
    questions: [],
    gameStarted: false
  });

  const socketRef = useRef();

  useEffect(() => {
    // Crear conexión WebSocket
    const newSocket = io(SOCKET_URL);
    socketRef.current = newSocket;
    setSocket(newSocket);

    // Eventos de conexión
    newSocket.on('connect', () => {
      console.log('Conectado al servidor WebSocket');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Desconectado del servidor WebSocket');
      setIsConnected(false);
    });

    // Eventos del juego
    newSocket.on('gameState', (state) => {
      console.log('Estado del juego actualizado:', state);
      setGameState(state);
    });

    newSocket.on('gameStarted', (state) => {
      console.log('Juego iniciado:', state);
      setGameState(state);
    });

    newSocket.on('gameEnded', () => {
      console.log('Juego finalizado');
      setGameState(prev => ({ ...prev, isActive: false, gameStarted: false }));
    });

    newSocket.on('questionChanged', (index) => {
      console.log('Pregunta cambiada a:', index);
      setGameState(prev => ({ ...prev, currentQuestionIndex: index, showAnswer: false, selectedAnswer: null }));
    });

    newSocket.on('answerSelected', (answerIndex) => {
      console.log('Respuesta seleccionada:', answerIndex);
      setGameState(prev => ({ ...prev, selectedAnswer: answerIndex, showAnswer: true }));
    });

    newSocket.on('answerShown', () => {
      console.log('Respuesta mostrada');
      setGameState(prev => ({ ...prev, showAnswer: true }));
    });

    newSocket.on('answerHidden', () => {
      console.log('Respuesta oculta');
      setGameState(prev => ({ ...prev, showAnswer: false, selectedAnswer: null }));
    });

    newSocket.on('questionReset', () => {
      console.log('Pregunta reseteada');
      setGameState(prev => ({ ...prev, showAnswer: false, selectedAnswer: null }));
    });

    newSocket.on('overlayShown', () => {
      console.log('Overlay mostrado');
    });

    newSocket.on('overlayHidden', () => {
      console.log('Overlay oculto');
    });

    // Cleanup al desmontar
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  // Funciones para controlar el juego
  const startGame = (questions) => {
    if (socket) {
      socket.emit('startGame', questions);
    }
  };

  const endGame = () => {
    if (socket) {
      socket.emit('endGame');
    }
  };

  const nextQuestion = () => {
    if (socket) {
      socket.emit('nextQuestion');
    }
  };

  const previousQuestion = () => {
    if (socket) {
      socket.emit('previousQuestion');
    }
  };

  const setQuestion = (index) => {
    if (socket) {
      socket.emit('setQuestion', index);
    }
  };

  const selectAnswer = (answerIndex) => {
    if (socket) {
      socket.emit('selectAnswer', answerIndex);
    }
  };

  const showAnswer = () => {
    if (socket) {
      socket.emit('showAnswer');
    }
  };

  const hideAnswer = () => {
    if (socket) {
      socket.emit('hideAnswer');
    }
  };

  const resetQuestion = () => {
    if (socket) {
      socket.emit('resetQuestion');
    }
  };

  const showOverlay = () => {
    if (socket) {
      socket.emit('showOverlay');
    }
  };

  const hideOverlay = () => {
    if (socket) {
      socket.emit('hideOverlay');
    }
  };

  return {
    socket,
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
    hideOverlay
  };
}; 