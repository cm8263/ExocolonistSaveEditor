using System.Globalization;

namespace ExocolonistSaveEditor.Core
{
    internal static class Extensions
    {
        #region Dictionary Extensions
        public static void DeserializeDictionary(this IDictionary<string, string> dictionary, string data, List<string>? possibleKeys = null)
        {
            if (dictionary is null || string.IsNullOrEmpty(data))
            {
                return;
            }

            dictionary.Clear();

            foreach (string string1 in data.Split(','))
            {
                string[] stringArray = string1.Split(':');

                if (stringArray.Length != 2)
                {
                    continue;
                }

                string key = stringArray[0].Trim();
                string string2 = stringArray[1].Trim();

                if (possibleKeys is not null && !possibleKeys.Contains(key))
                {
                    Console.WriteLine($"DeserializeDictionary ignoring unknown key {key}");
                    continue;
                }

                dictionary[key] = string2;
            }
        }

        public static void DeserializeDictionary(this IDictionary<string, int> dictionary, string data, List<string>? possibleKeys = null)
        {
            if (dictionary is null)
            {
                return;
            }

            dictionary.Clear();

            if (string.IsNullOrEmpty(data))
            {
                return;
            }

            foreach (string str in data.Split(','))
            {
                string[] stringArray = str.Split(':');

                if (stringArray.Length != 2)
                {
                    continue;
                }

                string key = stringArray[0].Trim();

                if (!int.TryParse(stringArray[1], out int result))
                {
                    Console.WriteLine($"DeserializeDictionary failed to parse int for key {key}");
                    continue;
                }

                if (possibleKeys is not null && !possibleKeys.Contains(key))
                {
                    Console.WriteLine($"DeserializeDictionary ignoring unknown key {key}");
                    continue;
                }

                dictionary[key] = result;
            }
        }

        public static void DeserializeDictionary(this IDictionary<int, List<string>> dictionary, string data)
        {
            if (dictionary is null || string.IsNullOrEmpty(data))
            {
                return;
            }

            dictionary.Clear();

            foreach (string string1 in data.Split(','))
            {
                string[] strArray = string1.Split(':');

                if (strArray.Length != 2)
                {
                    continue;
                }

                int key = strArray[0].ParseInt();
                string str2 = strArray[1].Trim();
                dictionary[key] = str2.StringToList(';', true);
            }
        }

        public static void DeserializeDictionaryOfDicts(this Dictionary<string, Dictionary<string, string>> dictionary, string data)
        {
            if (dictionary == null || string.IsNullOrEmpty(data))
            {
                return;
            }

            dictionary.Clear();

            foreach (string str in data.Split(';'))
            {
                string[] strArray = str.Split('=');

                if (strArray.Length != 2)
                {
                    continue;
                }

                string key = strArray[0].Trim();
                string newData = strArray[1].Trim();
                Dictionary<string, string> newDictionary = new();

                newDictionary.DeserializeDictionary(newData);
                dictionary[key] = newDictionary;
            }
        }
        #endregion

        #region String Extensions
        public static int ParseInt(this string value, int defaultValue = 0)
        {
            if (string.IsNullOrEmpty(value))
            {
                return defaultValue;
            }

            value = value.StripNonNumeric();

            return int.TryParse(value, NumberStyles.Integer, NumberFormatInfo.InvariantInfo, out int result) ? result : defaultValue;
        }

        public static List<string> StringToList(this string str, char delimiter = ',', bool ignoreEmpty = false)
        {
            if (string.IsNullOrEmpty(str))
            {
                return new List<string>();
            }

            if (!ignoreEmpty)
            {
                return str.Split(delimiter).ToList();
            }

            List<string> list = new();
            string[] strArray = str.Split(delimiter);

            for (int index = 0; index < strArray.Length; ++index)
            {
                if (!string.IsNullOrEmpty(strArray[index]))
                {
                    list.Add(strArray[index].Trim());
                }
            }

            return list;
        }

        public static long ParseLong(this string value)
        {
            if (string.IsNullOrEmpty(value))
            {
                return 0;
            }

            value = value.StripNonNumeric();

            return long.TryParse(value, NumberStyles.Integer, NumberFormatInfo.InvariantInfo, out long result) ? result : 0L;

        }
        #endregion
    }
}
