using ExocolonistSaveEditor.Core.Models;
using System.Text.RegularExpressions;

namespace ExocolonistSaveEditor.Core
{
    public static class Utils
    {
        public static string StripNonNumeric(this string value) => Regex.Replace(value, "[^0-9.-]", "");

        public static string ParseSaveName(string filename)
        {
            try
            {
                filename = Path.GetFileNameWithoutExtension(filename);

                string[] stringArray = filename.Split('_');

                return stringArray.Length > 1 ? stringArray[1] : "Save";
            }
            catch (Exception exception)
            {
                Console.WriteLine("Failed to parse princess name from filename " + filename + ", " + exception?.ToString());
                return "Save";
            }
        }

        public static string ParsePrincessName(string filename)
        {
            try
            {
                filename = Path.GetFileNameWithoutExtension(filename);

                string[] stringArray = filename.Split('_');

                return stringArray.Length < 3 ? Save.DefaultPrincessName : (stringArray.Length == 5 ? stringArray[2] : stringArray[1]);
            }
            catch (Exception exception)
            {
                Console.WriteLine("Failed to parse princess name from filename " + filename + ", " + exception?.ToString());
                return Save.DefaultPrincessName;
            }
        }

        public static DateTime ParseDateTime(string filename)
        {
            try
            {
                filename = Path.GetFileNameWithoutExtension(filename);

                string[] strArray = filename.Split('_');

                if (strArray.Length < 4)
                {
                    return new DateTime();
                }

                long ticks = strArray.Length == 5 ? strArray[4].ParseLong() : strArray[3].ParseLong();
                DateTime dateTime = new(ticks);
                
                if (dateTime.Year < 2000)
                {
                    dateTime = DateTime.UnixEpoch.AddMinutes((double)ticks);
                }

                return dateTime;
            }
            catch (Exception ex)
            {
                Console.WriteLine("Failed to parse DateTime from filename " + filename + ", " + ex?.ToString());
                return new DateTime();
            }
        }
    }
}
