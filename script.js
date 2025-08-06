// ===== TVA FILARMONICA INTERACTIVE EFFECTS =====

class TVAFilarmonica {
    constructor() {
        this.init();
        this.bindEvents();
        this.startAnimations();
    }

    init() {
        this.cursorTrail = document.querySelector('.cursor-trail');
        this.mainVinyl = document.querySelector('.main-vinyl');
        this.particleContainer = document.querySelector('.vinyl-particles-container');
        this.showcaseItems = document.querySelectorAll('.showcase-item');
        this.timelineNodes = document.querySelectorAll('.timeline-node');
        this.soundBars = document.querySelectorAll('.sound-bar');
        
        // Particle system variables
        this.particles = [];
        this.particleSymbols = ['♪', '♫', '♩', '♬', '𝄞', '𝄢', '♭', '♯'];
        this.particleColors = ['#d4af37', '#ff6b35', '#7fb069', '#f1d4e0'];
        
        // Animation state
        this.isVinylHovered = false;
        this.animationFrame = null;
        
        this.setupInitialAnimations();
    }

    bindEvents() {
        // Cursor trail
        document.addEventListener('mousemove', (e) => this.updateCursorTrail(e));
        
        // Vinyl interactions
        if (this.mainVinyl) {
            this.mainVinyl.addEventListener('mouseenter', () => this.startVinylParticles());
            this.mainVinyl.addEventListener('mouseleave', () => this.stopVinylParticles());
        }
        
        // Showcase item tilt effects
        this.showcaseItems.forEach(item => this.addTiltEffect(item));
        
        // Timeline interactions
        this.timelineNodes.forEach((node, index) => {
            node.addEventListener('click', () => this.handleTimelineClick(index));
            node.addEventListener('mouseenter', () => this.highlightTimelineNode(node));
            node.addEventListener('mouseleave', () => this.unhighlightTimelineNode(node));
        });
        
        // Button interactions
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => this.enhanceButtonHover(btn));
            btn.addEventListener('mouseleave', () => this.resetButtonHover(btn));
        });
        
        // Scroll animations
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Resize handler
        window.addEventListener('resize', () => this.handleResize());
        
        // Logo glitch effect
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.addEventListener('click', () => this.triggerLogoGlitch());
        }
    }

    setupInitialAnimations() {
        // Add fade-in animations to elements
        const elementsToAnimate = [
            '.hero-content',
            '.hero-vinyl',
            '.showcase-item',
            '.timeline-container'
        ];
        
        elementsToAnimate.forEach((selector, index) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element, i) => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                setTimeout(() => {
                    element.classList.add('fade-in-up');
                }, (index * 200) + (i * 100));
            });
        });
    }

    updateCursorTrail(e) {
        if (this.cursorTrail) {
            this.cursorTrail.style.left = e.clientX - 10 + 'px';
            this.cursorTrail.style.top = e.clientY - 10 + 'px';
        }
    }

    startVinylParticles() {
        this.isVinylHovered = true;
        this.createParticleSystem();
    }

    stopVinylParticles() {
        this.isVinylHovered = false;
        // Clear existing particles
        this.particles = [];
        if (this.particleContainer) {
            this.particleContainer.innerHTML = '';
        }
    }

    createParticleSystem() {
        if (!this.isVinylHovered || !this.particleContainer) return;

        // Create a new particle
        const particle = this.createParticle();
        this.particles.push(particle);
        this.particleContainer.appendChild(particle.element);

        // Clean up old particles
        this.particles = this.particles.filter(p => !p.isDead);

        // Continue creating particles
        setTimeout(() => this.createParticleSystem(), 200 + Math.random() * 300);
    }

    createParticle() {
        const element = document.createElement('div');
        element.className = 'musical-particle';
        
        // Random particle properties
        const symbol = this.particleSymbols[Math.floor(Math.random() * this.particleSymbols.length)];
        const color = this.particleColors[Math.floor(Math.random() * this.particleColors.length)];
        const size = 1 + Math.random() * 0.8;
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 50;
        
        // Position around the vinyl center
        const centerX = 150; // Half of vinyl container width
        const centerY = 150; // Half of vinyl container height
        const startX = centerX + Math.cos(angle) * 80;
        const startY = centerY + Math.sin(angle) * 80;
        
        element.textContent = symbol;
        element.style.left = startX + 'px';
        element.style.top = startY + 'px';
        element.style.color = color;
        element.style.fontSize = size + 'rem';
        element.style.textShadow = `0 0 10px ${color}`;
        
        // Particle lifecycle
        const particle = {
            element,
            isDead: false,
            life: 0,
            maxLife: 4000 + Math.random() * 2000
        };
        
        // Remove particle after animation
        setTimeout(() => {
            particle.isDead = true;
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, particle.maxLife);
        
        return particle;
    }

    addTiltEffect(element) {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const mouseX = e.clientX - centerX;
            const mouseY = e.clientY - centerY;
            
            const rotateX = (mouseY / rect.height) * 10;
            const rotateY = (mouseX / rect.width) * -10;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    }

    handleTimelineClick(index) {
        const years = [1791, 1973, 2000, 2025];
        const descriptions = [
            "Era dorada de la música filarmónica clásica",
            "Revolución de las grabaciones de alta fidelidad",
            "Digitalización del archivo musical temporal",
            "Presente: Preservación interdimensional activa"
        ];
        
        // Create popup notification
        this.showTimelineInfo(years[index], descriptions[index]);
        
        // Add visual feedback
        const node = this.timelineNodes[index];
        node.style.transform = 'translateY(-50%) scale(1.5)';
        node.classList.add('glow-gold');
        
        setTimeout(() => {
            node.style.transform = 'translateY(-50%) scale(1)';
            node.classList.remove('glow-gold');
        }, 500);
    }

    showTimelineInfo(year, description) {
        // Create temporary info popup
        const popup = document.createElement('div');
        popup.className = 'timeline-popup';
        popup.innerHTML = `
            <div class="popup-year">${year}</div>
            <div class="popup-description">${description}</div>
        `;
        
        // Style the popup
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
            animation: 'fadeInUp 0.3s ease'
        });
        
        document.body.appendChild(popup);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            popup.style.opacity = '0';
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.parentNode.removeChild(popup);
                }
            }, 300);
        }, 3000);
        
        // Click to dismiss
        popup.addEventListener('click', () => {
            popup.style.opacity = '0';
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.parentNode.removeChild(popup);
                }
            }, 300);
        });
    }

    highlightTimelineNode(node) {
        node.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.8)';
        node.style.transform = 'translateY(-50%) scale(1.2)';
    }

    unhighlightTimelineNode(node) {
        node.style.boxShadow = '';
        node.style.transform = 'translateY(-50%) scale(1)';
    }

    enhanceButtonHover(btn) {
        // Add particle effect for crowdfunding button
        if (btn.classList.contains('btn-crowdfunding')) {
            this.createButtonParticles(btn);
        }
        
        // Enhanced glow effect
        btn.style.filter = 'brightness(1.2)';
    }

    resetButtonHover(btn) {
        btn.style.filter = '';
    }

    createButtonParticles(btn) {
        const particleContainer = btn.querySelector('.btn-particles');
        if (!particleContainer) return;
        
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style.position = 'absolute';
                particle.style.width = '4px';
                particle.style.height = '4px';
                particle.style.background = '#d4af37';
                particle.style.borderRadius = '50%';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.animation = 'particleFloat 1s ease-out forwards';
                particle.style.pointerEvents = 'none';
                
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
        const logo = document.querySelector('.logo');
        if (!logo) return;
        
        logo.style.animation = 'none';
        setTimeout(() => {
            logo.style.animation = 'logoGlitch 0.3s ease-in-out';
        }, 10);
        
        // Add random color shift
        const colors = ['#d4af37', '#ff6b35', '#7fb069', '#f1d4e0'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        logo.style.textShadow = `0 0 50px ${randomColor}`;
        
        setTimeout(() => {
            logo.style.textShadow = '0 0 30px rgba(212, 175, 55, 0.6)';
        }, 300);
    }

    startAnimations() {
        // Sound visualizer animation
        this.animateSoundBars();
        
        // Continuous background animations
        this.animateBackgroundElements();
    }

    animateSoundBars() {
        if (!this.soundBars.length) return;
        
        setInterval(() => {
            this.soundBars.forEach(bar => {
                const randomHeight = 15 + Math.random() * 30;
                bar.style.height = randomHeight + 'px';
            });
        }, 150);
    }

    animateBackgroundElements() {
        // Animate holographic elements with random intensity changes
        const holoElements = document.querySelectorAll('.holo-circle, .holo-hexagon');
        
        setInterval(() => {
            holoElements.forEach(element => {
                const randomOpacity = 0.05 + Math.random() * 0.1;
                element.style.opacity = randomOpacity;
            });
        }, 2000);
        
        // Random wave generation
        setInterval(() => {
            this.createRandomWave();
        }, 5000);
    }

    createRandomWave() {
        const wavesContainer = document.querySelector('.temporal-waves');
        if (!wavesContainer) return;
        
        const wave = document.createElement('div');
        wave.className = 'wave';
        wave.style.position = 'absolute';
        wave.style.border = '1px solid rgba(212, 175, 55, 0.1)';
        wave.style.borderRadius = '50%';
        wave.style.width = '100px';
        wave.style.height = '100px';
        wave.style.left = Math.random() * 80 + '%';
        wave.style.top = Math.random() * 80 + '%';
        wave.style.animation = 'waveExpand 6s ease-out forwards';
        
        wavesContainer.appendChild(wave);
        
        setTimeout(() => {
            if (wave.parentNode) {
                wave.parentNode.removeChild(wave);
            }
        }, 6000);
    }

    handleScroll() {
        // Parallax effect for floating elements
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        const floatingVinyls = document.querySelectorAll('.vinyl');
        floatingVinyls.forEach((vinyl, index) => {
            const speed = 0.3 + (index * 0.1);
            vinyl.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
        
        // Reveal animations for elements coming into view
        const elements = document.querySelectorAll('.showcase-item, .timeline-container');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight * 0.75) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    handleResize() {
        // Adjust particle system for different screen sizes
        if (window.innerWidth < 768) {
            this.particleSymbols = ['♪', '♫', '♩', '♬']; // Reduce complexity on mobile
        } else {
            this.particleSymbols = ['♪', '♫', '♩', '♬', '𝄞', '𝄢', '♭', '♯'];
        }
    }

    // Utility functions
    createRippleEffect(element, x, y) {
        const ripple = document.createElement('div');
        ripple.style.position = 'absolute';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.width = '0';
        ripple.style.height = '0';
        ripple.style.border = '2px solid rgba(212, 175, 55, 0.6)';
        ripple.style.borderRadius = '50%';
        ripple.style.animation = 'rippleExpand 0.6s ease-out forwards';
        ripple.style.pointerEvents = 'none';
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    // Easter egg: Konami code for special effect
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
        // Secret TVA portal effect
        const portal = document.createElement('div');
        portal.style.position = 'fixed';
        portal.style.top = '50%';
        portal.style.left = '50%';
        portal.style.transform = 'translate(-50%, -50%)';
        portal.style.width = '0';
        portal.style.height = '0';
        portal.style.background = 'conic-gradient(from 0deg, #ff6b35, #d4af37, #7fb069, #5f021f, #ff6b35)';
        portal.style.borderRadius = '50%';
        portal.style.zIndex = '10000';
        portal.style.animation = 'portalExpand 2s ease-out forwards';
        
        document.body.appendChild(portal);
        
        // Play with the logo
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.textContent = 'TVA PORTAL ACTIVATED';
            setTimeout(() => {
                logo.textContent = 'LA FIL';
            }, 3000);
        }
        
        setTimeout(() => {
            if (portal.parentNode) {
                portal.parentNode.removeChild(portal);
            }
        }, 2000);
    }
}

// CSS animations to add dynamically
const additionalStyles = `
    @keyframes rippleExpand {
        0% { width: 0; height: 0; opacity: 1; }
        100% { width: 100px; height: 100px; opacity: 0; }
    }
    
    @keyframes portalExpand {
        0% { width: 0; height: 0; opacity: 0; }
        50% { width: 300px; height: 300px; opacity: 1; }
        100% { width: 0; height: 0; opacity: 0; }
    }
`;

// Add additional styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const tvaApp = new TVAFilarmonica();
    tvaApp.setupKonamiCode(); // Easter egg
    
    // Add click ripple effects to interactive elements
    document.querySelectorAll('.btn, .showcase-item, .timeline-node').forEach(element => {
        element.addEventListener('click', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            tvaApp.createRippleEffect(element, x, y);
        });
    });
});

// Service worker registration for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(registrationError => console.log('SW registration failed'));
    });
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TVAFilarmonica;
}