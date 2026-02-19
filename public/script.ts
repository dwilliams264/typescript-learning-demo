interface Demo {
    id: string;
    name: string;
}

interface RunResult {
    success: boolean;
    output: string;
    error?: string;
}

interface MtimeResponse {
    mtime: number;
}

let currentDemo: string | null = null;
let demos: Demo[] = [];
let liveReloadEnabled: boolean = true;
let liveReloadInterval: number | null = null;
let lastMtime: number | null = null;

// Load demos
async function loadDemos(): Promise<void> {
    try {
        const response = await fetch('/api/demos');
        demos = await response.json();

        const list = document.getElementById('demoList');
        if (!list) return;

        list.innerHTML = demos
            .map(
                (ex: Demo) => `
            <li class="demo-item" data-id="${ex.id}" onclick="runDemo('${ex.id}', '${ex.name}')" tabindex="0" onkeydown="handleKeyPress(event, '${ex.id}', '${ex.name}')">
                ${ex.id}. ${ex.name}
            </li>
        `,
            )
            .join('');
    } catch (error) {
        console.error('Failed to load demos:', error);
        const list = document.getElementById('demoList');
        if (list) {
            list.innerHTML = '<li style="color: #f48771; padding: 12px;">Failed to load demos</li>';
        }
    }
}

// Keyboard navigation
function handleKeyPress(event: KeyboardEvent, id: string, name: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        runDemo(id, name);
    }
}

// Arrow key navigation
document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const items = Array.from(document.querySelectorAll<HTMLElement>('.demo-item'));
        const currentIndex = items.findIndex((item) => item.classList.contains('active'));

        let nextIndex: number;
        if (e.key === 'ArrowUp') {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        } else {
            nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        }

        if (items[nextIndex]) {
            const demo = demos[nextIndex];
            runDemo(demo.id, demo.name);
            items[nextIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }
});

// Run a demo
async function runDemo(id: string, name: string): Promise<void> {
    // Update active state
    document.querySelectorAll('.demo-item').forEach((item) => {
        item.classList.toggle('active', item.getAttribute('data-id') === id);
    });

    currentDemo = id;
    lastMtime = null; // Reset mtime when manually running

    // Show header actions when demo is selected
    const headerActions = document.getElementById('headerActions');
    if (headerActions) {
        headerActions.classList.remove('hidden');
    }

    const outputTitle = document.getElementById('outputTitle');
    const status = document.getElementById('status');
    const output = document.getElementById('output');

    if (outputTitle) outputTitle.textContent = name;
    if (status) {
        status.textContent = 'Running...';
        status.className = 'status loading';
    }
    if (output) {
        output.innerHTML = '<div class="placeholder">⏳ Running...</div>';
    }

    try {
        const response = await fetch(`/api/run/${id}`);
        const result: RunResult = await response.json();

        if (result.success) {
            if (status) {
                status.textContent = '✓ Success';
                status.className = 'status success';
            }

            let outputHtml = `<pre>${escapeHtml(result.output)}</pre>`;
            if (result.error) {
                outputHtml += `<div class="error-output"><strong>Warnings:</strong>\n${escapeHtml(result.error)}</div>`;
            }
            if (output) {
                output.innerHTML = outputHtml;
            }

            // Update mtime for live reload tracking
            if (liveReloadEnabled) {
                try {
                    const mtimeResponse = await fetch(`/api/mtime/${id}`);
                    const mtimeData: MtimeResponse = await mtimeResponse.json();
                    lastMtime = mtimeData.mtime;
                } catch (e) {
                    console.error('Failed to get mtime:', e);
                }
            }
        } else {
            if (status) {
                status.textContent = '✗ Error';
                status.className = 'status error';
            }

            let errorHtml = '';
            if (result.output) {
                errorHtml += `<pre>${escapeHtml(result.output)}</pre>`;
            }
            if (result.error) {
                errorHtml += `<div class="error-output"><strong>Error:</strong>\n${escapeHtml(result.error)}</div>`;
            }
            if (output) {
                output.innerHTML = errorHtml;
            }
        }
    } catch (error) {
        if (status) {
            status.textContent = '✗ Error';
            status.className = 'status error';
        }
        if (output) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            output.innerHTML = `<div class="error-output">Network error: ${errorMessage}</div>`;
        }
    }
}

function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Toggle live reload
function toggleLiveReload(): void {
    liveReloadEnabled = !liveReloadEnabled;
    const btn = document.getElementById('liveReloadBtn');

    if (liveReloadEnabled) {
        btn?.classList.add('active');
        startLiveReload();
    } else {
        btn?.classList.remove('active');
        stopLiveReload();
    }
}

// Start live reload polling
function startLiveReload(): void {
    if (liveReloadInterval) return;

    liveReloadInterval = window.setInterval(async () => {
        if (!currentDemo) return;

        try {
            const response = await fetch(`/api/mtime/${currentDemo}`);
            const data: MtimeResponse = await response.json();

            if (lastMtime && data.mtime > lastMtime) {
                console.log('File changed, reloading...');
                const demo = demos.find((d) => d.id === currentDemo);
                if (demo) {
                    await runDemo(demo.id, demo.name);
                }
            }

            lastMtime = data.mtime;
        } catch (error) {
            console.error('Live reload check failed:', error);
        }
    }, 2000); // Check every 2 seconds
}

// Stop live reload polling
function stopLiveReload(): void {
    if (liveReloadInterval) {
        clearInterval(liveReloadInterval);
        liveReloadInterval = null;
    }
}

// Load on start
loadDemos();

// Enable live reload by default
startLiveReload();

// Export functions to window for inline event handlers
(window as any).runDemo = runDemo;
(window as any).handleKeyPress = handleKeyPress;
(window as any).toggleLiveReload = toggleLiveReload;
