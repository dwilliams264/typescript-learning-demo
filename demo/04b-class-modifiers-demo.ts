/**
 * Class Modifiers Demo
 *
 * What you'll learn:
 * - Access modifiers: public, private, protected
 * - Getters and setters
 * - Static properties and methods
 * - Readonly properties
 */

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

// Readonly Properties
class Configuration {
    readonly apiUrl: string;
    readonly version: string;
    timeout: number;

    constructor(apiUrl: string, version: string, timeout: number) {
        this.apiUrl = apiUrl;
        this.version = version;
        this.timeout = timeout;
    }

    updateTimeout(newTimeout: number): void {
        this.timeout = newTimeout;
        console.log(`Timeout updated to ${newTimeout}ms`);
    }
}

// Access Modifiers
console.log('=== Access Modifiers ===');
const account = new BankAccount('ACC001', 1000, 'Savings');
console.log(`Account: ${account.accountNumber}`);
account.deposit(500);
account.withdraw(200);
console.log(`Current balance: £${account.getBalance()}`);
account.withdraw(2000);

// Getters and Setters
console.log('\n=== Getters and Setters ===');
const video = new Video('Inception', 2010, 148);
video.printItem();
video.producer = 'Sci-Fi Pictures';
console.log(`Producer: ${video.producer}`);
console.log(`Duration: ${video.duration}`);

const video2 = new Video('The Matrix', 1999, 136);
console.log(`Total videos created: ${Video.getTotalVideos()}`);

// Static Members
console.log('\n=== Static Members ===');
console.log(`PI: ${MathHelper.PI}`);
console.log(`E: ${MathHelper.E}`);
console.log(`Square of 5: ${MathHelper.square(5)}`);
console.log(`Cube of 3: ${MathHelper.cube(3)}`);
console.log(`Circle area (r=4): ${MathHelper.calculateCircleArea(4).toFixed(2)}`);

// Readonly Properties
console.log('\n=== Readonly Properties ===');
const config = new Configuration('https://api.example.com', '1.0.0', 5000);
console.log(`API URL: ${config.apiUrl} (readonly)`);
console.log(`Version: ${config.version} (readonly)`);
console.log(`Timeout: ${config.timeout}ms`);
config.updateTimeout(10000);
