// UI event handlers and updates
import { showCopiedState } from '../utils.js';
import { demos, currentDemo } from '../demos/loader.js';
import { liveReloadEnabled, setLiveReloadEnabled } from './websocket.js';

export function setupSearch(): void {
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

export function setupCopyButtons(): void {
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

export function setupResizeHandle(): void {
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
        const maxWidth = containerWidth - minWidth - 8;

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

export function setupKeyboardShortcuts(onRunCode: () => void, onResetCode: () => void, onToggleHelp: () => void): void {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
        // Arrow key navigation for demos
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
                    (window as any).runDemo(id, name);
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

        // Ctrl/Cmd + Enter to run
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            onRunCode();
        }

        // Ctrl/Cmd + R to reset
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            onResetCode();
        }

        // ? for help
        if (e.key === '?') {
            e.preventDefault();
            onToggleHelp();
        }

        // Escape to close modals
        if (e.key === 'Escape') {
            const helpModal = document.getElementById('helpModal');
            if (helpModal && !helpModal.classList.contains('hidden')) {
                onToggleHelp();
            }
        }
    });
}

export function handleKeyPress(event: KeyboardEvent, id: string, name: string): void {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        (window as any).runDemo(id, name);
    }
}

export function toggleHelp(): void {
    const modal = document.getElementById('helpModal');
    if (modal) {
        modal.classList.toggle('hidden');
    }
}

export function updateModifiedBadge(isModified: boolean, isPlayground: boolean): void {
    const badge = document.getElementById('modifiedBadge');
    if (badge) {
        if (isPlayground) {
            badge.textContent = 'PLAYGROUND';
            badge.classList.remove('hidden');
            badge.style.backgroundColor = '#4a9eff';
        } else if (isModified) {
            badge.textContent = 'Modified';
            badge.classList.remove('hidden');
            badge.style.backgroundColor = '';
        } else {
            badge.classList.add('hidden');
            badge.style.backgroundColor = '';
        }
    }
}

export function updateExecutionTime(duration: number): void {
    const executionTime = document.getElementById('executionTime');
    if (executionTime) {
        executionTime.textContent = `${duration}ms`;
    }
}

export function setRunningStatus(): void {
    const status = document.getElementById('status');
    const output = document.getElementById('output');

    if (status) {
        status.textContent = 'Running...';
        status.className = 'status loading';
    }
    if (output) {
        output.innerHTML = '<div class="placeholder">⏳ Running modified code...</div>';
    }
}
