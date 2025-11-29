// ==========================================================
// 1. MOBILE NAVIGATION AND SITE LOGIC (Must run first)
// ==========================================================

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');
    
    // Safety checks for header visibility
    if (header) {
        header.style.display = 'block';
        header.style.visibility = 'visible';
        header.style.opacity = '1';
    }
    
    // ⭐ BFCache FIX: Force menu state reset on browser back/forward
    window.addEventListener('pageshow', function(event) {
        if (event.persisted) {
            if (header) {
                header.style.display = 'block';
                header.style.visibility = 'visible';
                header.style.opacity = '1';
            }
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
            if (hamburger && hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
            }
        }
    });
    
    // === Hamburger Click Handler (FIXES mobile menu activation) ===
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            if (header) {
                header.style.display = 'block';
            }
            
            if (navMenu.classList.contains('active')) {
                animateMenuOpen();
            } else {
                animateMenuClose();
            }
        });
    }
    // ===================================================
    
    // Staggered menu item animations on open/close (functions defined here)
    function animateMenuOpen() {
        navMenu.style.animation = 'fadeIn 0.4s ease-out forwards';
        
        navLinks.forEach((link, index) => {
            link.style.animation = 'none';
            setTimeout(() => {
                link.style.animation = `slideInLeft 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.08}s forwards, fadeIn 0.5s ease-out ${index * 0.08}s forwards`;
            }, 10);
        });
    }
    
    function animateMenuClose() {
        navLinks.forEach((link, index) => {
            link.style.animation = `slideOutLeft 0.5s ease-in ${index * 0.05}s forwards, fadeOut 0.3s ease-in ${index * 0.05}s forwards`;
        });
        
        setTimeout(() => {
            navMenu.style.animation = 'fadeOut 0.3s ease-in forwards';
        }, 150);
    }
    
    // Close menu when clicking link/outside
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger && navMenu) {
                // Ensure menu closes quickly on link click
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    // ... (All other logic: close on outside click, resize handler, smooth scrolling) ...
    document.addEventListener('click', function(event) {
        if (hamburger && navMenu && navMenu.classList.contains('active')) {
            if (!event.target.closest('.hamburger') && !event.target.closest('.nav-menu')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                animateMenuClose();
            }
        }
    });
    
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navMenu) {
            navMenu.classList.remove('active');
            if (hamburger) {
                hamburger.classList.remove('active');
            }
        }
    });
    
    // Smooth Scrolling logic (Keep existing logic)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                if (navMenu && navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    animateMenuClose();
                    setTimeout(() => { smoothScrollTo(target); }, 300);
                } else {
                    smoothScrollTo(target);
                }
            }
        });
    });

    function smoothScrollTo(target) {
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition - 80;
        const duration = 800;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function easeInOutCubic(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t + b;
            t -= 2;
            return c / 2 * (t * t * t + 2) + b;
        }

        requestAnimationFrame(animation);
    }
});


// ==========================================================
// 2. HERO ANIMATION CLASS (Your new code for mobile fix, runs after DOMContentLoaded)
// ==========================================================
class HeroAnimation {
    constructor() {
        this.container = document.getElementById('hero-canvas');
        if (!this.container) return;

        this.isMobile = window.innerWidth <= 768;
        
        if (this.isMobile) {
            this.createMobileFallback();
            return;
        }

        // [Keep your existing desktop Three.js code here if applicable]
    }

    createMobileFallback() {
        this.container.innerHTML = `
            <div class="mobile-hero-bg" style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #8B7355 0%, #D4AF37 50%, #E83C91 100%);
                opacity: 0.4;
                animation: mobileWave 8s ease-in-out infinite;
            "></div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes mobileWave {
                0%, 100% { transform: scale(1) rotate(0deg); }
                50% { transform: scale(1.1) rotate(1deg); }
            }
        `;
        document.head.appendChild(style);
        
        document.dispatchEvent(new Event('heroLoaded'));
    }
}
new HeroAnimation();


// ==========================================================
// 3. INJECTED CSS STYLES (Keep outside DOMContentLoaded)
// ==========================================================

const navbarFixStyles = `
    .header {
        /* Prevents disappearing on BFCache */
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        position: fixed !important;
        top: 0 !important;
        width: 100% !important;
        z-index: 1000 !important;
        transform: translateZ(0);
    }
    
    /* Smooth scrolling for the whole page */
    html {
        scroll-behavior: smooth;
    }
    
    /* Performance optimizations */
    .nav-menu, .nav-link {
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
    }
    
    @keyframes slideInLeft {
        from { opacity: 0; transform: translateX(-30px); }
        to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes slideOutLeft {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(-30px); }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; background: rgba(10, 10, 10, 0); }
        to { opacity: 1; background: rgba(10, 10, 10, 0.95); }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; background: rgba(10, 10, 10, 0.95); }
        to { opacity: 0; background: rgba(10, 10, 10, 0); }
    }

    .nav-item, .nav-link {
        background: transparent !important;
    }
`;

// Inject the styles
const style = document.createElement('style');
style.textContent = navbarFixStyles;
document.head.appendChild(style);