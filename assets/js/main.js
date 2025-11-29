// Add this RIGHT AFTER your DOMContentLoaded event listener
// ==========================================================
// ⭐ ENHANCED BFCache FIX: Force complete navbar repaint
// ==========================================================

// Listen for pageshow event (triggers on back/forward navigation)
window.addEventListener('pageshow', function(event) {
    // This fires when page is loaded from back/forward cache
    if (event.persisted) {
        console.log('Back/Forward navigation detected - fixing navbar visibility');
        
        const header = document.querySelector('.header');
        const navLinks = document.querySelectorAll('.nav-link');
        const navMenu = document.querySelector('.nav-menu');
        
        // CRITICAL: Force complete style reset and repaint
        if (header) {
            // Remove and re-add classes to force repaint
            header.classList.remove('header');
            void header.offsetWidth; // Trigger reflow
            header.classList.add('header');
            
            // Force visibility styles
            header.style.cssText = `
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                position: fixed !important;
                top: 0 !important;
                width: 100% !important;
                z-index: 1000 !important;
            `;
        }
        
        // Force nav links to be visible
        navLinks.forEach(link => {
            link.style.cssText = `
                color: var(--primary-nav-color) !important;
                visibility: visible !important;
                opacity: 1 !important;
                display: block !important;
            `;
        });
        
        // Ensure mobile menu is closed
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
        
        const hamburger = document.querySelector('.hamburger');
        if (hamburger && hamburger.classList.contains('active')) {
            hamburger.classList.remove('active');
        }
        
        // Add a class to body for CSS targeting
        document.body.classList.add('pageshow');
        
        // Remove the class after a short delay
        setTimeout(() => {
            document.body.classList.remove('pageshow');
        }, 100);
    }
});

// Additional safety: Also fix visibility on regular page load
window.addEventListener('load', function() {
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (header) {
        header.style.visibility = 'visible';
        header.style.opacity = '1';
    }
    
    navLinks.forEach(link => {
        link.style.visibility = 'visible';
        link.style.opacity = '1';
    });
});

// Fix for Safari specifically (known back/forward cache issues)
if (navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
    window.addEventListener('beforeunload', function() {
        // Force styles to be reapplied when returning to page
        const header = document.querySelector('.header');
        if (header) {
            header.style.visibility = 'visible';
        }
    });
}