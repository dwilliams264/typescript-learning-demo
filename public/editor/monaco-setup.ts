// Monaco Editor initialization and configuration
import { isPlaygroundMode, currentPlaygroundFile } from '../playground/state.js';

// Monaco and RequireJS are loaded via CDN
declare const monaco: any;
declare const require: any;
import { createInitialModel } from '../playground/monaco-models.js';

export let monacoEditor: any = null;
export let monacoReady: Promise<void>;
export let resolveMonacoReady: () => void;

// Initialize monacoReady promise
monacoReady = new Promise<void>((resolve) => {
    resolveMonacoReady = resolve;
});

export function initMonacoEditor(): void {
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

export async function initializeMonacoWithCode(
    code: string,
    onContentChange: (code: string, original: string) => void,
    onRunCommand: () => void,
    onResetCommand: () => void,
): Promise<void> {
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
    let model = createInitialModel(code, isPlaygroundMode ? currentPlaygroundFile : undefined);

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

    // Store original code for change detection
    let originalCode = code;

    // Track changes
    monacoEditor.onDidChangeModelContent(() => {
        const currentCode = monacoEditor.getValue();
        onContentChange(currentCode, originalCode);
    });

    // Keyboard shortcuts within Monaco
    monacoEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
        onRunCommand();
    });

    monacoEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        onRunCommand();
    });

    monacoEditor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR, () => {
        onResetCommand();
    });
}

export function getMonacoEditor(): any {
    return monacoEditor;
}

export function setMonacoEditor(editor: any): void {
    monacoEditor = editor;
}
