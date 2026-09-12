/**
 * Kai Onnu Kaattikke! - Confetti & Particle Effects
 */

export class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.animId = null;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  // Celebratory clean hand confetti
  celebrateClean() {
    this.particles = [];
    const colors = ['#FFD166', '#06D6A0', '#118AB2', '#EF476F', '#7209B7', '#4CC9F0', '#FFBE0B'];
    const count = 120;

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: this.canvas.width * 0.5 + (Math.random() - 0.5) * 200,
        y: this.canvas.height * 0.4,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 14 - 4,
        size: Math.random() * 9 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        shape: Math.random() > 0.4 ? 'rect' : 'star',
        gravity: 0.35,
        opacity: 1,
        decay: Math.random() * 0.008 + 0.005
      });
    }

    this.start();
  }

  // Soap bubbles & water drops for dirty hand
  celebrateDirty() {
    this.particles = [];
    const count = 60;

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: this.canvas.height + 20,
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 4 - 2,
        size: Math.random() * 22 + 8,
        color: Math.random() > 0.2 ? 'rgba(78, 175, 255, 0.45)' : 'rgba(109, 76, 65, 0.35)',
        strokeColor: Math.random() > 0.2 ? '#2196F3' : '#5D4037',
        shape: 'bubble',
        opacity: 1,
        wobble: Math.random() * 10,
        decay: 0.004
      });
    }

    this.start();
  }

  start() {
    if (this.animId) cancelAnimationFrame(this.animId);
    const render = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];

        if (p.shape === 'bubble') {
          p.y += p.vy;
          p.x += Math.sin(p.wobble) * 1.5;
          p.wobble += 0.05;
          p.opacity -= p.decay;

          this.ctx.save();
          this.ctx.globalAlpha = Math.max(0, p.opacity);
          this.ctx.beginPath();
          this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          this.ctx.fillStyle = p.color;
          this.ctx.fill();
          this.ctx.lineWidth = 2;
          this.ctx.strokeStyle = p.strokeColor;
          this.ctx.stroke();

          // Bubble shine highlight
          this.ctx.beginPath();
          this.ctx.arc(p.x - p.size * 0.3, p.y - p.size * 0.3, p.size * 0.25, 0, Math.PI * 2);
          this.ctx.fillStyle = 'rgba(255,255,255,0.7)';
          this.ctx.fill();
          this.ctx.restore();
        } else {
          // Confetti
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.rotation += p.rotSpeed;
          p.opacity -= p.decay;

          this.ctx.save();
          this.ctx.globalAlpha = Math.max(0, p.opacity);
          this.ctx.translate(p.x, p.y);
          this.ctx.rotate((p.rotation * Math.PI) / 180);

          if (p.shape === 'star') {
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            for (let s = 0; s < 5; s++) {
              this.ctx.lineTo(Math.cos((18 + s * 72) * Math.PI / 180) * p.size, -Math.sin((18 + s * 72) * Math.PI / 180) * p.size);
              this.ctx.lineTo(Math.cos((54 + s * 72) * Math.PI / 180) * (p.size * 0.5), -Math.sin((54 + s * 72) * Math.PI / 180) * (p.size * 0.5));
            }
            this.ctx.closePath();
            this.ctx.fill();
          } else {
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          }
          this.ctx.restore();
        }

        if (p.opacity <= 0 || p.y > this.canvas.height + 40) {
          this.particles.splice(i, 1);
        }
      }

      if (this.particles.length > 0) {
        this.animId = requestAnimationFrame(render);
      } else {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    };

    render();
  }

  stop() {
    if (this.animId) cancelAnimationFrame(this.animId);
    this.particles = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
