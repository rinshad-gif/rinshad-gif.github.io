class HeroAnimation {
    constructor() {
        this.container = document.getElementById('hero-canvas');
        if (!this.container) return;

        // Check if mobile and use simpler animation
        this.isMobile = window.innerWidth <= 768;
        
        if (this.isMobile) {
            this.createMobileFallback();
            return;
        }

        // Original Three.js code for desktop...
        // [Keep your existing desktop code here]
    }

    createMobileFallback() {
        // Simple CSS animation for mobile instead of heavy Three.js
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
        
        // Add CSS for mobile animation
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