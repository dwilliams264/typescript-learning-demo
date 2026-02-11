// Basic Class
class Person {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    greet(): string {
        return `Hello, I'm ${this.name} and I'm ${this.age} years old`;
    }
}

// Access Modifiers
class BankAccount {
    public accountNumber: string;
    private balance: number;
    protected accountType: string;

    constructor(accountNumber: string, initialBalance: number, accountType: string) {
        this.accountNumber = accountNumber;
        this.balance = initialBalance;
        this.accountType = accountType;
    }

    public deposit(amount: number): void {
        this.balance += amount;
        console.log(`Deposited £${amount}. New balance: £${this.balance}`);
    }

    public withdraw(amount: number): boolean {
        if (amount > this.balance) {
            console.log('Insufficient funds');
            return false;
        }
        this.balance -= amount;
        console.log(`Withdrew £${amount}. Remaining balance: £${this.balance}`);
        return true;
    }

    public getBalance(): number {
        return this.balance;
    }
}

// Getters and Setters
class Video {
    private _producer: string = '';
    static medium: string = 'Audio/Visual';
    static count: number = 0;

    get producer(): string {
        return this._producer.toUpperCase();
    }

    set producer(newProducer: string) {
        if (newProducer.length > 0) {
            this._producer = newProducer;
        }
    }

    get duration(): string {
        return this.length ? `${this.length} minutes` : 'Unknown';
    }

    constructor(
        public title: string,
        private year: number,
        public length?: number,
    ) {
        Video.count++;
    }

    printItem(): void {
        console.log(`${this.title} was published in ${this.year}`);
        console.log(`Medium: ${Video.medium}`);
    }

    static getTotalVideos(): number {
        return Video.count;
    }
}

// Inheritance
class Animal {
    constructor(
        public name: string,
        protected age: number,
    ) {}

    makeSound(): string {
        return 'Some generic sound';
    }

    getInfo(): string {
        return `${this.name} is ${this.age} years old`;
    }
}

class Dog extends Animal {
    constructor(
        name: string,
        age: number,
        public breed: string,
    ) {
        super(name, age);
    }

    makeSound(): string {
        return 'Woof! Woof!';
    }

    fetch(): string {
        return `${this.name} is fetching the ball`;
    }
}

class Cat extends Animal {
    constructor(
        name: string,
        age: number,
        public colour: string,
    ) {
        super(name, age);
    }

    makeSound(): string {
        return 'Meow!';
    }

    scratch(): string {
        return `${this.name} is scratching the furniture`;
    }
}

// Abstract Classes
abstract class Shape {
    constructor(public colour: string) {}

    abstract calculateArea(): number;
    abstract calculatePerimeter(): number;

    describe(): string {
        return `This is a ${this.colour} shape`;
    }
}

class Rectangle extends Shape {
    constructor(
        colour: string,
        public width: number,
        public height: number,
    ) {
        super(colour);
    }

    calculateArea(): number {
        return this.width * this.height;
    }

    calculatePerimeter(): number {
        return 2 * (this.width + this.height);
    }
}

class Circle extends Shape {
    constructor(
        colour: string,
        public radius: number,
    ) {
        super(colour);
    }

    calculateArea(): number {
        return Math.PI * this.radius * this.radius;
    }

    calculatePerimeter(): number {
        return 2 * Math.PI * this.radius;
    }
}

// Static Members
class MathHelper {
    static readonly PI: number = 3.14159;
    static readonly E: number = 2.71828;

    static square(n: number): number {
        return n * n;
    }

    static cube(n: number): number {
        return n * n * n;
    }

    static calculateCircleArea(radius: number): number {
        return MathHelper.PI * radius * radius;
    }
}

// Implementing Interfaces
interface Drivable {
    speed: number;
    drive(): void;
    stop(): void;
}

interface Refuelable {
    fuel: number;
    refuel(amount: number): void;
}

class Car implements Drivable, Refuelable {
    speed: number = 0;
    fuel: number = 0;

    constructor(
        public make: string,
        public model: string,
    ) {}

    drive(): void {
        if (this.fuel > 0) {
            this.speed = 60;
            this.fuel -= 1;
            console.log(`${this.make} ${this.model} is driving at ${this.speed} mph`);
        } else {
            console.log('Out of fuel!');
        }
    }

    stop(): void {
        this.speed = 0;
        console.log(`${this.make} ${this.model} has stopped`);
    }

    refuel(amount: number): void {
        this.fuel += amount;
        console.log(`Refuelled. Current fuel: ${this.fuel} litres`);
    }
}

// Method Chaining
class QueryBuilder {
    private query: string = '';

    select(fields: string): QueryBuilder {
        this.query += `SELECT ${fields} `;
        return this;
    }

    from(table: string): QueryBuilder {
        this.query += `FROM ${table} `;
        return this;
    }

    where(condition: string): QueryBuilder {
        this.query += `WHERE ${condition} `;
        return this;
    }

    build(): string {
        return this.query.trim();
    }
}

// Basic Class
console.log('=== Basic Class ===');
const person = new Person('Alice', 30);
console.log(person.greet());

// Access Modifiers
console.log('\n=== Access Modifiers ===');
const account = new BankAccount('ACC001', 1000, 'Savings');
console.log(`Account: ${account.accountNumber}`);
account.deposit(500);
account.withdraw(200);
console.log(`Current balance: £${account.getBalance()}`);

// Getters and Setters
console.log('\n=== Getters and Setters ===');
const video = new Video('Inception', 2010, 148);
video.printItem();
video.producer = 'Sci-Fi Pictures';
console.log(`Producer: ${video.producer}`);
console.log(`Duration: ${video.duration}`);

const video2 = new Video('The Matrix', 1999, 136);
console.log(`Total videos created: ${Video.getTotalVideos()}`);

// Inheritance
console.log('\n=== Inheritance ===');
const dog = new Dog('Buddy', 5, 'Labrador');
console.log(dog.getInfo());
console.log(dog.makeSound());
console.log(dog.fetch());

const cat = new Cat('Whiskers', 3, 'Tabby');
console.log(cat.getInfo());
console.log(cat.makeSound());
console.log(cat.scratch());

// Abstract Classes
console.log('\n=== Abstract Classes ===');
const rectangle = new Rectangle('blue', 5, 10);
console.log(rectangle.describe());
console.log(`Area: ${rectangle.calculateArea()}`);
console.log(`Perimeter: ${rectangle.calculatePerimeter()}`);

const circle = new Circle('red', 7);
console.log(circle.describe());
console.log(`Area: ${circle.calculateArea().toFixed(2)}`);
console.log(`Perimeter: ${circle.calculatePerimeter().toFixed(2)}`);

// Static Members
console.log('\n=== Static Members ===');
console.log(`PI: ${MathHelper.PI}`);
console.log(`E: ${MathHelper.E}`);
console.log(`Square of 5: ${MathHelper.square(5)}`);
console.log(`Cube of 3: ${MathHelper.cube(3)}`);
console.log(`Circle area (r=4): ${MathHelper.calculateCircleArea(4).toFixed(2)}`);

// Implementing Interfaces
console.log('\n=== Implementing Interfaces ===');
const car = new Car('Tesla', 'Model 3');
car.refuel(50);
car.drive();
car.drive();
car.stop();

// Method Chaining
console.log('\n=== Method Chaining ===');
const query = new QueryBuilder().select('name, email').from('users').where('age > 18').build();
console.log(`Query: ${query}`);
