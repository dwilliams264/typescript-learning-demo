/**
 * Control Flow Demo
 *
 * What you'll learn:
 * - For loops and iteration
 * - For...of and for...in loops
 * - While and do...while loops
 * - Switch statements
 * - Ternary operators
 * - Nullish coalescing (??)
 * - Optional chaining (?.)
 */

// Control Flow - For Loop
console.log('=== For Loop ===');
for (let i = 0; i < 5; i++) {
    console.log(`${i} is ${i % 2 === 0 ? 'even' : 'odd'}`);
}

// For...of Loop
console.log('\n=== For...of Loop ===');
const names = ['Alice', 'Bob', 'Charlie'];
for (const name of names) {
    console.log(`Hello, ${name}!`);
}

// For...in Loop
console.log('\n=== For...in Loop ===');
const person = { name: 'Bob', age: 25, city: 'Manchester' };
for (const key in person) {
    console.log(`${key}: ${person[key as keyof typeof person]}`);
}

// While Loop
console.log('\n=== While Loop ===');
let count = 0;
while (count < 3) {
    console.log(`Count: ${count}`);
    count++;
}

// Do...While Loop
console.log('\n=== Do...While Loop ===');
let counter = 0;
do {
    console.log(`Counter: ${counter}`);
    counter++;
} while (counter < 3);

// Switch Statement
console.log('\n=== Switch Statement ===');
const day: string = 'Monday';
switch (day) {
    case 'Monday':
        console.log('Start of the work week!');
        break;
    case 'Friday':
        console.log('Almost weekend!');
        break;
    case 'Saturday':
    case 'Sunday':
        console.log('Weekend!');
        break;
    default:
        console.log(`It's ${day}`);
}

// Conditional (Ternary) Operator
console.log('\n=== Ternary Operator ===');
const age = 18;
const canVote = age >= 18 ? 'Yes' : 'No';
console.log(`Can vote: ${canVote}`);

// Nullish Coalescing
console.log('\n=== Nullish Coalescing ===');
const nullValue: string | null = null;
const result = nullValue ?? 'Default value';
console.log(`Result: ${result}`);

const undefinedValue: string | undefined = undefined;
const result2 = undefinedValue ?? 'Fallback value';
console.log(`Result2: ${result2}`);

const zeroValue = 0;
const result3 = zeroValue ?? 'Default'; // Returns 0, not 'Default'
console.log(`Result3 (with 0): ${result3}`);

// Optional Chaining
console.log('\n=== Optional Chaining ===');
const user: { name: string; address?: { city?: string } } = { name: 'Charlie' };
console.log(`City: ${user.address?.city ?? 'Not specified'}`);

const userWithAddress = {
    name: 'Diana',
    address: { city: 'Edinburgh' },
};
console.log(`City: ${userWithAddress.address?.city ?? 'Not specified'}`);
