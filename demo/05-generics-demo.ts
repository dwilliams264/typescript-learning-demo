// Generic Functions
function identity<T>(arg: T): T {
    return arg;
}

function getFirstElement<T>(arr: T[]): T | undefined {
    return arr[0];
}

function reverseArray<T>(arr: T[]): T[] {
    return arr.reverse();
}

// Generic Interfaces
interface Box<T> {
    value: T;
    getValue: () => T;
}

interface Pair<K, V> {
    key: K;
    value: V;
}

// Generic Classes
class DataStore<T> {
    private data: T[] = [];

    addItem(item: T): void {
        this.data.push(item);
    }

    getItems(): T[] {
        return this.data;
    }

    removeItem(item: T): void {
        const index = this.data.indexOf(item);
        if (index > -1) {
            this.data.splice(index, 1);
        }
    }
}

// Generic Constraints
interface Lengthwise {
    length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
    console.log(`Length: ${arg.length}`);
    return arg;
}

// Multiple Type Parameters
function merge<T, U>(obj1: T, obj2: U): T & U {
    return { ...obj1, ...obj2 };
}

// Generic Constraints with keyof
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

// Generic Functions
console.log('=== Generic Functions ===');
console.log(identity<string>('Hello'));
console.log(identity<number>(42));
console.log(identity({ name: 'Alice', age: 30 }));

const numbers = [1, 2, 3, 4, 5];
const firstNumber = getFirstElement(numbers);
console.log(`First number: ${firstNumber}`);

const names = ['Alice', 'Bob', 'Charlie'];
const firstName = getFirstElement(names);
console.log(`First name: ${firstName}`);

console.log(`Reversed numbers: [${reverseArray([...numbers]).join(', ')}]`);

// Generic Interfaces
console.log('\n=== Generic Interfaces ===');
const stringBox: Box<string> = {
    value: 'TypeScript',
    getValue: function () {
        return this.value;
    },
};
console.log(`Box value: ${stringBox.getValue()}`);

const numberPair: Pair<string, number> = {
    key: 'age',
    value: 25,
};
console.log(`Pair: ${numberPair.key} = ${numberPair.value}`);

// Generic Classes
console.log('\n=== Generic Classes ===');
const stringStore = new DataStore<string>();
stringStore.addItem('Apple');
stringStore.addItem('Banana');
stringStore.addItem('Cherry');
console.log(`String store: [${stringStore.getItems().join(', ')}]`);
stringStore.removeItem('Banana');
console.log(`After removal: [${stringStore.getItems().join(', ')}]`);

const numberStore = new DataStore<number>();
numberStore.addItem(10);
numberStore.addItem(20);
numberStore.addItem(30);
console.log(`Number store: [${numberStore.getItems().join(', ')}]`);

// Generic Constraints
console.log('\n=== Generic Constraints ===');
logLength('Hello, World!');
logLength([1, 2, 3, 4, 5]);
logLength({ length: 10, value: 'test' });

// Multiple Type Parameters
console.log('\n=== Multiple Type Parameters ===');
const merged = merge({ name: 'Alice' }, { age: 30, city: 'London' });
console.log(`Merged: ${JSON.stringify(merged)}`);

// keyof Constraint
console.log('\n=== keyof Constraint ===');
const person = { name: 'Bob', age: 25, country: 'UK' };
console.log(`Name: ${getProperty(person, 'name')}`);
console.log(`Age: ${getProperty(person, 'age')}`);
