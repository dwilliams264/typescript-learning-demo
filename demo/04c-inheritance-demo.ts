/**
 * Inheritance Demo
 *
 * What you'll learn:
 * - Extending classes with 'extends'
 * - Method overriding
 * - Abstract classes and methods
 * - Implementing interfaces
 * - Method chaining
 */

// Inheritance
class ClassAnimal {
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

class ClassDog extends ClassAnimal {
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

class ClassCat extends ClassAnimal {
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
abstract class ClassShape {
    constructor(public colour: string) {}

    abstract calculateArea(): number;
    abstract calculatePerimeter(): number;

    describe(): string {
        return `This is a ${this.colour} shape`;
    }
}

class ClassRectangle extends ClassShape {
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

class ClassCircle extends ClassShape {
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

// Inheritance
console.log('=== Inheritance ===');
const dog = new ClassDog('Buddy', 5, 'Labrador');
console.log(dog.getInfo());
console.log(dog.makeSound());
console.log(dog.fetch());

const cat = new ClassCat('Whiskers', 3, 'Tabby');
console.log(cat.getInfo());
console.log(cat.makeSound());
console.log(cat.scratch());

// Abstract Classes
console.log('\n=== Abstract Classes ===');
const rectangle = new ClassRectangle('blue', 5, 10);
console.log(rectangle.describe());
console.log(`Area: ${rectangle.calculateArea()}`);
console.log(`Perimeter: ${rectangle.calculatePerimeter()}`);

const circle = new ClassCircle('red', 7);
console.log(circle.describe());
console.log(`Area: ${circle.calculateArea().toFixed(2)}`);
console.log(`Perimeter: ${circle.calculatePerimeter().toFixed(2)}`);

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

const query2 = new QueryBuilder().select('product_name, price').from('products').where('price < 100').build();
console.log(`Query 2: ${query2}`);
