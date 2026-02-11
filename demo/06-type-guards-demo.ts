// typeof Type Guards
function processValue(value: string | number): string {
    if (typeof value === 'string') {
        return value.toUpperCase();
    } else {
        return value.toFixed(2);
    }
}

// instanceof Type Guards
class Dog {
    bark(): string {
        return 'Woof!';
    }
}

class Cat {
    meow(): string {
        return 'Meow!';
    }
}

function makeSound(animal: Dog | Cat): string {
    if (animal instanceof Dog) {
        return animal.bark();
    } else {
        return animal.meow();
    }
}

// in Operator Type Guard
interface Car {
    drive: () => void;
    wheels: number;
}

interface Boat {
    sail: () => void;
    anchors: number;
}

function operateVehicle(vehicle: Car | Boat): string {
    if ('drive' in vehicle) {
        return `Driving with ${vehicle.wheels} wheels`;
    } else {
        return `Sailing with ${vehicle.anchors} anchors`;
    }
}

// Custom Type Guards (User-Defined)
interface Fish {
    swim: () => void;
    fins: number;
}

interface Bird {
    fly: () => void;
    wings: number;
}

function isFish(pet: Fish | Bird): pet is Fish {
    return (pet as Fish).swim !== undefined;
}

function moveAnimal(animal: Fish | Bird): string {
    if (isFish(animal)) {
        return `Swimming with ${animal.fins} fins`;
    } else {
        return `Flying with ${animal.wings} wings`;
    }
}

// Discriminated Unions
interface Square {
    kind: 'square';
    size: number;
}

interface Rectangle {
    kind: 'rectangle';
    width: number;
    height: number;
}

interface Circle {
    kind: 'circle';
    radius: number;
}

type Shape = Square | Rectangle | Circle;

function calculateArea(shape: Shape): number {
    switch (shape.kind) {
        case 'square':
            return shape.size * shape.size;
        case 'rectangle':
            return shape.width * shape.height;
        case 'circle':
            return Math.PI * shape.radius * shape.radius;
    }
}

// Truthiness Narrowing
function printLength(value: string | null | undefined): void {
    if (value) {
        console.log(`Length: ${value.length}`);
    } else {
        console.log('Value is null or undefined');
    }
}

// Equality Narrowing
function compareValues(x: string | number, y: string | boolean): void {
    if (x === y) {
        console.log(`Both values are: ${x}`);
    } else {
        console.log(`x: ${x}, y: ${y}`);
    }
}

// typeof Type Guards
console.log('=== typeof Type Guards ===');
console.log(processValue('hello'));
console.log(processValue(42.6789));

// instanceof Type Guards
console.log('\n=== instanceof Type Guards ===');
const dog = new Dog();
const cat = new Cat();
console.log(makeSound(dog));
console.log(makeSound(cat));

// in Operator Type Guard
console.log('\n=== in Operator Type Guard ===');
const car: Car = {
    drive: () => console.log('Driving...'),
    wheels: 4,
};
const boat: Boat = {
    sail: () => console.log('Sailing...'),
    anchors: 2,
};
console.log(operateVehicle(car));
console.log(operateVehicle(boat));

// Custom Type Guards
console.log('\n=== Custom Type Guards ===');
const fish: Fish = {
    swim: () => console.log('Swimming...'),
    fins: 2,
};
const bird: Bird = {
    fly: () => console.log('Flying...'),
    wings: 2,
};
console.log(moveAnimal(fish));
console.log(moveAnimal(bird));

// Discriminated Unions
console.log('\n=== Discriminated Unions ===');
const square: Square = { kind: 'square', size: 5 };
const rectangle: Rectangle = { kind: 'rectangle', width: 4, height: 6 };
const circle: Circle = { kind: 'circle', radius: 3 };

console.log(`Square area: ${calculateArea(square)}`);
console.log(`Rectangle area: ${calculateArea(rectangle)}`);
console.log(`Circle area: ${calculateArea(circle).toFixed(2)}`);

// Truthiness Narrowing
console.log('\n=== Truthiness Narrowing ===');
printLength('TypeScript');
printLength(null);
printLength(undefined);

// Equality Narrowing
console.log('\n=== Equality Narrowing ===');
compareValues('hello', 'hello');
compareValues('hello', true);
compareValues(42, 'hello');
