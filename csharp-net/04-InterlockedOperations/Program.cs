namespace InterlockedOperations;

internal class Program
{
    private static long counter = 0;
    private static int activeState = 0;
    private static long accumulatedValue = 0;

    private static void Main()
    {
        Console.WriteLine("Interlocked Thread Synchronization Demonstration");

        const int threadCount = 20;
        const int iterations = 50000;
        Thread[] threads = new Thread[threadCount];

        for (int i = 0; i < threadCount; i++)
        {
            threads[i] = new Thread(() =>
            {
                for (int j = 0; j < iterations; j++)
                {
                    Interlocked.Increment(ref counter);
                    Interlocked.Add(ref accumulatedValue, 2);
                }
            });
            threads[i].Start();
        }

        foreach (Thread t in threads)
        {
            t.Join();
        }

        Console.WriteLine($"Expected Counter: {threadCount * iterations}");
        Console.WriteLine($"Actual Interlocked Counter: {Interlocked.Read(ref counter)}");
        Console.WriteLine($"Actual Accumulated Value: {Interlocked.Read(ref accumulatedValue)}");

        int initial = Interlocked.CompareExchange(ref activeState, 1, 0);
        Console.WriteLine($"CompareExchange (0 -> 1) Result Initial: {initial}, Current: {activeState}");

        int swapped = Interlocked.Exchange(ref activeState, 99);
        Console.WriteLine($"Exchange (Current -> 99) Previous: {swapped}, New: {activeState}");
    }
}