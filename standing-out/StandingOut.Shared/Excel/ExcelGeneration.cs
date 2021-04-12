using System;
using System.Collections.Generic;
using System.IO;
using DTO = StandingOut.Data.DTO;

namespace StandingOut.Shared.Excel
{
    public class ExcelGeneration : IDisposable
    {
        public Stream GenerateClassSessionExport(List<DTO.ClassSessionIndex> model)
        {
            var dt = new EPPlusDataTable()
            {
                ColumnbckColour = "#2F373E",
                ColumnTextColour = "#FFFFFF",
                TableTitle = $"Session Export",
                Columns = new List<string> { "Name", "Length", "Start Date", "Start Time" },
            };

            foreach (var item in model)
            {

                var row = new List<object>()
                {
                    item.Name,
                    item.Duration + "mins",
                    item.StartDate.ToString("dd/MM/yyyy"),
                    item.StartDate.ToString("HH:mm"),
                };
                dt.Rows.Add(row);
            }

            using (var factory = new ExcelDocumentFactory())
            {
                factory.AddWorksheet("Sheet 1");
                factory.AddDataTableToWorksheet(dt);

                MemoryStream stream = factory.ExportMemoryStream();
                stream.Position = 0;
                return stream;
            }
        }


        public void Dispose()
        {
            GC.Collect();
        }

    }
}
