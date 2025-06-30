document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica del Contador Animado, Diagrama Interactivo, Gráfico de Impacto, etc. ---
    // (Se mantiene el código de las funciones anteriores para que todo siga funcionando)
    // ... (código anterior omitido por brevedad, pero debe estar aquí) ...
    const impactChartCtx = document.getElementById('impactChart');
    if (impactChartCtx) { /* ... código del gráfico ... */ }


    // --- LÓGICA DE LA DEMOSTRACIÓN DE AVATAR (LISTA PARA API) ---
    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input');
    const chatLog = document.getElementById('chat-log');
    const avatarContainer = document.getElementById('avatar-container');

    // Muestra un mensaje en la ventana de chat
    function addMessageToLog(text, sender) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${sender === 'user' ? 'user-bubble' : 'avatar-bubble'}`;
        bubble.textContent = text;
        chatLog.appendChild(bubble);
        chatLog.scrollTop = chatLog.scrollHeight;
    }
    
    // Muestra el video del avatar
    function displayAvatarVideo(videoUrl) {
        avatarContainer.innerHTML = ''; // Limpiar el contenedor
        const video = document.createElement('video');
        video.src = videoUrl;
        video.autoplay = true;
        video.playsinline = true;
        video.className = "w-full h-full object-cover";
        avatarContainer.appendChild(video);
    }
    
    // Función principal para manejar la conversación
    async function handleConversation() {
        const userText = userInput.value;
        if (!userText.trim()) return;

        addMessageToLog(userText, 'user');
        userInput.value = '';
        sendButton.disabled = true;
        sendButton.textContent = '...';

        // --- ¡ATENCIÓN! ESTA ES LA PARTE CLAVE ---
        // En un proyecto real, esta llamada se haría a su propio servidor (backend).
        // NUNCA ponga su API key directamente en este código.
        const backendUrl = '/api/talk-to-tavus'; // URL de ejemplo para su servidor intermediario

        try {
            /*
            // EJEMPLO DE CÓMO SE VERÍA LA LLAMADA AL BACKEND
            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: userText })
            });

            if (!response.ok) {
                throw new Error('Error de comunicación con el servidor.');
            }

            const data = await response.json();
            
            // Suponiendo que su backend devuelve la respuesta del avatar y la URL del video
            addMessageToLog(data.responseText, 'avatar');

            // Si Tavus devuelve una URL de video, la mostramos
            if (data.videoUrl) {
                displayAvatarVideo(data.videoUrl);
            }
            */

            // --- INICIO DE LA SIMULACIÓN (para que la demo funcione sin backend) ---
            // Este bloque simula una respuesta del servidor y debe ser reemplazado
            // por la llamada real (el bloque comentado de arriba) cuando tenga su backend.
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simula espera de red
            
            const simulatedResponse = {
                responseText: "Entendido. Procesando su solicitud para renovar la licencia. Un momento por favor...",
                // Tavus podría devolver una URL de video como esta:
                videoUrl: "https://cdn.coverr.co/videos/coverr-a-woman-in-a-business-suit-is-having-a-video-conference-8190/1080p.mp4"
            };
            
            addMessageToLog(simulatedResponse.responseText, 'avatar');
            if (simulatedResponse.videoUrl) {
                displayAvatarVideo(simulatedResponse.videoUrl);
            }
            // --- FIN DE LA SIMULACIÓN ---

        } catch (error) {
            addMessageToLog('Lo siento, hubo un error de conexión. Por favor, intente más tarde.', 'avatar');
            console.error('Error en la llamada al backend:', error);
        } finally {
            sendButton.disabled = false;
            sendButton.textContent = 'Enviar';
        }
    }

    sendButton.addEventListener('click', handleConversation);
    userInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            handleConversation();
        }
    });

    addMessageToLog('¡Pura vida! Soy su Asistente Cívico Personal. ¿En qué le puedo ayudar hoy?', 'avatar');
    // Código anterior (audio, scroll, etc.)
    // ...
});
