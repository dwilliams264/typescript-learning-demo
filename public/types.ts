// Shared type definitions for the TypeScript Practice application

export interface Demo {
    id: string;
    name: string;
}

export interface RunResult {
    success: boolean;
    output: string;
    error?: string;
}

export interface MtimeResponse {
    mtime: number;
}

export interface CodeResponse {
    id: string;
    name: string;
    file: string;
    code: string;
}

// Playground interfaces
export interface PlaygroundFile {
    name: string;
    content: string;
}

export interface PlaygroundWorkspace {
    files: PlaygroundFile[];
    activeFile: string;
    executionMode: 'client' | 'server';
}

// Monaco Editor types (loaded via CDN)
export declare const monaco: any;
export declare const require: any;
export declare const io: any;
export declare const Prism: {
    highlight: (text: string, grammar: any, language: string) => string;
    languages: {
        typescript: any;
    };
};
