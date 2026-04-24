// Playground state management and localStorage persistence
import type { PlaygroundWorkspace, PlaygroundFile } from '../types.js';

const PLAYGROUND_STORAGE_KEY = 'typescript-playground-workspace';

// State
export let playgroundWorkspace: PlaygroundWorkspace | null = null;
export let currentPlaygroundFile: string = 'main.ts';
export let isPlaygroundMode: boolean = false;

export function setPlaygroundWorkspace(workspace: PlaygroundWorkspace | null): void {
    playgroundWorkspace = workspace;
}

export function setCurrentPlaygroundFile(filename: string): void {
    currentPlaygroundFile = filename;
}

export function setPlaygroundMode(mode: boolean): void {
    isPlaygroundMode = mode;
}

export function getDefaultPlaygroundWorkspace(): PlaygroundWorkspace {
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

export function savePlaygroundToLocalStorage(workspace: PlaygroundWorkspace): void {
    try {
        localStorage.setItem(PLAYGROUND_STORAGE_KEY, JSON.stringify(workspace));
    } catch (error) {
        console.error('Failed to save playground to localStorage:', error);
    }
}

export function loadPlaygroundFromLocalStorage(): PlaygroundWorkspace {
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

export function addPlaygroundFile(file: PlaygroundFile): void {
    if (!playgroundWorkspace) return;
    playgroundWorkspace.files.push(file);
}

export function removePlaygroundFile(filename: string): void {
    if (!playgroundWorkspace) return;
    playgroundWorkspace.files = playgroundWorkspace.files.filter((f) => f.name !== filename);
}

export function getPlaygroundFile(filename: string): PlaygroundFile | undefined {
    if (!playgroundWorkspace) return undefined;
    return playgroundWorkspace.files.find((f) => f.name === filename);
}

export function toggleExecutionMode(): void {
    if (!playgroundWorkspace) return;
    playgroundWorkspace.executionMode = playgroundWorkspace.executionMode === 'client' ? 'server' : 'client';
}

export function resetPlaygroundToDefault(): void {
    const defaultWorkspace = getDefaultPlaygroundWorkspace();
    setPlaygroundWorkspace(defaultWorkspace);
    setCurrentPlaygroundFile('main.ts');
    savePlaygroundToLocalStorage(defaultWorkspace);
}
