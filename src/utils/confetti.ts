/**
 * 自定义 confetti 实现
 * 替代 canvas-confetti 库，减少依赖
 */

interface ConfettiOptions {
  particleCount?: number;
  angle?: number;
  spread?: number;
  startVelocity?: number;
  decay?: number;
  gravity?: number;
  drift?: number;
  ticks?: number;
  origin?: {
    x: number;
    y: number;
  };
  colors?: string[];
  shapes?: string[];
  scalar?: number;
  zIndex?: number;
  disableForReducedMotion?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  shape: string;
  size: number;
  life: number;
  maxLife: number;
}

class ConfettiCanvas {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId: number | null = null;
  private isAnimating = false;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '9999';
    
    this.ctx = this.canvas.getContext('2d')!;
    this.resize();
    
    window.addEventListener('resize', () => this.resize());
  }

  private resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private createParticle(options: ConfettiOptions): Particle {
    const {
      angle = 90,
      spread = 45,
      startVelocity = 30,
      decay = 0.94,
      gravity = 1,
      drift = 0,
      origin = { x: 0.5, y: 0.5 },
      colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
      shapes = ['circle', 'square'],
      scalar = 1,
    } = options;

    const angleRad = (angle * Math.PI) / 180;
    const spreadRad = (spread * Math.PI) / 180;
    const randomAngle = angleRad + (Math.random() - 0.5) * spreadRad;
    const velocity = startVelocity * (0.5 + Math.random() * 0.5);
    
    const x = origin.x * this.canvas.width;
    const y = origin.y * this.canvas.height;
    
    const vx = Math.cos(randomAngle) * velocity;
    const vy = Math.sin(randomAngle) * velocity;
    
    return {
      x,
      y,
      vx,
      vy,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      size: (Math.random() * 3 + 2) * scalar,
      life: 0,
      maxLife: 200 + Math.random() * 100,
    };
  }

  private updateParticle(particle: Particle, options: ConfettiOptions) {
    const { decay = 0.94, gravity = 1, drift = 0 } = options;
    
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vx *= decay;
    particle.vy *= decay;
    particle.vy += gravity;
    particle.vx += drift;
    particle.life++;
    
    return particle.life < particle.maxLife;
  }

  private drawParticle(particle: Particle) {
    this.ctx.save();
    this.ctx.translate(particle.x, particle.y);
    this.ctx.fillStyle = particle.color;
    this.ctx.globalAlpha = 1 - particle.life / particle.maxLife;
    
    if (particle.shape === 'circle') {
      this.ctx.beginPath();
      this.ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
    } else if (particle.shape === 'square') {
      this.ctx.fillRect(-particle.size, -particle.size, particle.size * 2, particle.size * 2);
    }
    
    this.ctx.restore();
  }

  private animate(options: ConfettiOptions) {
    if (!this.isAnimating) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw particles
    this.particles = this.particles.filter(particle => {
      const alive = this.updateParticle(particle, options);
      if (alive) {
        this.drawParticle(particle);
      }
      return alive;
    });
    
    // Add new particles
    if (this.particles.length < (options.particleCount || 50)) {
      this.particles.push(this.createParticle(options));
    }
    
    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.animate(options));
    } else {
      this.stop();
    }
  }

  fire(options: ConfettiOptions = {}) {
    if (this.isAnimating) {
      this.stop();
    }
    
    this.isAnimating = true;
    this.particles = [];
    
    // Create initial particles
    const particleCount = options.particleCount || 50;
    for (let i = 0; i < particleCount; i++) {
      this.particles.push(this.createParticle(options));
    }
    
    document.body.appendChild(this.canvas);
    this.animate(options);
  }

  stop() {
    this.isAnimating = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    if (this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
  }
}

// 全局 confetti 实例
let confettiInstance: ConfettiCanvas | null = null;

/**
 * 获取或创建 confetti 实例
 */
function getConfettiInstance(): ConfettiCanvas {
  if (!confettiInstance) {
    confettiInstance = new ConfettiCanvas();
  }
  return confettiInstance;
}

/**
 * 触发 confetti 效果
 * @param options - confetti 选项
 */
export function confetti(options: ConfettiOptions = {}) {
  const instance = getConfettiInstance();
  instance.fire(options);
}

/**
 * 停止 confetti 效果
 */
export function stopConfetti() {
  if (confettiInstance) {
    confettiInstance.stop();
  }
}

/**
 * 默认的 confetti 效果
 */
export function defaultConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

export default confetti;