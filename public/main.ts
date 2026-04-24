// Main application entry point
import { escapeHtml } from './utils.js';

// Playground modules
import {
    playgroundWorkspace,
    currentPlaygroundFile,
    isPlaygroundMode,
    setPlaygroundWorkspace,
    setPlaygroundMode,
    loadPlaygroundFromLocalStorage,
    savePlaygroundToLocalStorage,
    getPlaygroundFile,
} from './playground/state.js';
import { updateMonacoExtraLibs } from './playground/monaco-models.js';
import { executePlaygroundClientSide, executePlaygroundServerSide, executeClientSide } from './playground/execution.js';
import {
    renderPlaygroundFileTree,
    switchPlaygroundFile,
    createPlaygroundFile,
    deletePlaygroundFile,
    updateExecutionModeToggle,
    toggleExecutionMode,
} from './playground/ui.js';

// Editor modules
import { initMonacoEditor, initializeMonacoWithCode, monacoReady, getMonacoEditor } from './editor/monaco-setup.js';

// Demo modules
import {
    loadDemos,
    loadDemoCode,
    runDemoCode,
    runModifiedDemoCode,
    isDOMDemo,
    setCurrentDemo,
    currentDemo,
    renderDemoOutput,
} from './demos/loader.js';

// UI modules
import {
    setupSearch,
    setupCopyButtons,
    setupResizeHandle,
    setupKeyboardShortcuts,
    handleKeyPress,
    toggleHelp,
    updateModifiedBadge,
    updateExecutionTime,
    setRunningStatus,
} from './ui/handlers.js';
import { initializeWebSocket, toggleLiveReload } from './ui/websocket.js';

// State
let originalCode: string = '';

// Load playground
function loadPlayground(): void {
    setPlaygroundMode(true);
    setPlaygroundWorkspace(loadPlaygroundFromLocalStorage());

    // Update UI to show playground mode
    const outputTitle = document.getElementById('outputTitle');
    const headerActions = document.getElementById('headerActions');
    if (outputTitle) outputTitle.textContent = '🎮 Playground';
    if (headerActions) headerActions.classList.remove('hidden');

    // Clear demo selection
    document.querySelectorAll('.demo-item').forEach((item) => item.classList.remove('active'));
    setCurrentDemo(null);

    // Render file tree
    renderPlaygroundFileTree();

    // Update execution mode toggle
    updateExecutionModeToggle();

    // Load active file into editor
    const activeFile = getPlaygroundFile(currentPlaygroundFile);
    if (activeFile) {
        originalCode = activeFile.content;
        const editor = getMonacoEditor();
        if (editor) {
            editor.setValue(activeFile.content);
            updateModifiedBadge(false, true);
            updateMonacoExtraLibs();
        } else {
            // Wait for Monaco to load
            monacoReady.then(() => {
                initializeMonacoWithCode(activeFile.content, onMonacoContentChange, runModifiedCode, resetCode).then(
                    () => {
                        updateMonacoExtraLibs();
                    },
                );
            });
        }
    }

    // Update badge
    updateModifiedBadge(false, true);
}

// Monaco content change handler
function onMonacoContentChange(currentCode: string, original: string): void {
    updateModifiedBadge(currentCode !== original, isPlaygroundMode);
}

// Run modified code
async function runModifiedCode(): Promise<void> {
    const monacoEditor = getMonacoEditor();
    if (!monacoEditor) return;

    // Save current playground file content if in playground mode
    if (isPlaygroundMode && playgroundWorkspace) {
        const currentFile = getPlaygroundFile(currentPlaygroundFile);
        if (currentFile) {
            currentFile.content = monacoEditor.getValue();
            savePlaygroundToLocalStorage(playgroundWorkspace);
        }
    }

    const code = monacoEditor.getValue();
    const startTime = Date.now();

    setRunningStatus();

    // Handle playground mode execution
    if (isPlaygroundMode && playgroundWorkspace) {
        if (playgroundWorkspace.executionMode === 'client') {
            // Update current file content before execution
            const updatedFiles = playgroundWorkspace.files.map((f) =>
                f.name === currentPlaygroundFile ? { ...f, content: code } : f,
            );

            // Client-side multi-file execution
            const result = executePlaygroundClientSide(updatedFiles, currentPlaygroundFile);
            const duration = Date.now() - startTime;
            updateExecutionTime(duration);
            renderDemoOutput(result, true);
            return;
        } else {
            // Server-side execution for playground
            const result = await executePlaygroundServerSide(playgroundWorkspace.files, currentPlaygroundFile);
            const duration = Date.now() - startTime;
            updateExecutionTime(duration);
            renderDemoOutput(result, false);
            return;
        }
    }

    // Check if this is a DOM demo - execute client-side
    if (currentDemo && isDOMDemo(currentDemo)) {
        const result = executeClientSide(code);
        const duration = Date.now() - startTime;
        updateExecutionTime(duration);
        renderDemoOutput(result, true);
        return;
    }

    // Regular server-side execution for non-DOM demos
    const result = await runModifiedDemoCode(code, currentDemo);
    const duration = Date.now() - startTime;
    updateExecutionTime(duration);
    renderDemoOutput(result, false);
}

// Reset to original code
function resetCode(): void {
    const monacoEditor = getMonacoEditor();

    // In playground mode, don't reset - show a message instead
    if (isPlaygroundMode) {
        if (!confirm('Reset this playground file to its last saved state? Unsaved changes will be lost.')) {
            return;
        }
        // Reload from localStorage
        if (playgroundWorkspace) {
            const file = getPlaygroundFile(currentPlaygroundFile);
            if (file && monacoEditor) {
                monacoEditor.setValue(file.content);
                originalCode = file.content;
                updateModifiedBadge(false, true);
            }
        }
        return;
    }

    if (monacoEditor && originalCode) {
        monacoEditor.setValue(originalCode);
        updateModifiedBadge(false, false);
    }
}

// Run a demo
async function runDemo(id: string, name: string): Promise<void> {
    const monacoEditor = getMonacoEditor();

    // Save playground state if we're leaving playground mode
    if (isPlaygroundMode && playgroundWorkspace && monacoEditor) {
        const currentFile = getPlaygroundFile(currentPlaygroundFile);
        if (currentFile) {
            currentFile.content = monacoEditor.getValue();
            savePlaygroundToLocalStorage(playgroundWorkspace);
        }
    }

    // Exit playground mode
    setPlaygroundMode(false);

    const startTime = Date.now();

    // Update active state
    document.querySelectorAll('.demo-item').forEach((item) => {
        item.classList.toggle('active', item.getAttribute('data-id') === id);
    });

    setCurrentDemo(id);

    // Show header actions when demo is selected
    const headerActions = document.getElementById('headerActions');
    if (headerActions) {
        headerActions.classList.remove('hidden');
    }

    const outputTitle = document.getElementById('outputTitle');
    if (outputTitle) outputTitle.textContent = name;

    setRunningStatus();

    // Load source code
    const codeData = await loadDemoCode(id);
    if (codeData) {
        originalCode = codeData.code;
        if (monacoEditor) {
            monacoEditor.setValue(codeData.code);
            updateModifiedBadge(false, false);
        } else {
            await monacoReady;
            await initializeMonacoWithCode(codeData.code, onMonacoContentChange, runModifiedCode, resetCode);
        }
    }

    // Check if this is a DOM demo - execute client-side
    if (isDOMDemo(id)) {
        if (codeData) {
            const result = executeClientSide(codeData.code);
            const duration = Date.now() - startTime;
            updateExecutionTime(duration);
            renderDemoOutput(result, true);
        }
        return;
    }

    // Regular server-side execution for non-DOM demos
    const result = await runDemoCode(id);
    const duration = Date.now() - startTime;
    updateExecutionTime(duration);
    renderDemoOutput(result, false);
}

// Initialize everything
function init(): void {
    loadDemos();
    setupSearch();
    setupCopyButtons();
    setupResizeHandle();
    setupKeyboardShortcuts(runModifiedCode, resetCode, toggleHelp);
    initializeWebSocket();

    // Load Monaco Editor
    if (typeof window !== 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js';
        script.onload = () => {
            initMonacoEditor();
            // Load playground by default after Monaco is ready
            monacoReady.then(() => {
                loadPlayground();
            });
        };
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
(window as any).loadPlayground = loadPlayground;
(window as any).createPlaygroundFile = createPlaygroundFile;
(window as any).deletePlaygroundFile = deletePlaygroundFile;
(window as any).switchPlaygroundFile = switchPlaygroundFile;
(window as any).toggleExecutionMode = toggleExecutionMode;

// Import and export resetPlayground
import { resetPlayground } from './playground/ui.js';
(window as any).resetPlayground = resetPlayground;
