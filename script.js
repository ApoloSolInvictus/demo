document.addEventListener('DOMContentLoaded', () => {

    // --- Animated Counter ---
    const counter = document.getElementById('traffic-rank');
    if (counter) {
        const targetRank = parseInt(counter.dataset.rank, 10);
        
        const animateCounter = (el, target) => {
            let current = 100; // Start from a higher number for effect
            const step = Math.abs(Math.floor((target - current) / 20)) || 1;
            
            const timer = setInterval(() => {
                current -= step;
                if (current <= target) {
                    current = target;
                    clearInterval(timer);
                }
                el.textContent = `#${current}`;
            }, 50);
        };

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(counter, targetRank);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.8 });
        counterObserver.observe(counter);
    }
    
    // --- Interactive Diagram ---
    const nodes = document.querySelectorAll('.diagram-node');
    if (nodes.length > 0) {
        const connectors = { c1: document.getElementById('connector1'), c2: document.getElementById('connector2'), c3: document.getElementById('connector3'), };
        const nodeElements = { citizen: document.getElementById('node-citizen'), station: document.getElementById('node-station'), avatar: document.getElementById('node-avatar'), services: document.getElementById('node-services'), };
        const drawConnectors = () => {
             const isMobile = window.innerWidth < 768;
             const cR = nodeElements.citizen.parentElement.getBoundingClientRect();
             const c1R = nodeElements.citizen.getBoundingClientRect(), c2R = nodeElements.station.getBoundingClientRect(), c3R = nodeElements.avatar.getBoundingClientRect(), c4R = nodeElements.services.getBoundingClientRect();
             if (isMobile) {
                const setV = (el, r1, r2) => { el.style.top = `${r1.bottom - cR.top + 10}px`; el.style.left = `${r1.left + r1.width / 2 - cR.left}px`; el.style.width = '2px'; el.style.height = `${r2.top - r1.bottom - 20}px`; };
                setV(connectors.c1, c1R, c2R); setV(connectors.c2, c2R, c3R); setV(connectors.c3, c3R, c4R);
            } else {
                const setH = (el, r1, r2) => { el.style.top = `${r1.top + r1.height / 2 - cR.top}px`; el.style.left = `${r1.right - cR.left}px`; el.style.width = `${r2.left - r1.right}px`; el.style.height = '2px'; };
                setH(connectors.c1, c1R, c2R); setH(connectors.c2, c2R, c3R); setH(connectors.c3, c3R, c4R);
            }
        };
        let step = 0;
        const diagramObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    drawConnectors();
                    const interval = setInterval(() => {
                        step++;
                        if (step > nodes.length) { clearInterval(interval); return; }
                        nodes.forEach(n => n.classList.remove('active'));
                        if (nodes[step - 1]) nodes[step - 1].classList.add('active');
                        if (connectors[`c${step - 1}`]) connectors[`c${step - 1}`].style.transform = 'scaleX(1)';
                    }, 800);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        diagramObserver.observe(nodeElements.citizen.parentElement);
        window.addEventListener('resize', drawConnectors);
    }
    
    // --- Impact Chart ---
    const impactChartCtx = document.getElementById('impactChart');
    if (impactChartCtx) {
        new Chart(impactChartCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Tiempo en Trámites', 'Tráfico Vehicular', 'Costos Operativos (Oficinas)', 'Acceso a Servicios'],
                datasets: [{ label: 'Sistema Actual', data: [100, 100, 100, 40], backgroundColor: '#cbd5e1', borderColor: '#94a3b8', borderWidth: 1, borderRadius: 4 }, { label: 'Con Oráculo Digital', data: [10, 30, 40, 100], backgroundColor: '#2dd4bf', borderColor: '#0d9488', borderWidth: 1, borderRadius: 4 }]
            },
            options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 110, ticks: { callback: (value) => value + '%' } } }, plugins: { title: { display: true, text: 'Índice de Eficiencia Cívica (Estimado)', font: { size: 16 } }, tooltip: { callbacks: { label: function(context) { let label = context.dataset.label || ''; if (label) { label += ': '; } label += `${context.parsed.y}%`; return label; } } } } }
        });
    }

    // --- Chat Simulation Logic ---
    const chatLog = document.getElementById('chat-log');
    const userOptions = document.getElementById('user-options');

    const conversationScript = {
        start: {
            avatar: "¡Pura vida! Soy su Asistente Cívico Personal. ¿En qué le puedo ayudar hoy?",
            options: [
                { text: "Renovar mi licencia de conducir.", next: "licencia_1" },
                { text: "Consultar sobre un permiso de construcción.", next: "permiso_1" },
                { text: "Necesito información turística.", next: "turismo_1" }
            ]
        },
        licencia_1: {
            avatar: "¡Excelente! Veo en el sistema que su cédula y su licencia están vigentes. Para renovar, necesitamos verificar sus datos y realizar el pago. ¿Desea que utilice la información de su identidad digital para autocompletar el formulario?",
            options: [
                { text: "Sí, por favor.", next: "licencia_2" },
                { text: "No, gracias.", next: "fin_manual" }
            ]
        },
        licencia_2: {
            avatar: "Perfecto. He completado el formulario. El monto a pagar es de ₡10,000. ¿Desea realizar el pago ahora con su cuenta del BAC, la cual ya está asociada a su identidad digital?",
            options: [
                { text: "Sí, pagar ahora.", next: "fin_licencia" },
                { text: "Ver otras opciones de pago.", next: "otras_opciones" }
            ]
        },
        fin_licencia: {
            avatar: "¡Pago realizado con éxito! Su licencia digital ha sido actualizada y la recibirá en su correo en los próximos 5 minutos. ¿Hay algo más en lo que pueda ayudarle?",
            options: [{ text: "No, muchas gracias.", next: "start" }]
        },
        permiso_1: {
            avatar: "Entendido. Para consultar un permiso de construcción, necesito el número de expediente o la dirección de la propiedad. ¿Cómo desea proceder?",
            options: [{ text: "Volver al inicio.", next: "start" }]
        },
        turismo_1: {
            avatar: "¡Con gusto! Costa Rica es un paraíso. ¿Qué tipo de información le interesa? ¿Hospedaje, tours, transporte?",
            options: [{ text: "Volver al inicio.", next: "start" }]
        },
        otras_opciones: {
            avatar: "Puede pagar en cualquier banco del estado o en línea a través del portal de la municipalidad. Su trámite quedará guardado. ¿Desea continuar con otra gestión?",
            options: [{ text: "No, gracias.", next: "start" }]
        },
         fin_manual: {
            avatar: "Como guste. Puede llenar el formulario manualmente en la pantalla. Quedo a su disposición si necesita algo más.",
            options: [{ text: "Gracias, volver al inicio.", next: "start" }]
        },
    };

    function displayConversationStep(stepKey) {
        const step = conversationScript[stepKey];
        
        // Add avatar message
        const avatarBubble = document.createElement('div');
        avatarBubble.className = 'chat-bubble avatar-bubble';
        avatarBubble.textContent = step.avatar;
        chatLog.appendChild(avatarBubble);
        
        // Clear and display user options
        userOptions.innerHTML = '';
        step.options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-button';
            button.textContent = option.text;
            button.onclick = () => selectOption(option);
            userOptions.appendChild(button);
        });
        chatLog.scrollTop = chatLog.scrollHeight;
    }

    function selectOption(option) {
        // Add user message to log
        const userBubble = document.createElement('div');
        userBubble.className = 'chat-bubble user-bubble';
        userBubble.textContent = option.text;
        chatLog.appendChild(userBubble);
        
        // Disable buttons
        userOptions.innerHTML = '<p class="text-center text-slate-400 text-sm">...</p>';

        // Go to next step after a short delay
        setTimeout(() => {
            if (option.next === 'start') {
                 chatLog.innerHTML = ''; // Clear chat
            }
            displayConversationStep(option.next);
        }, 800);
    }

    // Start conversation
    displayConversationStep('start');
    
    // --- Fade-in Animations on Scroll ---
    const faders = document.querySelectorAll('.fade-in');
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    faders.forEach(fader => scrollObserver.observe(fader));
    
    // --- Active Nav Link on Scroll ---
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main section');
    const onScroll = () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 70) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', onScroll);
    onScroll();

    // --- Audio Player Logic ---
    const audioPlayer = document.getElementById('audio-player');
    const audioButton = document.getElementById('audio-toggle-button');
    const audioIcon = document.getElementById('audio-icon');

    if(audioPlayer && audioButton && audioIcon) {
        const playIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
        const pauseIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
        
        audioIcon.innerHTML = playIcon;

        audioButton.addEventListener('click', function() {
            if (audioPlayer.paused) {
                audioPlayer.play();
                audioIcon.innerHTML = pauseIcon;
            } else {
                audioPlayer.pause();
                audioIcon.innerHTML = playIcon;
            }
        });

        audioPlayer.addEventListener('ended', function() {
            audioIcon.innerHTML = playIcon;
        });
    }
});
