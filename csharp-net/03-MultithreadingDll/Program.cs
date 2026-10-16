namespace MultithreadingDll;

public class MathWorker
{
    public static long ComputeFactorial(int n)
    {
        long result = 1;
        for (int i = 2; i <= n; i++)
        {
            result *= i;
        }
        return result;
    }

    public static double[] CalculateSquares(double[] input)
    {
        double[] output = new double[input.Length];
        Parallel.For(0, input.Length, i =>
        {
            output[i] = Math.Pow(input[i], 2);
        });
        return output;
    }

    public static async Task<int> ProcessDataAsync(int delayMs)
    {
        await Task.Delay(delayMs);
        return delayMs * 2;
    }
}

internal class Program
{
    private static async Task Main()
    {
        Console.WriteLine("Multithreading with Modular Component Demonstration");

        Thread t1 = new Thread(() =>
        {
            long fact = MathWorker.ComputeFactorial(15);
            Console.WriteLine($"Thread 1 Factorial(15) = {fact}");
        });

        Thread t2 = new Thread(() =>
        {
            double[] data = new double[] { 2.5, 4.0, 6.5, 8.0, 10.0 };
            double[] squares = MathWorker.CalculateSquares(data);
            Console.WriteLine($"Thread 2 Computed Squares: {string.Join(", ", squares)}");
        });

        t1.Start();
        t2.Start();
        t1.Join();
        t2.Join();

        int asyncResult = await MathWorker.ProcessDataAsync(100);
        Console.WriteLine($"Async Task Result: {asyncResult}");
    }
}