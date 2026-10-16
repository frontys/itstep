using System.Diagnostics;

namespace ParallelProcessing;

internal class Program
{
    private static void Main()
    {
        Console.WriteLine("Parallel Processing Demonstration");

        int[] numbers = Enumerable.Range(1, 1000000).ToArray();
        long sum = 0;
        object lockObj = new object();

        Stopwatch sw = Stopwatch.StartNew();
        Parallel.For(0, numbers.Length, i =>
        {
            if (numbers[i] % 2 == 0)
            {
                lock (lockObj)
                {
                    sum += numbers[i];
                }
            }
        });
        sw.Stop();
        Console.WriteLine($"Parallel.For Sum: {sum} (Elapsed: {sw.ElapsedMilliseconds}ms)");

        List<string> words = new List<string> { "data", "stream", "buffer", "socket", "network", "parallel", "thread" };
        Parallel.ForEach(words, word =>
        {
            string upper = word.ToUpperInvariant();
            Console.WriteLine($"Processed '{word}' -> '{upper}' on Thread {Environment.CurrentManagedThreadId}");
        });

        Parallel.Invoke(
            () => ExecuteTask("Task Alpha"),
            () => ExecuteTask("Task Beta"),
            () => ExecuteTask("Task Gamma")
        );

        var plinqResult = numbers.AsParallel()
            .WithDegreeOfParallelism(Environment.ProcessorCount)
            .Where(n => n % 100000 == 0)
            .Select(n => n * 2)
            .ToList();

        Console.WriteLine($"PLINQ Matches: {plinqResult.Count}");
        foreach (int item in plinqResult)
        {
            Console.WriteLine($"PLINQ Value: {item}");
        }
    }

    private static void ExecuteTask(string name)
    {
        Thread.Sleep(50);
        Console.WriteLine($"Executed {name} on Thread {Environment.CurrentManagedThreadId}");
    }
}