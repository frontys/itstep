using System.Net;
using System.Net.Sockets;
using System.Text.Json;

namespace InteractiveClientServer;

public record QueryRequest(string Action, int Parameter);
public record QueryResponse(string Status, int Code, string Payload);

internal class Program
{
    private const int Port = 9310;

    private static async Task Main()
    {
        Console.WriteLine("Structured Query Client-Server Architecture");

        CancellationTokenSource cts = new CancellationTokenSource();
        Task serverTask = Task.Run(() => StartServer(cts.Token));

        await Task.Delay(200);
        await ExecuteClientQueries();

        cts.Cancel();
        await serverTask;
    }

    private static void StartServer(CancellationToken token)
    {
        TcpListener listener = new TcpListener(IPAddress.Loopback, Port);
        listener.Start();

        while (!token.IsCancellationRequested)
        {
            if (listener.Pending())
            {
                TcpClient client = listener.AcceptTcpClient();
                Task.Run(() => ProcessConnection(client));
            }
            else
            {
                Thread.Sleep(40);
            }
        }
        listener.Stop();
    }

    private static async Task ProcessConnection(TcpClient client)
    {
        using (client)
        using (NetworkStream stream = client.GetStream())
        using (StreamReader reader = new StreamReader(stream))
        using (StreamWriter writer = new StreamWriter(stream) { AutoFlush = true })
        {
            string? line = await reader.ReadLineAsync();
            if (line != null)
            {
                QueryRequest? req = JsonSerializer.Deserialize<QueryRequest>(line);
                QueryResponse response = req?.Action switch
                {
                    "SQUARE" => new QueryResponse("OK", 200, (req.Parameter * req.Parameter).ToString()),
                    "DOUBLE" => new QueryResponse("OK", 200, (req.Parameter * 2).ToString()),
                    _ => new QueryResponse("ERROR", 400, "Unknown Action")
                };
                await writer.WriteLineAsync(JsonSerializer.Serialize(response));
            }
        }
    }

    private static async Task ExecuteClientQueries()
    {
        var queries = new[] { new QueryRequest("SQUARE", 12), new QueryRequest("DOUBLE", 25) };
        foreach (var q in queries)
        {
            using TcpClient client = new TcpClient();
            await client.ConnectAsync(IPAddress.Loopback, Port);
            using NetworkStream stream = client.GetStream();
            using StreamWriter writer = new StreamWriter(stream) { AutoFlush = true };
            using StreamReader reader = new StreamReader(stream);

            await writer.WriteLineAsync(JsonSerializer.Serialize(q));
            string? raw = await reader.ReadLineAsync();
            if (raw != null)
            {
                var resp = JsonSerializer.Deserialize<QueryResponse>(raw);
                Console.WriteLine($"[Client] Query: {q.Action}({q.Parameter}) -> Code: {resp?.Code}, Payload: {resp?.Payload}");
            }
        }
    }
}