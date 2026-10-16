using System.Net;
using System.Net.NetworkInformation;

namespace IpProtocolBasics;

internal class Program
{
    private static async Task Main()
    {
        Console.WriteLine("IP Protocol and Network Diagnostics");

        IPAddress localIp = IPAddress.Parse("127.0.0.1");
        IPEndPoint localEndPoint = new IPEndPoint(localIp, 8080);
        Console.WriteLine($"Local EndPoint: {localEndPoint.Address}:{localEndPoint.Port} (AddressFamily: {localEndPoint.AddressFamily})");

        string hostName = "dns.google";
        try
        {
            IPHostEntry entry = await Dns.GetHostEntryAsync(hostName);
            Console.WriteLine($"Host: {entry.HostName}");
            foreach (IPAddress ip in entry.AddressList)
            {
                Console.WriteLine($" - IP: {ip} (Family: {ip.AddressFamily})");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"DNS Lookup notice: {ex.Message}");
        }

        using Ping pingSender = new Ping();
        PingOptions options = new PingOptions(64, true);
        byte[] buffer = new byte[32];
        new Random().NextBytes(buffer);

        try
        {
            PingReply reply = await pingSender.SendPingAsync("8.8.8.8", 1000, buffer, options);
            if (reply.Status == IPStatus.Success)
            {
                Console.WriteLine($"Ping 8.8.8.8: RoundTrip={reply.RoundtripTime}ms, TTL={reply.Options?.Ttl}, Buffer={reply.Buffer.Length}b");
            }
            else
            {
                Console.WriteLine($"Ping status: {reply.Status}");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Ping notice: {ex.Message}");
        }

        IPAddress subnet = IPAddress.Parse("255.255.255.0");
        Console.WriteLine($"Subnet mask configured: {subnet}");
    }
}