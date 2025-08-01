# 🎮 Guía del Overlay de Streaming - Los 8 Escalones

## 📺 Descripción

Este overlay está diseñado específicamente para ser usado en OBS Studio como fuente de navegador durante transmisiones en vivo. Muestra preguntas de trivia de "Los 8 Escalones" de forma profesional y atractiva.

## 🚀 URLs de Acceso

### 1. **Página Principal con Controlador**
```
http://localhost:3000/stream
```
- Incluye el overlay + panel de control
- Ideal para configurar y probar

### 2. **Overlay Puro (Solo Visualización)**
```
http://localhost:3000/overlay
```
- Solo muestra el overlay sin controles
- Perfecto para OBS Studio

## ⚙️ Configuración en OBS Studio

### Paso 1: Agregar Fuente de Navegador
1. En OBS Studio, haz clic derecho en "Fuentes"
2. Selecciona "Agregar" → "Navegador"
3. Dale un nombre como "Trivia Overlay"

### Paso 2: Configurar URL
1. En la URL, ingresa: `http://localhost:3000/overlay`
2. Ancho: 1920 (o tu resolución)
3. Alto: 1080 (o tu resolución)
4. Marca "Controlar audio mediante OBS"

### Paso 3: Ajustar Posición
1. Posiciona el overlay donde desees en tu escena
2. Puedes usar "Ajustar a pantalla" si quieres que ocupe toda la pantalla
3. Ajusta la opacidad si es necesario

## 🎮 Control del Overlay

### Método 1: Consola del Navegador
Abre la consola del navegador (F12) y usa estos comandos:

```javascript
// Mostrar/ocultar overlay
streamController.showOverlay()
streamController.hideOverlay()

// Navegar entre preguntas
streamController.nextQuestion()
streamController.previousQuestion()

// Ir a pregunta específica (0 = primera pregunta)
streamController.setQuestion(2)

// Control de respuestas
streamController.selectAnswer(1)        // Seleccionar opción B (0=A, 1=B, 2=C, 3=D)
streamController.showAnswer()           // Mostrar respuesta correcta
streamController.hideAnswer()           // Ocultar respuesta
streamController.resetQuestion()        // Reiniciar pregunta

// Obtener información
streamController.getCurrentQuestion()
streamController.getQuestionCount()
```

### Método 2: Botones en Pantalla
Si usas `/stream`, tendrás botones en pantalla para controlar el overlay.

### Método 3: Hotkeys (Recomendado)
Configura hotkeys en OBS Studio:
1. Ve a "Configuración" → "Hotkeys"
2. Asigna teclas para mostrar/ocultar la fuente
3. Ejemplo: F1 para mostrar, F2 para ocultar

## 🎨 Características del Overlay

### ✨ Diseño Profesional
- **Fondo oscuro** con gradientes sutiles
- **Texto grande y legible** para streaming
- **Animaciones suaves** sin distraer
- **Efectos de brillo** profesionales

### 📊 Información Mostrada
- **Número de pregunta** actual
- **Timer** de la pregunta
- **Pregunta principal** en texto grande
- **4 opciones** (A, B, C, D) en grid 2x2
- **Indicador de progreso**
- **Tema** (Los 8 Escalones)

### 🔄 Funcionalidades
- **Carga automática** de preguntas personalizadas
- **Navegación circular** entre preguntas
- **Timer automático** por pregunta
- **Selección de respuestas** con clic
- **Mostrar/ocultar** respuesta correcta
- **Feedback visual** inmediato
- **Responsive** para diferentes resoluciones

## 🛠️ Personalización

### Cambiar Preguntas
1. Ve a la aplicación principal: `http://localhost:3000`
2. Usa el gestor de preguntas para agregar/editar
3. Las preguntas se sincronizan automáticamente con el overlay

### Modificar Estilos
Los estilos están en `src/components/StreamOverlay.css`
Puedes modificar:
- Colores y gradientes
- Tamaños de fuente
- Animaciones
- Efectos visuales

## 📱 Resoluciones Soportadas

El overlay es completamente responsive y se adapta a:
- **1920x1080** (Full HD)
- **1280x720** (HD)
- **2560x1440** (2K)
- **3840x2160** (4K)
- **Resoluciones móviles** (para streaming desde móvil)

## 🎯 Casos de Uso

### 1. **Streaming Educativo**
- Mostrar preguntas durante clases en vivo
- Interactuar con la audiencia
- Crear engagement

### 2. **Gaming Streams**
- Pausas entre partidas
- Interacción con chat
- Contenido educativo

### 3. **Presentaciones**
- Eventos corporativos
- Webinars
- Conferencias

## 🔧 Solución de Problemas

### Overlay no se muestra
1. Verifica que la URL sea correcta
2. Asegúrate de que la aplicación esté ejecutándose
3. Revisa la consola del navegador por errores

### Preguntas no se actualizan
1. Verifica que hayas guardado las preguntas en el gestor
2. Recarga la página del overlay
3. Limpia el caché del navegador

### Problemas de rendimiento
1. Cierra otras pestañas del navegador
2. Reduce la resolución del overlay
3. Desactiva efectos visuales si es necesario

## 🎨 Temas y Variaciones

### Modo Oscuro (Por defecto)
- Fondo negro con gradientes
- Texto blanco con sombras
- Efectos de brillo sutiles

### Modo Transparente
Agrega la clase `transparent` al elemento `.stream-overlay`:
```css
.stream-overlay.transparent {
  background: transparent;
}
```

## 📞 Soporte

Para problemas o sugerencias:
1. Revisa la consola del navegador
2. Verifica que todas las dependencias estén instaladas
3. Asegúrate de que estés usando la URL correcta

---

**¡Disfruta usando el overlay en tus streams! 🎮📺** 