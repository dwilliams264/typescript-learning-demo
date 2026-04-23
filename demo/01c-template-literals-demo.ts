/**
 * Template Literals Demo
 *
 * What you'll learn:
 * - Template literal strings (backticks)
 * - Multi-line strings
 * - String interpolation
 * - Template literal types
 */

// Template Literals
function formatUserInfo(name: string, age: number, city: string): string {
    return `User ${name} is ${age} years old and lives in ${city}`;
}

type EmailAddress = `${string}@${string}.${string}`;
const email: EmailAddress = 'user@example.com';

// Template Literals
console.log('=== Template Literals ===');
const info = formatUserInfo('Alice', 30, 'London');
console.log(info);

const multiLine = `Multi-line
template literal
preserves formatting`;
console.log(multiLine);
console.log(`Email: ${email}`);

// String Interpolation Examples
console.log('\n=== String Interpolation ===');
const product = 'Laptop';
const price = 999.99;
const quantity = 2;
console.log(`${quantity}x ${product} = £${(price * quantity).toFixed(2)}`);

const items = ['apple', 'banana', 'cherry'];
console.log(`Shopping list: ${items.join(', ')}`);

// Complex Template Expressions
console.log('\n=== Complex Template Expressions ===');
const scores = [85, 92, 78, 95];
const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
console.log(`Test scores: ${scores.join(', ')}`);
console.log(`Average: ${average.toFixed(2)} (${average >= 90 ? 'A' : average >= 80 ? 'B' : 'C'})`);
