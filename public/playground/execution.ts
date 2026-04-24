// Playground code execution (client-side and server-side)
import type { PlaygroundFile, RunResult } from '../types.js';
import { escapeHtml } from '../utils.js';

export async function executePlaygroundServerSide(files: PlaygroundFile[], entryPoint: string): Promise<RunResult> {
    try {
        const response = await fetch('/api/run-playground', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                files: files.map((f) => ({
                    filename: f.name,
                    content: f.content,
                })),
                entryPoint: entryPoint,
            }),
        });

        const result: RunResult = await response.json();
        return result;
    } catch (error) {
        return {
            success: false,
            output: '',
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

export function executePlaygroundClientSide(
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

export function executeClientSide(code: string): { success: boolean; output: string; error?: string } {
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
        // Execute the JavaScript code directly
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
