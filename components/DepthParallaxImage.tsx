"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { useIsSlowDeviceConservative } from "@/hooks/useDeviceDetection";

interface DepthParallaxImageProps {
  imageSrc: string;
  depthSrc: string;
  alt: string;
  className?: string;
  intensity?: number; // How strong the parallax effect is (default: 20)
  scale?: number; // Scale factor to prevent edge clipping (default: 1.05)
}

export default function DepthParallaxImage({
  imageSrc,
  depthSrc,
  alt,
  className = "",
  intensity = 20,
  scale = 1.05,
}: DepthParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const mousePos = useRef({ x: 0.5, y: 0.5 });
  const targetPos = useRef({ x: 0.5, y: 0.5 });
  const animationRef = useRef<number | null>(null);
  const glRef = useRef<{
    gl: WebGLRenderingContext;
    program: WebGLProgram;
    mouseLocation: WebGLUniformLocation | null;
  } | null>(null);

  // Check for slow device - skip WebGL entirely
  const isSlowDevice = useIsSlowDeviceConservative();

  // Smooth interpolation
  const lerp = (start: number, end: number, factor: number) =>
    start + (end - start) * factor;

  // Handle mouse movement on window level for smooth tracking
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();

    // Calculate position relative to container center
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Normalize to -1 to 1 range from center
    const x = (e.clientX - centerX) / (window.innerWidth / 2);
    const y = (e.clientY - centerY) / (window.innerHeight / 2);

    // Clamp and convert to 0-1 range
    targetPos.current = {
      x: 0.5 + Math.max(-0.5, Math.min(0.5, x * 0.5)),
      y: 0.5 + Math.max(-0.5, Math.min(0.5, y * 0.5)),
    };
  }, []);

  // Intersection Observer - pause when off-screen
  useEffect(() => {
    if (isSlowDevice) return; // Skip IO setup for slow devices

    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [isSlowDevice]);

  // Animation loop - pauses when off-screen
  useEffect(() => {
    if (isSlowDevice) return; // Skip animation for slow devices

    const animate = () => {
      // Skip rendering when off-screen (performance optimization)
      if (!isVisible) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Smooth interpolation towards target (lower = smoother/slower)
      mousePos.current.x = lerp(mousePos.current.x, targetPos.current.x, 0.03);
      mousePos.current.y = lerp(mousePos.current.y, targetPos.current.y, 0.03);

      // Render if WebGL is ready
      if (glRef.current && isReady) {
        const { gl, mouseLocation } = glRef.current;
        gl.uniform2f(mouseLocation, mousePos.current.x, mousePos.current.y);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isReady, isVisible, isSlowDevice]);

  // Mouse event listeners
  useEffect(() => {
    if (isSlowDevice) return; // Skip mouse events for slow devices

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove, isSlowDevice]);

  // WebGL setup
  useEffect(() => {
    if (isSlowDevice) return; // Skip WebGL setup for slow devices

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext("webgl", {
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: true,
    });

    if (!gl) {
      console.warn("WebGL not supported");
      return;
    }

    // Vertex shader - simple passthrough
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    if (!vertexShader) return;

    gl.shaderSource(vertexShader, `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      varying vec2 v_texCoord;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `);
    gl.compileShader(vertexShader);

    // Fragment shader - depth-based displacement
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fragmentShader) return;

    gl.shaderSource(fragmentShader, `
      precision highp float;

      uniform sampler2D u_image;
      uniform sampler2D u_depth;
      uniform vec2 u_mouse;
      uniform float u_intensity;

      varying vec2 v_texCoord;

      void main() {
        // Get depth value (white = close/more movement, black = far/less movement)
        float depth = texture2D(u_depth, v_texCoord).r;

        // Calculate offset based on mouse position and depth
        // Mouse is 0-1, we want displacement from center (0.5)
        vec2 offset = (u_mouse - 0.5) * depth * u_intensity * 0.001;

        // Apply displacement
        vec2 uv = v_texCoord - offset;

        // Clamp to prevent edge artifacts
        uv = clamp(uv, 0.001, 0.999);

        gl_FragColor = texture2D(u_image, uv);
      }
    `);
    gl.compileShader(fragmentShader);

    // Check for shader compilation errors
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error("Vertex shader error:", gl.getShaderInfoLog(vertexShader));
      return;
    }
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error("Fragment shader error:", gl.getShaderInfoLog(fragmentShader));
      return;
    }

    // Create and link program
    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Set up geometry (full-screen quad)
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,  1, -1,  -1, 1,
      -1,  1,  1, -1,   1, 1,
    ]), gl.STATIC_DRAW);

    const positionLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    // Texture coordinates
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0, 1,  1, 1,  0, 0,
      0, 0,  1, 1,  1, 0,
    ]), gl.STATIC_DRAW);

    const texCoordLoc = gl.getAttribLocation(program, "a_texCoord");
    gl.enableVertexAttribArray(texCoordLoc);
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 0, 0);

    // Load textures
    const loadTexture = (src: string, unit: number): Promise<boolean> => {
      return new Promise((resolve) => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
          const texture = gl.createTexture();
          gl.activeTexture(gl.TEXTURE0 + unit);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
          resolve(true);
        };

        img.onerror = () => {
          console.error("Failed to load:", src);
          resolve(false);
        };

        img.src = src;
      });
    };

    // Load both textures
    Promise.all([
      loadTexture(imageSrc, 0),
      loadTexture(depthSrc, 1),
    ]).then(([imgLoaded, depthLoaded]) => {
      if (!imgLoaded || !depthLoaded) return;

      // Set uniforms
      gl.uniform1i(gl.getUniformLocation(program, "u_image"), 0);
      gl.uniform1i(gl.getUniformLocation(program, "u_depth"), 1);
      gl.uniform1f(gl.getUniformLocation(program, "u_intensity"), intensity);

      const mouseLocation = gl.getUniformLocation(program, "u_mouse");
      gl.uniform2f(mouseLocation, 0.5, 0.5);

      // Store references for animation loop
      glRef.current = { gl, program, mouseLocation };

      // Set canvas size
      const updateSize = () => {
        const rect = container.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
      };

      updateSize();
      window.addEventListener("resize", updateSize);

      setIsReady(true);

      return () => window.removeEventListener("resize", updateSize);
    });

    // Cleanup
    return () => {
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      glRef.current = null;
    };
  }, [imageSrc, depthSrc, intensity, isSlowDevice]);

  // Early return for slow devices - use static image (AFTER all hooks)
  if (isSlowDevice) {
    return (
      <div ref={containerRef} className={`relative ${className}`}>
        <Image
          src={imageSrc}
          alt={alt}
          fill
          priority
          quality={90}
          className="object-cover"
          sizes="100vw"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "center center",
          }}
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          isReady ? "opacity-100" : "opacity-0"
        }`}
        style={{
          imageRendering: "auto",
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      />

      {/* Fallback image while loading */}
      <Image
        src={imageSrc}
        alt={alt}
        fill
        priority
        quality={90}
        className={`object-cover transition-opacity duration-700 ${
          isReady ? "opacity-0" : "opacity-100"
        }`}
        sizes="100vw"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      />
    </div>
  );
}
