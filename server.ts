import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import { readdir, stat } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
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
                const match = file.match(/^(\d+)-(.+)-demo\.ts$/);
                if (match) {
                    const id = match[1];
                    const name = match[2]
                        .split('-')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ');
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

app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('  🚀 TypeScript Practice Viewer');
    console.log('='.repeat(60));
    console.log(`  → Local:   http://localhost:${PORT}`);
    console.log(`  → Network: http://127.0.0.1:${PORT}`);
    console.log('='.repeat(60) + '\n');
    console.log('  Press Ctrl+C to stop\n');
});
