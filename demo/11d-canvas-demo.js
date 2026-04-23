/**
 * 🎨 Canvas Demo
 *
 * What you'll learn:
 * - Working with HTML5 Canvas API
 * - Animation loops
 * - Drawing shapes and gradients
 * - Physics simulation
 */

class CanvasApp {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        if (!this.ctx) {
            throw new Error('Could not get canvas context');
        }

        this.balls = [];
        this.animationId = null;
        this.isRunning = false;

        // Initialize canvas size
        this.canvas.width = 800;
        this.canvas.height = 400;

        // Create initial balls
        this.createBalls(5);
    }

    createBalls(count) {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];

        for (let i = 0; i < count; i++) {
            this.balls.push({
                position: {
                    x: Math.random() * (this.canvas.width - 40) + 20,
                    y: Math.random() * (this.canvas.height - 40) + 20,
                },
                velocity: {
                    x: (Math.random() - 0.5) * 5,
                    y: (Math.random() - 0.5) * 5,
                },
                radius: Math.random() * 15 + 15,
                color: colors[i % colors.length],
            });
        }
    }

    update() {
        this.balls.forEach((ball) => {
            // Update position
            ball.position.x += ball.velocity.x;
            ball.position.y += ball.velocity.y;

            // Bounce off walls
            if (ball.position.x - ball.radius <= 0 || ball.position.x + ball.radius >= this.canvas.width) {
                ball.velocity.x *= -1;
                ball.position.x = Math.max(ball.radius, Math.min(this.canvas.width - ball.radius, ball.position.x));
            }

            if (ball.position.y - ball.radius <= 0 || ball.position.y + ball.radius >= this.canvas.height) {
                ball.velocity.y *= -1;
                ball.position.y = Math.max(ball.radius, Math.min(this.canvas.height - ball.radius, ball.position.y));
            }
        });
    }

    draw() {
        // Clear canvas with gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw balls
        this.balls.forEach((ball) => {
            this.ctx.beginPath();
            this.ctx.arc(ball.position.x, ball.position.y, ball.radius, 0, Math.PI * 2);

            // Gradient for each ball
            const ballGradient = this.ctx.createRadialGradient(
                ball.position.x - ball.radius / 3,
                ball.position.y - ball.radius / 3,
                0,
                ball.position.x,
                ball.position.y,
                ball.radius,
            );
            ballGradient.addColorStop(0, ball.color + 'ff');
            ballGradient.addColorStop(1, ball.color + '80');

            this.ctx.fillStyle = ballGradient;
            this.ctx.fill();

            // Shadow
            this.ctx.shadowColor = ball.color;
            this.ctx.shadowBlur = 20;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });
    }

    animate() {
        this.update();
        this.draw();

        if (this.isRunning) {
            this.animationId = requestAnimationFrame(() => this.animate());
        }
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.animate();
        }
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    reset() {
        this.stop();
        this.balls = [];
        this.createBalls(5);
        this.draw();
    }
}

// Initialize canvas app
const outputElement = document.getElementById('output');
if (!outputElement) {
    console.error('Output element not found!');
} else {
    outputElement.innerHTML = '';

    const container = document.createElement('div');
    container.style.cssText = 'padding: 20px; font-family: Arial, sans-serif;';

    // Header
    const header = document.createElement('h2');
    header.textContent = '🎨 Canvas Animation';
    header.style.cssText = 'margin: 0 0 15px 0; color: #4ECDC4;';
    container.appendChild(header);

    // Canvas
    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'border: 2px solid #4ECDC4; border-radius: 8px; display: block; background: #1a1a2e;';
    container.appendChild(canvas);

    // Controls
    const controls = document.createElement('div');
    controls.style.cssText = 'margin-top: 15px; display: flex; gap: 10px;';

    const startButton = document.createElement('button');
    startButton.textContent = '▶️ Start';
    startButton.style.cssText =
        'padding: 10px 20px; background: #4ECDC4; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;';

    const stopButton = document.createElement('button');
    stopButton.textContent = '⏸️ Stop';
    stopButton.style.cssText =
        'padding: 10px 20px; background: #FF6B6B; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;';

    const resetButton = document.createElement('button');
    resetButton.textContent = '🔄 Reset';
    resetButton.style.cssText =
        'padding: 10px 20px; background: #95a5a6; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;';

    controls.appendChild(startButton);
    controls.appendChild(stopButton);
    controls.appendChild(resetButton);
    container.appendChild(controls);

    // Info
    const info = document.createElement('div');
    info.style.cssText = 'margin-top: 15px; color: #999; font-size: 14px;';
    info.textContent = 'Bouncing balls with physics simulation. Click Start to begin!';
    container.appendChild(info);

    outputElement.appendChild(container);

    // Create app instance
    const app = new CanvasApp(canvas);

    // Event listeners
    startButton.addEventListener('click', () => {
        app.start();
        info.textContent = '✓ Animation running...';
    });

    stopButton.addEventListener('click', () => {
        app.stop();
        info.textContent = '⏸️ Animation paused.';
    });

    resetButton.addEventListener('click', () => {
        app.reset();
        info.textContent = '🔄 Animation reset. Click Start to begin!';
    });

    // Draw initial state
    app.draw();
}
