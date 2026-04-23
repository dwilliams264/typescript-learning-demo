/**
 * Async Exercise
 *
 * Complete the following async functions.
 * Run this file to see which tests pass!
 */

// Exercise 1: Delay Function
// TODO: Implement a delay function that returns a promise that resolves after ms milliseconds
function delay(ms: number): Promise<void> {
    // YOUR CODE HERE
    return Promise.resolve();
}

// Exercise 2: Fetch with Timeout
// TODO: Implement a function that races a promise against a timeout
// Return the promise result if it completes first, otherwise throw "Timeout"
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    // YOUR CODE HERE
    return promise;
}

// Exercise 3: Parallel Execution
// TODO: Implement a function that runs multiple async functions in parallel
// Return an array of all results
async function parallel<T>(tasks: Array<() => Promise<T>>): Promise<T[]> {
    // YOUR CODE HERE
    return [];
}

// ==================== TESTS ====================
console.log('=== Async Exercise Tests ===\n');

(async () => {
    // Test 1: Delay
    console.log('Test 1: Delay');
    try {
        console.log('Starting delay...');
        await delay(1000);
        console.log('✓ PASS: Delay completed\n');
    } catch (e) {
        console.log('✗ FAIL: Delay error\n');
    }

    // Test 2: Timeout
    console.log('Test 2: Timeout');
    try {
        const quick = withTimeout(
            delay(500).then(() => 'success'),
            1000,
        );
        console.log(`Result: ${await quick}`);
        console.log('✓ PASS: Timeout works\n');
    } catch (e) {
        console.log('✗ FAIL: Timeout error\n');
    }

    // Test 3: Parallel
    console.log('Test 3: Parallel');
    try {
        const tasks = [
            async () => {
                await delay(100);
                return 'Task 1';
            },
            async () => {
                await delay(50);
                return 'Task 2';
            },
            async () => {
                await delay(150);
                return 'Task 3';
            },
        ];
        const results = await parallel(tasks);
        console.log(`Results: [${results}]`);
        console.log('✓ PASS: Parallel execution works\n');
    } catch (e) {
        console.log('✗ FAIL: Parallel error\n');
    }

    console.log('=== End of Tests ===');
    console.log('Check the solution file (13d-async-solution.ts) if you need help!');
})();
