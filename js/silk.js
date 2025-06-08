/**
 * Silk Shader Background Effect
 * A vanilla JS implementation of a flowing silk background effect using Three.js
 */

class SilkBackground {
    constructor(options = {}) {
        // Default options
        this.options = Object.assign({
            container: null,
            speed: 5,
            scale: 1,
            color: '#7B7481',
            noiseIntensity: 1.5,
            rotation: 0
        }, options);

        // Initialize Three.js components
        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.material = null;
        this.mesh = null;
        this.time = 0;
        this.animationFrameId = null;

        // Initialize if container exists
        if (this.options.container) {
            this.init();
        }
    }

    init() {
        // Set up renderer
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.options.container.clientWidth, this.options.container.clientHeight);
        this.options.container.appendChild(this.renderer.domElement);

        // Set up scene and camera
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        // Create shader material
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: this.hexToThreeColor(this.options.color) },
                uSpeed: { value: this.options.speed },
                uScale: { value: this.options.scale },
                uRotation: { value: this.options.rotation },
                uNoiseIntensity: { value: this.options.noiseIntensity }
            },
            vertexShader: this.vertexShader(),
            fragmentShader: this.fragmentShader()
        });

        // Create mesh
        const geometry = new THREE.PlaneGeometry(2, 2);
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.scene.add(this.mesh);

        // Start animation
        this.animate();

        // Handle resize
        window.addEventListener('resize', this.onResize.bind(this));
    }

    animate() {
        this.time += 0.01;
        this.material.uniforms.uTime.value = this.time;
        this.renderer.render(this.scene, this.camera);
        this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
    }

    onResize() {
        if (this.options.container && this.renderer) {
            const width = this.options.container.clientWidth;
            const height = this.options.container.clientHeight;
            this.renderer.setSize(width, height);
        }
    }

    // Convert hex color to Three.js color
    hexToThreeColor(hex) {
        hex = hex.replace('#', '');
        const r = parseInt(hex.slice(0, 2), 16) / 255;
        const g = parseInt(hex.slice(2, 4), 16) / 255;
        const b = parseInt(hex.slice(4, 6), 16) / 255;
        return new THREE.Color(r, g, b);
    }

    // Vertex shader
    vertexShader() {
        return `
        varying vec2 vUv;
        varying vec3 vPosition;

        void main() {
          vPosition = position;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
        `;
    }

    // Fragment shader
    fragmentShader() {
        return `
        varying vec2 vUv;
        varying vec3 vPosition;

        uniform float uTime;
        uniform vec3  uColor;
        uniform float uSpeed;
        uniform float uScale;
        uniform float uRotation;
        uniform float uNoiseIntensity;

        const float e = 2.71828182845904523536;

        float noise(vec2 texCoord) {
          float G = e;
          vec2  r = (G * sin(G * texCoord));
          return fract(r.x * r.y * (1.0 + texCoord.x));
        }

        vec2 rotateUvs(vec2 uv, float angle) {
          float c = cos(angle);
          float s = sin(angle);
          mat2  rot = mat2(c, -s, s, c);
          return rot * uv;
        }

        void main() {
          float rnd        = noise(gl_FragCoord.xy);
          vec2  uv         = rotateUvs(vUv * uScale, uRotation);
          vec2  tex        = uv * uScale;
          float tOffset    = uSpeed * uTime;

          tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

          float pattern = 0.6 +
                          0.4 * sin(5.0 * (tex.x + tex.y +
                                           cos(3.0 * tex.x + 5.0 * tex.y) +
                                           0.02 * tOffset) +
                                   sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

          vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
          col.a = 1.0;
          gl_FragColor = col;
        }
        `;
    }

    // Clean up resources
    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }

        window.removeEventListener('resize', this.onResize);

        if (this.mesh) {
            this.scene.remove(this.mesh);
            this.mesh.geometry.dispose();
            this.mesh.material.dispose();
        }

        if (this.renderer && this.options.container) {
            this.options.container.removeChild(this.renderer.domElement);
        }

        this.renderer = null;
        this.scene = null;
        this.camera = null;
        this.material = null;
        this.mesh = null;
    }
}