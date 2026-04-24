// Shared utility functions

export function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

export function showCopiedState(button: HTMLElement): void {
    button.classList.add('copied');
    const originalHtml = button.innerHTML;
    button.innerHTML = '<span>✓</span>';

    setTimeout(() => {
        button.classList.remove('copied');
        button.innerHTML = originalHtml;
    }, 2000);
}
