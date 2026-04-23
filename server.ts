import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { exec } from 'child_process';
import { promisify } from 'util';
import { readdir, stat, readFile, writeFile, unlink } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chokidar from 'chokidar';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
});

// Dynamically discover demo files
async function getDemos() {
    try {
        const demoDir = path.join(__dirname, 'demo');
        const files = await readdir(demoDir);

        return files
            .filter((file) => file.endsWith('-demo.ts'))
            .sort()
            .map((file) => {
                // Extract number and name from filename
                // e.g., "01-syntax-demo.ts" -> id: "01", name: "Syntax"
                // e.g., "11a-dom-basics-demo.ts" -> id: "11a", name: "🎨 Dom Basics"
                const match = file.match(/^(\d+[a-z]?)-(.+)-demo\.ts$/);
                if (match) {
                    const id = match[1];
                    let name = match[2]
                        .split('-')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');

                    // Add 🎨 prefix for DOM/interactive demos (11-series)
                    if (id.startsWith('11')) {
                        name = '🎨 ' + name;
                    }

                    return { id, name, file };
                }
                return null;
            })
            .filter(Boolean);
    } catch (error) {
        console.error('Error reading demo directory:', error);
        return [];
    }
}

// Get list of demos
app.get('/api/demos', async (req, res) => {
    try {
        const demos = await getDemos();
        res.json(demos);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Get source code of a demo
app.get('/api/code/:id', async (req, res) => {
    try {
        const demos = await getDemos();
        const demo = demos.find((ex) => ex?.id === req.params.id);

        if (!demo) {
            return res.status(404).json({ error: 'Demo not found' });
        }

        // For DOM demos (11a-d), serve .js files for browser execution
        let fileName = demo.file;
        if (req.params.id.startsWith('11')) {
            fileName = demo.file.replace('.ts', '.js');
        }

        const filePath = path.join(__dirname, 'demo', fileName);
        const sourceCode = await readFile(filePath, 'utf-8');

        res.json({
            id: demo.id,
            name: demo.name,
            file: fileName,
            code: sourceCode,
        });
    } catch (error: any) {
        console.error(`Error reading demo source:`, error.message);
        res.status(500).json({ error: error.message });
    }
});

// Run a demo
app.get('/api/run/:id', async (req, res) => {
    const startTime = Date.now();

    try {
        const demos = await getDemos();
        const demo = demos.find((ex) => ex?.id === req.params.id);

        if (!demo) {
            return res.status(404).json({ error: 'Demo not found' });
        }

        console.log(`  → Running demo: ${demo.file}`);

        const { stdout, stderr } = await execAsync(`tsx demo/${demo.file}`, {
            cwd: __dirname,
            timeout: 10000,
        });

        const duration = Date.now() - startTime;
        console.log(`  ✓ Completed in ${duration}ms`);

        res.json({
            success: true,
            output: stdout,
            error: stderr || null,
        });
    } catch (error: any) {
        const duration = Date.now() - startTime;
        console.error(`  ✗ Failed after ${duration}ms:`, error.message);

        res.json({
            success: false,
            output: error.stdout || '',
            error: error.stderr || error.message,
        });
    }
});

// Run modified code
app.post('/api/run-code', express.json({ limit: '1mb' }), async (req, res) => {
    const startTime = Date.now();

    try {
        const { code, demoId } = req.body;

        if (!code) {
            return res.status(400).json({ error: 'No code provided' });
        }

        console.log(`  → Running modified code for demo: ${demoId || 'unknown'}`);

        // Write code to temporary file
        const tempFile = path.join(__dirname, '.tmp-demo.ts');
        await writeFile(tempFile, code, 'utf-8');

        try {
            const { stdout, stderr } = await execAsync(`tsx ${tempFile}`, {
                cwd: __dirname,
                timeout: 10000,
            });

            const duration = Date.now() - startTime;
            console.log(`  ✓ Completed in ${duration}ms`);

            // Clean up temp file
            await unlink(tempFile).catch(() => {});

            res.json({
                success: true,
                output: stdout,
                error: stderr || null,
            });
        } catch (error: any) {
            const duration = Date.now() - startTime;
            console.error(`  ✗ Failed after ${duration}ms:`, error.message);

            // Clean up temp file
            await unlink(tempFile).catch(() => {});

            res.json({
                success: false,
                output: error.stdout || '',
                error: error.stderr || error.message,
            });
        }
    } catch (error: any) {
        const duration = Date.now() - startTime;
        console.error(`  ✗ Failed after ${duration}ms:`, error.message);

        res.status(500).json({
            success: false,
            output: '',
            error: error.message,
        });
    }
});

// Get file modification time for live reload
app.get('/api/mtime/:id', async (req, res) => {
    try {
        const demos = await getDemos();
        const demo = demos.find((ex) => ex?.id === req.params.id);

        if (!demo) {
            return res.status(404).json({ error: 'Demo not found' });
        }

        const filePath = path.join(__dirname, 'demo', demo.file);
        const stats = await stat(filePath);

        res.json({
            id: req.params.id,
            mtime: stats.mtimeMs,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log(`  → Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`  ← Client disconnected: ${socket.id}`);
    });
});

// Watch demo files for changes
const demoDir = path.join(__dirname, 'demo');
const watcher = chokidar.watch(`${demoDir}/**/*.ts`, {
    persistent: true,
    ignoreInitial: true,
});

watcher.on('change', async (filePath) => {
    const fileName = path.basename(filePath);
    console.log(`  📝 File changed: ${fileName}`);

    // Extract demo ID from filename
    const match = fileName.match(/^(\d+)-(.+)-demo\.ts$/);
    if (match) {
        const demoId = match[1];
        io.emit('file-changed', { id: demoId, file: fileName });
    }
});

watcher.on('error', (error) => {
    console.error('  Watcher error:', error);
});

httpServer.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('  🚀 TypeScript Practice Viewer');
    console.log('='.repeat(60));
    console.log(`  → Local:   http://localhost:${PORT}`);
    console.log(`  → Network: http://127.0.0.1:${PORT}`);
    console.log(`  → WebSocket: enabled`);
    console.log('='.repeat(60) + '\n');
    console.log('  Press Ctrl+C to stop\n');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n  👋 Shutting down gracefully...');
    watcher.close();
    httpServer.close(() => {
        console.log('  ✓ Server closed\n');
        process.exit(0);
    });
});
