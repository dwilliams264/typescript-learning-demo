/**
 * Type Debugging Demo
 *
 * What you'll learn:
 * - Understanding TypeScript's type inference
 * - The 'satisfies' operator for type checking
 * - Type predicates and narrowing
 * - Debugging complex types
 * - Using utility types to understand transformations
 */

// Type Inference Examples
console.log('=== Type Inference ===');

// TypeScript infers the type automatically
const inferredString = 'Hello'; // Type: string
const inferredNumber = 42; // Type: number
const inferredArray = [1, 2, 3]; // Type: number[]
const inferredObject = { name: 'Alice', age: 30 }; // Type: { name: string; age: number }

console.log('TypeScript infers types automatically:');
console.log(`- inferredString is inferred as: string`);
console.log(`- inferredNumber is inferred as: number`);
console.log(`- inferredArray is inferred as: number[]`);
console.log(`- inferredObject is inferred as: { name: string; age: number }`);

// Literal Types vs Widened Types
const literalString = 'hello' as const; // Type: "hello" (literal)
const widenedString = 'hello'; // Type: string (widened)

console.log('\nLiteral vs Widened:');
console.log(`- literalString with 'as const' has type: "hello"`);
console.log(`- widenedString without 'as const' has type: string`);

// The 'satisfies' Operator
console.log('\n=== The satisfies Operator ===');

type RGB = [number, number, number];
type Color = string | RGB;

// Using satisfies ensures the value matches the type but preserves specific inference
const palette = {
    red: [255, 0, 0],
    green: '#00ff00',
    blue: [0, 0, 255],
} satisfies Record<string, Color>;

// Now we can access properties with type safety
const redArray = palette.red; // Inferred as [number, number, number]
const greenString = palette.green; // Inferred as string

console.log('satisfies operator checks type without widening:');
console.log(`- palette.red is inferred as tuple: [255, 0, 0]`);
console.log(`- palette.green is inferred as string: "${greenString}"`);
console.log('Without satisfies, both would be widened to Color type');

// Type Predicates
console.log('\n=== Type Predicates ===');

interface Cat {
    type: 'cat';
    meow: () => string;
}

interface Dog {
    type: 'dog';
    bark: () => string;
}

type Animal = Cat | Dog;

// Custom type guard using predicate
function isCat(animal: Animal): animal is Cat {
    return animal.type === 'cat';
}

function isDog(animal: Animal): animal is Dog {
    return animal.type === 'dog';
}

const myCat: Animal = {
    type: 'cat',
    meow: () => 'Meow!',
};

const myDog: Animal = {
    type: 'dog',
    bark: () => 'Woof!',
};

console.log('Type predicates narrow union types:');
if (isCat(myCat)) {
    console.log(`- After isCat check, can call: ${myCat.meow()}`);
}
if (isDog(myDog)) {
    console.log(`- After isDog check, can call: ${myDog.bark()}`);
}

// Conditional Types
console.log('\n=== Conditional Types ===');

// Simple conditional type
type IsString<T> = T extends string ? 'yes' : 'no';

type Test1 = IsString<string>; // "yes"
type Test2 = IsString<number>; // "no"

console.log('Conditional types use extends keyword:');
console.log(`- IsString<string> = "yes"`);
console.log(`- IsString<number> = "no"`);

// Extracting types from arrays
type ArrayElement<T> = T extends Array<infer U> ? U : never;

type NumberArrayElement = ArrayElement<number[]>; // number
type StringArrayElement = ArrayElement<string[]>; // string

console.log('\nExtracting types with infer:');
console.log(`- ArrayElement<number[]> = number`);
console.log(`- ArrayElement<string[]> = string`);

// Utility Type Examples
console.log('\n=== Understanding Utility Types ===');

interface DebugUser {
    id: number;
    name: string;
    email: string;
    password: string;
}

// Visualizing transformations
type PartialUser = Partial<DebugUser>;
// Result: { id?: number; name?: string; email?: string; password?: string; }

type PickedUser = Pick<DebugUser, 'id' | 'name'>;
// Result: { id: number; name: string; }

type OmittedUser = Omit<DebugUser, 'password'>;
// Result: { id: number; name: string; email: string; }

type RequiredUser = Required<Partial<DebugUser>>;
// Result: { id: number; name: string; email: string; password: string; }

console.log('Utility types transform existing types:');
console.log('- Partial<T>: Makes all properties optional');
console.log('- Pick<T, K>: Selects specific properties');
console.log('- Omit<T, K>: Removes specific properties');
console.log('- Required<T>: Makes all properties required');

// Type Narrowing Examples
console.log('\n=== Type Narrowing ===');

function processValue(value: string | number | boolean): string {
    if (typeof value === 'string') {
        // TypeScript knows value is string here
        return `String: ${value.toUpperCase()}`;
    } else if (typeof value === 'number') {
        // TypeScript knows value is number here
        return `Number: ${value.toFixed(2)}`;
    } else {
        // TypeScript knows value is boolean here
        return `Boolean: ${value ? 'true' : 'false'}`;
    }
}

console.log('Type narrowing with typeof:');
console.log(processValue('hello'));
console.log(processValue(42.123));
console.log(processValue(true));

// Discriminated Unions
console.log('\n=== Discriminated Unions ===');

type Success = { status: 'success'; data: string };
type Error = { status: 'error'; message: string };
type Result = Success | Error;

function handleResult(result: Result): string {
    // TypeScript uses the discriminant to narrow the type
    if (result.status === 'success') {
        return `Success: ${result.data}`;
    } else {
        return `Error: ${result.message}`;
    }
}

console.log('Discriminated unions use a common property:');
console.log(handleResult({ status: 'success', data: 'All good!' }));
console.log(handleResult({ status: 'error', message: 'Something went wrong' }));

// Never Type Usage
console.log('\n=== The never Type ===');

function assertNever(value: never): never {
    throw new Error(`Unexpected value: ${value}`);
}

type Shape = 'circle' | 'square' | 'triangle';

function getArea(shape: Shape): number {
    switch (shape) {
        case 'circle':
            return Math.PI * 10 * 10;
        case 'square':
            return 10 * 10;
        case 'triangle':
            return (10 * 10) / 2;
        default:
            // If we add a new shape and forget to handle it,
            // TypeScript will error here because shape is not never
            assertNever(shape);
    }
}

console.log('never type ensures exhaustiveness checking:');
console.log(`- Circle area: ${getArea('circle').toFixed(2)}`);
console.log(`- Square area: ${getArea('square')}`);
console.log(`- Triangle area: ${getArea('triangle')}`);
console.log('If a new shape is added, TypeScript will error if not handled!');

// Template Literal Types
console.log('\n=== Template Literal Types ===');

type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type APIRoute = `/api/${string}`;
type APIEndpoint = `${HTTPMethod} ${APIRoute}`;

const validEndpoint: APIEndpoint = 'GET /api/users';
console.log(`Template literal types combine types: ${validEndpoint}`);
console.log('Valid formats: "GET /api/users", "POST /api/products", etc.');

// Key Remapping
console.log('\n=== Key Remapping ===');

type Getters<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type PersonGetters = Getters<{ name: string; age: number }>;
// Result: { getName: () => string; getAge: () => number; }

console.log('Key remapping transforms property names:');
console.log('- Input: { name: string; age: number }');
console.log('- Output: { getName: () => string; getAge: () => number }');

console.log('\n=== Summary ===');
console.log('✓ Use typeof for runtime type checking');
console.log('✓ Use satisfies to check types without widening');
console.log('✓ Use type predicates for custom type guards');
console.log('✓ Use conditional types with extends and infer');
console.log('✓ Use discriminated unions for exhaustive checking');
console.log('✓ Hover over types in your editor to see inferred types!');
