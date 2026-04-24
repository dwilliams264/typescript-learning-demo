// Monaco model management for multi-file playground
import { playgroundWorkspace, currentPlaygroundFile, isPlaygroundMode } from './state.js';

// Monaco is loaded via CDN
declare const monaco: any;

export function updateMonacoExtraLibs(): void {
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

export function createModelForFile(filename: string, content: string): any {
    if (typeof monaco === 'undefined') return null;

    const uri = monaco.Uri.parse(`file:///workspace/${filename}`);
    let model = monaco.editor.getModel(uri);

    if (!model) {
        model = monaco.editor.createModel(content, 'typescript', uri);
    } else {
        model.setValue(content);
    }

    return model;
}

export function getOrCreateModel(filename: string, content: string): any {
    if (typeof monaco === 'undefined') return null;

    const uri = monaco.Uri.parse(`file:///workspace/${filename}`);
    let model = monaco.editor.getModel(uri);

    if (!model) {
        model = monaco.editor.createModel(content, 'typescript', uri);
    }

    return model;
}

export function createInitialModel(code: string, filename?: string): any {
    if (typeof monaco === 'undefined') return null;

    // Create model with proper URI for playground files
    if (isPlaygroundMode && filename) {
        const uri = monaco.Uri.parse(`file:///workspace/${filename}`);
        return monaco.editor.createModel(code, 'typescript', uri);
    }

    return null; // Let Monaco create default model
}
