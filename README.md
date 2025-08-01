# Trivia Los 8 Escalones

Una aplicación web de trivia basada en el concepto de "Los 8 Escalones" del desarrollo personal, creada con React JS.

## 🎯 Características

- **5 preguntas precargadas** sobre Los 8 Escalones
- **4 opciones por pregunta** (A, B, C, D)
- **Feedback visual inmediato**: verde para correctas, rojo para incorrectas
- **Progreso automático**: avanza a la siguiente pregunta después de 2 segundos
- **Indicador de progreso**: muestra "Pregunta X de 5"
- **Puntuación en tiempo real**
- **Guardado de progreso** usando localStorage
- **Diseño responsive** y moderno
- **Pantalla de resultados finales** con porcentaje y mensaje personalizado
- **🎯 Gestor de Preguntas**: Agregar, editar y eliminar preguntas personalizadas
- **💾 Persistencia de datos**: Las preguntas personalizadas se guardan automáticamente
- **🔄 Restauración**: Opción para volver a las preguntas por defecto
- **📺 Overlay de Streaming**: Versión optimizada para OBS Studio
- **🎮 Control Remoto**: Comandos desde consola del navegador

## 🚀 Instalación y Ejecución

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar la aplicación:**
   ```bash
   npm start
   ```

3. **Abrir en el navegador:**
   La aplicación se abrirá automáticamente en `http://localhost:3000`

## 🎮 Cómo Jugar

1. Lee cuidadosamente cada pregunta
2. Selecciona una de las 4 opciones disponibles
3. Observa el feedback visual (verde = correcto, rojo = incorrecto)
4. Lee la explicación que aparece
5. La siguiente pregunta aparecerá automáticamente
6. Al final verás tu puntuación total y porcentaje

## ⚙️ Gestor de Preguntas

### Acceder al Gestor:
- **Durante el juego**: Haz clic en el botón ⚙️ en la parte superior
- **Al finalizar**: Usa el botón "Gestionar Preguntas" en la pantalla de resultados

### Funcionalidades:
- **➕ Agregar Preguntas**: Crea nuevas preguntas con 4 opciones
- **✏️ Editar Preguntas**: Modifica preguntas existentes
- **🗑️ Eliminar Preguntas**: Elimina preguntas que no necesites
- **📊 Estadísticas**: Ve cuántas preguntas tienes cargadas
- **🔄 Restaurar**: Vuelve a las preguntas por defecto
- **💾 Guardado Automático**: Los cambios se guardan automáticamente

### Cómo Crear una Pregunta:
1. Haz clic en "Agregar Nueva Pregunta"
2. Escribe la pregunta en el campo correspondiente
3. Completa las 4 opciones de respuesta
4. Selecciona la respuesta correcta con el radio button
5. Agrega una explicación (opcional)
6. Haz clic en "Agregar"

## 📺 Overlay de Streaming

### URLs de Acceso:
- **Con Controlador**: `http://localhost:3000/stream`
- **Solo Overlay**: `http://localhost:3000/overlay` (para OBS Studio)

### Configuración en OBS Studio:
1. Agregar fuente de navegador
2. URL: `http://localhost:3000/overlay`
3. Resolución: 1920x1080 (o tu resolución)
4. Configurar hotkeys para mostrar/ocultar

### Control desde Consola:
```javascript
// Navegar entre preguntas
streamController.nextQuestion()
streamController.previousQuestion()
streamController.setQuestion(2)

// Mostrar/ocultar
streamController.showOverlay()
streamController.hideOverlay()
```

**📖 Ver guía completa en `STREAM_OVERLAY_GUIDE.md`**

## 📱 Características Técnicas

- **React 18** con hooks modernos
- **CSS3** con animaciones y gradientes
- **localStorage** para persistencia de datos
- **Diseño responsive** para móviles y desktop
- **Accesibilidad** con estados disabled y feedback visual

## 🎨 Diseño

- Interfaz moderna con gradientes y efectos de glassmorphism
- Animaciones suaves para mejor experiencia de usuario
- Colores temáticos (púrpura y azul)
- Tipografía clara y legible
- Efectos hover y transiciones fluidas

## 📝 Estructura del Proyecto

```
src/
├── components/
│   ├── TriviaGame.js          # Componente principal del juego
│   ├── TriviaGame.css         # Estilos del juego
│   ├── QuestionManager.js     # Gestor de preguntas personalizadas
│   ├── QuestionManager.css    # Estilos del gestor
│   ├── StreamOverlay.js       # Overlay para streaming
│   ├── StreamOverlay.css      # Estilos del overlay
│   ├── StreamController.js    # Controlador del overlay
│   ├── StreamController.css   # Estilos del controlador
│   ├── ParticleBackground.js  # Efecto de partículas
│   └── ParticleBackground.css # Estilos de partículas
├── pages/
│   ├── StreamPage.js          # Página con overlay + controlador
│   └── StreamOverlayPage.js   # Página solo overlay
├── data/
│   └── questions.js           # Array de preguntas por defecto
├── App.js                     # Componente raíz
├── App.css                   # Estilos globales
├── index.js                  # Punto de entrada
└── index.css                 # Estilos base
```

## 🔧 Personalización

Para agregar más preguntas, edita el archivo `src/data/questions.js` siguiendo este formato:

```javascript
{
  id: 6,
  question: "Tu nueva pregunta aquí?",
  options: [
    "A) Opción 1",
    "B) Opción 2", 
    "C) Opción 3",
    "D) Opción 4"
  ],
  correctAnswer: 0, // Índice de la respuesta correcta (0-3)
  explanation: "Explicación de la respuesta correcta."
}
```

¡Disfruta jugando y aprendiendo sobre Los 8 Escalones! 🎯 