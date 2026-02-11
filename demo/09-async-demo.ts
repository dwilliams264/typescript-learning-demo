// Basic Promise
function fetchUserData(userId: number): Promise<string> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (userId > 0) {
                resolve(`User ${userId} data fetched`);
            } else {
                reject('Invalid user ID');
            }
        }, 1000);
    });
}

// Promise Chaining
function processOrder(orderId: number): Promise<string> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(`Order ${orderId} validated`), 500);
    });
}

function chargePayment(orderId: number): Promise<string> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(`Payment for order ${orderId} processed`), 500);
    });
}

function shipOrder(orderId: number): Promise<string> {
    return new Promise((resolve) => {
        setTimeout(() => resolve(`Order ${orderId} shipped`), 500);
    });
}

// Async/Await
async function getUserProfile(userId: number): Promise<string> {
    try {
        const userData = await fetchUserData(userId);
        return `Profile: ${userData}`;
    } catch (error) {
        return `Error: ${error}`;
    }
}

// Multiple Async Operations
async function fetchMultipleUsers(userIds: number[]): Promise<string[]> {
    const promises = userIds.map((id) => fetchUserData(id));
    return Promise.all(promises);
}

// Async with Error Handling
async function performTask(shouldFail: boolean): Promise<string> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject('Task failed');
            } else {
                resolve('Task completed successfully');
            }
        }, 500);
    });
}

async function runTaskWithRetry(maxRetries: number): Promise<string> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const result = await performTask(attempt < maxRetries);
            return result;
        } catch (error) {
            console.log(`Attempt ${attempt} failed: ${error}`);
            if (attempt === maxRetries) {
                throw new Error(`Failed after ${maxRetries} attempts`);
            }
        }
    }
    return 'Unexpected completion';
}

// Promise.race
function timeout(ms: number): Promise<never> {
    return new Promise((_, reject) => {
        setTimeout(() => reject('Operation timed out'), ms);
    });
}

async function fetchWithTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return Promise.race([promise, timeout(ms)]);
}

// Async Generator
async function* generateNumbers(count: number): AsyncGenerator<number> {
    for (let i = 1; i <= count; i++) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        yield i;
    }
}

// Type-safe Async Operations
interface DataResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

async function fetchData<T>(url: string): Promise<DataResponse<T>> {
    try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const mockData = { id: 1, name: 'Sample Data' } as unknown as T;
        return { success: true, data: mockData };
    } catch (error) {
        return { success: false, error: String(error) };
    }
}

// Parallel vs Sequential
async function sequentialExecution(): Promise<string> {
    const start = Date.now();
    await fetchUserData(1);
    await fetchUserData(2);
    await fetchUserData(3);
    const duration = Date.now() - start;
    return `Sequential: ${duration}ms`;
}

async function parallelExecution(): Promise<string> {
    const start = Date.now();
    await Promise.all([fetchUserData(1), fetchUserData(2), fetchUserData(3)]);
    const duration = Date.now() - start;
    return `Parallel: ${duration}ms`;
}

// Execute Demos
(async () => {
    console.log('=== Basic Promise ===');
    try {
        const result = await fetchUserData(42);
        console.log(result);
    } catch (error) {
        console.log(`Error: ${error}`);
    }

    console.log('\n=== Promise Chaining ===');
    await processOrder(100)
        .then((result) => {
            console.log(result);
            return chargePayment(100);
        })
        .then((result) => {
            console.log(result);
            return shipOrder(100);
        })
        .then((result) => {
            console.log(result);
        })
        .catch((error) => console.log(`Error: ${error}`));

    console.log('\n=== Async/Await ===');
    const profile = await getUserProfile(123);
    console.log(profile);

    console.log('\n=== Multiple Async Operations ===');
    const users = await fetchMultipleUsers([1, 2, 3]);
    users.forEach((user) => console.log(user));

    console.log('\n=== Async with Retry ===');
    try {
        const result = await runTaskWithRetry(3);
        console.log(result);
    } catch (error) {
        console.log(`Final error: ${error}`);
    }

    console.log('\n=== Promise.race with Timeout ===');
    try {
        const result = await fetchWithTimeout(fetchUserData(456), 2000);
        console.log(result);
    } catch (error) {
        console.log(`Error: ${error}`);
    }

    console.log('\n=== Async Generator ===');
    for await (const num of generateNumbers(5)) {
        console.log(`Generated: ${num}`);
    }

    console.log('\n=== Type-safe Async ===');
    const response = await fetchData<{ id: number; name: string }>('/api/data');
    if (response.success) {
        console.log(`Data: ${JSON.stringify(response.data)}`);
    } else {
        console.log(`Error: ${response.error}`);
    }

    console.log('\n=== Parallel vs Sequential ===');
    console.log(await sequentialExecution());
    console.log(await parallelExecution());
})();
