using System.Net;
using System.Net.Sockets;
using System.Text;

namespace NewsAndQuoteServer;

internal class Program
{
    private const int Port = 9640;
    private static readonly List<string> News = new()
    {
        "Network programming efficiency increased by 40%",
        "New async streaming API announced in modern runtimes",
        "High availability microservices architecture best practices"
    };

    private static readonly List<string> Quotes = new()
    {
        "Simplicity is prerequisite for reliability.",
        "Code is like humor. When you have to explain it, it is bad.",
        "First, solve the problem. Then, write the code."
    };

    private static async Task Main()
    {
        Console.WriteLine("News & Quotes Distribution Server");

        await File.WriteAllLinesAsync("news.txt", News);
        await File.WriteAllLinesAsync("quotes.txt", Quotes);
        Console.WriteLine($"Saved {News.Count} news and {Quotes.Count} quotes to local storage.");

        var foundQuotes = Quotes.Where(q => q.Contains("code", StringComparison.OrdinalIgnoreCase)).ToList();
        Console.WriteLine($"Found {foundQuotes.Count} quotes matching keyword 'code':");
        foreach (var q in foundQuotes)
        {
            Console.WriteLine($" - {q}");
        }

        using CancellationTokenSource cts = new CancellationTokenSource();
        Task serverTask = RunServer(cts.Token);

        await Task.Delay(200);
        await FetchFromNewsServer();

        cts.Cancel();
        await serverTask;

        if (File.Exists("news.txt")) File.Delete("news.txt");
        if (File.Exists("quotes.txt")) File.Delete("quotes.txt");
    }

    private static async Task RunServer(CancellationToken token)
    {
        TcpListener listener = new TcpListener(IPAddress.Loopback, Port);
        listener.Start();

        while (!token.IsCancellationRequested)
        {
            if (listener.Pending())
            {
                using TcpClient client = await listener.AcceptTcpClientAsync();
                using NetworkStream stream = client.GetStream();
                using StreamWriter writer = new StreamWriter(stream, Encoding.UTF8) { AutoFlush = true };
                foreach (string item in News)
                {
                    await writer.WriteLineAsync(item);
                }
            }
            else
            {
                await Task.Delay(40);
            }
        }
        listener.Stop();
    }

    private static async Task FetchFromNewsServer()
    {
        using TcpClient client = new TcpClient();
        await client.ConnectAsync(IPAddress.Loopback, Port);
        using NetworkStream stream = client.GetStream();
        using StreamReader reader = new StreamReader(stream, Encoding.UTF8);

        Console.WriteLine("[Client] Fetched live news feed from server:");
        string? line;
        while ((line = await reader.ReadLineAsync()) != null)
        {
            Console.WriteLine($" -> {line}");
        }
    }
}