/**
 * Basic Types Demo
 *
 * What you'll learn:
 * - Primitive types: boolean, number, string, undefined, null
 * - Arrays and array syntax
 * - Tuples and their uses
 */

// Basic Primitive Types
let isDone: boolean = true;
let decimal: number = 42;
let hexadecimal: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;
let userName: string = 'Alice';
let notDefined: undefined = undefined;
let notPresent: null = null;

// Arrays
const numbers: number[] = [1, 2, 3, 4, 5];
const names: Array<string> = ['Alice', 'Bob', 'Charlie'];
const mixed: (string | number)[] = ['one', 2, 'three', 4];

// Tuples
const tuple: [string, number, boolean] = ['TypeScript', 2024, true];
const coordinates: [number, number] = [51.5074, -0.1278];

// Basic Types
console.log('=== Basic Types ===');
console.log(`Boolean: ${isDone}`);
console.log(`Decimal: ${decimal}`);
console.log(`Hexadecimal: ${hexadecimal}`);
console.log(`Binary: ${binary}`);
console.log(`Octal: ${octal}`);
console.log(`String: ${userName}`);

// Arrays
console.log('\n=== Arrays ===');
console.log(`Numbers: [${numbers.join(', ')}]`);
console.log(`Names: [${names.join(', ')}]`);
console.log(`Mixed: [${mixed.join(', ')}]`);

// Tuples
console.log('\n=== Tuples ===');
console.log(`Tuple: [${tuple.join(', ')}]`);
console.log(`Coordinates: (${coordinates[0]}, ${coordinates[1]})`);
