// Type declarations for Prism.js (loaded via CDN)
declare const Prism: {
    highlight: (text: string, grammar: any, language: string) => string;
    languages: {
        typescript: any;
    };
};

// Type declarations for Socket.io (loaded via CDN)
declare const io: any;

// Type declarations for Monaco Editor (loaded via CDN)
declare const monaco: any;
declare const require: any;

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

interface CodeResponse {
    id: string;
    name: string;
    file: string;
    code: string;
}

let currentDemo: string | null = null;
let demos: Demo[] = [];
let liveReloadEnabled: boolean = true;
let socket: any = null;
let lastExecutionTime: number = 0;

// Monaco Editor state
let monacoEditor: any = null;
let originalCode: string = '';
let monacoReady: Promise<void>;
let resolveMonacoReady: () => void;

// Initialize monacoReady promise immediately
monacoReady = new Promise<void>((resolve) => {
    resolveMonacoReady = resolve;
});

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
            <li class="demo-item" data-id="${ex.id}" data-name="${ex.name}" onclick="runDemo('${ex.id}', '${ex.name}')" tabindex="0" onkeydown="handleKeyPress(event, '${ex.id}', '${ex.name}')">
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

// Load demo source code
async function loadDemoCode(id: string): Promise<void> {
    const monacoContainer = document.getElementById('monacoContainer');
    if (!monacoContainer) return;

    try {
        // Only show placeholder if Monaco hasn't been created yet
        if (!monacoEditor) {
            monacoContainer.innerHTML = '<div class="placeholder">⏳ Loading code...</div>';
        }

        const response = await fetch(`/api/code/${id}`);
        const data: CodeResponse = await response.json();

        // Store original code
        originalCode = data.code;

        // Initialize or update Monaco Editor
        if (!monacoEditor) {
            // Always wait for Monaco to be ready
            await monacoReady;
            await initializeMonacoWithCode(data.code);
        } else {
            monacoEditor.setValue(data.code);
            updateModifiedBadge(false);
        }
    } catch (error) {
        console.error('Failed to load code:', error);
        monacoContainer.innerHTML = '<div class="placeholder" style="color: #f48771;">Failed to load code</div>';
    }
}

// Search functionality
function setupSearch(): void {
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = (e.target as HTMLInputElement).value.toLowerCase();
        const items = document.querySelectorAll<HTMLElement>('.demo-item');

        items.forEach((item) => {
            const name = item.getAttribute('data-name')?.toLowerCase() || '';
            const id = item.getAttribute('data-id')?.toLowerCase() || '';

            if (name.includes(query) || id.includes(query)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    });
}

// Initialize Monaco Editor
function initMonacoEditor(): void {
    if (typeof require === 'undefined') {
        console.error('RequireJS not available for Monaco');
        return;
    }

    require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } });

    require(['vs/editor/editor.main'], function () {
        console.log('✓ Monaco Editor loaded');
        resolveMonacoReady();
    });
}

async function initializeMonacoWithCode(code: string): Promise<void> {
    const monacoContainer = document.getElementById('monacoContainer');
    if (!monacoContainer) {
        throw new Error('Monaco container not found');
    }

    if (typeof monaco === 'undefined') {
        throw new Error('Monaco not loaded');
    }

    // Clear placeholder
    monacoContainer.innerHTML = '';

    monacoEditor = monaco.editor.create(monacoContainer, {
        value: code,
        language: 'typescript',
        theme: 'vs-dark',
        minimap: { enabled: false },
        fontSize: 13,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 4,
    });

    // Track changes
    monacoEditor.onDidChangeModelContent(() => {
        const currentCode = monacoEditor.getValue();
        updateModifiedBadge(currentCode !== originalCode);
    });

    // Keyboard shortcuts within Monaco
    monacoEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        runModifiedCode();
    });

    monacoEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        runModifiedCode();
    });

    monacoEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR, () => {
        resetCode();
    });
}

function updateModifiedBadge(isModified: boolean): void {
    const badge = document.getElementById('modifiedBadge');
    if (badge) {
        if (isModified) {
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
}

// Run modified code
async function runModifiedCode(): Promise<void> {
    if (!monacoEditor) return;

    const code = monacoEditor.getValue();
    const startTime = Date.now();

    const status = document.getElementById('status');
    const output = document.getElementById('output');
    const executionTime = document.getElementById('executionTime');

    if (status) {
        status.textContent = 'Running...';
        status.className = 'status loading';
    }
    if (output) {
        output.innerHTML = '<div class="placeholder">⏳ Running modified code...</div>';
    }

    try {
        const response = await fetch('/api/run-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, demoId: currentDemo }),
        });

        const result: RunResult = await response.json();
        const duration = Date.now() - startTime;

        if (executionTime) {
            executionTime.textContent = `${duration}ms`;
        }

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

// Reset to original code
function resetCode(): void {
    if (monacoEditor && originalCode) {
        monacoEditor.setValue(originalCode);
        updateModifiedBadge(false);
    }
}

// Keyboard navigation
function handleKeyPress(event: KeyboardEvent, id: string, name: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        runDemo(id, name);
    }
}

// Global keyboard shortcuts
document.addEventListener('keydown', (e: KeyboardEvent) => {
    // Arrow key navigation
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        const items = Array.from(document.querySelectorAll<HTMLElement>('.demo-item:not(.hidden)'));
        const currentIndex = items.findIndex((item) => item.classList.contains('active'));

        let nextIndex: number;
        if (e.key === 'ArrowUp') {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
        } else {
            nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
        }

        if (items[nextIndex]) {
            const id = items[nextIndex].getAttribute('data-id');
            const name = items[nextIndex].getAttribute('data-name');
            if (id && name) {
                runDemo(id, name);
                items[nextIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
    }

    // Ctrl/Cmd + K for search focus
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput') as HTMLInputElement;
        searchInput?.focus();
    }

    // Ctrl/Cmd + Enter to run (when not focused in Monaco)
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runModifiedCode();
    }

    // Ctrl/Cmd + R to reset (when not focused in Monaco)
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        resetCode();
    }

    // ? for help
    if (e.key === '?') {
        e.preventDefault();
        toggleHelp();
    }

    // Escape to close modals
    if (e.key === 'Escape') {
        const helpModal = document.getElementById('helpModal');
        if (helpModal && !helpModal.classList.contains('hidden')) {
            toggleHelp();
        }
    }
});

// Run a demo
async function runDemo(id: string, name: string): Promise<void> {
    const startTime = Date.now();

    // Update active state
    document.querySelectorAll('.demo-item').forEach((item) => {
        item.classList.toggle('active', item.getAttribute('data-id') === id);
    });

    currentDemo = id;

    // Show header actions when demo is selected
    const headerActions = document.getElementById('headerActions');
    if (headerActions) {
        headerActions.classList.remove('hidden');
    }

    const outputTitle = document.getElementById('outputTitle');
    const status = document.getElementById('status');
    const output = document.getElementById('output');
    const executionTime = document.getElementById('executionTime');

    if (outputTitle) outputTitle.textContent = name;
    if (status) {
        status.textContent = 'Running...';
        status.className = 'status loading';
    }
    if (output) {
        output.innerHTML = '<div class="placeholder">⏳ Running...</div>';
    }
    if (executionTime) {
        executionTime.textContent = '';
    }

    // Load source code in parallel
    loadDemoCode(id);

    try {
        const response = await fetch(`/api/run/${id}`);
        const result: RunResult = await response.json();

        const duration = Date.now() - startTime;
        lastExecutionTime = duration;

        if (executionTime) {
            executionTime.textContent = `${duration}ms`;
        }

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

            // Update mtime for live reload tracking (kept for backwards compatibility with polling)
            if (liveReloadEnabled) {
                try {
                    const mtimeResponse = await fetch(`/api/mtime/${id}`);
                    const mtimeData: MtimeResponse = await mtimeResponse.json();
                } catch (e) {
                    // Silently fail - WebSocket handles live reload now
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

// Initialize WebSocket connection
function initializeWebSocket(): void {
    socket = io();

    socket.on('connect', () => {
        console.log('✓ WebSocket connected');
        updateConnectionStatus(true);
    });

    socket.on('disconnect', () => {
        console.log('✗ WebSocket disconnected');
        updateConnectionStatus(false);
    });

    socket.on('file-changed', (data: { id: string; file: string }) => {
        if (liveReloadEnabled && currentDemo === data.id) {
            console.log(`File changed: ${data.file}, reloading...`);
            const demo = demos.find((d) => d.id === data.id);
            if (demo) {
                runDemo(demo.id, demo.name);
            }
        }
    });
}

function updateConnectionStatus(connected: boolean): void {
    const btn = document.getElementById('liveReloadBtn');
    if (!btn) return;

    if (connected) {
        btn.title = 'Live reload: Connected';
    } else {
        btn.title = 'Live reload: Disconnected';
    }
}

// Start live reload (WebSocket-based)
function startLiveReload(): void {
    if (socket && !socket.connected) {
        socket.connect();
    }
}

// Stop live reload
function stopLiveReload(): void {
    // Keep socket connected but just ignore file-changed events
    // The toggleLiveReload function already updates the liveReloadEnabled flag
}

// Toggle help modal
function toggleHelp(): void {
    const modal = document.getElementById('helpModal');
    if (modal) {
        modal.classList.toggle('hidden');
    }
}

// Copy button functionality
function setupCopyButtons(): void {
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    const copyOutputBtn = document.getElementById('copyOutputBtn');

    copyCodeBtn?.addEventListener('click', async () => {
        const codeContent = document.querySelector('#codeContent pre code');
        if (codeContent) {
            try {
                await navigator.clipboard.writeText(codeContent.textContent || '');
                showCopiedState(copyCodeBtn as HTMLElement);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    });

    copyOutputBtn?.addEventListener('click', async () => {
        const output = document.querySelector('#output pre');
        if (output) {
            try {
                await navigator.clipboard.writeText(output.textContent || '');
                showCopiedState(copyOutputBtn as HTMLElement);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    });
}

function showCopiedState(button: HTMLElement): void {
    button.classList.add('copied');
    const originalHtml = button.innerHTML;
    button.innerHTML = '<span>✓</span>';

    setTimeout(() => {
        button.classList.remove('copied');
        button.innerHTML = originalHtml;
    }, 2000);
}

// Resize handle functionality
function setupResizeHandle(): void {
    const resizeHandle = document.getElementById('resizeHandle');
    const codePanel = document.getElementById('codePanel');
    const outputPanel = document.getElementById('outputPanel');

    if (!resizeHandle || !codePanel || !outputPanel) return;

    let isResizing = false;
    let startX = 0;
    let startWidth = 0;

    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        startX = e.clientX;
        startWidth = codePanel.offsetWidth;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;

        const delta = e.clientX - startX;
        const newWidth = startWidth + delta;
        const containerWidth = codePanel.parentElement?.offsetWidth || 0;
        const minWidth = 200;
        const maxWidth = containerWidth - minWidth - 8; // 8px for resize handle

        if (newWidth >= minWidth && newWidth <= maxWidth) {
            codePanel.style.flex = 'none';
            codePanel.style.width = `${newWidth}px`;
            outputPanel.style.flex = '1';
        }
    });

    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
    });
}

// Initialize everything
function init(): void {
    loadDemos();
    setupSearch();
    setupCopyButtons();
    setupResizeHandle();
    initializeWebSocket();

    // Load Monaco Editor
    if (typeof window !== 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js';
        script.onload = () => initMonacoEditor();
        document.head.appendChild(script);
    }
}

// Load on start
init();

// Export functions to window for inline event handlers
(window as any).runDemo = runDemo;
(window as any).handleKeyPress = handleKeyPress;
(window as any).toggleLiveReload = toggleLiveReload;
(window as any).toggleHelp = toggleHelp;
(window as any).runModifiedCode = runModifiedCode;
(window as any).resetCode = resetCode;
