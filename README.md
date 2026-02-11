# TypeScript Learning Demo

An interactive TypeScript learning environment with a live web viewer. Run TypeScript demos in real-time and see console output instantly in your browser.

## ✨ Features

- **🔴 Live Reload**: Automatically reruns demos when you save changes to your code
- **📁 Auto-Discovery**: Automatically detects and lists all demo files in the `demo/` folder
- **⌨️ Keyboard Navigation**: Use arrow keys (↑↓) to quickly navigate between demos
- **🎨 Modern UI**: Clean, responsive interface with syntax-highlighted output
- **🚀 Zero Configuration**: Just add a TypeScript file and start coding
- **📚 Comprehensive Examples**: 10 demo files covering TypeScript fundamentals to advanced concepts

## 📚 Included Demos

1. **Syntax** - Basic types, arrays, tuples, union types
2. **Functions** - Function types, optional parameters, rest parameters, overloads
3. **Interfaces** - Object types, extending interfaces, optional properties
4. **Classes** - Inheritance, access modifiers, abstract classes
5. **Generics** - Generic functions, constraints, multiple type parameters
6. **Type Guards** - Type narrowing, user-defined type guards, discriminated unions
7. **Enums** - Numeric, string, and const enums
8. **Advanced Types** - Intersection types, mapped types, conditional types
9. **Async** - Promises, async/await, error handling
10. **Utility Types** - Partial, Required, Pick, Omit, Record, and more

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

- `npm run dev` - Start the development server with live reload
- `npm run build` - Compile TypeScript files to JavaScript
- `npm run clean` - Remove the generated `dist/` folder

## 🏗️ Project Structure

```
typescript-learning-demo/
├── demo/                    # All demo TypeScript files
│   ├── 01-syntax-demo.ts
│   ├── 02-functions-demo.ts
│   └── ...
├── public/                  # Web viewer frontend
│   ├── index.html          # Main HTML page
│   ├── script.js           # Client-side logic
│   └── style.css           # Styles
├── server.ts               # Express server for running demos
├── package.json
├── tsconfig.json
└── eslint.config.js
```

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
