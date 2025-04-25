import React, { useEffect, useRef } from 'react';
import styles from './DynamicBackground.module.scss';

export type Props = {
  numShapes?: number;
  opacity?: number;
  rimLight?: number;
  animSpeed?: number;
  blur?: number;
  colorPalettes?: { color1: string; color2: string; rimColor: string }[];
  paletteCycleSpeed?: number;
  curvature?: number;
  colorAnimSpeed?: number;
  vignette?: number;
};

// Helper: Convert hex color to RGB
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

// Helper to interpolate between two hex colors
function lerpColor(a: string, b: string, t: number) {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  const r = Math.round(ca.r + (cb.r - ca.r) * t);
  const g = Math.round(ca.g + (cb.g - ca.g) * t);
  const b_ = Math.round(ca.b + (cb.b - ca.b) * t);
  return (
    '#' +
    r.toString(16).padStart(2, '0') +
    g.toString(16).padStart(2, '0') +
    b_.toString(16).padStart(2, '0')
  );
}

const DEFAULTS = {
  numShapes: 5,
  opacity: 0.5,
  rimLight: 0.1,
  animSpeed: 0.3,
  blur: 0,
  colorPalettes: [
    { color1: '#5a6d8f', color2: '#232f3e', rimColor: '#e0f7fa' },
    { color1: '#7a9d7b', color2: '#3e5641', rimColor: '#eafbe6' },
  ],
  paletteCycleSpeed: 12,
  curvature: 0.7,
  colorAnimSpeed: 1.0,
  vignette: 0.72,
};

// Adds a vignette (darkened edges) overlay to the canvas for visual focus
function addVignette(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  strength: number = 0.7
) {
  // Clamp strength between 0 and 1
  const s = Math.max(0, Math.min(1, strength));
  ctx.save();
  // Create a radial gradient centered on the canvas
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const maxRadius = Math.sqrt(cx * cx + cy * cy);
  const vignetteGradient = ctx.createRadialGradient(
    cx,
    cy,
    maxRadius * 0.55, // Start fading from 55% out
    cx,
    cy,
    maxRadius
  );
  vignetteGradient.addColorStop(0, 'rgba(0,0,0,0)');
  vignetteGradient.addColorStop(1, `rgba(0,0,0,${s})`);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = vignetteGradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

// Helper to convert normalized to pixel coordinates
function normToPx(norm: number, size: number) {
  return norm * size;
}

// Draw a single shape (rectangle with one curved side) using normalized coordinates
function drawShape(
  ctx: CanvasRenderingContext2D,
  shape: any,
  animAngle: number,
  shapeOpacity: number,
  c1: string,
  c2: string,
  rimColor: string,
  rimLight: number,
  canvas: HTMLCanvasElement,
  shapeIndex: number,
  blur: number
) {
  if (shape.type === 'curved-rect') {
    ctx.save();
    const moveRadius = (canvas.width + canvas.height) * 0.01;
    const moveAngle = animAngle * 0.015 + shapeIndex * 1.7;
    const offsetX = Math.cos(moveAngle) * moveRadius;
    const offsetY = Math.sin(moveAngle) * moveRadius;
    const wave = Math.sin(animAngle * 0.03 + shapeIndex * 1.2) * (canvas.width + canvas.height) * 0.01;
    // Convert normalized to pixel positions
    const x1 = normToPx(shape.x1, canvas.width) + offsetX;
    const y1 = normToPx(shape.y1, canvas.height) + offsetY;
    const x2 = normToPx(shape.x2, canvas.width) + offsetX;
    const y2 = normToPx(shape.y2, canvas.height) + offsetY;
    const animatedCtrlX = normToPx(shape.ctrlX, canvas.width) + offsetX + wave;
    const animatedCtrlY = normToPx(shape.ctrlY, canvas.height) + offsetY + wave;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.bezierCurveTo(animatedCtrlX, animatedCtrlY, animatedCtrlX, animatedCtrlY, x2, y2);
    const corners = [
      { x: -canvas.width * 0.1, y: -canvas.height * 0.1, side: 'top-left' },
      { x: canvas.width * 1.1, y: -canvas.height * 0.1, side: 'top-right' },
      { x: canvas.width * 1.1, y: canvas.height * 1.1, side: 'bottom-right' },
      { x: -canvas.width * 0.1, y: canvas.height * 1.1, side: 'bottom-left' },
    ];
    const sideToCorner = {
      top: 0,
      right: 1,
      bottom: 2,
      left: 3,
    };
    const idx2 = sideToCorner[shape.side2 as 'top' | 'right' | 'bottom' | 'left'];
    const idx1 = sideToCorner[shape.side1 as 'top' | 'right' | 'bottom' | 'left'];
    let i = idx2;
    while (i !== idx1) {
      i = (i + 1) % 4;
      ctx.lineTo(corners[i].x, corners[i].y);
    }
    ctx.closePath();
    const bezierMidX = 0.25 * x1 + 0.5 * animatedCtrlX + 0.25 * x2;
    const bezierMidY = 0.25 * y1 + 0.5 * animatedCtrlY + 0.25 * y2;
    const cornerAfterIdx2 = (idx2 + 1) % 4;
    const cornerAtIdx1 = idx1;
    const perimeterMidX = (corners[cornerAfterIdx2].x + corners[cornerAtIdx1].x) / 2;
    const perimeterMidY = (corners[cornerAfterIdx2].y + corners[cornerAtIdx1].y) / 2;
    const grad = ctx.createLinearGradient(bezierMidX, bezierMidY, perimeterMidX, perimeterMidY);
    grad.addColorStop(0, c1);
    grad.addColorStop(1, c2);
    ctx.globalAlpha = shapeOpacity;
    ctx.fillStyle = grad;
    ctx.filter = blur > 0 ? `blur(${blur}px)` : 'none';
    ctx.fill();
    ctx.globalAlpha = rimLight;
    ctx.strokeStyle = rimColor;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.filter = 'none';
    ctx.restore();
  }
}

const DynamicBackground: React.FC<Props> = ({
  numShapes = DEFAULTS.numShapes,
  opacity = DEFAULTS.opacity,
  rimLight = DEFAULTS.rimLight,
  animSpeed = DEFAULTS.animSpeed,
  blur = DEFAULTS.blur,
  colorPalettes = DEFAULTS.colorPalettes,
  paletteCycleSpeed = DEFAULTS.paletteCycleSpeed,
  curvature = DEFAULTS.curvature,
  colorAnimSpeed = DEFAULTS.colorAnimSpeed,
  vignette = DEFAULTS.vignette,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const shapesRef = useRef<any[]>([]);
  const animationAngleRef = useRef(0);

  // Only generate shapes when numShapes changes
  React.useEffect(() => {
    const newShapes = [];
    for (let i = 0; i < numShapes; i++) {
      newShapes.push(createShape());
    }
    shapesRef.current = newShapes;
  }, [numShapes]);

  // Resize canvas to fill viewport
  const resizeCanvas = (canvas: HTMLCanvasElement) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  // Create a shape definition with normalized coordinates
  function createShape() {
    const sides: Array<'top' | 'bottom' | 'left' | 'right'> = ['top', 'bottom', 'left', 'right'];
    let side1: 'top' | 'bottom' | 'left' | 'right' = sides[Math.floor(Math.random() * 4)];
    let side2: 'top' | 'bottom' | 'left' | 'right';
    do {
      side2 = sides[Math.floor(Math.random() * 4)];
    } while (side2 === side1);
    function randomOnSideNorm(side: string) {
      switch (side) {
        case 'top':
          return { x: Math.random(), y: -0.1 };
        case 'bottom':
          return { x: Math.random(), y: 1.1 };
        case 'left':
          return { x: -0.1, y: Math.random() };
        case 'right':
          return { x: 1.1, y: Math.random() };
        default:
          return { x: 0, y: 0 };
      }
    }
    const p1 = randomOnSideNorm(side1);
    const p2 = randomOnSideNorm(side2);
    const ctrlX = (p1.x + p2.x) / 2 + (Math.random() - 0.5) * 0.2;
    const ctrlY = (p1.y + p2.y) / 2 + (Math.random() - 0.5) * 0.2;
    return {
      type: 'curved-rect',
      x1: p1.x, y1: p1.y,
      x2: p2.x, y2: p2.y,
      ctrlX, ctrlY,
      side1, side2,
      color1: DEFAULTS.colorPalettes[Math.floor(Math.random() * DEFAULTS.colorPalettes.length)].color1,
      color2: DEFAULTS.colorPalettes[Math.floor(Math.random() * DEFAULTS.colorPalettes.length)].color2,
      rimColor: DEFAULTS.colorPalettes[Math.floor(Math.random() * DEFAULTS.colorPalettes.length)].rimColor,
      rimLight: DEFAULTS.rimLight,
      opacity: DEFAULTS.opacity,
    };
  }

  // Create a noise canvas
  function createNoiseCanvas(width: number, height: number, intensity: number) {
    const noiseCanvas = document.createElement('canvas');
    noiseCanvas.width = width;
    noiseCanvas.height = height;
    const ctx = noiseCanvas.getContext('2d');
    if (!ctx) return noiseCanvas;
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * intensity * 255;
      data[i] = 128 + noise;
      data[i + 1] = 128 + noise;
      data[i + 2] = 128 + noise;
      data[i + 3] = 16; // subtle alpha
    }
    ctx.putImageData(imageData, 0, 0);
    return noiseCanvas;
  }

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let running = true;
    let noiseLayer: HTMLCanvasElement | null = null;
    // Resize on mount and on window resize
    const handleResize = () => {
      resizeCanvas(canvas);
      noiseLayer = createNoiseCanvas(canvas.width, canvas.height, 2.9);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    // Animation loop
    let lastTimestamp = performance.now();
    const animate = (timestamp?: number) => {
      if (!running) return;
      const now = timestamp ?? performance.now();
      const delta = (now - lastTimestamp) / 1000; // seconds
      lastTimestamp = now;
      // --- Palette cycling logic ---
      const paletteCount = colorPalettes.length;
      if (paletteCount === 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      const cycleTime = paletteCycleSpeed;
      // Use colorAnimSpeed to control color cycling speed
      const colorTime = (animationAngleRef.current * colorAnimSpeed) / 60; // seconds
      const paletteIdx = ((Math.floor(colorTime / cycleTime) % paletteCount) + paletteCount) % paletteCount;
      const nextPaletteIdx = (paletteIdx + 1) % paletteCount;
      const t = ((colorTime % cycleTime) / cycleTime);
      const paletteA = colorPalettes[paletteIdx];
      const paletteB = colorPalettes[nextPaletteIdx];
      if (!paletteA || !paletteB) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      const color1 = lerpColor(paletteA.color1, paletteB.color1, t);
      const color2 = lerpColor(paletteA.color2, paletteB.color2, t);
      const rimColor = lerpColor(paletteA.rimColor, paletteB.rimColor, t);
      // Animate background gradient angle
      const gradAngle = (animationAngleRef.current * 0.01) % (2 * Math.PI);
      const gradX = Math.cos(gradAngle) * canvas.width * 0.4 + canvas.width / 2;
      const gradY = Math.sin(gradAngle) * canvas.height * 0.4 + canvas.height / 2;
      const bgGradient = ctx.createLinearGradient(gradX, gradY, canvas.width - gradX, canvas.height - gradY);
      bgGradient.addColorStop(0, color1);
      bgGradient.addColorStop(1, color2);
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Draw static noise layer
      if (noiseLayer) ctx.drawImage(noiseLayer, 0, 0, canvas.width, canvas.height);
      // Shapes
      shapesRef.current.forEach((shape, i) => {
        drawShape(
          ctx,
          {
            ...shape,
            color1,
            color2,
            rimColor,
            rimLight,
            opacity,
          },
          animationAngleRef.current,
          opacity,
          color1,
          color2,
          rimColor,
          rimLight,
          canvas,
          i,
          blur
        );
      });
      // Vignette
      addVignette(ctx, canvas, vignette);
      animationAngleRef.current += animSpeed * delta * 60;
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      running = false;
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [numShapes, opacity, rimLight, animSpeed, blur, colorPalettes, paletteCycleSpeed, curvature, colorAnimSpeed, vignette]);

  return (
    <div className={styles['dynamic-background']}>
      <canvas ref={canvasRef} className={styles['dynamic-background__canvas']} />
    </div>
  );
};

export default DynamicBackground;