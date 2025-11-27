// Premium mobile navigation with enhanced fade animations
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Staggered animation for nav items
            if (navMenu.classList.contains('active')) {
                animateMenuOpen();
            } else {
                animateMenuClose();
            }
        });
    }
    
    // Staggered menu item animations on open with fade & slide
    function animateMenuOpen() {
        // Fade in background overlay
        navMenu.style.animation = 'fadeIn 0.4s ease-out forwards';
        
        navLinks.forEach((link, index) => {
            link.style.animation = 'none';
            setTimeout(() => {
                link.style.animation = `slideInLeft 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.08}s forwards, fadeIn 0.5s ease-out ${index * 0.08}s forwards`;
            }, 10);
        });
    }
    
    // Staggered menu item animations on close with fade & slide
    function animateMenuClose() {
        navLinks.forEach((link, index) => {
            link.style.animation = `slideOutLeft 0.5s ease-in ${index * 0.05}s forwards, fadeOut 0.3s ease-in ${index * 0.05}s forwards`;
        });
        
        // Fade out background overlay
        setTimeout(() => {
            navMenu.style.animation = 'fadeOut 0.3s ease-in forwards';
        }, 150);
    }
    
    // Close mobile menu when clicking on a link with smooth exit
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                animateMenuClose();
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.hamburger') && !event.target.closest('.nav-menu')) {
            if (navMenu && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                animateMenuClose();
            }
        }
    });
    
    // Smooth scrolling for anchor links with menu close
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                // Close menu first
                if (navMenu && navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    animateMenuClose();
                    
                    // Scroll after menu closes
                    setTimeout(() => {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 300);
                } else {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
});

// CSS animations with premium fade effects
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOutLeft {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(-30px);
        }
    }
    
    @keyframes fadeIn {
        from {
            opacity: 0;
            background: rgba(10, 10, 10, 0);
        }
        to {
            opacity: 1;
            background: rgba(10, 10, 10, 0.95);
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
            background: rgba(10, 10, 10, 0.95);
        }
        to {
            opacity: 0;
            background: rgba(10, 10, 10, 0);
        }
    }

    .nav-item {
        background: transparent !important;
    }
    
    .nav-link {
        background: transparent !important;
    }
    
    @keyframes fadeInText {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    
    @keyframes fadeOutText {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);