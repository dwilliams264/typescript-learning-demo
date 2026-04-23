/**
 * Functions Exercise - SOLUTION
 *
 * This file contains the solutions to the functions exercise.
 * Try to solve the exercises yourself before looking at these!
 */

// Exercise 1: Calculator Function
function calculator(a: number, b: number, operation: string): number {
    switch (operation) {
        case 'add':
            return a + b;
        case 'subtract':
            return a - b;
        case 'multiply':
            return a * b;
        case 'divide':
            if (b === 0) throw new Error('Cannot divide by zero');
            return a / b;
        default:
            throw new Error(`Unknown operation: ${operation}`);
    }
}

// Exercise 2: Array Filter Function
function filterArray<T>(arr: T[], predicate: (item: T) => boolean): T[] {
    const result: T[] = [];
    for (const item of arr) {
        if (predicate(item)) {
            result.push(item);
        }
    }
    return result;

    // Alternative solution using built-in filter:
    // return arr.filter(predicate);
}

// Exercise 3: String Formatter
function formatString(template: string, values: Record<string, string>): string {
    let result = template;
    for (const key in values) {
        const placeholder = `{{${key}}}`;
        result = result.replace(new RegExp(placeholder, 'g'), values[key]);
    }
    return result;

    // Alternative solution with single replace:
    // return template.replace(/\{\{(\w+)\}\}/g, (match, key) => values[key] || match);
}

// Exercise 4: Function Composition
function compose<A, B, C>(f: (b: B) => C, g: (a: A) => B): (a: A) => C {
    return (a: A): C => f(g(a));
}

// Exercise 5: Retry Function
async function retry<T>(fn: () => Promise<T>, maxAttempts: number): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;
            console.log(`Attempt ${attempt} failed`);

            if (attempt === maxAttempts) {
                throw lastError;
            }
        }
    }

    throw lastError || new Error('Max attempts reached');
}

// ==================== TESTS ====================
console.log('=== Functions Exercise - SOLUTION ===\n');

// Test 1: Calculator
console.log('Test 1: Calculator');
console.log(`10 + 5 = ${calculator(10, 5, 'add')}`); // 15
console.log(`10 - 5 = ${calculator(10, 5, 'subtract')}`); // 5
console.log(`10 * 5 = ${calculator(10, 5, 'multiply')}`); // 50
console.log(`10 / 5 = ${calculator(10, 5, 'divide')}`); // 2
console.log('✓ All calculator tests pass!\n');

// Test 2: Filter Array
console.log('Test 2: Filter Array');
const numbers = [1, 2, 3, 4, 5, 6];
const evenNumbers = filterArray(numbers, (n) => n % 2 === 0);
console.log(`Even numbers from [${numbers}]: [${evenNumbers}]`); // [2, 4, 6]

const strings = ['apple', 'banana', 'avocado', 'cherry'];
const aWords = filterArray(strings, (s) => s.startsWith('a'));
console.log(`Words starting with 'a': [${aWords}]`); // ['apple', 'avocado']
console.log('✓ All filter tests pass!\n');

// Test 3: String Formatter
console.log('Test 3: String Formatter');
const result = formatString('Hello {{name}}, you are {{age}} years old!', {
    name: 'Alice',
    age: '30',
});
console.log(result); // "Hello Alice, you are 30 years old!"

const result2 = formatString('{{greeting}}, {{name}}! Welcome to {{place}}.', {
    greeting: 'Hi',
    name: 'Bob',
    place: 'TypeScript Land',
});
console.log(result2); // "Hi, Bob! Welcome to TypeScript Land."
console.log('✓ All formatter tests pass!\n');

// Test 4: Compose
console.log('Test 4: Function Composition');
const addFive = (n: number) => n + 5;
const double = (n: number) => n * 2;
const doubleThenAddFive = compose(addFive, double);

console.log(`compose(+5, *2)(10) = ${doubleThenAddFive(10)}`); // 25
console.log(`compose(+5, *2)(7) = ${doubleThenAddFive(7)}`); // 19

const addTenThenDouble = compose(double, addFive);
console.log(`compose(*2, +5)(10) = ${addTenThenDouble(10)}`); // 30
console.log('✓ All compose tests pass!\n');

// Test 5: Retry
console.log('Test 5: Retry Function');
(async () => {
    let attempts = 0;
    const unreliableFunction = async () => {
        attempts++;
        console.log(`  Attempt ${attempts}...`);
        if (attempts < 3) {
            throw new Error('Failed');
        }
        return 'Success';
    };

    try {
        const result = await retry(unreliableFunction, 5);
        console.log(`  Result: ${result}`);
        console.log('✓ Retry test passes!\n');
    } catch (error) {
        console.log(`✗ Retry failed: ${error}`);
    }

    console.log('=== All Tests Complete ===');
})();
