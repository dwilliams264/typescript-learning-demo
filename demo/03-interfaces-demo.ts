// Basic Interfaces
interface User {
    id: number;
    name: string;
    email: string;
    isActive: boolean;
}

interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    inStock: boolean;
}

// Optional Properties
interface Movie {
    title: string;
    director: string;
    yearReleased: number;
    streaming: boolean;
    length?: number;
    rating?: number;
    logReview?: (review: string) => void;
}

interface Book {
    title: string;
    author: string;
    pages: number;
    available: boolean;
    isbn?: string;
    publisher?: string;
}

// Readonly Properties
interface Config {
    readonly apiKey: string;
    readonly environment: string;
    timeout: number;
}

// Function Types in Interfaces
interface Calculator {
    add(a: number, b: number): number;
    subtract(a: number, b: number): number;
    multiply(a: number, b: number): number;
    divide(a: number, b: number): number;
}

// Extending Interfaces
interface Person {
    name: string;
    age: number;
}

interface Employee extends Person {
    employeeId: number;
    department: string;
    salary: number;
}

interface Manager extends Employee {
    teamSize: number;
    reports: Employee[];
}

// Multiple Interface Extension
interface Timestamped {
    createdAt: Date;
    updatedAt: Date;
}

interface Identifiable {
    id: string;
}

interface Article extends Identifiable, Timestamped {
    title: string;
    content: string;
    author: string;
}

// Index Signatures
interface StringDictionary {
    [key: string]: string;
}

interface NumberDictionary {
    [key: string]: number;
    length: number;
    count: number;
}

interface MixedDictionary {
    [key: string]: string | number;
    name: string;
    age: number;
}

// Hybrid Types (Callable Interfaces)
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}

function createCounter(): Counter {
    const counter = ((start: number) => {
        return `Starting from ${start}`;
    }) as Counter;
    counter.interval = 1;
    counter.reset = () => console.log('Counter reset');
    return counter;
}

// Interface vs Type Alias
type Point = {
    x: number;
    y: number;
};

interface Point3D extends Point {
    z: number;
}

// Function Implementations
function printMovieInfo(movie: Movie): void {
    console.log(`${movie.title} (${movie.yearReleased}) - ${movie.director}`);
    console.log(`Streaming: ${movie.streaming ? 'Yes' : 'No'}`);
    if (movie.length) {
        console.log(`Duration: ${movie.length} minutes`);
    }
}

function printBookInfo(book: Book): void {
    console.log(`${book.title} by ${book.author}`);
    console.log(`${book.pages} pages - Available: ${book.available ? 'Yes' : 'No'}`);
}

function printUserInfo(user: User): void {
    console.log(`User #${user.id}: ${user.name}`);
    console.log(`Email: ${user.email}, Active: ${user.isActive}`);
}

function printEmployeeInfo(employee: Employee): void {
    console.log(`${employee.name} (ID: ${employee.employeeId})`);
    console.log(`${employee.department} - Salary: £${employee.salary.toLocaleString()}`);
}

// Duck Typing
function printMedia(media: { title: string; yearReleased?: number }): void {
    const year = media.yearReleased ? ` (${media.yearReleased})` : '';
    console.log(`${media.title}${year}`);
}

// Basic Interfaces
console.log('=== Basic Interfaces ===');
const user: User = {
    id: 1,
    name: 'Alice',
    email: 'alice@example.com',
    isActive: true,
};
printUserInfo(user);

const product: Product = {
    id: 101,
    name: 'Laptop',
    price: 999.99,
    description: 'High-performance laptop',
    inStock: true,
};
console.log(`Product: ${product.name} - £${product.price}`);

// Optional Properties
console.log('\n=== Optional Properties ===');
const movie: Movie = {
    title: 'Inception',
    director: 'Christopher Nolan',
    yearReleased: 2010,
    streaming: true,
    length: 148,
    rating: 8.8,
    logReview: (review: string) => console.log(`Review: ${review}`),
};
printMovieInfo(movie);
movie.logReview?.('Mind-bending masterpiece!');

const book: Book = {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    pages: 464,
    available: true,
    isbn: '978-0132350884',
};
printBookInfo(book);

// Readonly Properties
console.log('\n=== Readonly Properties ===');
const config: Config = {
    apiKey: 'abc123xyz',
    environment: 'production',
    timeout: 5000,
};
console.log(`API Key: ${config.apiKey}`);
console.log(`Environment: ${config.environment}`);
config.timeout = 10000;
console.log(`Updated timeout: ${config.timeout}`);

// Function Types
console.log('\n=== Function Types in Interfaces ===');
const calculator: Calculator = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => a / b,
};
console.log(`10 + 5 = ${calculator.add(10, 5)}`);
console.log(`10 - 5 = ${calculator.subtract(10, 5)}`);
console.log(`10 × 5 = ${calculator.multiply(10, 5)}`);
console.log(`10 ÷ 5 = ${calculator.divide(10, 5)}`);

// Extending Interfaces
console.log('\n=== Extending Interfaces ===');
const person: Person = {
    name: 'Bob',
    age: 30,
};
console.log(`Person: ${person.name}, Age: ${person.age}`);

const employee: Employee = {
    name: 'Charlie',
    age: 28,
    employeeId: 1001,
    department: 'Engineering',
    salary: 75000,
};
printEmployeeInfo(employee);

const manager: Manager = {
    name: 'Diana',
    age: 35,
    employeeId: 2001,
    department: 'Engineering',
    salary: 95000,
    teamSize: 8,
    reports: [employee],
};
console.log(`Manager: ${manager.name}, Team size: ${manager.teamSize}`);

// Multiple Interface Extension
console.log('\n=== Multiple Interface Extension ===');
const article: Article = {
    id: 'article-001',
    title: 'Introduction to TypeScript',
    content: 'TypeScript is a typed superset of JavaScript...',
    author: 'John Doe',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-01'),
};
console.log(`Article: ${article.title}`);
console.log(`Author: ${article.author}`);
console.log(`Created: ${article.createdAt.toDateString()}`);

// Index Signatures
console.log('\n=== Index Signatures ===');
const stringDict: StringDictionary = {
    firstName: 'Alice',
    lastName: 'Smith',
    city: 'London',
};
console.log(`First name: ${stringDict.firstName}`);
console.log(`City: ${stringDict.city}`);

const numberDict: NumberDictionary = {
    length: 100,
    count: 5,
    total: 500,
};
console.log(`Length: ${numberDict.length}, Count: ${numberDict.count}`);

const mixedDict: MixedDictionary = {
    name: 'TypeScript',
    age: 12,
    version: '5.0',
};
console.log(`Mixed dict: ${JSON.stringify(mixedDict)}`);

// Hybrid Types
console.log('\n=== Hybrid Types ===');
const counter = createCounter();
console.log(counter(10));
console.log(`Interval: ${counter.interval}`);
counter.reset();

// Interface vs Type
console.log('\n=== Interface Extending Type ===');
const point3d: Point3D = { x: 10, y: 20, z: 30 };
console.log(`3D Point: (${point3d.x}, ${point3d.y}, ${point3d.z})`);

// Duck Typing
console.log('\n=== Duck Typing ===');
printMedia(movie);
printMedia({ title: 'TypeScript Course', yearReleased: 2024 });
printMedia({ title: 'Programming Fundamentals' });
