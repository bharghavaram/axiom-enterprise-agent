
import React, { useEffect, useRef } from 'react';

const MatrixBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Characters: Mix of alphanumeric and symbols
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890xABCDEF@#$%&*()';
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = new Array(columns).fill(1);

    const draw = () => {
      // Semi-transparent black to create trailing effect
      ctx.fillStyle = 'rgba(3, 7, 18, 0.1)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Randomly choose between blue and cyan for the "AXIOM" look
        const colorSeed = Math.random();
        if (colorSeed > 0.98) {
          ctx.fillStyle = '#f8fafc'; // Occasional white spark
        } else if (colorSeed > 0.5) {
          ctx.fillStyle = '#3b82f6'; // Axiom Blue
        } else {
          ctx.fillStyle = '#1e3a8a'; // Darker Blue
        }

        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Reset drop to top randomly after it crosses screen
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      // Re-calculate columns on resize
      const newColumns = Math.floor(width / fontSize);
      drops.length = 0;
      for (let i = 0; i < newColumns; i++) drops[i] = 1;
    };

    window.addEventListener('resize', handleResize);
    const interval = setInterval(draw, 33); // ~30fps for performance

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-[0.15]"
      style={{ filter: 'blur(0.5px)' }}
    />
  );
};

export default MatrixBackground;
