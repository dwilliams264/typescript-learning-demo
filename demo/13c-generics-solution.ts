/**
 * Generics Exercise - SOLUTION
 */

// Exercise 1: Generic Pair
class Pair<T, U> {
    constructor(
        public first: T,
        public second: U,
    ) {}

    swap(): Pair<U, T> {
        return new Pair(this.second, this.first);
    }
}

// Exercise 2: Generic Stack
class Stack<T> {
    private items: T[] = [];

    push(item: T): void {
        this.items.push(item);
    }

    pop(): T | undefined {
        return this.items.pop();
    }

    peek(): T | undefined {
        return this.items[this.items.length - 1];
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    size(): number {
        return this.items.length;
    }
}

// Exercise 3: Generic Filter with Type Guard
function filterByType<T, U extends T>(arr: T[], predicate: (item: T) => item is U): U[] {
    const result: U[] = [];
    for (const item of arr) {
        if (predicate(item)) {
            result.push(item);
        }
    }
    return result;
}

// Exercise 4: Generic Promise Wrapper
function wrapInPromise<T>(value: T): Promise<T> {
    return Promise.resolve(value);
}

// ==================== TESTS ====================
console.log('=== Generics Exercise - SOLUTION ===\n');

// Test 1
console.log('Test 1: Generic Pair');
const pair = new Pair('Alice', 30);
console.log(`Original: (${pair.first}, ${pair.second})`);
const swapped = pair.swap();
console.log(`Swapped: (${swapped.first}, ${swapped.second})`);
console.log('✓ Pass\n');

// Test 2
console.log('Test 2: Generic Stack');
const stack = new Stack<string>();
stack.push('first');
stack.push('second');
stack.push('third');
console.log(`Peek: ${stack.peek()}`);
console.log(`Pop: ${stack.pop()}`);
console.log(`Size: ${stack.size()}`);
console.log('✓ Pass\n');

// Test 3
console.log('Test 3: Filter by Type');
const mixed: (string | number | boolean)[] = [1, 'hello', true, 2, 'world', false, 3];
const numbers = filterByType(mixed, (item): item is number => typeof item === 'number');
const strings = filterByType(mixed, (item): item is string => typeof item === 'string');
console.log(`Numbers: [${numbers}]`);
console.log(`Strings: [${strings}]`);
console.log('✓ Pass\n');

// Test 4
console.log('Test 4: Promise Wrapper');
wrapInPromise('Hello').then((value) => console.log(`Wrapped: ${value}`));
wrapInPromise(42).then((value) => console.log(`Wrapped: ${value}`));
console.log('✓ Pass\n');

console.log('=== All Tests Complete ===');
