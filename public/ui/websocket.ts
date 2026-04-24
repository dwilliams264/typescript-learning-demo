// WebSocket connection for live reload
import { demos, currentDemo } from '../demos/loader.js';

// Socket.io is loaded via CDN
declare const io: any;

export let socket: any = null;
export let liveReloadEnabled: boolean = true;

export function setLiveReloadEnabled(enabled: boolean): void {
    liveReloadEnabled = enabled;
}

export function initializeWebSocket(): void {
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
                (window as any).runDemo(demo.id, demo.name);
            }
        }
    });
}

export function toggleLiveReload(): void {
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

function updateConnectionStatus(connected: boolean): void {
    const btn = document.getElementById('liveReloadBtn');
    if (!btn) return;

    if (connected) {
        btn.title = 'Live reload: Connected';
    } else {
        btn.title = 'Live reload: Disconnected';
    }
}

function startLiveReload(): void {
    if (socket && !socket.connected) {
        socket.connect();
    }
}

function stopLiveReload(): void {
    // Keep socket connected but just ignore file-changed events
}
