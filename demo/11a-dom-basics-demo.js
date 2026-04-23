/**
 * 🎨 DOM Basics Demo
 *
 * What you'll learn:
 * - Selecting DOM elements with type safety
 * - Manipulating element properties and styles
 * - Adding event listeners
 * - Creating and appending elements
 */

// Get output element
const outputElement = document.getElementById('output');

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
    header.style.cssText = 'color: #4CAF50; margin-bottom: 20px;';
    container.appendChild(header);

    // Button demo
    const buttonSection = document.createElement('div');
    buttonSection.style.cssText = 'margin-bottom: 20px;';

    const button = document.createElement('button');
    button.textContent = 'Click Me!';
    button.style.cssText =
        'padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;';

    const clickCount = document.createElement('span');
    clickCount.textContent = ' Clicks: 0';
    clickCount.style.cssText = 'margin-left: 10px; font-weight: bold;';

    let count = 0;
    button.addEventListener('click', () => {
        count++;
        clickCount.textContent = ` Clicks: ${count}`;
        button.style.background = count % 2 === 0 ? '#4CAF50' : '#2196F3';
    });

    buttonSection.appendChild(button);
    buttonSection.appendChild(clickCount);
    container.appendChild(buttonSection);

    // Input demo
    const inputSection = document.createElement('div');
    inputSection.style.cssText = 'margin-bottom: 20px;';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Type something...';
    input.style.cssText = 'padding: 8px; border: 1px solid #ccc; border-radius: 4px; width: 250px;';

    const output = document.createElement('div');
    output.style.cssText = 'margin-top: 10px; color: #555;';
    output.textContent = 'You typed: ';

    input.addEventListener('input', (e) => {
        output.textContent = `You typed: ${e.target.value}`;
    });

    inputSection.appendChild(input);
    inputSection.appendChild(output);
    container.appendChild(inputSection);

    // List demo
    const listSection = document.createElement('div');
    listSection.style.cssText = 'margin-bottom: 20px;';

    const listTitle = document.createElement('h3');
    listTitle.textContent = 'Dynamic List:';
    listTitle.style.cssText = 'margin-bottom: 10px;';
    listSection.appendChild(listTitle);

    const list = document.createElement('ul');
    list.style.cssText = 'list-style: none; padding: 0;';

    const items = ['Item 1', 'Item 2', 'Item 3'];
    items.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        li.style.cssText = 'padding: 8px; background: #f0f0f0; margin-bottom: 5px; border-radius: 4px;';

        li.addEventListener('mouseenter', () => {
            li.style.background = '#4CAF50';
            li.style.color = 'white';
        });

        li.addEventListener('mouseleave', () => {
            li.style.background = '#f0f0f0';
            li.style.color = 'black';
        });

        list.appendChild(li);
    });

    listSection.appendChild(list);
    container.appendChild(listSection);

    outputElement.appendChild(container);
}
