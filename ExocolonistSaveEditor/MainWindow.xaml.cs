using System;
using System.IO;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using ExocolonistSaveEditor.Core;
using ExocolonistSaveEditor.Core.Models;
using ExocolonistSaveEditor.Windows;

namespace ExocolonistSaveEditor
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        internal readonly string SAVE_DIR = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments), "Exocolonist", "Savegames");

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
                string saveName = Utils.ParseSaveName(file);
                Save? save = Save.Load(file);

                if (saveName == "Save" || save is null)
                {
                    continue;
                }

                save.FileName = saveName;
                save.FileTimestamp = Utils.ParseDateTime(file).ToString("g");

                SaveData.Items.Add(save);
            }
        }

        private void SaveData_MouseDoubleClick(object sender, MouseButtonEventArgs e)
        {
            if (sender is not ListViewItem item)
            {
                return;
            }

            SaveWindow subWindow = new((Save)item.Content);
            subWindow.Show();
        }
    }
}
