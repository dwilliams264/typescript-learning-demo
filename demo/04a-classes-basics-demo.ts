/**
 * Classes Basics Demo
 *
 * What you'll learn:
 * - Basic class syntax
 * - Constructors
 * - Instance methods and properties
 * - The 'this' keyword
 */

// Basic Class
class ClassPerson {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    greet(): string {
        return `Hello, I'm ${this.name} and I'm ${this.age} years old`;
    }

    haveBirthday(): void {
        this.age++;
        console.log(`Happy birthday! ${this.name} is now ${this.age} years old`);
    }
}

// Class with Methods
class Calculator {
    add(a: number, b: number): number {
        return a + b;
    }

    subtract(a: number, b: number): number {
        return a - b;
    }

    multiply(a: number, b: number): number {
        return a * b;
    }

    divide(a: number, b: number): number {
        if (b === 0) {
            throw new Error('Cannot divide by zero');
        }
        return a / b;
    }
}

// Class with Constructor Shorthand
class Product {
    constructor(
        public id: number,
        public name: string,
        public price: number,
    ) {}

    getDescription(): string {
        return `${this.name} (ID: ${this.id}) - £${this.price.toFixed(2)}`;
    }

    applyDiscount(percent: number): void {
        this.price = this.price * (1 - percent / 100);
        console.log(`Discount applied! New price: £${this.price.toFixed(2)}`);
    }
}

// Basic Class
console.log('=== Basic Class ===');
const person = new ClassPerson('Alice', 30);
console.log(person.greet());
person.haveBirthday();

const person2 = new ClassPerson('Bob', 25);
console.log(person2.greet());

// Calculator Class
console.log('\n=== Calculator Class ===');
const calc = new Calculator();
console.log(`10 + 5 = ${calc.add(10, 5)}`);
console.log(`10 - 5 = ${calc.subtract(10, 5)}`);
console.log(`10 × 5 = ${calc.multiply(10, 5)}`);
console.log(`10 ÷ 5 = ${calc.divide(10, 5)}`);

// Product Class
console.log('\n=== Product Class ===');
const laptop = new Product(101, 'Laptop', 999.99);
console.log(laptop.getDescription());
laptop.applyDiscount(10);
console.log(laptop.getDescription());
