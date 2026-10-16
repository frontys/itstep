using System.Net;
using System.Net.Sockets;
using System.Text;

namespace AsyncNetworkApp;

internal class Program
{
    private const int Port = 9530;

    private static async Task Main()
    {
        Console.WriteLine("High-Throughput Asynchronous Network Server");

        using CancellationTokenSource cts = new CancellationTokenSource();
        Task serverTask = RunAsyncServer(cts.Token);

        await Task.Delay(200);
        await RunAsyncClients(10);

        cts.Cancel();
        try
        {
            await serverTask;
        }
        catch (OperationCanceledException) {}
    }

    private static async Task RunAsyncServer(CancellationToken token)
    {
        TcpListener listener = new TcpListener(IPAddress.Loopback, Port);
        listener.Start();

        try
        {
            while (!token.IsCancellationRequested)
            {
                TcpClient client = await listener.AcceptTcpClientAsync(token);
                _ = ProcessClientPipelineAsync(client, token);
            }
        }
        finally
        {
            listener.Stop();
        }
    }

    private static async Task ProcessClientPipelineAsync(TcpClient client, CancellationToken token)
    {
        using (client)
        using (NetworkStream stream = client.GetStream())
        {
            byte[] buffer = new byte[512];
            int read = await stream.ReadAsync(buffer, 0, buffer.Length, token);
            if (read > 0)
            {
                string msg = Encoding.UTF8.GetString(buffer, 0, read);
                byte[] reply = Encoding.UTF8.GetBytes($"ASYNC_RESPONSE: {msg.ToUpperInvariant()}");
                await stream.WriteAsync(reply, 0, reply.Length, token);
            }
        }
    }

    private static async Task RunAsyncClients(int count)
    {
        List<Task> tasks = new List<Task>();
        for (int i = 0; i < count; i++)
        {
            int id = i;
            tasks.Add(Task.Run(async () =>
            {
                using TcpClient client = new TcpClient();
                await client.ConnectAsync(IPAddress.Loopback, Port);
                using NetworkStream stream = client.GetStream();

                byte[] data = Encoding.UTF8.GetBytes($"Packet_{id}");
                await stream.WriteAsync(data, 0, data.Length);

                byte[] buffer = new byte[512];
                int read = await stream.ReadAsync(buffer, 0, buffer.Length);
                string res = Encoding.UTF8.GetString(buffer, 0, read);
                Console.WriteLine($"[Client {id}] Sent Packet_{id} | Received: {res}");
            }));
        }
        await Task.WhenAll(tasks);
    }
}