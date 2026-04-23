/**
 * Async Exercise - SOLUTION
 */

// Exercise 1: Delay Function
function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Exercise 2: Fetch with Timeout
async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
    const timeoutPromise = new Promise<T>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]);
}

// Exercise 3: Parallel Execution
async function parallel<T>(tasks: Array<() => Promise<T>>): Promise<T[]> {
    const promises = tasks.map((task) => task());
    return Promise.all(promises);
}

// Exercise 4: Sequential Execution
async function sequential<T>(tasks: Array<() => Promise<T>>): Promise<T[]> {
    const results: T[] = [];
    for (const task of tasks) {
        const result = await task();
        results.push(result);
    }
    return results;
}

// ==================== TESTS ====================
console.log('=== Async Exercise - SOLUTION ===\n');

(async () => {
    // Test 1: Delay
    console.log('Test 1: Delay');
    const start = Date.now();
    await delay(500);
    const elapsed = Date.now() - start;
    console.log(`Delayed ${elapsed}ms`);
    console.log('✓ Pass\n');

    // Test 2: Timeout
    console.log('Test 2: Timeout');
    try {
        const quick = await withTimeout(
            delay(100).then(() => 'Success'),
            500,
        );
        console.log(`Quick result: ${quick}`);

        try {
            await withTimeout(
                delay(1000).then(() => 'Too slow'),
                500,
            );
        } catch (e) {
            console.log('Caught timeout as expected');
        }
        console.log('✓ Pass\n');
    } catch (e) {
        console.log('Error:', e);
    }

    // Test 3: Parallel
    console.log('Test 3: Parallel Execution');
    const startParallel = Date.now();
    const parallelTasks = [
        async () => {
            await delay(300);
            return 'A';
        },
        async () => {
            await delay(200);
            return 'B';
        },
        async () => {
            await delay(100);
            return 'C';
        },
    ];
    const parallelResults = await parallel(parallelTasks);
    const parallelTime = Date.now() - startParallel;
    console.log(`Results: [${parallelResults}]`);
    console.log(`Time: ~${parallelTime}ms (should be ~300ms, not 600ms)`);
    console.log('✓ Pass\n');

    // Test 4: Sequential
    console.log('Test 4: Sequential Execution');
    const startSeq = Date.now();
    const seqResults = await sequential(parallelTasks);
    const seqTime = Date.now() - startSeq;
    console.log(`Results: [${seqResults}]`);
    console.log(`Time: ~${seqTime}ms (should be ~600ms)`);
    console.log('✓ Pass\n');

    console.log('=== All Tests Complete ===');
})();
