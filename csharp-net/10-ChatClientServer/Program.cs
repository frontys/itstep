using System.Collections.Concurrent;
using System.Net;
using System.Net.Sockets;
using System.Text;

namespace ChatClientServer;

internal class Program
{
    private const int Port = 9420;
    private static readonly ConcurrentDictionary<string, StreamWriter> Clients = new();

    private static async Task Main()
    {
        Console.WriteLine("Multi-Client Broadcast Chat System");

        CancellationTokenSource cts = new CancellationTokenSource();
        Task serverTask = Task.Run(() => RunServer(cts.Token));

        await Task.Delay(200);
        await RunChatSession();

        cts.Cancel();
        await serverTask;
    }

    private static void RunServer(CancellationToken token)
    {
        TcpListener listener = new TcpListener(IPAddress.Loopback, Port);
        listener.Start();

        while (!token.IsCancellationRequested)
        {
            if (listener.Pending())
            {
                TcpClient client = listener.AcceptTcpClient();
                Task.Run(() => HandleChatClient(client));
            }
            else
            {
                Thread.Sleep(30);
            }
        }
        listener.Stop();
    }

    private static async Task HandleChatClient(TcpClient client)
    {
        using (client)
        using (NetworkStream stream = client.GetStream())
        using (StreamReader reader = new StreamReader(stream, Encoding.UTF8))
        using (StreamWriter writer = new StreamWriter(stream, Encoding.UTF8) { AutoFlush = true })
        {
            string? username = await reader.ReadLineAsync();
            if (string.IsNullOrWhiteSpace(username)) return;

            Clients[username] = writer;
            Broadcast($"[Server] User '{username}' joined the room.");

            string? message;
            while ((message = await reader.ReadLineAsync()) != null)
            {
                if (message == "/quit") break;
                Broadcast($"[{username}]: {message}");
            }

            Clients.TryRemove(username, out _);
            Broadcast($"[Server] User '{username}' left the room.");
        }
    }

    private static void Broadcast(string text)
    {
        Console.WriteLine(text);
        foreach (var client in Clients.Values)
        {
            try
            {
                client.WriteLine(text);
            }
            catch {}
        }
    }

    private static async Task RunChatSession()
    {
        using TcpClient alice = new TcpClient();
        await alice.ConnectAsync(IPAddress.Loopback, Port);
        using StreamWriter aliceWriter = new StreamWriter(alice.GetStream(), Encoding.UTF8) { AutoFlush = true };

        using TcpClient bob = new TcpClient();
        await bob.ConnectAsync(IPAddress.Loopback, Port);
        using StreamWriter bobWriter = new StreamWriter(bob.GetStream(), Encoding.UTF8) { AutoFlush = true };

        await aliceWriter.WriteLineAsync("Alice");
        await bobWriter.WriteLineAsync("Bob");
        await Task.Delay(50);

        await aliceWriter.WriteLineAsync("Hello everyone!");
        await Task.Delay(50);
        await bobWriter.WriteLineAsync("Hi Alice, connection verified.");
        await Task.Delay(50);

        await aliceWriter.WriteLineAsync("/quit");
        await bobWriter.WriteLineAsync("/quit");
    }
}