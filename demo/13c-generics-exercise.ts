/**
 * Generics Exercise
 *
 * Complete the following generic functions and classes.
 * Run this file to see which tests pass!
 */

// Exercise 1: Generic Pair
// TODO: Implement a generic Pair class that holds two values of potentially different types
class Pair<T, U> {
    // YOUR CODE HERE
    constructor(
        public first: T,
        public second: U,
    ) {}
}

// Exercise 2: Generic Stack
// TODO: Implement a generic Stack (LIFO) data structure
// Methods: push(item: T), pop(): T | undefined, peek(): T | undefined, isEmpty(): boolean, size(): number
class Stack<T> {
    push(item: T): void {}
    pop(): T | undefined {
        return undefined;
    }
    peek(): T | undefined {
        return undefined;
    }
    isEmpty(): boolean {
        return true;
    }
    size(): number {
        return 0;
    }
    // YOUR CODE HERE
}

// Exercise 3: Generic Filter with Type Guard
// TODO: Implement a function that filters an array and narrows its type
// Use a type predicate to ensure type safety
function filterByType<T, U extends T>(arr: T[], predicate: (item: T) => item is U): U[] {
    // YOUR CODE HERE
    return [];
}

// Exercise 4: Generic Promise Wrapper
// TODO: Implement a function that wraps a value in a resolved Promise
// Should preserve the type of the value
function wrapInPromise<T>(value: T): Promise<T> {
    // YOUR CODE HERE
    return Promise.resolve(value);
}

// ==================== TESTS ====================
console.log('=== Generics Exercise Tests ===\n');

// Test 1: Generic Pair
console.log('Test 1: Generic Pair');
try {
    const pair = new Pair('name', 42);
    console.log(`Pair: (${pair.first}, ${pair.second})`);
    console.log('✓ PASS: Generic Pair works\n');
} catch (e) {
    console.log('✗ FAIL: Pair threw an error\n');
}

// Test 2: Generic Stack
console.log('Test 2: Generic Stack');
try {
    const stack = new Stack<number>();
    stack.push(1);
    stack.push(2);
    stack.push(3);

    console.log(`Top: ${stack.peek()}`);
    console.log(`Popped: ${stack.pop()}`);
    console.log(`Size: ${stack.size()}`);
    console.log('✓ PASS: Generic Stack works\n');
} catch (e) {
    console.log('✗ FAIL: Stack threw an error\n');
}

// Test 3: Filter with Type Guard
console.log('Test 3: Filter by Type');
try {
    const mixed: (string | number)[] = [1, 'hello', 2, 'world', 3];
    const numbers = filterByType(mixed, (item): item is number => typeof item === 'number');
    console.log(`Numbers: [${numbers}]`);
    console.log('✓ PASS: Type guard filter works\n');
} catch (e) {
    console.log('✗ FAIL: Filter threw an error\n');
}

console.log('=== End of Tests ===');
console.log('Check the solution file (13c-generics-solution.ts) if you need help!');
