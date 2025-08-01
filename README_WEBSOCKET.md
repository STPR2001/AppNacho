# 🎮 Trivia Los 8 Escalones - WebSocket Edition

## 🚀 Nueva Funcionalidad: Control en Tiempo Real

Esta versión incluye **WebSockets** para permitir el control en tiempo real del juego entre diferentes pestañas del navegador.

### ✨ Características Nuevas

- **🔄 Comunicación en Tiempo Real**: Control del juego desde una pestaña hacia otra
- **📺 Overlay Automático**: Se abre automáticamente en nueva pestaña al iniciar partida
- **🎮 Control Completo**: Botones para todas las acciones del juego
- **⚡ Sincronización Instantánea**: Cambios reflejados inmediatamente en ambas pestañas
- **🛡️ Estado Centralizado**: El servidor mantiene el estado del juego
- **📝 Gestión de Preguntas Integrada**: Agregar, editar y eliminar preguntas desde el controlador

## 🚀 Instalación y Ejecución

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Construir la Aplicación
```bash
npm run build
```

### 3. Ejecutar el Sistema Completo
```bash
npm run dev
```

Esto iniciará:
- **Servidor WebSocket** en `http://localhost:3001`
- **Aplicación React** en `http://localhost:3000`

## 🎮 Cómo Usar el Sistema

### Paso 1: Acceder al Controlador
1. Abre `http://localhost:3000/stream` en tu navegador
2. Verás el panel de control con todos los botones

### Paso 2: Gestionar Preguntas (Opcional)
1. Haz clic en **"⚙️ Gestionar Preguntas"**
2. Agrega, edita o elimina preguntas según necesites
3. Los cambios se guardan automáticamente en el navegador

### Paso 3: Iniciar Partida
1. Haz clic en **"🚀 Iniciar Partida"**
2. El overlay se abrirá automáticamente en una nueva pestaña
3. Ambas pestañas estarán sincronizadas

### Paso 4: Controlar el Juego
Usa los botones del controlador para:
- **⏭️ Siguiente**: Avanzar a la siguiente pregunta
- **⏮️ Anterior**: Volver a la pregunta anterior
- **🔄 Primera**: Ir a la primera pregunta
- **✅ Mostrar Respuesta**: Revelar la respuesta correcta
- **❌ Ocultar Respuesta**: Ocultar la respuesta
- **🔄 Reiniciar Pregunta**: Resetear la pregunta actual
- **A, B, C, D**: Seleccionar respuesta específica

## 📝 Gestión de Preguntas

### Funcionalidades Disponibles:
- **➕ Agregar Preguntas**: Crea nuevas preguntas con 4 opciones
- **✏️ Editar Preguntas**: Modifica preguntas existentes
- **🗑️ Eliminar Preguntas**: Elimina preguntas que no necesites
- **📊 Vista Previa**: Ve todas las preguntas con sus opciones
- **🔄 Restaurar**: Vuelve a las preguntas por defecto
- **💾 Guardado Automático**: Los cambios se guardan automáticamente

### Cómo Crear una Pregunta:
1. Haz clic en "⚙️ Gestionar Preguntas"
2. Escribe la pregunta en el campo correspondiente
3. Completa las 4 opciones de respuesta
4. Selecciona la respuesta correcta con el radio button
5. Agrega una explicación (opcional)
6. Haz clic en "➕ Agregar Pregunta"

## 📺 URLs Disponibles

- **Controlador**: `http://localhost:3000/stream`
- **Overlay**: `http://localhost:3000/overlay`
- **Aplicación Principal**: `http://localhost:3000`

## 🎯 Comandos de Consola

También puedes usar comandos desde la consola del navegador:

```javascript
// Control básico
streamController.startGame()           // Iniciar partida
streamController.endGame()             // Finalizar partida
streamController.openOverlay()         // Abrir overlay
streamController.closeOverlay()        // Cerrar overlay

// Gestión de preguntas
streamController.toggleQuestionManager() // Abrir/cerrar gestor de preguntas

// Navegación
streamController.nextQuestion()        // Siguiente pregunta
streamController.previousQuestion()    // Pregunta anterior
streamController.setQuestion(2)        // Ir a pregunta específica

// Control de respuestas
streamController.selectAnswer(1)       // Seleccionar opción B
streamController.showAnswer()          // Mostrar respuesta
streamController.hideAnswer()          // Ocultar respuesta
streamController.resetQuestion()       // Reiniciar pregunta

// Información
streamController.getCurrentQuestion()  // Pregunta actual
streamController.getQuestionCount()    // Total de preguntas
streamController.getGameState()        // Estado completo
```

## 🔧 Configuración para Streaming

### OBS Studio
1. Agregar fuente de navegador
2. URL: `http://localhost:3000/overlay`
3. Resolución: 1920x1080
4. Configurar hotkeys para mostrar/ocultar

### Flujo de Trabajo
1. **Preparación**: Abrir controlador en una pestaña
2. **Configuración**: Gestionar preguntas si es necesario
3. **Inicio**: Hacer clic en "Iniciar Partida"
4. **Control**: Usar botones o comandos de consola
5. **Finalización**: Hacer clic en "Finalizar Partida"

## 🛠️ Arquitectura Técnica

### Componentes
- **`server.js`**: Servidor WebSocket con Express
- **`useSocket.js`**: Hook personalizado para WebSockets
- **`StreamController.js`**: Panel de control actualizado con gestor de preguntas
- **`StreamOverlay.js`**: Overlay sincronizado

### Flujo de Datos
1. **Cliente** → **Servidor**: Envía comandos (nextQuestion, selectAnswer, etc.)
2. **Servidor** → **Todos los Clientes**: Propaga cambios a todas las pestañas
3. **Estado Centralizado**: El servidor mantiene el estado del juego
4. **Persistencia Local**: Las preguntas se guardan en localStorage

### Eventos WebSocket
- `startGame`: Iniciar partida
- `endGame`: Finalizar partida
- `nextQuestion`: Siguiente pregunta
- `previousQuestion`: Pregunta anterior
- `selectAnswer`: Seleccionar respuesta
- `showAnswer`: Mostrar respuesta
- `hideAnswer`: Ocultar respuesta
- `resetQuestion`: Reiniciar pregunta

## 🎨 Características de Diseño

### Controlador
- **Estado de conexión** en tiempo real
- **Botones intuitivos** con iconos
- **Información del juego** actualizada
- **Diseño responsive** para diferentes pantallas
- **Gestor de preguntas integrado** con formularios intuitivos

### Overlay
- **Mensaje de espera** cuando no hay partida activa
- **Sincronización perfecta** con el controlador
- **Animaciones suaves** para transiciones
- **Feedback visual** inmediato

### Gestor de Preguntas
- **Interfaz intuitiva** con formularios claros
- **Vista previa** de todas las preguntas
- **Acciones rápidas** para editar/eliminar
- **Validación de campos** automática
- **Guardado automático** en localStorage

## 🔍 Solución de Problemas

### Overlay no se abre
1. Verifica que las ventanas emergentes estén permitidas
2. Asegúrate de que el servidor esté ejecutándose
3. Revisa la consola del navegador por errores

### No hay sincronización
1. Verifica que ambas pestañas estén en el mismo dominio
2. Asegúrate de que el WebSocket esté conectado
3. Revisa el estado de conexión en el controlador

### Comandos no funcionan
1. Verifica que estés en la pestaña correcta (`/stream`)
2. Asegúrate de que el juego esté activo
3. Revisa la consola por errores de JavaScript

### Problemas con preguntas
1. Verifica que hayas completado todos los campos
2. Asegúrate de haber seleccionado una respuesta correcta
3. Revisa que las preguntas se hayan guardado correctamente

## 🚀 Próximas Mejoras

- [ ] **Múltiples partidas simultáneas**
- [ ] **Sistema de usuarios/administradores**
- [ ] **Chat en tiempo real**
- [ ] **Estadísticas de juego**
- [ ] **Temas personalizables**
- [ ] **Integración con APIs externas**
- [ ] **Importar/exportar preguntas**
- [ ] **Categorías de preguntas**

---

**¡Disfruta del control en tiempo real de tu trivia! 🎮📺** 