using ExocolonistSaveEditor.Core.Models;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Windows;

namespace ExocolonistSaveEditor.Windows
{
    /// <summary>
    /// Interaction logic for SaveWindow.xaml
    /// </summary>
    public partial class SaveWindow : Window
    {
        [GeneratedRegex("(?<!^)(?=[A-Z])")]
        private static partial Regex Uppercase();

        public SaveWindow(Save save)
        {
            InitializeComponent();

            Title = $"{save.FileName} - Exocolonoist Saved Editor";

            foreach (PropertyInfo field in typeof(Save).GetProperties())
            {
                object value = field.GetValue(save) ?? "";

                if (value is null || string.IsNullOrEmpty(value.ToString()))
                {
                    continue;
                }

                if (value is string)
                {
                    SaveData.Items.Add(new { Key = string.Join(" ", Uppercase().Split(field.Name)), Value = field.GetValue(save) });
                }
            }
        }
    }
}
