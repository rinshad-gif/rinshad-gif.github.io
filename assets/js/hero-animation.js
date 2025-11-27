class HeroAnimation {
    constructor() {
        this.container = document.getElementById('hero-canvas');
        if (!this.container) {
            console.error("Hero Canvas element not found!");
            return;
        }

        // 1. Setup Scene
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.z = 5; // Move camera back to see the plane

        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        this.container.appendChild(this.renderer.domElement);

        this.uniforms = {
            uTime: { value: 0 },
            uTexture: { value: null },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uImageAspect: { value: 1 } // Will be updated when image loads
        };

        this.init();
    }

    init() {
        // 2. Load Texture with CORS handling
        const loader = new THREE.TextureLoader();
        loader.setCrossOrigin('anonymous'); // CRITICAL: Allows Unsplash images to load

        // High Fashion Image (Clear, Model, Feminine, Moody)
        const imageURL = 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=2000&auto=format&fit=crop';

        loader.load(
            imageURL,
            (texture) => {
                // --- SUCCESS ---
                console.log("Texture loaded successfully");
                
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                
                // Pass texture to shader
                this.uniforms.uTexture.value = texture;
                
                // Calculate Image Aspect Ratio
                const imageAspect = texture.image.width / texture.image.height;
                this.uniforms.uImageAspect.value = imageAspect;

                this.createMesh();
                this.addEvents();
                this.animate();

                // Reveal Canvas smoothly
                this.container.classList.add('loaded');
                
                // CRITICAL FIX: Dispatch a custom event to signal the GSAP script
                document.dispatchEvent(new Event('heroLoaded'));
            },
            undefined,
            (error) => {
                // --- ERROR ---
                console.error("An error occurred loading the texture:", error);
            }
        );
    }

    createMesh() {
        // 3. Create Geometry (High segment count for smooth waves)
        const geometry = new THREE.PlaneGeometry(1, 1, 60, 60);

        // 4. Create Shader Material
        const material = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            side: THREE.DoubleSide, // Render both sides of the cloth
            vertexShader: `
                uniform float uTime;
                uniform vec2 uMouse;
                varying vec2 vUv;
                varying float vElevation;

                void main() {
                    vUv = uv;
                    vec3 pos = position;

                    // --- WIND SIMULATION (Sine Waves) ---
                    
                    // Large Wave (The primary wind direction)
                    float elevation = sin(pos.x * 3.0 + uTime * 0.5) * 0.1;
                    
                    // Secondary Ripple (Detail)
                    elevation += sin(pos.y * 5.0 + uTime * 0.8) * 0.05;

                    // Diagonal Fold (Complexity)
                    elevation += sin((pos.x + pos.y) * 4.0 + uTime * 0.3) * 0.02;

                    // Apply elevation to Z-axis
                    pos.z += elevation;
                    
                    // Pass elevation to fragment shader for shadows
                    vElevation = elevation;

                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D uTexture;
                uniform vec2 uResolution;
                uniform float uImageAspect;
                
                varying vec2 vUv;
                varying float vElevation;

                void main() {
                    // --- OBJECT-FIT: COVER LOGIC ---
                    vec2 ratio = vec2(
                        min((uResolution.x / uResolution.y) / uImageAspect, 1.0),
                        min((uResolution.y / uResolution.x) * uImageAspect, 1.0)
                    );

                    vec2 uv = vec2(
                        vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
                        vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
                    );

                    // Fetch color from texture
                    vec4 color = texture2D(uTexture, uv);

                    // --- LIGHTING / SHADOWS ---
                    // Darken the valleys of the wave, lighten the peaks
                    float shadow = vElevation * 1.8; 
                    
                    // Apply shadow to color
                    color.rgb += shadow * 0.2;

                    // Add subtle "cinematic" darkness (Vignette/Mood)
                    color.rgb *= 0.9; 

                    gl_FragColor = color;
                }
            `
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.mesh);
        
        // Initial sizing
        this.resize();
    }

    resize() {
        if (!this.mesh) return;

        // Scale the plane to cover the full screen at the current camera distance
        const dist = this.camera.position.z;
        const vFOV = THREE.MathUtils.degToRad(this.camera.fov);
        const height = 2 * Math.tan(vFOV / 2) * dist;
        const width = height * (window.innerWidth / window.innerHeight);

        // Multiply by 1.2 to give extra bleed room for the wind animation
        this.mesh.scale.set(width * 1.1, height * 1.1, 1);

        // Update Shader Uniforms
        this.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    }

    addEvents() {
        window.addEventListener('resize', () => {
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.resize();
        });
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        // Safety check: Don't render if mesh isn't ready
        if (!this.mesh) return;

        this.uniforms.uTime.value += 0.01; // Speed of wind
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new HeroAnimation();
});