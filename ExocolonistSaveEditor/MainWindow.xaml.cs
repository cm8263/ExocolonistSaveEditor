using System;
using System.Collections.Generic;
using System.IO;
using System.Windows;
using ExocolonistSaveEditor.Core;
using ExocolonistSaveEditor.Core.Models;

namespace ExocolonistSaveEditor
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        internal readonly string SAVE_DIR = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "Exocolonist", "Savegames");

        internal Dictionary<string, Save> _savedGames = new();

        public MainWindow()
        {
            InitializeComponent();

            if (!Directory.Exists(SAVE_DIR))
            {
                return;
            }

            string[] files = Directory.GetFiles(SAVE_DIR, "Save_*.json", SearchOption.TopDirectoryOnly);

            foreach (string file in files)
            {
                string saveName = Utils.ParseSaveName(file) + " (" + Utils.ParsePrincessName(file) + ") - " + Utils.ParseDateTime(file).ToString("g");
                Save? save = Save.Load(file);

                if (saveName == "Save" || save is null)
                {
                    continue;
                }

                _savedGames.Add(saveName, save);
            }

            SavesFound.Text = _savedGames.Count.ToString();

            foreach (Save save in _savedGames.Values)
            {
                SaveData.Items.Add(save);
            }
        }
    }
}
