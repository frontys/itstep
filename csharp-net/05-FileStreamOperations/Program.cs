using System.Text;

namespace FileStreamOperations;

internal class Program
{
    private static async Task Main()
    {
        Console.WriteLine("FileStream, StreamWriter and StreamReader Demonstration");

        string filePath = "records.dat";
        string textPath = "log.txt";

        using (FileStream fs = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.None))
        {
            byte[] header = Encoding.UTF8.GetBytes("DATA_STREAM_HEADER_V1" + Environment.NewLine);
            fs.Write(header, 0, header.Length);

            for (int i = 1; i <= 50; i++)
            {
                byte[] entry = Encoding.UTF8.GetBytes($"Record #{i:D3}: Value={i * 15}" + Environment.NewLine);
                fs.Write(entry, 0, entry.Length);
            }
        }

        using (StreamWriter writer = new StreamWriter(textPath, false, Encoding.UTF8))
        {
            writer.WriteLine("Log initialized: " + DateTime.UtcNow.ToString("O"));
            writer.WriteLine("Status: System operational");
            for (int i = 1; i <= 10; i++)
            {
                writer.WriteLine($"Event ID {i} recorded successfully.");
            }
        }

        Console.WriteLine("Reading binary/text stream:");
        using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read))
        using (StreamReader reader = new StreamReader(fs, Encoding.UTF8))
        {
            string? line;
            int count = 0;
            while ((line = await reader.ReadLineAsync()) != null)
            {
                if (count < 5 || count > 45)
                {
                    Console.WriteLine($"[{fs.Position}b] {line}");
                }
                count++;
            }
            Console.WriteLine($"Total lines read: {count}");
        }

        using (StreamReader logReader = new StreamReader(textPath))
        {
            string fullLog = await logReader.ReadToEndAsync();
            Console.WriteLine($"Read log ({fullLog.Length} characters)");
        }

        if (File.Exists(filePath)) File.Delete(filePath);
        if (File.Exists(textPath)) File.Delete(textPath);
    }
}