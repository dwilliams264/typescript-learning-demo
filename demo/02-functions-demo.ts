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

// Type Annotations
function calculateArea(width: number, height: number): number {
    return width * height;
}

function getFullName(firstName: string, lastName: string): string {
    return `${firstName} ${lastName}`;
}

// Function Types
type MathOperation = (a: number, b: number) => number;
type StringFormatter = (input: string) => string;

const subtract: MathOperation = (a, b) => a - b;
const toUpperCase: StringFormatter = (str) => str.toUpperCase();

// Function Overloads
function formatValue(value: string): string;
function formatValue(value: number): string;
function formatValue(value: boolean): string;
function formatValue(value: string | number | boolean): string {
    if (typeof value === 'string') {
        return `String: "${value}"`;
    } else if (typeof value === 'number') {
        return `Number: ${value.toFixed(2)}`;
    } else {
        return `Boolean: ${value ? 'true' : 'false'}`;
    }
}

function createDate(timestamp: number): Date;
function createDate(year: number, month: number, day: number): Date;
function createDate(yearOrTimestamp: number, month?: number, day?: number): Date {
    if (month !== undefined && day !== undefined) {
        return new Date(yearOrTimestamp, month - 1, day);
    } else {
        return new Date(yearOrTimestamp);
    }
}

// Higher-Order Functions
function applyOperation(a: number, b: number, operation: MathOperation): number {
    return operation(a, b);
}

function createMultiplier(factor: number): (num: number) => number {
    return (num: number) => num * factor;
}

// Callback Functions
function processArray(arr: number[], callback: (num: number) => number): number[] {
    return arr.map(callback);
}

// Function with Union Return Types
function findUser(id: number): { name: string; email: string } | null {
    if (id > 0) {
        return { name: 'Alice', email: 'alice@example.com' };
    }
    return null;
}

// Never Type (Functions that never return)
function throwError(message: string): never {
    throw new Error(message);
}

function infiniteLoop(): never {
    while (true) {
        // Infinite loop
    }
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

// Type Annotations
console.log('\n=== Type Annotations ===');
console.log(`calculateArea(5, 10) = ${calculateArea(5, 10)}`);
console.log(`Full name: ${getFullName('Alice', 'Smith')}`);

// Function Types
console.log('\n=== Function Types ===');
console.log(`subtract(10, 3) = ${subtract(10, 3)}`);
console.log(toUpperCase('typescript'));

// Function Overloads
console.log('\n=== Function Overloads ===');
console.log(formatValue('Hello'));
console.log(formatValue(42.5678));
console.log(formatValue(true));

const date1 = createDate(1609459200000);
const date2 = createDate(2024, 6, 15);
console.log(`Date from timestamp: ${date1.toDateString()}`);
console.log(`Date from values: ${date2.toDateString()}`);

// Higher-Order Functions
console.log('\n=== Higher-Order Functions ===');
console.log(`applyOperation(10, 5, add) = ${applyOperation(10, 5, add)}`);
console.log(`applyOperation(10, 5, multiply) = ${applyOperation(10, 5, multiply)}`);

const double = createMultiplier(2);
const triple = createMultiplier(3);
console.log(`double(5) = ${double(5)}`);
console.log(`triple(5) = ${triple(5)}`);

// Callback Functions
console.log('\n=== Callback Functions ===');
const numbers = [1, 2, 3, 4, 5];
const squared = processArray(numbers, (n) => n * n);
const doubled = processArray(numbers, (n) => n * 2);
console.log(`Original: [${numbers.join(', ')}]`);
console.log(`Squared: [${squared.join(', ')}]`);
console.log(`Doubled: [${doubled.join(', ')}]`);

// Union Return Types
console.log('\n=== Union Return Types ===');
const user = findUser(1);
if (user) {
    console.log(`Found user: ${user.name} (${user.email})`);
} else {
    console.log('User not found');
}
