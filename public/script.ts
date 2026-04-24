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

// Playground interfaces
interface PlaygroundFile {
    name: string;
    content: string;
}

interface PlaygroundWorkspace {
    files: PlaygroundFile[];
    activeFile: string;
    executionMode: 'client' | 'server';
}

// Playground state
let isPlaygroundMode: boolean = false;
let playgroundWorkspace: PlaygroundWorkspace | null = null;
let currentPlaygroundFile: string = 'main.ts';

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

// Playground localStorage functions
const PLAYGROUND_STORAGE_KEY = 'typescript-playground-workspace';

function getDefaultPlaygroundWorkspace(): PlaygroundWorkspace {
    return {
        files: [
            {
                name: 'main.ts',
                content: `// 🎮 TypeScript Playground
// Welcome! This is your personal scratch space for practicing TypeScript.
//
// Features:
// - Create multiple .ts files and import between them
// - Toggle between client-side (browser/DOM) and server-side (Node.js) execution
// - Your code auto-saves to your browser
// - Demo files are available in the sidebar as reference
//
// Example: Create a new file called "utils.ts" with:
// export const greet = (name: string) => \`Hello, \${name}!\`;
//
// Then import it here:
// import { greet } from './utils';
// console.log(greet('World'));
//
// Get started by writing some TypeScript below! 👇

console.log('Welcome to the TypeScript Playground! 🚀');

// Your code here...
`,
            },
        ],
        activeFile: 'main.ts',
        executionMode: 'server',
    };
}

function savePlaygroundToLocalStorage(workspace: PlaygroundWorkspace): void {
    try {
        localStorage.setItem(PLAYGROUND_STORAGE_KEY, JSON.stringify(workspace));
    } catch (error) {
        console.error('Failed to save playground to localStorage:', error);
    }
}

function loadPlaygroundFromLocalStorage(): PlaygroundWorkspace {
    try {
        const stored = localStorage.getItem(PLAYGROUND_STORAGE_KEY);
        if (stored) {
            const workspace = JSON.parse(stored) as PlaygroundWorkspace;
            // Validate workspace has at least one file
            if (workspace.files && workspace.files.length > 0) {
                return workspace;
            }
        }
    } catch (error) {
        console.error('Failed to load playground from localStorage:', error);
    }
    return getDefaultPlaygroundWorkspace();
}

// Playground file management
function renderPlaygroundFileTree(): void {
    const fileTreeContainer = document.getElementById('playgroundFiles');
    if (!fileTreeContainer || !playgroundWorkspace) return;

    fileTreeContainer.innerHTML = playgroundWorkspace.files
        .map(
            (file) => `
        <div class="playground-file ${file.name === currentPlaygroundFile ? 'active' : ''}" 
             data-filename="${file.name}"
             onclick="switchPlaygroundFile('${file.name}')">
            <span class="file-icon">📄</span>
            <span class="file-name">${file.name}</span>
            ${playgroundWorkspace!.files.length > 1 ? `<button class="delete-file-btn" onclick="event.stopPropagation(); deletePlaygroundFile('${file.name}')" title="Delete file">×</button>` : ''}
        </div>
    `,
        )
        .join('');
}

function switchPlaygroundFile(filename: string): void {
    if (!playgroundWorkspace || !monacoEditor || typeof monaco === 'undefined') return;

    // Save current file content before switching
    const currentFile = playgroundWorkspace.files.find((f) => f.name === currentPlaygroundFile);
    if (currentFile) {
        currentFile.content = monacoEditor.getValue();
    }

    // Switch to new file
    currentPlaygroundFile = filename;
    playgroundWorkspace.activeFile = filename;

    const newFile = playgroundWorkspace.files.find((f) => f.name === filename);
    if (newFile) {
        // Create or get model for the new file with proper URI
        const uri = monaco.Uri.parse(`file:///workspace/${filename}`);
        let model = monaco.editor.getModel(uri);

        if (!model) {
            model = monaco.editor.createModel(newFile.content, 'typescript', uri);
        } else {
            // Update existing model content
            model.setValue(newFile.content);
        }

        monacoEditor.setModel(model);
        originalCode = newFile.content; // Update original code reference
        updateModifiedBadge(false);
    }

    renderPlaygroundFileTree();
    savePlaygroundToLocalStorage(playgroundWorkspace);

    // Update Monaco's understanding of other files
    updateMonacoExtraLibs();
}

function updateMonacoExtraLibs(): void {
    if (!playgroundWorkspace || typeof monaco === 'undefined') return;

    // Create models for all playground files so Monaco can resolve imports between them
    playgroundWorkspace.files.forEach((file) => {
        const uri = monaco.Uri.parse(`file:///workspace/${file.name}`);
        let model = monaco.editor.getModel(uri);

        if (!model) {
            // Create new model for this file
            monaco.editor.createModel(file.content, 'typescript', uri);
        } else if (file.name !== currentPlaygroundFile) {
            // Update content of non-active files
            model.setValue(file.content);
        }
    });
}

function createPlaygroundFile(): void {
    if (!playgroundWorkspace) return;

    const filename = prompt('Enter filename (e.g., utils.ts):');
    if (!filename) return;

    // Validate filename
    if (!filename.endsWith('.ts')) {
        alert('Filename must end with .ts');
        return;
    }

    if (!/^[a-zA-Z0-9-_]+\.ts$/.test(filename)) {
        alert('Filename can only contain letters, numbers, hyphens, and underscores');
        return;
    }

    if (playgroundWorkspace.files.some((f) => f.name === filename)) {
        alert('File already exists');
        return;
    }

    // Check file count limit
    if (playgroundWorkspace.files.length >= 20) {
        alert('Maximum 20 files allowed in playground');
        return;
    }

    // Create new file
    const newFile: PlaygroundFile = {
        name: filename,
        content: `// ${filename}\n\n`,
    };

    playgroundWorkspace.files.push(newFile);
    renderPlaygroundFileTree();
    savePlaygroundToLocalStorage(playgroundWorkspace);

    // Switch to new file
    switchPlaygroundFile(filename);
    updateMonacoExtraLibs();
}

function deletePlaygroundFile(filename: string): void {
    if (!playgroundWorkspace) return;

    if (playgroundWorkspace.files.length <= 1) {
        alert('Cannot delete the last file');
        return;
    }

    if (!confirm(`Delete ${filename}?`)) {
        return;
    }

    playgroundWorkspace.files = playgroundWorkspace.files.filter((f) => f.name !== filename);

    // If deleted file was active, switch to first file
    if (currentPlaygroundFile === filename) {
        currentPlaygroundFile = playgroundWorkspace.files[0].name;
        playgroundWorkspace.activeFile = currentPlaygroundFile;

        if (monacoEditor) {
            monacoEditor.setValue(playgroundWorkspace.files[0].content);
            originalCode = playgroundWorkspace.files[0].content;
            updateModifiedBadge(false);
        }
    }

    renderPlaygroundFileTree();
    savePlaygroundToLocalStorage(playgroundWorkspace);
    updateMonacoExtraLibs();
}

function loadPlayground(): void {
    isPlaygroundMode = true;
    playgroundWorkspace = loadPlaygroundFromLocalStorage();
    currentPlaygroundFile = playgroundWorkspace.activeFile;

    // Update UI to show playground mode
    const outputTitle = document.getElementById('outputTitle');
    const headerActions = document.getElementById('headerActions');
    if (outputTitle) outputTitle.textContent = '🎮 Playground';
    if (headerActions) headerActions.classList.remove('hidden');

    // Clear demo selection
    document.querySelectorAll('.demo-item').forEach((item) => item.classList.remove('active'));
    currentDemo = null;

    // Render file tree
    renderPlaygroundFileTree();

    // Update execution mode toggle
    updateExecutionModeToggle();

    // Load active file into editor
    const activeFile = playgroundWorkspace.files.find((f) => f.name === currentPlaygroundFile);
    if (activeFile) {
        originalCode = activeFile.content;
        if (monacoEditor) {
            monacoEditor.setValue(activeFile.content);
            updateModifiedBadge(false);
            updateMonacoExtraLibs();
        } else {
            // Wait for Monaco to load
            monacoReady.then(() => {
                initializeMonacoWithCode(activeFile.content).then(() => {
                    updateMonacoExtraLibs();
                });
            });
        }
    }

    // Update badge
    updatePlaygroundBadge();
}

function updatePlaygroundBadge(): void {
    const badge = document.getElementById('modifiedBadge');
    if (badge && isPlaygroundMode) {
        badge.textContent = 'PLAYGROUND';
        badge.classList.remove('hidden');
        badge.style.backgroundColor = '#4a9eff';
    }
}

function updateExecutionModeToggle(): void {
    const toggle = document.getElementById('executionModeToggle');
    if (!toggle || !playgroundWorkspace) return;

    toggle.textContent = playgroundWorkspace.executionMode === 'client' ? '🌐 Client-side' : '🖥️ Server-side';
    toggle.title = `Execution mode: ${playgroundWorkspace.executionMode === 'client' ? 'Browser/DOM APIs' : 'Node.js APIs'}`;
}

function toggleExecutionMode(): void {
    if (!playgroundWorkspace) return;

    playgroundWorkspace.executionMode = playgroundWorkspace.executionMode === 'client' ? 'server' : 'client';
    updateExecutionModeToggle();
    savePlaygroundToLocalStorage(playgroundWorkspace);
}

// Helper to check if demo is a DOM demo
function isDOMDemo(id: string): boolean {
    return id.startsWith('11');
}

// Execute multi-file playground code client-side
function executePlaygroundClientSide(
    files: PlaygroundFile[],
    entryPoint: string,
): { success: boolean; output: string; error?: string } {
    const output = document.getElementById('output');
    if (!output) {
        return { success: false, output: '', error: 'Output element not found' };
    }

    // Clear output and prepare for DOM rendering
    output.innerHTML = '';

    // Capture console logs
    const logs: string[] = [];
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args: any[]) => {
        logs.push(args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join(' '));
        originalLog.apply(console, args);
    };
    console.error = (...args: any[]) => {
        logs.push('ERROR: ' + args.join(' '));
        originalError.apply(console, args);
    };
    console.warn = (...args: any[]) => {
        logs.push('WARN: ' + args.join(' '));
        originalWarn.apply(console, args);
    };

    try {
        // Create a simple module system
        const modules: { [key: string]: any } = {};
        const moduleCache: { [key: string]: any } = {};

        // Process imports/exports for each file
        files.forEach((file) => {
            let processedCode = file.content;

            // Remove single-line comments to avoid breaking regex
            processedCode = processedCode.replace(/\/\/.*$/gm, '');

            // Convert export statements to module.exports
            processedCode = processedCode.replace(/export\s+const\s+(\w+)\s*=\s*([^;]+);?/g, (_, name, value) => {
                return `const ${name} = ${value}; __exports.${name} = ${name};`;
            });
            processedCode = processedCode.replace(/export\s+function\s+(\w+)/g, (match, name) => {
                return `function ${name}`;
            });
            processedCode = processedCode.replace(/export\s+class\s+(\w+)/g, (match, name) => {
                return `class ${name}`;
            });

            // Store for later export registration
            processedCode = processedCode.replace(/export\s*{([^}]+)}/g, (_, names) => {
                const exportNames = names.split(',').map((n: string) => n.trim());
                return exportNames.map((name: string) => `__exports.${name} = ${name};`).join(' ');
            });

            modules[file.name] = processedCode;
        });

        // Function to execute a module
        const executeModule = (moduleName: string): any => {
            if (moduleCache[moduleName]) {
                return moduleCache[moduleName];
            }

            const code = modules[moduleName];
            if (!code) {
                throw new Error(`Module not found: ${moduleName}`);
            }

            const __exports: any = {};

            // Create a require function for this module
            const require = (importPath: string) => {
                // Handle relative imports
                let targetModule = importPath;
                if (importPath.startsWith('./') || importPath.startsWith('../')) {
                    targetModule = importPath.replace(/^\.\//, '').replace(/^\.\.\//, '');
                }
                // Add .ts extension if not present
                if (!targetModule.endsWith('.ts')) {
                    targetModule += '.ts';
                }
                return executeModule(targetModule);
            };

            // Process import statements
            let processedCode = code;
            const importRegex = /import\s*{([^}]+)}\s*from\s*['"]([^'"]+)['"]/g;
            let match;
            const imports: { names: string[]; from: string }[] = [];

            while ((match = importRegex.exec(processedCode)) !== null) {
                const names = match[1].split(',').map((n) => n.trim());
                const from = match[2];
                imports.push({ names, from });
            }

            // Remove import statements
            processedCode = processedCode.replace(importRegex, '');

            // Execute imports first
            imports.forEach((imp) => {
                let targetModule = imp.from;
                if (targetModule.startsWith('./') || targetModule.startsWith('../')) {
                    targetModule = targetModule.replace(/^\.\//, '').replace(/^\.\.\//, '');
                }
                if (!targetModule.endsWith('.ts')) {
                    targetModule += '.ts';
                }

                const importedModule = executeModule(targetModule);
                imp.names.forEach((name) => {
                    // Make imported values available in scope
                    processedCode = `const ${name} = __imported_${targetModule.replace(/\./g, '_')}.${name};\n${processedCode}`;
                });
            });

            // Create function scope with imported modules available
            const importedModules: any = {};
            imports.forEach((imp) => {
                let targetModule = imp.from;
                if (targetModule.startsWith('./') || targetModule.startsWith('../')) {
                    targetModule = targetModule.replace(/^\.\//, '').replace(/^\.\.\//, '');
                }
                if (!targetModule.endsWith('.ts')) {
                    targetModule += '.ts';
                }
                importedModules[`__imported_${targetModule.replace(/\./g, '_')}`] = executeModule(targetModule);
            });

            // Execute the module code
            const func = new Function(
                '__exports',
                ...Object.keys(importedModules),
                processedCode + '\nreturn __exports;',
            );
            const result = func(__exports, ...Object.values(importedModules));

            moduleCache[moduleName] = result;
            return result;
        };

        // Execute entry point
        executeModule(entryPoint);

        // Restore console
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;

        return {
            success: true,
            output: logs.length > 0 ? logs.join('\n') : 'Code executed successfully',
        };
    } catch (error) {
        // Restore console
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;

        return {
            success: false,
            output: logs.join('\n'),
            error: error instanceof Error ? error.message : String(error),
        };
    }
}

// Execute code client-side for DOM demos
function executeClientSide(code: string): { success: boolean; output: string; error?: string } {
    const output = document.getElementById('output');
    if (!output) {
        return { success: false, output: '', error: 'Output element not found' };
    }

    // Clear output and prepare for DOM rendering
    output.innerHTML = '';

    // Capture console logs
    const logs: string[] = [];
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args: any[]) => {
        logs.push(args.map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg))).join(' '));
        originalLog.apply(console, args);
    };
    console.error = (...args: any[]) => {
        logs.push('ERROR: ' + args.join(' '));
        originalError.apply(console, args);
    };
    console.warn = (...args: any[]) => {
        logs.push('WARN: ' + args.join(' '));
        originalWarn.apply(console, args);
    };

    try {
        // Execute the JavaScript code directly (no TypeScript stripping needed - using .js files)
        const func = new Function(code);
        func();

        // Restore console
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;

        return {
            success: true,
            output: logs.length > 0 ? logs.join('\n') : 'Demo rendered successfully',
        };
    } catch (error) {
        // Restore console
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;

        return {
            success: false,
            output: logs.join('\n'),
            error: error instanceof Error ? error.message : String(error),
        };
    }
}

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

        // Configure TypeScript compiler options for Monaco
        if (typeof monaco !== 'undefined') {
            monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                target: monaco.languages.typescript.ScriptTarget.ES2020,
                module: monaco.languages.typescript.ModuleKind.ES2015,
                moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
                allowNonTsExtensions: true,
                allowSyntheticDefaultImports: true,
                esModuleInterop: true,
            });
        }

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

    // Create model with proper URI for playground files
    let model;
    if (isPlaygroundMode && currentPlaygroundFile) {
        const uri = monaco.Uri.parse(`file:///workspace/${currentPlaygroundFile}`);
        model = monaco.editor.createModel(code, 'typescript', uri);
    }

    monacoEditor = monaco.editor.create(monacoContainer, {
        model: model,
        value: model ? undefined : code,
        language: model ? undefined : 'typescript',
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
        // In playground mode, always show PLAYGROUND badge
        if (isPlaygroundMode) {
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

// Run modified code
async function runModifiedCode(): Promise<void> {
    if (!monacoEditor) return;

    // Save current playground file content if in playground mode
    if (isPlaygroundMode && playgroundWorkspace) {
        const currentFile = playgroundWorkspace.files.find((f) => f.name === currentPlaygroundFile);
        if (currentFile) {
            currentFile.content = monacoEditor.getValue();
            savePlaygroundToLocalStorage(playgroundWorkspace);
        }
    }

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

            if (executionTime) {
                executionTime.textContent = `${duration}ms`;
            }

            if (result.success) {
                if (status) {
                    status.textContent = '✓ Success';
                    status.className = 'status success';
                }
                if (result.output && result.output !== 'Code executed successfully') {
                    const consoleDiv = document.createElement('div');
                    consoleDiv.className = 'console-output';

                    const logs = result.output.split('\n');
                    const logEntries = logs
                        .map((log) => {
                            let className = 'console-log-entry';
                            let content = log;

                            if (log.startsWith('ERROR:')) {
                                className += ' error';
                                content = log.substring(6).trim();
                            } else if (log.startsWith('WARN:')) {
                                className += ' warn';
                                content = log.substring(5).trim();
                            }

                            return `<div class="${className}">${escapeHtml(content)}</div>`;
                        })
                        .join('');

                    consoleDiv.innerHTML = `
                        <div class="console-header">
                            <span class="console-header-icon">▶</span>
                            <span>Console</span>
                        </div>
                        <div class="console-logs">${logEntries}</div>
                    `;

                    if (output) output.appendChild(consoleDiv);
                }
            } else {
                if (status) {
                    status.textContent = '✗ Error';
                    status.className = 'status error';
                }
                if (output) {
                    output.innerHTML = `<div class="error-output"><strong>Error:</strong>\n${escapeHtml(result.error || 'Unknown error')}</div>`;
                }
            }
            return;
        } else {
            // Server-side execution for playground
            try {
                const response = await fetch('/api/run-playground', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        files: playgroundWorkspace.files.map((f) => ({
                            filename: f.name,
                            content: f.name === currentPlaygroundFile ? code : f.content,
                        })),
                        entryPoint: currentPlaygroundFile,
                    }),
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
                return;
            } catch (error) {
                if (status) {
                    status.textContent = '✗ Error';
                    status.className = 'status error';
                }
                if (output) {
                    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                    output.innerHTML = `<div class="error-output">Network error: ${errorMessage}</div>`;
                }
                return;
            }
        }
    }

    // Check if this is a DOM demo - execute client-side
    if (currentDemo && isDOMDemo(currentDemo)) {
        const result = executeClientSide(code);
        const duration = Date.now() - startTime;

        if (executionTime) {
            executionTime.textContent = `${duration}ms`;
        }

        if (result.success) {
            if (status) {
                status.textContent = '✓ Success';
                status.className = 'status success';
            }
            // Output is already in DOM
            if (result.output && result.output !== 'Demo rendered successfully') {
                const consoleDiv = document.createElement('div');
                consoleDiv.className = 'console-output';

                const logs = result.output.split('\n');
                const logEntries = logs
                    .map((log) => {
                        let className = 'console-log-entry';
                        let content = log;

                        if (log.startsWith('ERROR:')) {
                            className += ' error';
                            content = log.substring(6).trim();
                        } else if (log.startsWith('WARN:')) {
                            className += ' warn';
                            content = log.substring(5).trim();
                        }

                        return `<div class="${className}">${escapeHtml(content)}</div>`;
                    })
                    .join('');

                consoleDiv.innerHTML = `
                    <div class="console-header">
                        <span class="console-header-icon">▶</span>
                        <span>Console</span>
                    </div>
                    <div class="console-logs">${logEntries}</div>
                `;

                if (output) output.appendChild(consoleDiv);
            }
        } else {
            if (status) {
                status.textContent = '✗ Error';
                status.className = 'status error';
            }
            if (output) {
                output.innerHTML = `<div class="error-output"><strong>Error:</strong>\n${escapeHtml(result.error || 'Unknown error')}</div>`;
            }
        }
        return;
    }

    // Regular server-side execution for non-DOM demos
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
    // In playground mode, don't reset - show a message instead
    if (isPlaygroundMode) {
        if (!confirm('Reset this playground file to its last saved state? Unsaved changes will be lost.')) {
            return;
        }
        // Reload from localStorage
        if (playgroundWorkspace) {
            const file = playgroundWorkspace.files.find((f) => f.name === currentPlaygroundFile);
            if (file && monacoEditor) {
                monacoEditor.setValue(file.content);
                originalCode = file.content;
                updateModifiedBadge(false);
            }
        }
        return;
    }

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
    // Save playground state if we're leaving playground mode
    if (isPlaygroundMode && playgroundWorkspace && monacoEditor) {
        const currentFile = playgroundWorkspace.files.find((f) => f.name === currentPlaygroundFile);
        if (currentFile) {
            currentFile.content = monacoEditor.getValue();
            savePlaygroundToLocalStorage(playgroundWorkspace);
        }
    }

    // Exit playground mode
    isPlaygroundMode = false;

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

    // Check if this is a DOM demo - execute client-side
    if (isDOMDemo(id)) {
        try {
            const codeResponse = await fetch(`/api/code/${id}`);
            const codeData: CodeResponse = await codeResponse.json();

            const result = executeClientSide(codeData.code);
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
                // Output is already in DOM, just show console logs if any
                if (result.output && result.output !== 'Demo rendered successfully') {
                    const consoleDiv = document.createElement('div');
                    consoleDiv.className = 'console-output';

                    const logs = result.output.split('\n');
                    const logEntries = logs
                        .map((log) => {
                            let className = 'console-log-entry';
                            let content = log;

                            if (log.startsWith('ERROR:')) {
                                className += ' error';
                                content = log.substring(6).trim();
                            } else if (log.startsWith('WARN:')) {
                                className += ' warn';
                                content = log.substring(5).trim();
                            }

                            return `<div class="${className}">${escapeHtml(content)}</div>`;
                        })
                        .join('');

                    consoleDiv.innerHTML = `
                        <div class="console-header">
                            <span class="console-header-icon">▶</span>
                            <span>Console</span>
                        </div>
                        <div class="console-logs">${logEntries}</div>
                    `;

                    if (output) output.appendChild(consoleDiv);
                }
            } else {
                if (status) {
                    status.textContent = '✗ Error';
                    status.className = 'status error';
                }
                if (output) {
                    output.innerHTML = `<div class="error-output"><strong>Error:</strong>\n${escapeHtml(result.error || 'Unknown error')}</div>`;
                }
            }
            return;
        } catch (error) {
            if (status) {
                status.textContent = '✗ Error';
                status.className = 'status error';
            }
            if (output) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                output.innerHTML = `<div class="error-output">Execution error: ${errorMessage}</div>`;
            }
            return;
        }
    }

    // Regular server-side execution for non-DOM demos
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
