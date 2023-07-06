using ExocolonistSaveEditor.Core.Models;
using System.Windows;

namespace ExocolonistSaveEditor.Windows
{
    /// <summary>
    /// Interaction logic for SaveWindow.xaml
    /// </summary>
    public partial class SaveWindow : Window
    {
        public SaveWindow(Save save)
        {
            InitializeComponent();

            CharacterName.Text = save.PrincessName;
        }
    }
}
