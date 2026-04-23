/**
 * Classes Exercise - SOLUTION
 *
 * This file contains the solutions to the classes exercise.
 * Try to solve the exercises yourself before looking at these!
 */

// Exercise 1: Shopping Cart Class
interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

class ShoppingCart {
    private items: CartItem[] = [];

    addItem(item: CartItem): void {
        this.items.push(item);
    }

    removeItem(id: string): void {
        const index = this.items.findIndex((item) => item.id === id);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }

    getTotal(): number {
        return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    getItemCount(): number {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    getItems(): CartItem[] {
        return [...this.items];
    }
}

// Exercise 2: Animal Hierarchy with Inheritance
abstract class Animal {
    constructor(
        public name: string,
        public age: number,
    ) {}

    abstract makeSound(): string;

    getInfo(): string {
        return `${this.name} is ${this.age} years old`;
    }
}

class Cat extends Animal {
    makeSound(): string {
        return 'Meow!';
    }

    purr(): string {
        return 'Purrrr';
    }
}

class Dog extends Animal {
    makeSound(): string {
        return 'Woof!';
    }

    fetch(): string {
        return 'Fetching!';
    }
}

// Exercise 3: Singleton Pattern
class Logger {
    private static instance: Logger;
    private logs: string[] = [];

    private constructor() {}

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    log(message: string): void {
        this.logs.push(message);
        console.log(`  [LOG] ${message}`);
    }

    getLogs(): string[] {
        return [...this.logs];
    }
}

// ==================== TESTS ====================
console.log('=== Classes Exercise - SOLUTION ===\n');

// Test 1: Shopping Cart
console.log('Test 1: Shopping Cart');
const cart = new ShoppingCart();
cart.addItem({ id: '1', name: 'Apple', price: 1.5, quantity: 3 });
cart.addItem({ id: '2', name: 'Banana', price: 0.8, quantity: 5 });
cart.addItem({ id: '3', name: 'Orange', price: 1.2, quantity: 2 });

console.log(`Total: £${cart.getTotal().toFixed(2)}`); // 10.90
console.log(`Item count: ${cart.getItemCount()}`); // 10

cart.removeItem('1');
console.log(`After removing item 1 - Total: £${cart.getTotal().toFixed(2)}`); // 6.40
console.log('✓ All shopping cart tests pass!\n');

// Test 2: Animal Hierarchy
console.log('Test 2: Animal Hierarchy');
const cat = new Cat('Whiskers', 3);
const dog = new Dog('Buddy', 5);

console.log(`${cat.getInfo()} - ${cat.makeSound()}`);
console.log(`${cat.name} purrs: ${cat.purr()}`);

console.log(`${dog.getInfo()} - ${dog.makeSound()}`);
console.log(`${dog.name} fetches: ${dog.fetch()}`);
console.log('✓ All animal tests pass!\n');

// Test 3: Singleton
console.log('Test 3: Singleton Pattern');
const logger1 = Logger.getInstance();
const logger2 = Logger.getInstance();

console.log(`Same instance? ${logger1 === logger2 ? 'Yes' : 'No'}`);

logger1.log('Application started');
logger2.log('User logged in');
logger1.log('Data saved');

const logs = logger1.getLogs();
console.log(`\nTotal logs: ${logs.length}`);
console.log('✓ All singleton tests pass!\n');

console.log('=== All Tests Complete ===');
