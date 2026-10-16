using System;
using System.Collections.Generic;
using System.Threading;

namespace LockSynchronization;

public class BankAccount
{
    private readonly object _syncRoot = new();
    private decimal _balance;

    public BankAccount(decimal initialBalance)
    {
        _balance = initialBalance;
    }

    public decimal Balance
    {
        get
        {
            lock (_syncRoot)
            {
                return _balance;
            }
        }
    }

    public void Deposit(decimal amount)
    {
        lock (_syncRoot)
        {
            _balance += amount;
        }
    }

    public bool Withdraw(decimal amount)
    {
        lock (_syncRoot)
        {
            if (_balance >= amount)
            {
                _balance -= amount;
                return true;
            }
            return false;
        }
    }
}

public class ThreadSafeCounter
{
    private readonly object _lockObj = new();
    private int _count;

    public int Value
    {
        get
        {
            lock (_lockObj)
            {
                return _count;
            }
        }
    }

    public void Increment()
    {
        lock (_lockObj)
        {
            _count++;
        }
    }

    public void Decrement()
    {
        lock (_lockObj)
        {
            _count--;
        }
    }
}

public class Program
{
    public static void Main()
    {
        Console.WriteLine("=== Lock Synchronization Demo ===");

        RunCounterTest();
        RunBankTest();

        Console.WriteLine("Execution finished successfully.");
    }

    private static void RunCounterTest()
    {
        var counter = new ThreadSafeCounter();
        const int threadCount = 10;
        const int operationsPerThread = 10000;
        var threads = new List<Thread>();

        for (var i = 0; i < threadCount; i++)
        {
            var t = new Thread(() =>
            {
                for (var j = 0; j < operationsPerThread; j++)
                {
                    counter.Increment();
                }
            });
            threads.Add(t);
            t.Start();
        }

        foreach (var t in threads)
        {
            t.Join();
        }

        Console.WriteLine($"Counter Expected: {threadCount * operationsPerThread}, Actual: {counter.Value}");
    }

    private static void RunBankTest()
    {
        var account = new BankAccount(1000m);
        var threads = new List<Thread>();

        for (var i = 0; i < 5; i++)
        {
            var t1 = new Thread(() =>
            {
                for (var j = 0; j < 100; j++)
                {
                    account.Deposit(10m);
                }
            });

            var t2 = new Thread(() =>
            {
                for (var j = 0; j < 100; j++)
                {
                    account.Withdraw(10m);
                }
            });

            threads.Add(t1);
            threads.Add(t2);
            t1.Start();
            t2.Start();
        }

        foreach (var t in threads)
        {
            t.Join();
        }

        Console.WriteLine($"Bank Account Expected: 1000, Actual: {account.Balance}");
    }
}
