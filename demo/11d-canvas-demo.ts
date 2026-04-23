/**
 * 🎨 Canvas Demo
 *
 * What you'll learn:
 * - Working with HTML5 Canvas API
 * - Type-safe canvas operations
 * - Animation loops
 * - Drawing shapes and gradients
 */
// Check if running in browser
if (typeof document === 'undefined') {
    console.log('=== 🎨 Canvas Animation Demo ===');
    console.log('');
    console.log('⚠️  This is an interactive DOM demo that needs to run in the browser.');
    console.log('');
    console.log('To view this demo:');
    console.log('1. Open http://localhost:3000 in your browser');
    console.log('2. Click "Edit" button in the top-right');
    console.log('3. Click "Run Modified" to execute in the browser');
    console.log('');
    console.log('This demo creates an animated canvas with:');
    console.log('- Bouncing balls with physics');
    console.log('- Gradient backgrounds');
    console.log('- Collision detection');
    console.log('- Start/Stop/Reset controls');
    process.exit(0);
}
interface Point {
    x: number;
    y: number;
}

interface Ball {
    position: Point;
    velocity: Point;
    radius: number;
    color: string;
}

class CanvasApp {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private balls: Ball[] = [];
    private animationId: number | null = null;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('Could not get canvas context');
        }
        this.ctx = context;
        this.setupCanvas();
        this.createBalls();
    }

    private setupCanvas(): void {
        this.canvas.width = 600;
        this.canvas.height = 400;
        this.canvas.style.cssText = 'border: 2px solid #e5e7eb; border-radius: 8px; background: #f9fafb;';
    }

    private createBalls(): void {
        const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
        for (let i = 0; i < 5; i++) {
            this.balls.push({
                position: {
                    x: Math.random() * (this.canvas.width - 40) + 20,
                    y: Math.random() * (this.canvas.height - 40) + 20,
                },
                velocity: {
                    x: (Math.random() - 0.5) * 4,
                    y: (Math.random() - 0.5) * 4,
                },
                radius: 15 + Math.random() * 15,
                color: colors[i % colors.length],
            });
        }
    }

    private drawBall(ball: Ball): void {
        this.ctx.beginPath();
        this.ctx.arc(ball.position.x, ball.position.y, ball.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = ball.color;
        this.ctx.fill();
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
    }

    private updateBall(ball: Ball): void {
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
    }

    private drawBackground(): void {
        // Gradient background
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, '#dbeafe');
        gradient.addColorStop(1, '#e0e7ff');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Grid
        this.ctx.strokeStyle = '#e5e7eb';
        this.ctx.lineWidth = 1;
        for (let x = 0; x < this.canvas.width; x += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y < this.canvas.height; y += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    private animate = (): void => {
        // Clear and redraw
        this.drawBackground();

        // Update and draw balls
        this.balls.forEach((ball) => {
            this.updateBall(ball);
            this.drawBall(ball);
        });

        // Continue animation
        this.animationId = requestAnimationFrame(this.animate);
    };

    start(): void {
        if (!this.animationId) {
            this.animate();
        }
    }

    stop(): void {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

// Initialize canvas app
const outputElement = document.getElementById('output') as HTMLDivElement;

if (!outputElement) {
    console.error('Output element not found!');
} else {
    outputElement.innerHTML = '';

    const container = document.createElement('div');
    container.style.cssText = 'padding: 20px; font-family: Arial, sans-serif;';

    // Header
    const header = document.createElement('h2');
    header.textContent = '🎨 Canvas Animation Demo';
    header.style.cssText = 'color: #2563eb; margin-bottom: 20px;';
    container.appendChild(header);

    // Description
    const description = document.createElement('p');
    description.textContent = 'Bouncing balls with HTML5 Canvas and TypeScript';
    description.style.cssText = 'color: #6b7280; margin-bottom: 15px;';
    container.appendChild(description);

    // Canvas
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    container.appendChild(canvas);

    // Controls
    const controls = document.createElement('div');
    controls.style.cssText = 'margin-top: 15px; display: flex; gap: 10px;';

    const startButton = document.createElement('button');
    startButton.textContent = '▶️ Start';
    startButton.style.cssText = `
        background: #10b981;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
    `;

    const stopButton = document.createElement('button');
    stopButton.textContent = '⏸️ Stop';
    stopButton.style.cssText = `
        background: #ef4444;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
    `;

    const resetButton = document.createElement('button');
    resetButton.textContent = '🔄 Reset';
    resetButton.style.cssText = `
        background: #3b82f6;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
    `;

    controls.appendChild(startButton);
    controls.appendChild(stopButton);
    controls.appendChild(resetButton);
    container.appendChild(controls);

    outputElement.appendChild(container);

    // Create app
    let app = new CanvasApp(canvas);
    app.start();

    startButton.addEventListener('click', () => app.start());
    stopButton.addEventListener('click', () => app.stop());
    resetButton.addEventListener('click', () => {
        app.stop();
        app = new CanvasApp(canvas);
        app.start();
    });

    console.log('=== Canvas Animation Demo ===');
    console.log('✓ Canvas API with TypeScript');
    console.log('✓ Animation loop with requestAnimationFrame');
    console.log('✓ Physics simulation (collision detection)');
    console.log('✓ Gradients and styling');
    console.log('Use the buttons to control the animation!');
}
