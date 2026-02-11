let currentDemo = null;
let demos = [];
let liveReloadEnabled = true;
let liveReloadInterval = null;
let lastMtime = null;

// Load demos
async function loadDemos() {
    try {
        const response = await fetch('/api/demos');
        demos = await response.json();

        const list = document.getElementById('demoList');
        list.innerHTML = demos
            .map(
                (ex) => `
            <li class="demo-item" data-id="${ex.id}" onclick="runDemo('${ex.id}', '${ex.name}')" tabindex="0" onkeydown="handleKeyPress(event, '${ex.id}', '${ex.name}')">
                ${ex.id}. ${ex.name}
            </li>
        `,
            )
            .join('');
    } catch (error) {
        console.error('Failed to load demos:', error);
        document.getElementById('demoList').innerHTML =
            '<li style="color: #f48771; padding: 12px;">Failed to load demos</li>';
    }
}

// Keyboard navigation
function handleKeyPress(event, id, name) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        runDemo(id, name);
    }
}

// Arrow key navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const items = Array.from(document.querySelectorAll('.demo-item'));
        const currentIndex = items.findIndex((item) => item.classList.contains('active'));

        let nextIndex;
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
async function runDemo(id, name) {
    // Update active state
    document.querySelectorAll('.demo-item').forEach((item) => {
        item.classList.toggle('active', item.dataset.id === id);
    });

    currentDemo = id;
    lastMtime = null; // Reset mtime when manually running

    // Show header actions when demo is selected
    document.getElementById('headerActions').classList.remove('hidden');

    document.getElementById('outputTitle').textContent = name;
    document.getElementById('status').textContent = 'Running...';
    document.getElementById('status').className = 'status loading';
    document.getElementById('output').innerHTML = '<div class="placeholder">⏳ Running...</div>';

    try {
        const response = await fetch(`/api/run/${id}`);
        const result = await response.json();

        if (result.success) {
            document.getElementById('status').textContent = '✓ Success';
            document.getElementById('status').className = 'status success';

            let outputHtml = `<pre>${escapeHtml(result.output)}</pre>`;
            if (result.error) {
                outputHtml += `<div class="error-output"><strong>Warnings:</strong>\n${escapeHtml(result.error)}</div>`;
            }
            document.getElementById('output').innerHTML = outputHtml;

            // Update mtime for live reload tracking
            if (liveReloadEnabled) {
                try {
                    const mtimeResponse = await fetch(`/api/mtime/${id}`);
                    const mtimeData = await mtimeResponse.json();
                    lastMtime = mtimeData.mtime;
                } catch (e) {
                    console.error('Failed to get mtime:', e);
                }
            }
        } else {
            document.getElementById('status').textContent = '✗ Error';
            document.getElementById('status').className = 'status error';

            let errorHtml = '';
            if (result.output) {
                errorHtml += `<pre>${escapeHtml(result.output)}</pre>`;
            }
            if (result.error) {
                errorHtml += `<div class="error-output"><strong>Error:</strong>\n${escapeHtml(result.error)}</div>`;
            }
            document.getElementById('output').innerHTML = errorHtml;
        }
    } catch (error) {
        document.getElementById('status').textContent = '✗ Error';
        document.getElementById('status').className = 'status error';
        document.getElementById('output').innerHTML = `<div class="error-output">Network error: ${error.message}</div>`;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Toggle live reload
function toggleLiveReload() {
    liveReloadEnabled = !liveReloadEnabled;
    const btn = document.getElementById('liveReloadBtn');

    if (liveReloadEnabled) {
        btn.classList.add('active');
        startLiveReload();
    } else {
        btn.classList.remove('active');
        stopLiveReload();
    }
}

// Start live reload polling
function startLiveReload() {
    if (liveReloadInterval) return;

    liveReloadInterval = setInterval(async () => {
        if (!currentDemo) return;

        try {
            const response = await fetch(`/api/mtime/${currentDemo}`);
            const data = await response.json();

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
function stopLiveReload() {
    if (liveReloadInterval) {
        clearInterval(liveReloadInterval);
        liveReloadInterval = null;
    }
}

// Load on start
loadDemos();

// Enable live reload by default
startLiveReload();
