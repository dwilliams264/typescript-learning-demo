/**
 * 🎨 Todo App Demo
 *
 * What you'll learn:
 * - Building a complete CRUD application
 * - State management in TypeScript
 * - Type-safe data structures
 * - Event-driven programming
 */
// Check if running in browser
if (typeof document === 'undefined') {
    console.log('=== 🎨 Todo App Demo ===');
    console.log('');
    console.log('⚠️  This is an interactive DOM demo that needs to run in the browser.');
    console.log('');
    console.log('To view this demo:');
    console.log('1. Open http://localhost:3000 in your browser');
    console.log('2. Click "Edit" button in the top-right');
    console.log('3. Click "Run Modified" to execute in the browser');
    console.log('');
    console.log('This demo creates a fully functional todo app with:');
    console.log('- Add new todos');
    console.log('- Mark as complete/incomplete');
    console.log('- Delete todos');
    console.log('- Live statistics');
    process.exit(0);
}
interface Todo {
    id: number;
    text: string;
    completed: boolean;
    createdAt: Date;
}

class TodoApp {
    private todos: Todo[] = [];
    private nextId: number = 1;
    private container: HTMLElement;

    constructor(container: HTMLElement) {
        this.container = container;
        this.render();
    }

    addTodo(text: string): void {
        if (text.trim().length === 0) return;

        const todo: Todo = {
            id: this.nextId++,
            text: text.trim(),
            completed: false,
            createdAt: new Date(),
        };

        this.todos.push(todo);
        this.render();
        console.log('Added todo:', todo);
    }

    toggleTodo(id: number): void {
        const todo = this.todos.find((t) => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.render();
            console.log(`Toggled todo ${id}:`, todo);
        }
    }

    deleteTodo(id: number): void {
        const index = this.todos.findIndex((t) => t.id === id);
        if (index !== -1) {
            const deleted = this.todos.splice(index, 1)[0];
            this.render();
            console.log('Deleted todo:', deleted);
        }
    }

    getStats(): { total: number; completed: number; remaining: number } {
        return {
            total: this.todos.length,
            completed: this.todos.filter((t) => t.completed).length,
            remaining: this.todos.filter((t) => !t.completed).length,
        };
    }

    render(): void {
        this.container.innerHTML = '';

        // Header
        const header = document.createElement('h2');
        header.textContent = '🎨 Todo App Demo';
        header.style.cssText = 'color: #2563eb; margin-bottom: 20px;';
        this.container.appendChild(header);

        // Input section
        const inputSection = document.createElement('div');
        inputSection.style.cssText = 'margin-bottom: 20px; display: flex; gap: 10px;';

        const input = document.createElement('input') as HTMLInputElement;
        input.type = 'text';
        input.placeholder = 'What needs to be done?';
        input.style.cssText = `
            flex: 1;
            padding: 12px;
            border: 2px solid #e5e7eb;
            border-radius: 6px;
            font-size: 14px;
        `;

        const addButton = document.createElement('button');
        addButton.textContent = 'Add';
        addButton.style.cssText = `
            background: #3b82f6;
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
        `;

        const handleAdd = () => {
            if (input.value.trim()) {
                this.addTodo(input.value);
                input.value = '';
            }
        };

        addButton.addEventListener('click', handleAdd);
        input.addEventListener('keypress', (e: KeyboardEvent) => {
            if (e.key === 'Enter') handleAdd();
        });

        inputSection.appendChild(input);
        inputSection.appendChild(addButton);
        this.container.appendChild(inputSection);

        // Stats
        const stats = this.getStats();
        const statsDiv = document.createElement('div');
        statsDiv.style.cssText =
            'margin-bottom: 15px; padding: 10px; background: #f3f4f6; border-radius: 6px; font-size: 14px;';
        statsDiv.textContent = `Total: ${stats.total} | Completed: ${stats.completed} | Remaining: ${stats.remaining}`;
        this.container.appendChild(statsDiv);

        // Todo list
        if (this.todos.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.textContent = 'No todos yet. Add one above!';
            emptyMessage.style.cssText = 'text-align: center; color: #9ca3af; padding: 40px; font-size: 16px;';
            this.container.appendChild(emptyMessage);
        } else {
            const list = document.createElement('div');
            list.style.cssText = 'display: flex; flex-direction: column; gap: 10px;';

            this.todos.forEach((todo) => {
                const todoItem = document.createElement('div');
                todoItem.style.cssText = `
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 12px;
                    background: white;
                    border: 2px solid #e5e7eb;
                    border-radius: 6px;
                    ${todo.completed ? 'opacity: 0.6;' : ''}
                `;

                // Checkbox
                const checkbox = document.createElement('input') as HTMLInputElement;
                checkbox.type = 'checkbox';
                checkbox.checked = todo.completed;
                checkbox.style.cssText = 'width: 20px; height: 20px; cursor: pointer;';
                checkbox.addEventListener('change', () => this.toggleTodo(todo.id));

                // Text
                const text = document.createElement('span');
                text.textContent = todo.text;
                text.style.cssText = `
                    flex: 1;
                    font-size: 16px;
                    ${todo.completed ? 'text-decoration: line-through; color: #9ca3af;' : ''}
                `;

                // Delete button
                const deleteButton = document.createElement('button');
                deleteButton.textContent = '×';
                deleteButton.style.cssText = `
                    background: #ef4444;
                    color: white;
                    width: 30px;
                    height: 30px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 20px;
                    line-height: 1;
                `;
                deleteButton.addEventListener('click', () => this.deleteTodo(todo.id));

                todoItem.appendChild(checkbox);
                todoItem.appendChild(text);
                todoItem.appendChild(deleteButton);
                list.appendChild(todoItem);
            });

            this.container.appendChild(list);
        }
    }
}

// Initialize app
const outputElement = document.getElementById('output') as HTMLDivElement;

if (!outputElement) {
    console.error('Output element not found!');
} else {
    outputElement.innerHTML = '';

    const container = document.createElement('div');
    container.style.cssText = 'padding: 20px; font-family: Arial, sans-serif; max-width: 600px;';

    outputElement.appendChild(container);

    const app = new TodoApp(container);

    // Add some example todos
    app.addTodo('Learn TypeScript basics');
    app.addTodo('Build a todo app');
    app.addTodo('Master type safety');

    console.log('=== Todo App Demo ===');
    console.log('✓ CRUD operations implemented');
    console.log('✓ Type-safe data structures');
    console.log('✓ State management');
    console.log('Try adding, completing, and deleting todos!');
}
