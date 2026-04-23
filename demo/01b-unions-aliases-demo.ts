/**
 * Union Types & Type Aliases Demo
 *
 * What you'll learn:
 * - Union types and type narrowing
 * - Type aliases for better code organization
 * - Literal types for precise values
 * - Any vs Unknown types
 * - Type assertions
 */

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
type SyntaxPoint = { x: number; y: number };
type Callback = (message: string) => void;

const syntaxOrigin: SyntaxPoint = { x: 0, y: 0 };
const logMessage: Callback = (msg) => console.log(`Log: ${msg}`);

// Literal Types
type Direction = 'north' | 'south' | 'east' | 'west';
type HttpCode = 200 | 400 | 404 | 500;

function move(direction: Direction): string {
    return `Moving ${direction}`;
}

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

// Union Types
console.log('=== Union Types ===');
printStatus('active');
printStatus('pending');
printID('ABC123');
printID(42);

// Type Aliases
console.log('\n=== Type Aliases ===');
console.log(`Origin point: (${syntaxOrigin.x}, ${syntaxOrigin.y})`);
logMessage('Type aliases make code more readable');

// Literal Types
console.log('\n=== Literal Types ===');
console.log(move('north'));
console.log(move('west'));

const statusCode: HttpCode = 200;
console.log(`HTTP Status: ${statusCode}`);

// Type Assertions
console.log('\n=== Type Assertions ===');
console.log(`String length: ${stringLength}`);
