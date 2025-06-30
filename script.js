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
        const connectors = {
            c1: document.getElementById('connector1'),
            c2: document.getElementById('connector2'),
            c3: document.getElementById('connector3'),
        };
        const nodeElements = {
            citizen: document.getElementById('node-citizen'),
            station: document.getElementById('node-station'),
            avatar: document.getElementById('node-avatar'),
            services: document.getElementById('node-services'),
        };

        const drawConnectors = () => {
             const isMobile = window.innerWidth < 768;
             const citizenRect = nodeElements.citizen.getBoundingClientRect();
             const stationRect = nodeElements.station.getBoundingClientRect();
             const avatarRect = nodeElements.avatar.getBoundingClientRect();
             const servicesRect = nodeElements.services.getBoundingClientRect();
             const containerRect = nodeElements.citizen.parentElement.getBoundingClientRect();

            if (isMobile) {
                // Vertical layout
                connectors.c1.style.top = `${citizenRect.bottom - containerRect.top + 10}px`;
                connectors.c1.style.left = `${citizenRect.left + citizenRect.width / 2 - containerRect.left}px`;
                connectors.c1.style.width = '2px';
                connectors.c1.style.height = `${stationRect.top - citizenRect.bottom - 20}px`;
                
                connectors.c2.style.top = `${stationRect.bottom - containerRect.top + 10}px`;
                connectors.c2.style.left = `${stationRect.left + stationRect.width / 2 - containerRect.left}px`;
                connectors.c2.style.width = '2px';
                connectors.c2.style.height = `${avatarRect.top - stationRect.bottom - 20}px`;

                connectors.c3.style.top = `${avatarRect.bottom - containerRect.top + 10}px`;
                connectors.c3.style.left = `${avatarRect.left + avatarRect.width / 2 - containerRect.left}px`;
                connectors.c3.style.width = '2px';
                connectors.c3.style.height = `${servicesRect.top - avatarRect.bottom - 20}px`;
            } else {
                 // Horizontal layout
                connectors.c1.style.top = `${citizenRect.top + citizenRect.height / 2 - containerRect.top}px`;
                connectors.c1.style.left = `${citizenRect.right - containerRect.left}px`;
                connectors.c1.style.width = `${stationRect.left - citizenRect.right}px`;
                connectors.c1.style.height = '2px';

                connectors.c2.style.top = `${stationRect.top + stationRect.height / 2 - containerRect.top}px`;
                connectors.c2.style.left = `${stationRect.right - containerRect.left}px`;
                connectors.c2.style.width = `${avatarRect.left - stationRect.right}px`;
                connectors.c2.style.height = '2px';

                connectors.c3.style.top = `${avatarRect.top + avatarRect.height / 2 - containerRect.top}px`;
                connectors.c3.style.left = `${avatarRect.right - containerRect.left}px`;
                connectors.c3.style.width = `${servicesRect.left - avatarRect.right}px`;
                connectors.c3.style.height = '2px';
            }
        };
        
        let step = 0;
        const diagramObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    drawConnectors(); // Draw first
                    const interval = setInterval(() => {
                        step++;
                        if (step > nodes.length) { clearInterval(interval); return; }
                        nodes.forEach(n => n.classList.remove('active'));
                        if (nodes[step-1]) nodes[step-1].classList.add('active');
                        if (connectors[`c${step-1}`]) connectors[`c${step-1}`].style.transform = 'scaleX(1)';
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
                datasets: [{
                    label: 'Sistema Actual', data: [100, 100, 100, 40],
                    backgroundColor: '#cbd5e1', borderColor: '#94a3b8', borderWidth: 1, borderRadius: 4
                }, {
                    label: 'Con Oráculo Digital', data: [10, 30, 40, 100],
                    backgroundColor: '#2dd4bf', borderColor: '#0d9488', borderWidth: 1, borderRadius: 4
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: { y: { beginAtZero: true, max: 110, ticks: { callback: (value) => value + '%' } } },
                plugins: {
                    title: { display: true, text: 'Índice de Eficiencia Cívica (Estimado)', font: { size: 16 } },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) { label += ': '; }
                                label += `${context.parsed.y}%`;
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

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

    // --- LÓGICA PARA EL REPRODUCTOR DE AUDIO ---
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
