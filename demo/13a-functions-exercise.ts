/**
 * Functions Exercise
 *
 * Complete the following functions according to their specifications.
 * Run this file to see which tests pass!
 */

// Exercise 1: Calculator Function
// TODO: Implement a calculator function that takes two numbers and an operation
// Operation can be: 'add', 'subtract', 'multiply', 'divide'
// Return the result of the operation
function calculator(a: number, b: number, operation: string): number {
    // YOUR CODE HERE
    return 0;
}

// Exercise 2: Array Filter Function
// TODO: Implement a generic filter function that takes an array and a predicate
// Return a new array with only elements that match the predicate
function filterArray<T>(arr: T[], predicate: (item: T) => boolean): T[] {
    // YOUR CODE HERE
    return [];
}

// Exercise 3: String Formatter
// TODO: Implement a function that takes a template string and an object
// Replace {{key}} in the template with values from the object
// Example: formatString("Hello {{name}}!", {name: "Alice"}) => "Hello Alice!"
function formatString(template: string, values: Record<string, string>): string {
    // YOUR CODE HERE
    return '';
}

// Exercise 4: Function Composition
// TODO: Implement a compose function that takes two functions and returns their composition
// compose(f, g)(x) should return f(g(x))
function compose<A, B, C>(f: (b: B) => C, g: (a: A) => B): (a: A) => C {
    // YOUR CODE HERE
    return (a: A) => ({}) as C;
}

// Exercise 5: Retry Function
// TODO: Implement a function that retries another function up to maxAttempts times
// If the function succeeds, return the result
// If it fails after maxAttempts, throw the last error
async function retry<T>(fn: () => Promise<T>, maxAttempts: number): Promise<T> {
    // YOUR CODE HERE
    return {} as T;
}

// ==================== TESTS ====================
console.log('=== Functions Exercise Tests ===\n');

// Test 1: Calculator
console.log('Test 1: Calculator');
try {
    const result1 = calculator(10, 5, 'add');
    const result2 = calculator(10, 5, 'multiply');
    const result3 = calculator(10, 5, 'divide');

    if (result1 === 15 && result2 === 50 && result3 === 2) {
        console.log('✓ PASS: Calculator works correctly');
    } else {
        console.log(`✗ FAIL: Expected 15, 50, 2 but got ${result1}, ${result2}, ${result3}`);
    }
} catch (e) {
    console.log('✗ FAIL: Calculator threw an error');
}

// Test 2: Filter Array
console.log('\nTest 2: Filter Array');
try {
    const numbers = [1, 2, 3, 4, 5, 6];
    const evenNumbers = filterArray(numbers, (n) => n % 2 === 0);

    if (evenNumbers.length === 3 && evenNumbers[0] === 2) {
        console.log('✓ PASS: Filter array works correctly');
    } else {
        console.log(`✗ FAIL: Expected [2, 4, 6] but got [${evenNumbers}]`);
    }
} catch (e) {
    console.log('✗ FAIL: Filter array threw an error');
}

// Test 3: String Formatter
console.log('\nTest 3: String Formatter');
try {
    const result = formatString('Hello {{name}}, you are {{age}} years old!', {
        name: 'Alice',
        age: '30',
    });

    if (result === 'Hello Alice, you are 30 years old!') {
        console.log('✓ PASS: String formatter works correctly');
    } else {
        console.log(`✗ FAIL: Expected "Hello Alice, you are 30 years old!" but got "${result}"`);
    }
} catch (e) {
    console.log('✗ FAIL: String formatter threw an error');
}

// Test 4: Compose
console.log('\nTest 4: Function Composition');
try {
    const addFive = (n: number) => n + 5;
    const double = (n: number) => n * 2;
    const doubleThenAddFive = compose(addFive, double);

    const result = doubleThenAddFive(10); // (10 * 2) + 5 = 25

    if (result === 25) {
        console.log('✓ PASS: Compose works correctly');
    } else {
        console.log(`✗ FAIL: Expected 25 but got ${result}`);
    }
} catch (e) {
    console.log('✗ FAIL: Compose threw an error');
}

// Test 5: Retry
console.log('\nTest 5: Retry Function');
(async () => {
    try {
        let attempts = 0;
        const unreliableFunction = async () => {
            attempts++;
            if (attempts < 3) {
                throw new Error('Failed');
            }
            return 'Success';
        };

        const result = await retry(unreliableFunction, 5);

        if (result === 'Success' && attempts === 3) {
            console.log('✓ PASS: Retry works correctly');
        } else {
            console.log(`✗ FAIL: Expected "Success" after 3 attempts but got "${result}" after ${attempts} attempts`);
        }
    } catch (e) {
        console.log('✗ FAIL: Retry threw an error');
    }
})();

console.log('\n=== End of Tests ===');
console.log('Check the solution file (13a-functions-solution.ts) if you need help!');
