class TVAFilarmonica {
    constructor() {
        this.init();
        this.bindEvents();
        this.startAnimations();
        this.initRepertorioSwitch();
    }

    init() {
        this.cursorTrail = document.querySelector('.cursor-trail');
        this.mainVinyl = document.querySelector('.main-vinyl');
        this.particleContainer = document.querySelector('.vinyl-particles-container');
        this.showcaseItems = document.querySelectorAll('.showcase-item');
        this.timelineNodes = document.querySelectorAll('.timeline-node');
        this.soundBars = document.querySelectorAll('.sound-bar');
        
        this.particles = [];
        this.particleSymbols = ['♪', '♫', '♩', '♬', '𝄞', '𝄢', '♭', '♯'];
        this.particleColors = ['#d4af37', '#ff6b35', '#7fb069', '#f1d4e0'];
        
        this.isVinylHovered = false;
        this.animationFrame = null;
        this.currentRepertorio = 'clasico';

        this.debouncedHandleScroll = this.debounce(this.handleScroll.bind(this), 16);
        this.debouncedHandleResize = this.debounce(this.handleResize.bind(this), 200);
        
        this.setupInitialAnimations();
        this.setupLazyLoading();
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    initRepertorioSwitch() {
        this.switchButtons = document.querySelectorAll('.switch-btn');
        this.clasicoGrid = document.querySelector('.showcase-grid[data-repertorio="clasico"]');
        this.navidadGrid = document.querySelector('.showcase-grid[data-repertorio="navidad"]');

        this.switchButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const repertorio = btn.dataset.repertorio;
                if (repertorio !== this.currentRepertorio) {
                    this.cambiarRepertorio(repertorio, btn);
                }
            });
        });
    }

    cambiarRepertorio(nuevoRepertorio, btnClicked) {
        const currentGrid = this.currentRepertorio === 'clasico' ? this.clasicoGrid : this.navidadGrid;
        const nextGrid = nuevoRepertorio === 'clasico' ? this.clasicoGrid : this.navidadGrid;

        this.switchButtons.forEach(btn => btn.classList.remove('active'));
        btnClicked.classList.add('active');

        currentGrid.classList.add('glitch-out');

        setTimeout(() => {
            currentGrid.style.display = 'none';
            currentGrid.classList.remove('glitch-out');

            nextGrid.style.display = 'grid';
            nextGrid.style.opacity = '0';

            requestAnimationFrame(() => {
                nextGrid.classList.add('fade-in');
                nextGrid.style.opacity = '1';
            });

            setTimeout(() => {
                nextGrid.classList.remove('fade-in');
                this.reinitializeShowcaseItems();
            }, 600);

            this.currentRepertorio = nuevoRepertorio;
        }, 500);
    }

    reinitializeShowcaseItems() {
        this.showcaseItems = document.querySelectorAll('.showcase-item');
        this.showcaseItems.forEach(item => {
            if (!item.dataset.tiltInitialized) {
                this.addTiltEffect(item);
                item.dataset.tiltInitialized = 'true';
            }
        });
    }

    bindEvents() {
        document.addEventListener('mousemove', (e) => this.updateCursorTrail(e));
        
        if (this.mainVinyl) {
            this.mainVinyl.addEventListener('mouseenter', () => this.startVinylParticles());
            this.mainVinyl.addEventListener('mouseleave', () => this.stopVinylParticles());
        }
        
        this.showcaseItems.forEach(item => this.addTiltEffect(item));
        
        this.timelineNodes.forEach((node, index) => {
            node.addEventListener('click', () => this.handleTimelineClick(index));
            node.addEventListener('mouseenter', () => this.highlightTimelineNode(node));
            node.addEventListener('mouseleave', () => this.unhighlightTimelineNode(node));
        });
        
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => this.enhanceButtonHover(btn));
            btn.addEventListener('mouseleave', () => this.resetButtonHover(btn));
        });

        window.addEventListener('scroll', this.debouncedHandleScroll, { passive: true });
        window.addEventListener('resize', this.debouncedHandleResize);
        
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.addEventListener('click', () => this.triggerLogoGlitch());
        }

        this.setupButtonClickEffects();
    }

    setupButtonClickEffects() {
        document.querySelectorAll('.btn-ver-mas').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                this.createRippleEffect(btn, x, y);
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = '';
                }, 150);
            });

            btn.addEventListener('mouseenter', (e) => {
                btn.style.filter = 'brightness(1.1)';
            });

            btn.addEventListener('mouseleave', (e) => {
                btn.style.filter = '';
            });
        });
    }

    setupInitialAnimations() {
        const elementsToAnimate = [
            '.hero-content',
            '.hero-vinyl',
            '.showcase-item',
            '.timeline-container'
        ];

        let animationIndex = 0;
        
        const animateNext = () => {
            if (animationIndex < elementsToAnimate.length) {
                const selector = elementsToAnimate[animationIndex];
                const elements = document.querySelectorAll(selector);
                
                elements.forEach((element, i) => {
                    element.style.opacity = '0';
                    element.style.transform = 'translateY(30px)';
                    setTimeout(() => {
                        element.classList.add('fade-in-up');
                    }, i * 100);
                });
                
                animationIndex++;
                setTimeout(animateNext, 200);
            }
        };
        
        requestAnimationFrame(animateNext);
    }

    updateCursorTrail(e) {
        if (this.cursorTrail) {
            requestAnimationFrame(() => {
                this.cursorTrail.style.left = e.clientX - 10 + 'px';
                this.cursorTrail.style.top = e.clientY - 10 + 'px';
            });
        }
    }

    startVinylParticles() {
        this.isVinylHovered = true;
        this.createParticleSystem();
    }

    stopVinylParticles() {
        this.isVinylHovered = false;
        this.particles = [];
        if (this.particleContainer) {
            const currentParticles = this.particleContainer.querySelectorAll('.musical-particle');
            currentParticles.forEach(particle => {
                particle.style.opacity = '0';
                particle.style.transform = 'scale(0)';
            });
            
            setTimeout(() => {
                this.particleContainer.innerHTML = '';
            }, 300);
        }
    }

    createParticleSystem() {
        if (!this.isVinylHovered || !this.particleContainer) return;

        const particle = this.createParticle();
        this.particles.push(particle);
        this.particleContainer.appendChild(particle.element);

        this.particles = this.particles.filter(p => !p.isDead);

        setTimeout(() => this.createParticleSystem(), 200 + Math.random() * 300);
    }

    createParticle() {
        const element = document.createElement('div');
        element.className = 'musical-particle';
        
        const symbol = this.particleSymbols[Math.floor(Math.random() * this.particleSymbols.length)];
        const color = this.particleColors[Math.floor(Math.random() * this.particleColors.length)];
        const size = 1 + Math.random() * 0.8;
        const angle = Math.random() * Math.PI * 2;
        
        const centerX = 150;
        const centerY = 150;
        const startX = centerX + Math.cos(angle) * 80;
        const startY = centerY + Math.sin(angle) * 80;
        
        element.textContent = symbol;
        element.style.left = startX + 'px';
        element.style.top = startY + 'px';
        element.style.color = color;
        element.style.fontSize = size + 'rem';
        element.style.textShadow = `0 0 10px ${color}`;
        element.style.opacity = '0';
        element.style.transform = 'scale(0)';

        requestAnimationFrame(() => {
            element.style.transition = 'all 0.3s ease';
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        });
        
        const particle = {
            element,
            isDead: false,
            life: 0,
            maxLife: 4000 + Math.random() * 2000
        };
        
        setTimeout(() => {
            particle.isDead = true;
            element.style.opacity = '0';
            element.style.transform = 'scale(0)';
            setTimeout(() => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }, 300);
        }, particle.maxLife);
        
        return particle;
    }

    addTiltEffect(element) {
        let tiltTimeout;
        
        element.addEventListener('mousemove', (e) => {
            clearTimeout(tiltTimeout);
            
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            
            const rotateX = (mouseY / rect.height) * 10;
            const rotateY = (mouseX / rect.width) * -10;
            
            requestAnimationFrame(() => {
                element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            });
        });
        
        element.addEventListener('mouseleave', () => {
            tiltTimeout = setTimeout(() => {
                element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
            }, 100);
        });
    }

    handleTimelineClick(index) {
        const years = [1791, 1973, 2000, 2025];
        const descriptions = [
            "Era naciente de la música filarmónica clásica",
            "Revolución de las grabaciones de alta fidelidad",
            "Digitalización del archivo musical temporal",
            "Presente: Preservación musical activa"
        ];
        
        this.showTimelineInfo(years[index], descriptions[index]);
        
        const node = this.timelineNodes[index];
        requestAnimationFrame(() => {
            node.style.transform = 'translateY(-50%) scale(1.5)';
            node.classList.add('glow-gold');
        });
        
        setTimeout(() => {
            requestAnimationFrame(() => {
                node.style.transform = 'translateY(-50%) scale(1)';
                node.classList.remove('glow-gold');
            });
        }, 500);
    }

    showTimelineInfo(year, description) {
        const existingPopup = document.querySelector('.timeline-popup');
        if (existingPopup) {
            existingPopup.remove();
        }

        const popup = document.createElement('div');
        popup.className = 'timeline-popup';
        popup.innerHTML = `
            <div class="popup-year">${year}</div>
            <div class="popup-description">${description}</div>
            <div class="popup-close">✕</div>
        `;
        
        Object.assign(popup.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(95, 2, 31, 0.95)',
            color: 'white',
            padding: '2rem',
            borderRadius: '15px',
            border: '2px solid #d4af37',
            textAlign: 'center',
            zIndex: '10000',
            backdropFilter: 'blur(10px)',
            animation: 'fadeInUp 0.3s ease',
            maxWidth: '400px',
            cursor: 'pointer'
        });

        const closeBtn = popup.querySelector('.popup-close');
        Object.assign(closeBtn.style, {
            position: 'absolute',
            top: '10px',
            right: '15px',
            fontSize: '1.2rem',
            cursor: 'pointer',
            opacity: '0.7'
        });
        
        document.body.appendChild(popup);
        
        const closePopup = () => {
            popup.style.opacity = '0';
            popup.style.transform = 'translate(-50%, -50%) scale(0.9)';
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.parentNode.removeChild(popup);
                }
            }, 300);
        };

        setTimeout(closePopup, 4000);
        popup.addEventListener('click', closePopup);

        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closePopup();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    highlightTimelineNode(node) {
        requestAnimationFrame(() => {
            node.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.8)';
            node.style.transform = 'translateY(-50%) scale(1.2)';
        });
    }

    unhighlightTimelineNode(node) {
        requestAnimationFrame(() => {
            node.style.boxShadow = '';
            node.style.transform = 'translateY(-50%) scale(1)';
        });
    }

    enhanceButtonHover(btn) {
        if (btn.classList.contains('btn-crowdfunding')) {
            this.createButtonParticles(btn);
        }
        
        requestAnimationFrame(() => {
            btn.style.filter = 'brightness(1.2)';
        });
    }

    resetButtonHover(btn) {
        requestAnimationFrame(() => {
            btn.style.filter = '';
        });
    }

    createButtonParticles(btn) {
        const particleContainer = btn.querySelector('.btn-particles');
        if (!particleContainer) return;
        
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: #d4af37;
                    border-radius: 50%;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    animation: particleFloat 1s ease-out forwards;
                    pointer-events: none;
                `;
                
                particleContainer.appendChild(particle);
                
                setTimeout(() => {
                    if (particle.parentNode) {
                        particle.parentNode.removeChild(particle);
                    }
                }, 1000);
            }, i * 100);
        }
    }

    triggerLogoGlitch() {
        const logoImage = document.querySelector('.logo-image');
        if (!logoImage) return;
        
        logoImage.style.animation = 'none';
        requestAnimationFrame(() => {
            logoImage.style.animation = 'logoGlitch 0.3s ease-in-out';
        });
        
        const colors = ['#d4af37', '#ff6b35', '#7fb069', '#f1d4e0'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        logoImage.style.filter = `drop-shadow(0 0 50px ${randomColor})`;
        
        setTimeout(() => {
            logoImage.style.filter = 'drop-shadow(0 0 30px rgba(212, 175, 55, 0.6))';
        }, 300);
    }

    startAnimations() {
        this.animateSoundBars();
        this.animateBackgroundElements();
    }

    animateSoundBars() {
        if (!this.soundBars.length) return;

        const animateBars = () => {
            this.soundBars.forEach(bar => {
                const randomHeight = 15 + Math.random() * 30;
                bar.style.height = randomHeight + 'px';
            });
            setTimeout(() => requestAnimationFrame(animateBars), 150);
        };
        
        animateBars();
    }

    animateBackgroundElements() {
        const holoElements = document.querySelectorAll('.holo-circle, .holo-hexagon');
        
        setInterval(() => {
            holoElements.forEach(element => {
                const randomOpacity = 0.05 + Math.random() * 0.1;
                requestAnimationFrame(() => {
                    element.style.opacity = randomOpacity;
                });
            });
        }, 2000);
        
        setInterval(() => {
            this.createRandomWave();
        }, 5000);
    }

    createRandomWave() {
        const wavesContainer = document.querySelector('.temporal-waves');
        if (!wavesContainer) return;
        
        const wave = document.createElement('div');
        wave.className = 'wave';
        wave.style.cssText = `
            position: absolute;
            border: 1px solid rgba(212, 175, 55, 0.1);
            border-radius: 50%;
            width: 100px;
            height: 100px;
            left: ${Math.random() * 80}%;
            top: ${Math.random() * 80}%;
            animation: waveExpand 6s ease-out forwards;
        `;
        
        wavesContainer.appendChild(wave);
        
        setTimeout(() => {
            if (wave.parentNode) {
                wave.parentNode.removeChild(wave);
            }
        }, 6000);
    }

    handleScroll() {
        const scrolled = window.pageYOffset;

        const floatingVinyls = document.querySelectorAll('.vinyl');
        floatingVinyls.forEach((vinyl, index) => {
            const speed = 0.3 + (index * 0.1);
            requestAnimationFrame(() => {
                vinyl.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
            });
        });

        if (!this.intersectionObserver) {
            this.intersectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        requestAnimationFrame(() => {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                        });
                    }
                });
            }, { threshold: 0.1 });
            
            document.querySelectorAll('.showcase-item, .timeline-container').forEach(element => {
                this.intersectionObserver.observe(element);
            });
        }
    }

    handleResize() {
        if (window.innerWidth < 768) {
            this.particleSymbols = ['♪', '♫', '♩', '♬'];
        } else {
            this.particleSymbols = ['♪', '♫', '♩', '♬', '𝄞', '𝄢', '♭', '♯'];
        }
        this.recalculateElements();
    }

    recalculateElements() {
        const showcaseItems = document.querySelectorAll('.showcase-item');
        showcaseItems.forEach(item => {
            item.style.transform = '';
        });
    }

    createRippleEffect(element, x, y) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 0;
            height: 0;
            border: 2px solid rgba(212, 175, 55, 0.6);
            border-radius: 50%;
            animation: rippleExpand 0.6s ease-out forwards;
            pointer-events: none;
            z-index: 100;
        `;
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    setupKonamiCode() {
        const konamiCode = [
            'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
            'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
            'KeyB', 'KeyA'
        ];
        let konamiIndex = 0;
        
        document.addEventListener('keydown', (e) => {
            if (e.code === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    this.triggerSpecialEffect();
                    konamiIndex = 0;
                }
            } else {
                konamiIndex = 0;
            }
        });
    }

    triggerSpecialEffect() {
        const portal = document.createElement('div');
        portal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 0;
            height: 0;
            background: conic-gradient(from 0deg, #ff6b35, #d4af37, #7fb069, #5f021f, #ff6b35);
            border-radius: 50%;
            z-index: 10000;
            animation: portalExpand 2s ease-out forwards;
        `;
        
        document.body.appendChild(portal);
        
        const logoImage = document.querySelector('.logo-image');
        if (logoImage) {
            const originalFilter = logoImage.style.filter;
            logoImage.style.filter = 'hue-rotate(180deg) saturate(2)';
            
            setTimeout(() => {
                logoImage.style.filter = originalFilter;
            }, 3000);
        }
        
        this.createPortalParticles();
        
        setTimeout(() => {
            if (portal.parentNode) {
                portal.parentNode.removeChild(portal);
            }
        }, 2000);
    }

    createPortalParticles() {
        const particleContainer = document.createElement('div');
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        
        document.body.appendChild(particleContainer);
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                const symbols = ['⚡', '🌌', '⭐', '✨', '🎵', '🎶'];
                const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                
                particle.textContent = randomSymbol;
                particle.style.cssText = `
                    position: absolute;
                    left: ${50 + (Math.random() - 0.5) * 40}%;
                    top: ${50 + (Math.random() - 0.5) * 40}%;
                    font-size: ${1 + Math.random()}rem;
                    color: #d4af37;
                    animation: portalParticleFloat 3s ease-out forwards;
                    pointer-events: none;
                `;
                
                particleContainer.appendChild(particle);
            }, i * 100);
        }
        
        setTimeout(() => {
            if (particleContainer.parentNode) {
                particleContainer.parentNode.removeChild(particleContainer);
            }
        }, 4000);
    }

    destroy() {
        window.removeEventListener('scroll', this.debouncedHandleScroll);
        window.removeEventListener('resize', this.debouncedHandleResize);

        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }

        this.particles = [];
        this.isVinylHovered = false;

        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }

    reinitialize() {
        this.destroy();
        this.init();
        this.bindEvents();
        this.startAnimations();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const tvaApp = new TVAFilarmonica();
    tvaApp.setupKonamiCode();

    document.querySelectorAll('.btn, .showcase-item, .timeline-node').forEach(element => {
        element.addEventListener('click', (e) => {
            if (!element.href || element.href.startsWith(window.location.origin)) {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                tvaApp.createRippleEffect(element, x, y);
            }
        });
    });

    window.addEventListener('error', (e) => {
        console.warn('LA FIL: Error capturado:', e.error);
    });

    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.tvaApp = tvaApp;
    }
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registrado');
            })
            .catch(registrationError => {
                console.log('Error al registrar Service Worker:', registrationError);
            });
    });
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = TVAFilarmonica;
}
