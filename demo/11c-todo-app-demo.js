/**
 * 🎨 Todo App Demo
 *
 * What you'll learn:
 * - Building a complete CRUD application
 * - State management
 * - Event-driven programming
 * - Dynamic UI updates
 */

class TodoApp {
    constructor(container) {
        this.todos = [];
        this.nextId = 1;
        this.container = container;
        this.render();
    }

    addTodo(text) {
        if (text.trim().length === 0) return;

        const todo = {
            id: this.nextId++,
            text: text.trim(),
            completed: false,
            createdAt: new Date(),
        };

        this.todos.push(todo);
        this.render();
    }

    toggleTodo(id) {
        const todo = this.todos.find((t) => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.render();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter((t) => t.id !== id);
        this.render();
    }

    getStats() {
        const total = this.todos.length;
        const completed = this.todos.filter((t) => t.completed).length;
        const active = total - completed;

        return { total, completed, active };
    }

    render() {
        // Clear container
        this.container.innerHTML = '';

        // Create header
        const header = document.createElement('div');
        header.style.cssText = 'margin-bottom: 20px;';

        const title = document.createElement('h2');
        title.textContent = '📝 Todo App';
        title.style.cssText = 'margin: 0 0 10px 0; color: #2196F3;';
        header.appendChild(title);

        // Stats
        const stats = this.getStats();
        const statsDiv = document.createElement('div');
        statsDiv.style.cssText = 'font-size: 14px; color: #666; margin-bottom: 15px;';
        statsDiv.innerHTML = `<strong>Total:</strong> ${stats.total} | <strong>Active:</strong> ${stats.active} | <strong>Completed:</strong> ${stats.completed}`;
        header.appendChild(statsDiv);

        // Input section
        const inputSection = document.createElement('div');
        inputSection.style.cssText = 'display: flex; gap: 10px; margin-bottom: 20px;';

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'What needs to be done?';
        input.style.cssText = 'flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;';

        const addButton = document.createElement('button');
        addButton.textContent = 'Add';
        addButton.style.cssText =
            'padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;';

        addButton.addEventListener('click', () => {
            this.addTodo(input.value);
            input.value = '';
            input.focus();
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo(input.value);
                input.value = '';
            }
        });

        inputSection.appendChild(input);
        inputSection.appendChild(addButton);
        header.appendChild(inputSection);

        this.container.appendChild(header);

        // Todo list
        if (this.todos.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.textContent = '🎉 No todos yet! Add one above.';
            emptyMessage.style.cssText = 'text-align: center; color: #999; padding: 20px; font-style: italic;';
            this.container.appendChild(emptyMessage);
            return;
        }

        const todoList = document.createElement('div');
        todoList.style.cssText = 'display: flex; flex-direction: column; gap: 10px;';

        this.todos.forEach((todo) => {
            const todoItem = document.createElement('div');
            todoItem.style.cssText = `
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 12px;
                background: ${todo.completed ? '#f5f5f5' : 'white'};
                border: 1px solid #ddd;
                border-radius: 4px;
                transition: background 0.2s;
            `;

            // Checkbox
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.completed;
            checkbox.style.cssText = 'width: 18px; height: 18px; cursor: pointer;';
            checkbox.addEventListener('change', () => {
                this.toggleTodo(todo.id);
            });

            // Text
            const text = document.createElement('span');
            text.textContent = todo.text;
            text.style.cssText = `
                flex: 1;
                ${todo.completed ? 'text-decoration: line-through; color: #999;' : ''}
            `;

            // Delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '🗑️';
            deleteButton.style.cssText =
                'padding: 5px 10px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;';
            deleteButton.addEventListener('click', () => {
                this.deleteTodo(todo.id);
            });

            todoItem.appendChild(checkbox);
            todoItem.appendChild(text);
            todoItem.appendChild(deleteButton);

            todoList.appendChild(todoItem);
        });

        this.container.appendChild(todoList);
    }
}

// Initialize app
const outputElement = document.getElementById('output');
if (!outputElement) {
    console.error('Output element not found!');
} else {
    outputElement.innerHTML = '';
    const container = document.createElement('div');
    container.style.cssText = 'padding: 20px; font-family: Arial, sans-serif; max-width: 600px;';
    outputElement.appendChild(container);

    const app = new TodoApp(container);

    // Add some sample todos
    app.addTodo('Learn TypeScript basics');
    app.addTodo('Build a todo app');
    app.addTodo('Master async programming');
}
