// Numeric Enums
enum Direction {
    Up = 1,
    Down,
    Left,
    Right,
}

enum Status {
    Pending,
    InProgress,
    Completed,
    Cancelled,
}

function move(direction: Direction): string {
    switch (direction) {
        case Direction.Up:
            return 'Moving up';
        case Direction.Down:
            return 'Moving down';
        case Direction.Left:
            return 'Moving left';
        case Direction.Right:
            return 'Moving right';
    }
}

// String Enums
enum LogLevel {
    Error = 'ERROR',
    Warning = 'WARNING',
    Info = 'INFO',
    Debug = 'DEBUG',
}

enum HttpMethod {
    Get = 'GET',
    Post = 'POST',
    Put = 'PUT',
    Delete = 'DELETE',
    Patch = 'PATCH',
}

function logMessage(level: LogLevel, message: string): string {
    return `[${level}] ${message}`;
}

// Heterogeneous Enums (Mixed)
enum Response {
    No = 0,
    Yes = 'YES',
}

// Computed and Constant Members
enum FileAccess {
    None,
    Read = 1 << 1,
    Write = 1 << 2,
    ReadWrite = Read | Write,
    Delete = 1 << 3,
}

// Const Enums
const enum Colour {
    Red,
    Green,
    Blue,
}

function getColourName(colour: Colour): string {
    switch (colour) {
        case Colour.Red:
            return 'Red';
        case Colour.Green:
            return 'Green';
        case Colour.Blue:
            return 'Blue';
    }
}

// Enum as Object
enum Environment {
    Development = 'dev',
    Staging = 'staging',
    Production = 'prod',
}

function getEnvironmentConfig(env: Environment): string {
    const configs: Record<Environment, string> = {
        [Environment.Development]: 'http://localhost:3000',
        [Environment.Staging]: 'https://staging.example.com',
        [Environment.Production]: 'https://example.com',
    };
    return configs[env];
}

// Reverse Mapping (Numeric Enums Only)
function printEnumKeys(enumObj: any): void {
    const keys = Object.keys(enumObj).filter((key) => isNaN(Number(key)));
    console.log(`Keys: [${keys.join(', ')}]`);
}

// Numeric Enums
console.log('=== Numeric Enums ===');
console.log(move(Direction.Up));
console.log(move(Direction.Right));
console.log(`Direction.Up value: ${Direction.Up}`);
console.log(`Direction.Down value: ${Direction.Down}`);

console.log(`Status.Pending: ${Status.Pending}`);
console.log(`Status.Completed: ${Status.Completed}`);

// String Enums
console.log('\n=== String Enums ===');
console.log(logMessage(LogLevel.Error, 'System failure'));
console.log(logMessage(LogLevel.Info, 'Application started'));
console.log(`HTTP method: ${HttpMethod.Get}`);
console.log(`HTTP method: ${HttpMethod.Post}`);

// Heterogeneous Enums
console.log('\n=== Heterogeneous Enums ===');
console.log(`Response.No: ${Response.No}`);
console.log(`Response.Yes: ${Response.Yes}`);

// Computed Constants
console.log('\n=== Computed and Constant Members ===');
console.log(`FileAccess.None: ${FileAccess.None}`);
console.log(`FileAccess.Read: ${FileAccess.Read}`);
console.log(`FileAccess.Write: ${FileAccess.Write}`);
console.log(`FileAccess.ReadWrite: ${FileAccess.ReadWrite}`);
console.log(`FileAccess.Delete: ${FileAccess.Delete}`);

// Const Enums
console.log('\n=== Const Enums ===');
console.log(getColourName(Colour.Red));
console.log(getColourName(Colour.Green));
console.log(getColourName(Colour.Blue));

// Enum as Object
console.log('\n=== Enum as Object ===');
console.log(`Dev config: ${getEnvironmentConfig(Environment.Development)}`);
console.log(`Staging config: ${getEnvironmentConfig(Environment.Staging)}`);
console.log(`Production config: ${getEnvironmentConfig(Environment.Production)}`);

// Reverse Mapping
console.log('\n=== Reverse Mapping ===');
console.log(`Direction[1]: ${Direction[1]}`);
console.log(`Direction[2]: ${Direction[2]}`);
printEnumKeys(Direction);
printEnumKeys(Status);
