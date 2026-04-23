/**
 * Function Types Demo
 *
 * What you'll learn:
 * - Explicit type annotations on functions
 * - Function type aliases
 * - Function overloads
 * - Union return types
 * - Never type (functions that never return)
 */

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

const add: MathOperation = (a, b) => a + b;
const subtract: MathOperation = (a, b) => a - b;
const multiply: MathOperation = (a, b) => a * b;
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

// Type Annotations
console.log('=== Type Annotations ===');
console.log(`calculateArea(5, 10) = ${calculateArea(5, 10)}`);
console.log(`Full name: ${getFullName('Alice', 'Smith')}`);

// Function Types
console.log('\n=== Function Types ===');
console.log(`add(10, 5) = ${add(10, 5)}`);
console.log(`subtract(10, 3) = ${subtract(10, 3)}`);
console.log(`multiply(4, 7) = ${multiply(4, 7)}`);
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

// Union Return Types
console.log('\n=== Union Return Types ===');
const user = findUser(1);
if (user) {
    console.log(`Found user: ${user.name} (${user.email})`);
} else {
    console.log('User not found');
}

const noUser = findUser(-1);
if (noUser) {
    console.log(`Found user: ${noUser.name}`);
} else {
    console.log('No user found with negative ID');
}

// Never Type
console.log('\n=== Never Type ===');
console.log('Functions with never type never return normally');
console.log('Example: throwError() would throw, infiniteLoop() would run forever');
