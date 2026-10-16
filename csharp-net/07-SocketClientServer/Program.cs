using System.Net;
using System.Net.Sockets;
using System.Text;

namespace SocketClientServer;

internal class Program
{
    private const int Port = 9123;

    private static async Task Main()
    {
        Console.WriteLine("Raw TCP Socket Client-Server System");

        CancellationTokenSource cts = new CancellationTokenSource();
        Task serverTask = Task.Run(() => RunServer(cts.Token));

        await Task.Delay(200);
        await RunClient();

        cts.Cancel();
        await serverTask;
    }

    private static void RunServer(CancellationToken token)
    {
        IPEndPoint endPoint = new IPEndPoint(IPAddress.Loopback, Port);
        using Socket listener = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
        listener.Bind(endPoint);
        listener.Listen(5);
        Console.WriteLine($"[Server] Socket bound to {endPoint} and listening.");

        while (!token.IsCancellationRequested)
        {
            try
            {
                if (listener.Poll(100000, SelectMode.SelectRead))
                {
                    using Socket clientSocket = listener.Accept();
                    Console.WriteLine($"[Server] Accepted connection from {clientSocket.RemoteEndPoint}");

                    byte[] buffer = new byte[1024];
                    int bytesReceived = clientSocket.Receive(buffer);
                    string request = Encoding.UTF8.GetString(buffer, 0, bytesReceived);
                    Console.WriteLine($"[Server] Received: '{request}'");

                    string response = request.ToUpperInvariant() switch
                    {
                        "TIME" => DateTime.UtcNow.ToString("O"),
                        "PING" => "PONG",
                        _ => $"ACK: {request}"
                    };

                    byte[] responseBytes = Encoding.UTF8.GetBytes(response);
                    clientSocket.Send(responseBytes);
                    clientSocket.Shutdown(SocketShutdown.Both);
                }
            }
            catch (SocketException)
            {
                break;
            }
        }
    }

    private static async Task RunClient()
    {
        string[] commands = new[] { "PING", "TIME", "Hello Socket Server" };

        foreach (string cmd in commands)
        {
            using Socket client = new Socket(AddressFamily.InterNetwork, SocketType.Stream, ProtocolType.Tcp);
            client.Connect(new IPEndPoint(IPAddress.Loopback, Port));

            byte[] message = Encoding.UTF8.GetBytes(cmd);
            client.Send(message);

            byte[] buffer = new byte[1024];
            int received = client.Receive(buffer);
            string response = Encoding.UTF8.GetString(buffer, 0, received);

            Console.WriteLine($"[Client] Sent: '{cmd}' | Received: '{response}'");
            client.Shutdown(SocketShutdown.Both);
            await Task.Delay(50);
        }
    }
}