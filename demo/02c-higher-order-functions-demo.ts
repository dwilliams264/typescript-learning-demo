/**
 * Higher-Order Functions Demo
 *
 * What you'll learn:
 * - Higher-order functions (functions that take/return functions)
 * - Callback functions
 * - Closures and function factories
 * - Function composition
 */

// Function type for reuse
type MathOperation = (a: number, b: number) => number;

// Basic math functions
function add(a: number, b: number): number {
    return a + b;
}

function multiply(a: number, b: number): number {
    return a * b;
}

// Higher-Order Functions
function applyOperation(a: number, b: number, operation: MathOperation): number {
    return operation(a, b);
}

function createMultiplier(factor: number): (num: number) => number {
    return (num: number) => num * factor;
}

function createAdder(increment: number): (num: number) => number {
    return (num: number) => num + increment;
}

// Callback Functions
function processArray(arr: number[], callback: (num: number) => number): number[] {
    return arr.map(callback);
}

function filterArray(arr: number[], predicate: (num: number) => boolean): number[] {
    return arr.filter(predicate);
}

// Function Composition
function compose<A, B, C>(f: (b: B) => C, g: (a: A) => B): (a: A) => C {
    return (a: A) => f(g(a));
}

// Pipeline function
function pipe<T>(...fns: Array<(arg: T) => T>): (arg: T) => T {
    return (arg: T) => fns.reduce((result, fn) => fn(result), arg);
}

// Higher-Order Functions
console.log('=== Higher-Order Functions ===');
console.log(`applyOperation(10, 5, add) = ${applyOperation(10, 5, add)}`);
console.log(`applyOperation(10, 5, multiply) = ${applyOperation(10, 5, multiply)}`);

const double = createMultiplier(2);
const triple = createMultiplier(3);
const addTen = createAdder(10);

console.log(`double(5) = ${double(5)}`);
console.log(`triple(5) = ${triple(5)}`);
console.log(`addTen(5) = ${addTen(5)}`);

// Callback Functions
console.log('\n=== Callback Functions ===');
const numbers = [1, 2, 3, 4, 5];
const squared = processArray(numbers, (n) => n * n);
const doubled = processArray(numbers, (n) => n * 2);
const evenNumbers = filterArray(numbers, (n) => n % 2 === 0);

console.log(`Original: [${numbers.join(', ')}]`);
console.log(`Squared: [${squared.join(', ')}]`);
console.log(`Doubled: [${doubled.join(', ')}]`);
console.log(`Even numbers: [${evenNumbers.join(', ')}]`);

// Function Composition
console.log('\n=== Function Composition ===');
const addFive = (n: number) => n + 5;
const multiplyByTwo = (n: number) => n * 2;

const addThenMultiply = compose(multiplyByTwo, addFive);
console.log(`(5 + 5) * 2 = ${addThenMultiply(5)}`);

const multiplyThenAdd = compose(addFive, multiplyByTwo);
console.log(`(5 * 2) + 5 = ${multiplyThenAdd(5)}`);

// Pipeline
console.log('\n=== Pipeline ===');
const transform = pipe(
    (n: number) => n + 10,
    (n: number) => n * 2,
    (n: number) => n - 5,
);
console.log(`Pipeline (5 + 10) * 2 - 5 = ${transform(5)}`);

// Practical Example: Array Methods as HOFs
console.log('\n=== Array Methods (HOFs) ===');
const prices = [10.5, 25.0, 15.75, 30.0, 8.99];
const total = prices.reduce((sum, price) => sum + price, 0);
const expensive = prices.filter((price) => price > 20);
const withTax = prices.map((price) => price * 1.2);

console.log(`Prices: [${prices.map((p) => `£${p.toFixed(2)}`).join(', ')}]`);
console.log(`Total: £${total.toFixed(2)}`);
console.log(`Expensive items: [${expensive.map((p) => `£${p.toFixed(2)}`).join(', ')}]`);
console.log(`With 20% tax: [${withTax.map((p) => `£${p.toFixed(2)}`).join(', ')}]`);
