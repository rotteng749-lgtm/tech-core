/**
 * REA_Skill - 3D Interactive Cyber Core & Particle Constellation
 * Powered by Three.js
 * Hardware-accelerated, theme-aware, battery-efficient 60-120fps 3D graphics
 */

(function () {
  'use strict';

  function initThreeAnimation() {
    const canvas = document.getElementById('rea-hero-canvas');
    const container = document.getElementById('hero-3d-wrap');
    const heroSection = document.getElementById('setup');

    if (!canvas || !container || typeof window.THREE === 'undefined') {
      return;
    }

    // Check prefers-reduced-motion
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 600;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 8.5;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    // 2. Color Palette & Theme Engine
    function getThemeColors() {
      const isDark =
        document.documentElement.getAttribute('data-theme') === 'dark' ||
        (!document.documentElement.getAttribute('data-theme') &&
          window.matchMedia('(prefers-color-scheme: dark)').matches);

      if (isDark) {
        return {
          wireframe: 0x00f0ff,
          wireframeOpacity: 0.28,
          core: 0x818cf8,
          coreOpacity: 0.45,
          ring1: 0x2dd4bf,
          ring2: 0xa855f7,
          particles: 0x38bdf8,
          particlesSecondary: 0xc084fc,
          glowIntensity: 1.0
        };
      } else {
        return {
          wireframe: 0x2563eb,
          wireframeOpacity: 0.22,
          core: 0x1d4ed8,
          coreOpacity: 0.35,
          ring1: 0x0284c7,
          ring2: 0x6366f1,
          particles: 0x3b82f6,
          particlesSecondary: 0x818cf8,
          glowIntensity: 0.7
        };
      }
    }

    let colors = getThemeColors();

    // 3. 3D Geometries & Cyber Core Mesh Group
    const coreGroup = new THREE.Group();
    // Position core toward the right-center of hero where terminal sits, creating depth
    coreGroup.position.set(2.2, 0.2, 0);
    scene.add(coreGroup);

    // Outer Geodesic Sphere (Icosahedron)
    const outerGeo = new THREE.IcosahedronGeometry(2.4, 2);
    const outerMat = new THREE.MeshBasicMaterial({
      color: colors.wireframe,
      wireframe: true,
      transparent: true,
      opacity: colors.wireframeOpacity
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    coreGroup.add(outerMesh);

    // Inner Crystalline Kernel (Octahedron)
    const innerGeo = new THREE.OctahedronGeometry(1.4, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: colors.core,
      wireframe: true,
      transparent: true,
      opacity: colors.coreOpacity
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // Core Center Glowing Point
    const centerPointGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const centerPointMat = new THREE.MeshBasicMaterial({
      color: colors.ring1,
      transparent: true,
      opacity: 0.8
    });
    const centerPoint = new THREE.Mesh(centerPointGeo, centerPointMat);
    coreGroup.add(centerPoint);

    // Dual Orbital Rings
    const ring1Geo = new THREE.TorusGeometry(3.2, 0.02, 16, 120);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: colors.ring1,
      transparent: true,
      opacity: 0.45
    });
    const ring1Mesh = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1Mesh.rotation.x = Math.PI / 3;
    ring1Mesh.rotation.y = Math.PI / 6;
    coreGroup.add(ring1Mesh);

    const ring2Geo = new THREE.TorusGeometry(3.6, 0.02, 16, 120);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: colors.ring2,
      transparent: true,
      opacity: 0.35
    });
    const ring2Mesh = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2Mesh.rotation.x = -Math.PI / 4;
    ring2Mesh.rotation.z = Math.PI / 5;
    coreGroup.add(ring2Mesh);

    // 4. Ambient Data Nodes Constellation (Floating Particles)
    const particleCount = 280;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = [];

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      particlePositions[i3] = (Math.random() - 0.5) * 16;
      particlePositions[i3 + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i3 + 2] = (Math.random() - 0.5) * 10;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.004,
        y: (Math.random() - 0.5) * 0.004,
        z: (Math.random() - 0.5) * 0.004
      });
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3)
    );

    // Custom Canvas Texture for Circular Glowing Particle
    function createCircleTexture() {
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 32;
      pCanvas.height = 32;
      const ctx = pCanvas.getContext('2d');
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.3, 'rgba(255,255,255,0.7)');
      gradient.addColorStop(0.8, 'rgba(255,255,255,0.1)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
      const texture = new THREE.Texture(pCanvas);
      texture.needsUpdate = true;
      return texture;
    }

    const particleTexture = createCircleTexture();

    const particlesMat = new THREE.PointsMaterial({
      color: colors.particles,
      size: 0.18,
      map: particleTexture,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleSystem);

    // 5. Responsive Coordinates on Resize
    function adjustCorePosition() {
      const curWidth = container.clientWidth || window.innerWidth;
      if (curWidth < 768) {
        // Center core on mobile/tablet behind content
        coreGroup.position.set(0, 0.4, -1.0);
        coreGroup.scale.set(0.72, 0.72, 0.72);
      } else if (curWidth < 1100) {
        coreGroup.position.set(1.4, 0.1, 0);
        coreGroup.scale.set(0.85, 0.85, 0.85);
      } else {
        coreGroup.position.set(2.4, 0.1, 0);
        coreGroup.scale.set(1.0, 1.0, 1.0);
      }
    }
    adjustCorePosition();

    // 6. Interactive Mouse Tracking & Parallax Inertia
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let pulseScale = 1.0;
    let isHovering = false;

    window.addEventListener('mousemove', (e) => {
      // Normalize mouse (-1 to 1)
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotationY = mouseX * 0.45;
      targetRotationX = -mouseY * 0.35;
    }, { passive: true });

    // Interactive Pulse on Click / Tap anywhere in Hero
    if (heroSection) {
      heroSection.addEventListener('pointerdown', () => {
        pulseScale = 1.22;
      }, { passive: true });
    }

    // 7. Theme Change Listener
    function updateColors() {
      colors = getThemeColors();
      outerMat.color.setHex(colors.wireframe);
      outerMat.opacity = colors.wireframeOpacity;
      innerMat.color.setHex(colors.core);
      innerMat.opacity = colors.coreOpacity;
      centerPointMat.color.setHex(colors.ring1);
      ring1Mat.color.setHex(colors.ring1);
      ring2Mat.color.setHex(colors.ring2);
      particlesMat.color.setHex(colors.particles);
    }

    const themeToggleBtn = document.querySelector('[data-theme-toggle]');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        setTimeout(updateColors, 50);
      });
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          updateColors();
        }
      });
    });
    observer.observe(document.documentElement, { attributes: true });

    // 8. Lifecycle & Battery-Efficient Render Loop
    let animationFrameId = null;
    let isVisible = true;
    let clock = new THREE.Clock();

    function animate() {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      if (!reduceMotion) {
        // Continuous organic rotation
        outerMesh.rotation.y += 0.0035;
        outerMesh.rotation.x += 0.002;

        innerMesh.rotation.y -= 0.006;
        innerMesh.rotation.z += 0.004;

        ring1Mesh.rotation.z += 0.003;
        ring2Mesh.rotation.y += 0.0035;

        // Interactive mouse parallax damping
        coreGroup.rotation.y += (targetRotationY - coreGroup.rotation.y) * 0.05;
        coreGroup.rotation.x += (targetRotationX - coreGroup.rotation.x) * 0.05;

        // Subtle vertical breathing float
        coreGroup.position.y += (Math.sin(elapsedTime * 1.5) * 0.12 - (coreGroup.position.y - (window.innerWidth < 768 ? 0.4 : 0.1))) * 0.05;

        // Damped return from click pulse
        pulseScale += (1.0 - pulseScale) * 0.08;
        const baseScale = window.innerWidth < 768 ? 0.72 : window.innerWidth < 1100 ? 0.85 : 1.0;
        coreGroup.scale.set(
          baseScale * pulseScale,
          baseScale * pulseScale,
          baseScale * pulseScale
        );

        // Particle subtle drift
        const positions = particleSystem.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          positions[i3] += particleVelocities[i].x;
          positions[i3 + 1] += particleVelocities[i].y;
          positions[i3 + 2] += particleVelocities[i].z;

          // Boundary wrap
          if (positions[i3] > 8) positions[i3] = -8;
          if (positions[i3] < -8) positions[i3] = 8;
          if (positions[i3 + 1] > 5) positions[i3 + 1] = -5;
          if (positions[i3 + 1] < -5) positions[i3 + 1] = 5;
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;
        particleSystem.rotation.y = elapsedTime * 0.015;
      }

      renderer.render(scene, camera);
    }

    // 9. Intersection Observer (Pause rendering when Hero is off-screen)
    if ('IntersectionObserver' in window && heroSection) {
      const heroObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting;
          });
        },
        { threshold: 0.05 }
      );
      heroObserver.observe(heroSection);
    }

    // 10. Window Resize Handler
    function onWindowResize() {
      const newWidth = container.clientWidth || window.innerWidth;
      const newHeight = container.clientHeight || 600;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      adjustCorePosition();
    }

    window.addEventListener('resize', onWindowResize, { passive: true });

    // Start Animation Loop
    animate();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeAnimation);
  } else {
    initThreeAnimation();
  }
})();
