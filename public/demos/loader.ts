// Demo loading and execution
import type { Demo, CodeResponse, RunResult } from '../types.js';
import { executeClientSide } from '../playground/execution.js';
import { escapeHtml } from '../utils.js';

export let demos: Demo[] = [];
export let currentDemo: string | null = null;
export let lastExecutionTime: number = 0;

export function setCurrentDemo(id: string | null): void {
    currentDemo = id;
}

export function isDOMDemo(id: string): boolean {
    return id.startsWith('11');
}

export async function loadDemos(): Promise<void> {
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

export async function loadDemoCode(id: string): Promise<CodeResponse | null> {
    try {
        const response = await fetch(`/api/code/${id}`);
        const data: CodeResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to load code:', error);
        return null;
    }
}

export async function runDemoCode(id: string): Promise<RunResult> {
    try {
        const response = await fetch(`/api/run/${id}`);
        const result: RunResult = await response.json();
        lastExecutionTime = 0; // Will be set by caller
        return result;
    } catch (error) {
        return {
            success: false,
            output: '',
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

export async function runModifiedDemoCode(code: string, demoId: string | null): Promise<RunResult> {
    try {
        const response = await fetch('/api/run-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, demoId }),
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

export function renderDemoOutput(
    result: { success: boolean; output: string; error?: string },
    isDom: boolean = false,
): void {
    const output = document.getElementById('output');
    const status = document.getElementById('status');

    if (!output || !status) return;

    if (result.success) {
        status.textContent = '✓ Success';
        status.className = 'status success';

        if (
            isDom &&
            result.output &&
            result.output !== 'Demo rendered successfully' &&
            result.output !== 'Code executed successfully'
        ) {
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

            output.appendChild(consoleDiv);
        } else if (!isDom) {
            let outputHtml = `<pre>${escapeHtml(result.output)}</pre>`;
            if (result.error) {
                outputHtml += `<div class="error-output"><strong>Warnings:</strong>\n${escapeHtml(result.error)}</div>`;
            }
            output.innerHTML = outputHtml;
        }
    } else {
        status.textContent = '✗ Error';
        status.className = 'status error';

        let errorHtml = '';
        if (result.output) {
            errorHtml += `<pre>${escapeHtml(result.output)}</pre>`;
        }
        if (result.error) {
            errorHtml += `<div class="error-output"><strong>Error:</strong>\n${escapeHtml(result.error)}</div>`;
        }
        output.innerHTML = errorHtml;
    }
}
