// Intersection Types
interface Printable {
    print: () => void;
}

interface Loggable {
    log: () => void;
}

type PrintableLoggable = Printable & Loggable;

const documentHandler: PrintableLoggable = {
    print: () => console.log('Printing document...'),
    log: () => console.log('Logging document...'),
};

// Union Types with Type Narrowing
type Result = { success: true; data: string } | { success: false; error: string };

function handleResult(result: Result): string {
    if (result.success) {
        return `Success: ${result.data}`;
    } else {
        return `Error: ${result.error}`;
    }
}

// Type Aliases
type StringOrNumber = string | number;
type Point = { x: number; y: number };
type Callback = (arg: string) => void;

const processInput = (input: StringOrNumber): string => {
    return typeof input === 'string' ? input.toUpperCase() : input.toString();
};

// Mapped Types
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};

type Optional<T> = {
    [P in keyof T]?: T[P];
};

interface User {
    id: number;
    name: string;
    email: string;
}

type ReadonlyUser = Readonly<User>;
type OptionalUser = Optional<User>;

// Conditional Types
type IsString<T> = T extends string ? 'yes' : 'no';
type Check1 = IsString<string>;
type Check2 = IsString<number>;

type NonNullable<T> = T extends null | undefined ? never : T;
type NullableString = string | null | undefined;
type SafeString = NonNullable<NullableString>;

// Index Types
interface UserRecord {
    id: number;
    name: string;
    email: string;
    age: number;
}

type UserKeys = keyof UserRecord;

function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

// Template Literal Types
type EmailLocalAddress = `${string}@${string}.${string}`;
type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Endpoint = `/api/${string}`;
type APIRoute = `${HTTPMethod} ${Endpoint}`;

function callAPI(route: APIRoute): string {
    return `Calling: ${route}`;
}

// Literal Types
type Direction = 'north' | 'south' | 'east' | 'west';
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

function move(direction: Direction, steps: number): string {
    return `Moving ${steps} steps ${direction}`;
}

// Type Assertions
interface Animal {
    name: string;
}

interface DogDetails extends Animal {
    breed: string;
}

const pet = { name: 'Buddy', breed: 'Labrador' } as DogDetails;

// Tuple Types
type RGB = [number, number, number];
type NamedPosition = [string, number, number];

function mixColours(colour1: RGB, colour2: RGB): string {
    return `Mixed colour: [${colour1.join(', ')}] + [${colour2.join(', ')}]`;
}

// Intersection Types
console.log('=== Intersection Types ===');
documentHandler.print();
documentHandler.log();

// Union Types
console.log('\n=== Union Types ===');
const successResult: Result = { success: true, data: 'User created' };
const errorResult: Result = { success: false, error: 'Invalid input' };
console.log(handleResult(successResult));
console.log(handleResult(errorResult));

// Type Aliases
console.log('\n=== Type Aliases ===');
console.log(processInput('hello'));
console.log(processInput(42));

const point: Point = { x: 10, y: 20 };
console.log(`Point: (${point.x}, ${point.y})`);

// Mapped Types
console.log('\n=== Mapped Types ===');
const regularUser: User = { id: 1, name: 'Alice', email: 'alice@example.com' };
const readonlyUser: ReadonlyUser = { id: 2, name: 'Bob', email: 'bob@example.com' };
const optionalUser: OptionalUser = { name: 'Charlie' };

console.log(`Regular user: ${JSON.stringify(regularUser)}`);
console.log(`Readonly user: ${JSON.stringify(readonlyUser)}`);
console.log(`Optional user: ${JSON.stringify(optionalUser)}`);

// Index Types
console.log('\n=== Index Types ===');
const user: UserRecord = { id: 1, name: 'David', email: 'david@example.com', age: 30 };
console.log(`Name: ${getProperty(user, 'name')}`);
console.log(`Age: ${getProperty(user, 'age')}`);

// Template Literal Types
console.log('\n=== Template Literal Types ===');
const email: EmailLocalAddress = 'user@example.com';
console.log(`Email: ${email}`);
console.log(callAPI('GET /api/users'));
console.log(callAPI('POST /api/products'));

// Literal Types
console.log('\n=== Literal Types ===');
console.log(move('north', 5));
console.log(move('west', 3));

const dice: DiceRoll = 4;
console.log(`Dice roll: ${dice}`);

// Type Assertions
console.log('\n=== Type Assertions ===');
console.log(`Pet: ${pet.name}, Breed: ${pet.breed}`);

// Tuple Types
console.log('\n=== Tuple Types ===');
const red: RGB = [255, 0, 0];
const blue: RGB = [0, 0, 255];
console.log(mixColours(red, blue));

const location: NamedPosition = ['London', 51.5074, -0.1278];
console.log(`Location: ${location[0]} at (${location[1]}, ${location[2]})`);
