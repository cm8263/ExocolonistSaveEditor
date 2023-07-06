using System.Numerics;
using System.Text.Json;

namespace ExocolonistSaveEditor.Core.Models
{
    public class Save
    {
        private const int CurrentVersion = 2;
        public static string LastLoadedFilename { get; set; } = "";
        public int SaveFileVersion { get; set; } = 2;
        public int Week { get; set; } = 1;
        public string? ExpeditionJobID { get; set; }
        public float SecondsPlayed { get; set; }
        public Vector3 MapCoords { get; set; } = Vector3.Zero;
        public string MapName { get; set; } = "ColonyStrato";
        public Dictionary<string, Dictionary<string, string>> MapSpotsByMap { get; set; } = new();
        public string? MapSpotsByMapSerialized { get; set; }
        public static string DefaultPrincessName { get; set; } = "Solanaceae";
        public string PrincessName { get; set; } = DefaultPrincessName;
        public float GenderPronounsFloat { get; set; }
        public float GenderAppearanceFloat { get; set; }
        public Dictionary<string, int> Skills { get; set; } = new();
        public string? SkillsSerialized { get; set; }
        public Dictionary<string, string> Memories { get; set; } = new();
        public string? MemoriesSerialized { get; set; }
        public Dictionary<string, int> Love { get; set; } = new();
        public string? LoveSerialized { get; set; }
        public Dictionary<string, int> Statuses { get; set; } = new();
        public string? StatusesSerialized { get; set; }
        public Dictionary<string, int> Stories { get; set; } = new();
        public string? StoriesSerialized { get; set; }
        public Dictionary<int, List<string>> StoriesLog { get; set; } = new();
        public string? StoriesLogSerialized { get; set; }
        public Dictionary<int, List<string>> YearStats { get; set; } = new();
        public string? YearStatsSerialized { get; set; }
        public Dictionary<string, string> CustomGender { get; set; } = new();
        public string? CustomGenderSerialized { get; set; }
        public List<string> SeenTutorials { get; set; } = new();
        public List<string> Cards { get; set; } = new();
        public List<string> EquippedGear { get; set; } = new();
        public List<int> LastJobScores { get; set; } = new();
        public List<int> LastJobGoal { get; set; } = new();
        public List<bool> LastHardJobWins { get; set; } = new();
        public string? GroundhogsSerialized { get; set; }
        public string? SeenChoicesSerialized { get; set; }
        public List<string> SeenBackgrounds { get; set; } = new();
        public List<string> SeenCards { get; set; } = new();
        public List<CheevoID> Cheevos { get; set; } = new();

        public static Save? Load(string path)
        {
            using FileStream file = File.OpenRead(path);

            Save? save = JsonSerializer.Deserialize<Save>(file, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });

            if (save is null)
            {
                Console.WriteLine("Save file was null");
                return null;
            }

            save.Deserialize();

            return save;
        }

        public void Deserialize()
        {
            Skills.DeserializeDictionary(SkillsSerialized);
            Memories.DeserializeDictionary(MemoriesSerialized);
            Love.DeserializeDictionary(LoveSerialized);
            Statuses.DeserializeDictionary(StatusesSerialized, Enum.GetNames(typeof(StatusID)).ToList());
            Stories.DeserializeDictionary(StoriesSerialized);
            StoriesLog.DeserializeDictionary(StoriesLogSerialized);
            YearStats.DeserializeDictionary(YearStatsSerialized);
            CustomGender.DeserializeDictionary(CustomGenderSerialized);
            MapSpotsByMap.DeserializeDictionaryOfDicts(MapSpotsByMapSerialized);
        }
    }
}
