/**
 * Functions Basics Demo
 *
 * What you'll learn:
 * - Function declarations
 * - Arrow functions (concise and block syntax)
 * - Default parameters
 * - Optional parameters
 * - Rest parameters
 */

// Function Declarations
function add(a: number, b: number): number {
    return a + b;
}

function greetUser(name: string): void {
    console.log(`Hello, ${name}!`);
}

// Arrow Functions
const multiply = (a: number, b: number): number => a * b;
const divide = (a: number, b: number): number => a / b;
const greet = (): string => 'Hello, TypeScript!';
const square = (n: number): number => n * n;

// Arrow Function with Block Body
const isEven = (num: number): boolean => {
    if (num % 2 === 0) {
        return true;
    }
    return false;
};

// Default Parameters
function createGreeting(name: string, greeting: string = 'Hello'): string {
    return `${greeting}, ${name}!`;
}

function calculatePrice(price: number, tax: number = 0.2, discount: number = 0): number {
    return price * (1 + tax) * (1 - discount);
}

// Optional Parameters
function buildName(firstName: string, lastName?: string): string {
    return lastName ? `${firstName} ${lastName}` : firstName;
}

function logMessage(message: string, timestamp?: Date): void {
    const time = timestamp ? timestamp.toISOString() : 'No timestamp';
    console.log(`[${time}] ${message}`);
}

// Rest Parameters
function sum(...numbers: number[]): number {
    return numbers.reduce((total, num) => total + num, 0);
}

function combineStrings(separator: string, ...strings: string[]): string {
    return strings.join(separator);
}

function findMax(...numbers: number[]): number {
    return Math.max(...numbers);
}

// Function Declarations
console.log('=== Function Declarations ===');
console.log(`add(5, 3) = ${add(5, 3)}`);
greetUser('TypeScript');

// Arrow Functions
console.log('\n=== Arrow Functions ===');
console.log(`multiply(4, 6) = ${multiply(4, 6)}`);
console.log(`divide(20, 4) = ${divide(20, 4)}`);
console.log(greet());
console.log(`square(7) = ${square(7)}`);
console.log(`isEven(4) = ${isEven(4)}`);
console.log(`isEven(5) = ${isEven(5)}`);

// Default Parameters
console.log('\n=== Default Parameters ===');
console.log(createGreeting('Alice'));
console.log(createGreeting('Bob', 'Good morning'));
console.log(`Price with defaults: £${calculatePrice(100).toFixed(2)}`);
console.log(`Price with discount: £${calculatePrice(100, 0.2, 0.1).toFixed(2)}`);

// Optional Parameters
console.log('\n=== Optional Parameters ===');
console.log(buildName('John'));
console.log(buildName('Jane', 'Doe'));
logMessage('System started');
logMessage('User logged in', new Date());

// Rest Parameters
console.log('\n=== Rest Parameters ===');
console.log(`sum(1, 2, 3) = ${sum(1, 2, 3)}`);
console.log(`sum(10, 20, 30, 40, 50) = ${sum(10, 20, 30, 40, 50)}`);
console.log(combineStrings(' ', 'Hello', 'TypeScript', 'World'));
console.log(combineStrings(', ', 'Apple', 'Banana', 'Cherry'));
console.log(`findMax(5, 12, 3, 18, 7) = ${findMax(5, 12, 3, 18, 7)}`);
