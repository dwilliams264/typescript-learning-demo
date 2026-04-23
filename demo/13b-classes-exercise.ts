/**
 * Classes Exercise
 *
 * Complete the following class implementations.
 * Run this file to see which tests pass!
 */

// Exercise 1: Shopping Cart Class
// TODO: Implement a ShoppingCart class with the following features:
// - Property: items (array of CartItem)
// - Method: addItem(item: CartItem) - adds an item to the cart
// - Method: removeItem(id: string) - removes an item by id
// - Method: getTotal() - returns the total price of all items
// - Method: getItemCount() - returns the total number of items

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

class ShoppingCart {
    // YOUR CODE HERE
    addItem(item: CartItem): void {}
    removeItem(id: string): void {}
    getTotal(): number {
        return 0;
    }
    getItemCount(): number {
        return 0;
    }
}

// Exercise 2: Animal Hierarchy with Inheritance
// TODO: Implement Animal base class and Cat/Dog subclasses
// - Animal should have: name (string), age (number), makeSound() method
// - Cat should extend Animal and override makeSound() to return "Meow!"
// - Dog should extend Animal and override makeSound() to return "Woof!"
// - Cat should have additional method: purr() that returns "Purrrr"
// - Dog should have additional method: fetch() that returns "Fetching!"

abstract class Animal {
    // YOUR CODE HERE
    constructor(
        public name: string,
        public age: number,
    ) {}
    abstract makeSound(): string;
}

class Cat extends Animal {
    // YOUR CODE HERE
    makeSound(): string {
        return '';
    }
    purr(): string {
        return '';
    }
}

class Dog extends Animal {
    // YOUR CODE HERE
    makeSound(): string {
        return '';
    }
    fetch(): string {
        return '';
    }
}

// Exercise 3: Singleton Pattern
// TODO: Implement a Logger class using the Singleton pattern
// - Should have a private static instance property
// - Should have a private constructor
// - Should have a static getInstance() method
// - Should have a log(message: string) method that adds to logs array
// - Should have a getLogs() method that returns all logs

class Logger {
    // YOUR CODE HERE
    static getInstance(): Logger {
        return new Logger();
    }
    log(message: string): void {}
    getLogs(): string[] {
        return [];
    }
}

// ==================== TESTS ====================
console.log('=== Classes Exercise Tests ===\n');

// Test 1: Shopping Cart
console.log('Test 1: Shopping Cart');
try {
    const cart = new ShoppingCart();
    cart.addItem({ id: '1', name: 'Apple', price: 1.5, quantity: 3 });
    cart.addItem({ id: '2', name: 'Banana', price: 0.8, quantity: 5 });

    const total = cart.getTotal();
    const count = cart.getItemCount();

    if (total === 8.5 && count === 8) {
        console.log('✓ PASS: Shopping cart works correctly');
        console.log(`  Total: £${total}, Items: ${count}`);
    } else {
        console.log(`✗ FAIL: Expected total 8.5 and count 8, got ${total} and ${count}`);
    }

    cart.removeItem('1');
    console.log(`  After removing item 1: £${cart.getTotal()}`);
} catch (e) {
    console.log('✗ FAIL: Shopping cart threw an error:', (e as Error).message);
}

// Test 2: Animal Hierarchy
console.log('\nTest 2: Animal Hierarchy');
try {
    const cat = new Cat('Whiskers', 3);
    const dog = new Dog('Buddy', 5);

    if (cat.makeSound() === 'Meow!' && dog.makeSound() === 'Woof!') {
        console.log('✓ PASS: Animal sounds work correctly');
        console.log(`  Cat says: ${cat.makeSound()}`);
        console.log(`  Dog says: ${dog.makeSound()}`);
    } else {
        console.log('✗ FAIL: Animal sounds incorrect');
    }

    if (typeof cat.purr === 'function' && typeof dog.fetch === 'function') {
        console.log(`  Cat purrs: ${cat.purr()}`);
        console.log(`  Dog fetches: ${dog.fetch()}`);
    }
} catch (e) {
    console.log('✗ FAIL: Animal hierarchy threw an error:', (e as Error).message);
}

// Test 3: Singleton
console.log('\nTest 3: Singleton Pattern');
try {
    const logger1 = Logger.getInstance();
    const logger2 = Logger.getInstance();

    if (logger1 === logger2) {
        console.log('✓ PASS: Singleton returns same instance');

        logger1.log('First message');
        logger2.log('Second message');

        const logs = logger1.getLogs();
        console.log(`  Logged ${logs.length} messages`);
        console.log(`  Messages: ${logs.join(', ')}`);
    } else {
        console.log('✗ FAIL: Singleton returns different instances');
    }
} catch (e) {
    console.log('✗ FAIL: Singleton threw an error:', (e as Error).message);
}

console.log('\n=== End of Tests ===');
console.log('Check the solution file (13b-classes-solution.ts) if you need help!');
