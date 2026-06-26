import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  // Interaction vectors
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollRef = useRef({ current: 0, target: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Create Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Add deep space white fog for light theme
    scene.fog = new THREE.FogExp2(0xffffff, 0.012);

    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 80;
    cameraRef.current = camera;

    // 2. Create WebGL Renderer with alpha and antialiasing
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Create particles forming a stunning orbital double torus wave
    const particleCount = 2800;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    // Color definitions optimized for light theme (richer, more saturated versions)
    const colorGold = new THREE.Color(0x66241f);  // #66241f
    const colorNeon = new THREE.Color(0xe00060);  // #e00060
    const colorCyan = new THREE.Color(0x009cb3);  // #009cb3

    for (let i = 0; i < particleCount; i++) {
      // Form a double torus / helix-like orbital cloud
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI * 2;
      
      const r1 = 30 + Math.sin(v) * 6;  // major radius with waves
      const r2 = Math.cos(v) * 6;       // minor radius

      const x = r1 * Math.cos(u) + (Math.random() - 0.5) * 5;
      const y = r1 * Math.sin(u) + (Math.random() - 0.5) * 5;
      const z = r2 + (Math.random() - 0.5) * 15;

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Color interpolate based on radius/position
      const lerpVal = Math.sin(u) * 0.5 + 0.5;
      let particleColor = new THREE.Color();
      
      if (Math.random() > 0.6) {
        particleColor.copy(colorGold).lerp(colorNeon, lerpVal);
      } else {
        particleColor.copy(colorCyan).lerp(colorNeon, lerpVal);
      }

      colors[i * 3] = particleColor.r;
      colors[i * 3 + 1] = particleColor.g;
      colors[i * 3 + 2] = particleColor.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    // Circular glowing particle texture using canvas
    const createCircleTexture = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 16;
      canvas.height = 16;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        gradient.addColorStop(0, "rgba(255,255,255,1)");
        gradient.addColorStop(0.4, "rgba(255,255,255,0.7)");
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 16, 16);
      }
      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    const pointsMaterial = new THREE.PointsMaterial({
      size: 1.6,
      vertexColors: true,
      map: createCircleTexture(),
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
      opacity: 0.85
    });

    const particles = new THREE.Points(geometry, pointsMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // 4. Mouse movement handler
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize coordinate system: center is (0, 0), top right is (1, 1)
      mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.targetY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    // 5. Scroll tracking (using low-overhead passive listener)
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        scrollRef.current.target = window.scrollY / scrollHeight;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    // 6. Resize Observer for proper dimensions handling (stops window resize jumps)
    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const width = entry.contentRect.width;
      const height = entry.contentRect.height;

      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      }
    });

    resizeObserver.observe(containerRef.current);

    // 7. RequestAnimationFrame Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animateScene = () => {
      const elapsedTime = clock.getElapsedTime();

      // Lerp mouse interactions
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      // Lerp scroll tracker
      scrollRef.current.current += (scrollRef.current.target - scrollRef.current.current) * 0.1;

      if (particles) {
        // Slow constant rotations
        particles.rotation.y = elapsedTime * 0.04;
        particles.rotation.x = elapsedTime * 0.025;

        // Apply mouse movement shift
        particles.position.x = mouseRef.current.x * 12;
        particles.position.y = mouseRef.current.y * 12;

        // Apply scroll rotation and depth shift
        particles.rotation.z = scrollRef.current.current * Math.PI * 1.5;
        particles.position.z = scrollRef.current.current * 25; // zooms slightly on scroll
      }

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }

      animationFrameId = requestAnimationFrame(animateScene);
    };

    animateScene();

    // 8. Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);

      if (rendererRef.current && containerRef.current) {
        // Safe check to avoid canvas removal crash if already unmounted
        try {
          if (rendererRef.current.domElement.parentNode === containerRef.current) {
            containerRef.current.removeChild(rendererRef.current.domElement);
          }
        } catch (e) {
          // ignore parental node conflicts
        }
      }

      // Dispose resources
      geometry.dispose();
      pointsMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="three-particles-container"
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
    />
  );
}
