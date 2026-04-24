// Playground UI logic - file tree, creation, deletion
import type { PlaygroundFile } from '../types.js';

// Monaco is loaded via CDN
declare const monaco: any;
import {
    playgroundWorkspace,
    currentPlaygroundFile,
    setCurrentPlaygroundFile,
    savePlaygroundToLocalStorage,
    addPlaygroundFile,
    removePlaygroundFile,
    getPlaygroundFile,
    toggleExecutionMode as toggleMode,
    resetPlaygroundToDefault,
} from './state.js';
import { updateMonacoExtraLibs, getOrCreateModel } from './monaco-models.js';
import { getMonacoEditor } from '../editor/monaco-setup.js';
import { updateModifiedBadge } from '../ui/handlers.js';

export function renderPlaygroundFileTree(): void {
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

export function switchPlaygroundFile(filename: string): void {
    const monacoEditor = getMonacoEditor();
    if (!playgroundWorkspace || !monacoEditor || typeof monaco === 'undefined') return;

    // Save current file content before switching
    const currentFile = getPlaygroundFile(currentPlaygroundFile);
    if (currentFile) {
        currentFile.content = monacoEditor.getValue();
    }

    // Switch to new file
    setCurrentPlaygroundFile(filename);
    playgroundWorkspace.activeFile = filename;

    const newFile = getPlaygroundFile(filename);
    if (newFile) {
        // Create or get model for the new file with proper URI
        const model = getOrCreateModel(filename, newFile.content);
        if (model) {
            monacoEditor.setModel(model);
        }
        updateModifiedBadge(false, true);
    }

    renderPlaygroundFileTree();
    savePlaygroundToLocalStorage(playgroundWorkspace);
    updateMonacoExtraLibs();
}

export function createPlaygroundFile(): void {
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

    addPlaygroundFile(newFile);
    renderPlaygroundFileTree();
    savePlaygroundToLocalStorage(playgroundWorkspace);

    // Switch to new file
    switchPlaygroundFile(filename);
    updateMonacoExtraLibs();
}

export function deletePlaygroundFile(filename: string): void {
    const monacoEditor = getMonacoEditor();
    if (!playgroundWorkspace) return;

    if (playgroundWorkspace.files.length <= 1) {
        alert('Cannot delete the last file');
        return;
    }

    if (!confirm(`Delete ${filename}?`)) {
        return;
    }

    removePlaygroundFile(filename);

    // If deleted file was active, switch to first file
    if (currentPlaygroundFile === filename) {
        setCurrentPlaygroundFile(playgroundWorkspace.files[0].name);
        playgroundWorkspace.activeFile = playgroundWorkspace.files[0].name;

        if (monacoEditor) {
            const model = getOrCreateModel(playgroundWorkspace.files[0].name, playgroundWorkspace.files[0].content);
            if (model) {
                monacoEditor.setModel(model);
            }
            updateModifiedBadge(false, true);
        }
    }

    renderPlaygroundFileTree();
    savePlaygroundToLocalStorage(playgroundWorkspace);
    updateMonacoExtraLibs();
}

export function updateExecutionModeToggle(): void {
    const toggle = document.getElementById('executionModeToggle');
    if (!toggle || !playgroundWorkspace) return;

    toggle.textContent = playgroundWorkspace.executionMode === 'client' ? '🌐 Client-side' : '🖥️ Server-side';
    toggle.title = `Execution mode: ${playgroundWorkspace.executionMode === 'client' ? 'Browser/DOM APIs' : 'Node.js APIs'}`;
}

export function toggleExecutionMode(): void {
    if (!playgroundWorkspace) return;

    toggleMode();
    updateExecutionModeToggle();
    savePlaygroundToLocalStorage(playgroundWorkspace);
}

export function resetPlayground(): void {
    if (!confirm('Reset playground to default? This will delete all your files and cannot be undone.')) {
        return;
    }

    resetPlaygroundToDefault();

    // Reload playground UI
    (window as any).loadPlayground();
}
