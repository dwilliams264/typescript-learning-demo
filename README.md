# TypeScript Learning Demo

An interactive TypeScript learning environment with a live web viewer. Run TypeScript demos in real-time and see console output instantly in your browser.

## ✨ Features

- **✏️ Interactive Code Editor**: Edit demos in-browser with Monaco Editor (VS Code engine) and run modified code instantly
- **🔴 Live Reload with WebSocket**: Real-time file watching with instant updates when you save changes
- **📁 Auto-Discovery**: Automatically detects and lists all demo files in the `demo/` folder
- **📝 Split-Pane View**: See source code and console output side-by-side with syntax highlighting
- **🔍 Search & Filter**: Quickly find demos with the built-in search bar (Ctrl/Cmd+K)
- **⌨️ Keyboard Navigation**: Use arrow keys (↑↓) to navigate, ? for shortcuts help
- **📋 Copy Buttons**: Easily copy source code or output to clipboard
- **⏱️ Execution Time**: See how long each demo takes to run
- **🎨 Modern UI**: Clean, responsive interface with VS Code-inspired dark theme
- **📱 Responsive Design**: Works on desktop, tablet, and mobile devices
- **♿ Accessible**: Full keyboard navigation with ARIA labels
- **🔧 Resizable Panels**: Drag the divider to adjust code/output panel sizes
- **🚀 Zero Configuration**: Just add a TypeScript file and start coding
- **📚 Comprehensive Examples**: 29 demo files covering TypeScript fundamentals to advanced concepts, including interactive DOM demos and hands-on exercises

## 📚 Included Demos

### Basic Syntax (01a-d)

1. **Basic Types** - Primitives, arrays, tuples
2. **Unions & Aliases** - Union types, type aliases, literal types
3. **Template Literals** - String interpolation, template literal types
4. **Control Flow** - Loops, conditionals, operators

### Functions (02a-c)

5. **Functions Basics** - Declarations, arrow functions, parameters
6. **Function Types** - Type annotations, overloads, union returns
7. **Higher-Order Functions** - HOFs, callbacks, composition

### Interfaces (03)

8. **Interfaces** - Object types, extending interfaces, optional properties

### Classes (04a-c)

9. **Classes Basics** - Constructors, methods, properties
10. **Class Modifiers** - Access modifiers, getters/setters, static members
11. **Inheritance** - Extends, abstract classes, interfaces

### Advanced TypeScript (05-10)

12. **Generics** - Generic functions, constraints, classes
13. **Type Guards** - Type narrowing, discriminated unions
14. **Enums** - Numeric, string, and const enums
15. **Advanced Types** - Intersection, mapped, conditional types
16. **Async** - Promises, async/await, error handling
17. **Utility Types** - Partial, Pick, Omit, Record, and more

### Interactive DOM Demos 🎨 (11a-d)

18. **DOM Basics** - Element selection, manipulation, events
19. **Form Validation** - Type-safe forms with validation
20. **Todo App** - Complete CRUD application
21. **Canvas Animation** - Visual programming with HTML5 Canvas

> **Note:** DOM demos (marked with 🎨) require browser execution. When run from the console, they display instructions for viewing them interactively. Use the "Edit" button in the web viewer and click "Run Modified" to execute them in the browser.

### Type System (12)

22. **Type Debugging** - Understanding inference, satisfies, predicates

### Practice Exercises (13a-d)

23. **Functions Exercise** + Solution
24. **Classes Exercise** + Solution
25. **Generics Exercise** + Solution
26. **Async Exercise** + Solution

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/typescript-learning-demo.git
cd typescript-learning-demo

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open **http://localhost:3000** in your browser and start exploring the demos.

## 🎯 Using the Viewer

### Navigation

- Click any demo in the sidebar to run it and view its code
- Use **↑** and **↓** arrow keys to navigate between demos
- Press **Ctrl/Cmd+K** to focus the search bar
- Press **?** to view all keyboard shortcuts

### Features

- **Split View**: Source code on the left, console output on the right
- **Search**: Filter demos by name or number using the search bar
- **Live Reload**: Edit any demo file and see changes instantly (WebSocket-powered)
- **Copy**: Click 📋 buttons to copy code or output to clipboard
- **Resize**: Drag the divider between panels to adjust sizes
- **Execution Time**: See performance metrics for each demo run

### Interactive Editing

1. **Edit Mode**: Click the "✏️ Edit" button to open Monaco Editor
2. **Modify Code**: Edit the TypeScript code with full IntelliSense support
3. **Run Modified**: Click "▶️ Run" to execute your changes
4. **Reset**: Click "🔄 Reset" to restore the original code
5. **Modified Badge**: See when code differs from the original

**Note**: Changes are session-only and don't affect the original demo files. Perfect for safe experimentation!

## 📝 Adding Your Own Demos

1. Create a new file in the `demo/` folder following this pattern: `##-name-demo.ts`
    - The `##` number determines the display order (e.g., `11-decorators-demo.ts`)
    - The `name` portion becomes the display name (e.g., "Decorators")

2. Write your TypeScript code with `console.log()` statements:

    ```typescript
    // 11-decorators-demo.ts
    console.log('=== Decorator Demo ===');

    function Logger(constructor: Function) {
        console.log('Logging...');
        console.log(constructor);
    }

    @Logger
    class Person {
        name = 'Max';
    }
    ```

3. Save the file and refresh your browser - the new demo appears automatically in the sidebar

## 🛠️ Available Scripts

- `npm run dev` - Build client and start the development server
- `npm run dev:watch` - Start with auto-rebuild for both client and server
- `npm run build` - Compile both server and client TypeScript to JavaScript
- `npm run build:client` - Compile only the browser TypeScript (public/script.ts)
- `npm run clean` - Remove all generated JavaScript files

## 🏗️ Project Structure

```
typescript-learning-demo/
├── demo/                    # All demo TypeScript files
│   ├── 01-syntax-demo.ts
│   ├── 02-functions-demo.ts
│   └── ...
├── public/                  # Web viewer frontend
│   ├── index.html          # Main HTML page
│   ├── script.ts           # Client-side TypeScript
│   ├── script.js           # Generated - gitignored
│   └── style.css           # Styles
├── server.ts               # Express server (TypeScript)
├── tsconfig.json           # TypeScript config for Node.js/server
├── tsconfig.browser.json   # TypeScript config for browser/client
└── package.json
```

## 📐 TypeScript Architecture

This project uses **two TypeScript configurations**:

1. **Server Code** (`tsconfig.json`):
    - Target: Node.js environment
    - Module system: NodeNext (ES modules for Node)
    - Run directly with `tsx` (no compilation needed for dev)

2. **Browser Code** (`tsconfig.browser.json`):
    - Target: Browser environment with DOM types
    - Module system: ES2022 modules
    - Compiled to `public/script.js` (gitignored)
    - Must rebuild when editing `public/script.ts`

**Why separate configs?** Node.js and browsers have different module systems, APIs, and runtime environments. The server needs Node APIs (fs, child_process), while the browser needs DOM APIs (document, fetch).

## 🤝 Contributing

Contributions are welcome! Whether it's fixing bugs, improving documentation, or adding new demo examples, all contributions are appreciated.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on the code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- Built with [Express](https://expressjs.com/) for the web server
- Powered by [TypeScript](https://www.typescriptlang.org/) for type-safe JavaScript
- Uses [tsx](https://github.com/privatenumber/tsx) for seamless TypeScript execution

---

**Happy Learning!** 🎉 If you find this project helpful, please consider giving it a ⭐ on GitHub.
