using System.Net;
using System.Net.Sockets;
using System.Text;

namespace TcpClientServerApp;

internal class Program
{
    private const int Port = 9245;

    private static async Task Main()
    {
        Console.WriteLine("TcpListener and TcpClient Application");

        CancellationTokenSource cts = new CancellationTokenSource();
        Task serverTask = Task.Run(() => RunServer(cts.Token));

        await Task.Delay(200);
        await RunClients();

        cts.Cancel();
        await serverTask;
    }

    private static void RunServer(CancellationToken token)
    {
        TcpListener listener = new TcpListener(IPAddress.Loopback, Port);
        listener.Start();
        Console.WriteLine($"[Server] TcpListener running on port {Port}");

        while (!token.IsCancellationRequested)
        {
            if (listener.Pending())
            {
                TcpClient client = listener.AcceptTcpClient();
                ThreadPool.QueueUserWorkItem(_ => HandleClient(client));
            }
            else
            {
                Thread.Sleep(50);
            }
        }
        listener.Stop();
    }

    private static void HandleClient(TcpClient client)
    {
        using (client)
        using (NetworkStream stream = client.GetStream())
        using (StreamReader reader = new StreamReader(stream, Encoding.UTF8))
        using (StreamWriter writer = new StreamWriter(stream, Encoding.UTF8) { AutoFlush = true })
        {
            string? command = reader.ReadLine();
            if (command != null)
            {
                string result = command switch
                {
                    "STATUS" => "STATUS_OK 200",
                    "ECHO" => "ECHO_OK",
                    _ => $"PROCESSED: {command}"
                };
                writer.WriteLine(result);
            }
        }
    }

    private static async Task RunClients()
    {
        for (int i = 1; i <= 3; i++)
        {
            using TcpClient client = new TcpClient();
            await client.ConnectAsync(IPAddress.Loopback, Port);
            using NetworkStream stream = client.GetStream();
            using StreamWriter writer = new StreamWriter(stream, Encoding.UTF8) { AutoFlush = true };
            using StreamReader reader = new StreamReader(stream, Encoding.UTF8);

            string req = i == 1 ? "STATUS" : (i == 2 ? "ECHO" : "SAMPLE_PAYLOAD");
            await writer.WriteLineAsync(req);
            string? res = await reader.ReadLineAsync();
            Console.WriteLine($"[Client #{i}] Sent: {req} -> Server Replied: {res}");
        }
    }
}