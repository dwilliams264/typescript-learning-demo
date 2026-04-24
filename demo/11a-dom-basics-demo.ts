/**
 * 🎨 DOM Basics Demo
 *
 * What you'll learn:
 * - Selecting DOM elements with type safety
 * - Manipulating element properties and styles
 * - Adding event listeners
 * - Creating and appending elements
 */

// Type-safe element selection
const outputElement = document.getElementById('output') as HTMLDivElement;

if (!outputElement) {
    console.error('Output element not found!');
} else {
    // Clear existing content
    outputElement.innerHTML = '';

    const container = document.createElement('div');
    container.style.cssText = 'padding: 20px; font-family: Arial, sans-serif;';

    // Header
    const header = document.createElement('h2');
    header.textContent = '🎨 DOM Basics Demo';
    header.style.cssText = 'color: #2563eb; margin-bottom: 20px;';
    container.appendChild(header);

    // Button creation
    const button = document.createElement('button');
    button.textContent = 'Click Me!';
    button.style.cssText = `
        background: #3b82f6;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 16px;
        margin: 10px 0;
    `;

    let clickCount = 0;
    const counter = document.createElement('div');
    counter.style.cssText = 'margin: 15px 0; font-size: 18px; color: #1f2937;';
    counter.textContent = `Clicks: ${clickCount}`;

    // Event listener with type safety
    button.addEventListener('click', (event: MouseEvent) => {
        clickCount++;
        counter.textContent = `Clicks: ${clickCount}`;
        console.log(`Button clicked! Event type: ${event.type}`);
    });

    container.appendChild(button);
    container.appendChild(counter);

    // Create a list
    const list = document.createElement('ul');
    list.style.cssText = 'list-style: none; padding: 0; margin: 20px 0;';

    const items = ['TypeScript', 'JavaScript', 'HTML', 'CSS'];
    items.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = `✓ ${item}`;
        li.style.cssText = 'padding: 8px; margin: 5px 0; background: #f3f4f6; border-radius: 4px;';
        list.appendChild(li);
    });

    container.appendChild(list);

    // Input example
    const inputSection = document.createElement('div');
    inputSection.style.cssText = 'margin: 20px 0;';

    const input = document.createElement('input') as HTMLInputElement;
    input.type = 'text';
    input.placeholder = 'Type something...';
    input.style.cssText = `
        padding: 10px;
        border: 2px solid #e5e7eb;
        border-radius: 6px;
        font-size: 14px;
        width: 250px;
    `;

    const inputDisplay = document.createElement('div');
    inputDisplay.style.cssText = 'margin-top: 10px; color: #6b7280;';
    inputDisplay.textContent = 'You typed: (nothing yet)';

    input.addEventListener('input', (event: Event) => {
        const target = event.target as HTMLInputElement;
        inputDisplay.textContent = `You typed: ${target.value || '(nothing yet)'}`;
    });

    inputSection.appendChild(input);
    inputSection.appendChild(inputDisplay);
    container.appendChild(inputSection);

    // Hover effect demo
    const hoverBox = document.createElement('div');
    hoverBox.textContent = 'Hover over me!';
    hoverBox.style.cssText = `
        padding: 20px;
        background: #fbbf24;
        border-radius: 8px;
        text-align: center;
        cursor: pointer;
        transition: all 0.3s ease;
        margin: 20px 0;
    `;

    hoverBox.addEventListener('mouseenter', () => {
        hoverBox.style.background = '#f59e0b';
        hoverBox.style.transform = 'scale(1.05)';
    });

    hoverBox.addEventListener('mouseleave', () => {
        hoverBox.style.background = '#fbbf24';
        hoverBox.style.transform = 'scale(1)';
    });

    container.appendChild(hoverBox);

    // Append to output
    outputElement.appendChild(container);
}
