using System.Net;
using System.Net.Sockets;
using System.Security.Cryptography;
using System.Text;

namespace NetworkExamProject;

public record FilePacket(string FileName, byte[] Content, string Sha256Checksum);

internal class Program
{
    private const int Port = 9750;

    private static async Task Main()
    {
        Console.WriteLine("Network Programming Final Exam Project");
        Console.WriteLine("High-Performance File & Message Transport Hub");

        using CancellationTokenSource cts = new CancellationTokenSource();
        Task serverTask = Task.Run(() => StartServer(cts.Token));

        await Task.Delay(200);
        await ExecuteExamTransmission();

        cts.Cancel();
        await serverTask;
    }

    private static void StartServer(CancellationToken token)
    {
        TcpListener listener = new TcpListener(IPAddress.Loopback, Port);
        listener.Start();
        Console.WriteLine($"[Exam Hub] Listening on port {Port}");

        while (!token.IsCancellationRequested)
        {
            if (listener.Pending())
            {
                TcpClient client = listener.AcceptTcpClient();
                Task.Run(() => ProcessExamPayload(client));
            }
            else
            {
                Thread.Sleep(30);
            }
        }
        listener.Stop();
    }

    private static void ProcessExamPayload(TcpClient client)
    {
        using (client)
        using (NetworkStream stream = client.GetStream())
        using (BinaryReader reader = new BinaryReader(stream))
        using (BinaryWriter writer = new BinaryWriter(stream))
        {
            string fileName = reader.ReadString();
            int length = reader.ReadInt32();
            byte[] fileBytes = reader.ReadBytes(length);
            string expectedHash = reader.ReadString();

            using SHA256 sha = SHA256.Create();
            byte[] hashBytes = sha.ComputeHash(fileBytes);
            string actualHash = Convert.ToHexString(hashBytes);

            bool verified = string.Equals(expectedHash, actualHash, StringComparison.OrdinalIgnoreCase);
            Console.WriteLine($"[Exam Hub] File '{fileName}' ({length} bytes) verified: {verified}");

            writer.Write(verified ? "VERIFIED_OK" : "CHECKSUM_MISMATCH");
        }
    }

    private static async Task ExecuteExamTransmission()
    {
        string sampleName = "exam_document.bin";
        byte[] payload = Encoding.UTF8.GetBytes("Enterprise asynchronous network distribution protocol packet verified.");
        using SHA256 sha = SHA256.Create();
        string checkSum = Convert.ToHexString(sha.ComputeHash(payload));

        using TcpClient client = new TcpClient();
        await client.ConnectAsync(IPAddress.Loopback, Port);
        using NetworkStream stream = client.GetStream();
        using BinaryWriter writer = new BinaryWriter(stream);
        using BinaryReader reader = new BinaryReader(stream);

        writer.Write(sampleName);
        writer.Write(payload.Length);
        writer.Write(payload);
        writer.Write(checkSum);

        string response = reader.ReadString();
        Console.WriteLine($"[Exam Client] Transmission status: {response}");
    }
}