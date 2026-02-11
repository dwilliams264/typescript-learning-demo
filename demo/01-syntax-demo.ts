// Basic Types
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

// Union Types
type Status = 'active' | 'inactive' | 'pending';
type ID = string | number;

function printStatus(status: Status): void {
    console.log(`Status: ${status}`);
}

function printID(id: ID): void {
    if (typeof id === 'string') {
        console.log(`String ID: ${id.toUpperCase()}`);
    } else {
        console.log(`Numeric ID: ${id}`);
    }
}

// Type Aliases
type Point = { x: number; y: number };
type Callback = (message: string) => void;

const origin: Point = { x: 0, y: 0 };
const logMessage: Callback = (msg) => console.log(`Log: ${msg}`);

// Literal Types
type Direction = 'north' | 'south' | 'east' | 'west';
type HttpCode = 200 | 400 | 404 | 500;

function move(direction: Direction): string {
    return `Moving ${direction}`;
}

// Template Literals
function formatUserInfo(name: string, age: number, city: string): string {
    return `User ${name} is ${age} years old and lives in ${city}`;
}

type EmailAddress = `${string}@${string}.${string}`;
const email: EmailAddress = 'user@example.com';

// Any and Unknown
let randomValue: any = 10;
randomValue = true;
randomValue = 'Hello';

let unknownValue: unknown = 10;
if (typeof unknownValue === 'number') {
    const sum = unknownValue + 5;
    console.log(`Unknown as number: ${sum}`);
}

// Type Assertions
const someValue: unknown = 'This is a string';
const stringLength: number = (someValue as string).length;

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

// Union Types
console.log('\n=== Union Types ===');
printStatus('active');
printStatus('pending');
printID('ABC123');
printID(42);

// Type Aliases
console.log('\n=== Type Aliases ===');
console.log(`Origin point: (${origin.x}, ${origin.y})`);
logMessage('Type aliases make code more readable');

// Literal Types
console.log('\n=== Literal Types ===');
console.log(move('north'));
console.log(move('west'));

const statusCode: HttpCode = 200;
console.log(`HTTP Status: ${statusCode}`);

// Template Literals
console.log('\n=== Template Literals ===');
const info = formatUserInfo('Alice', 30, 'London');
console.log(info);

const multiLine = `Multi-line
template literal
preserves formatting`;
console.log(multiLine);
console.log(`Email: ${email}`);

// Control Flow - For Loop
console.log('\n=== For Loop ===');
for (let i = 0; i < 5; i++) {
    console.log(`${i} is ${i % 2 === 0 ? 'even' : 'odd'}`);
}

// For...of Loop
console.log('\n=== For...of Loop ===');
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

// Optional Chaining
console.log('\n=== Optional Chaining ===');
const user: { name: string; address?: { city?: string } } = { name: 'Charlie' };
console.log(`City: ${user.address?.city ?? 'Not specified'}`);

// Type Assertions
console.log('\n=== Type Assertions ===');
console.log(`String length: ${stringLength}`);
