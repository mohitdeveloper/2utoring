using OfficeOpenXml;
using OfficeOpenXml.Drawing.Chart;
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Xml;
using System.Xml.Linq;

namespace StandingOut.Shared.Excel
{
    public class ExcelDocumentFactory : IDisposable
    {
        public ExcelPackage Package { get; set; }
        public ExcelWorksheet CurrentWorksheet { get; set; }

        public ExcelDocumentFactory()
        {
            Package = new ExcelPackage();
        }

        public void AddWorksheet(string name)
        {
            CurrentWorksheet = Package.Workbook.Worksheets.Add(name);

        }

        public void AddDataTableToWorksheet(EPPlusDataTable table)
        {
            AddDataToWorksheet(table);
        }

        public byte[] ExportByteArray()
        {
            return Package.GetAsByteArray();
        }

        public MemoryStream ExportMemoryStream()
        {
            MemoryStream stream = new MemoryStream(Package.GetAsByteArray());
            stream.Position = 0;
            return stream;
        }

        #region -- Private Methods --

        private TableDimensions AddDataToWorksheet(EPPlusDataTable table)
        {
            if (CurrentWorksheet != null)
            {
                var result = new TableDimensions();
                result.StartRow = 1;
                result.StartColumn = 1;

                var currentRow = 1;
                if (CurrentWorksheet.Dimension != null)
                {
                    currentRow = CurrentWorksheet.Dimension.End.Row;
                    currentRow += 3;
                    result.StartRow = currentRow;
                }

                #region title customisation

                if (!String.IsNullOrWhiteSpace(table.TableTitle))
                {
                    int titlecolumnstart = 1;

                    CurrentWorksheet.Cells[currentRow, titlecolumnstart].Value = table.TableTitle;

                    #region title styling

                    CurrentWorksheet.Cells[currentRow, 1, currentRow, 4].Merge = true;
                    CurrentWorksheet.Cells[currentRow, 1, currentRow, 4].Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;

                    using (ExcelRange rng = CurrentWorksheet.Cells[currentRow, 1, currentRow, 2])
                    {
                        System.Drawing.Color bckcol = System.Drawing.Color.FromArgb(int.Parse(table.TableTitlebckColour.Replace("#", ""), System.Globalization.NumberStyles.AllowHexSpecifier));
                        Color txtcol = Color.FromArgb(int.Parse(table.TableTitleTextColour.Replace("#", ""), System.Globalization.NumberStyles.AllowHexSpecifier));

                        rng.Style.Fill.PatternType = ExcelFillStyle.Solid;
                        rng.Style.Font.Bold = true;
                        rng.Style.Fill.BackgroundColor.SetColor(bckcol);
                        rng.Style.Font.Color.SetColor(txtcol);
                        rng.Style.Font.Size = 16;
                    }

                    #endregion

                    currentRow += 2;
                    result.StartRow = currentRow;

                }

                #endregion



                if (table.Columns != null && table.Columns.Count > 0)
                {
                    result.EndColumn = table.Columns.Count;
                    for (int i = 1; i <= table.Columns.Count; i++)
                    {
                        CurrentWorksheet.Cells[currentRow, i].Value = table.Columns[i - 1];
                    }
                    currentRow++;

                    #region column customisation

                    using (ExcelRange rng = CurrentWorksheet.Cells[currentRow - 1, result.StartColumn, currentRow - 1, result.EndColumn])
                    {
                        Color bckcol = Color.FromArgb(int.Parse(table.ColumnbckColour.Replace("#", ""), System.Globalization.NumberStyles.AllowHexSpecifier));
                        Color txtcol = Color.FromArgb(int.Parse(table.ColumnTextColour.Replace("#", ""), System.Globalization.NumberStyles.AllowHexSpecifier));

                        rng.Style.Fill.PatternType = ExcelFillStyle.Solid;
                        rng.Style.Font.Bold = true;
                        rng.Style.Fill.BackgroundColor.SetColor(bckcol);
                        rng.Style.Font.Color.SetColor(txtcol);
                    }

                    #endregion
                }

                if (table.Rows != null && table.Rows.Count > 0)
                {
                    foreach (var row in table.Rows)
                    {
                        if (row != null && row.Count > 0)
                        {
                            result.EndColumn = row.Count > result.EndColumn ? row.Count : result.EndColumn;
                            for (int i = 1; i <= row.Count; i++)
                            {
                                CurrentWorksheet.Cells[currentRow, i].Value = row[i - 1];
                            }
                            currentRow++;
                        }
                    }
                }
                result.EndRow = currentRow;
                CurrentWorksheet.Cells[CurrentWorksheet.Dimension.Address].AutoFitColumns();

                #region Generic Table Styling

                using (ExcelRange rng = CurrentWorksheet.Cells[result.StartRow, result.StartColumn, result.EndRow - 1, result.EndColumn])
                {
                    rng.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    rng.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    rng.Style.Border.Right.Style = ExcelBorderStyle.Thin;
                    rng.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                }

                #endregion

                return result;

            }
            else
            {
                throw new Exception("No worksheet created.");
            }
        }

        private PixelDimensions CalculatePixelDimensions(TableDimensions dimensions)
        {
            double height = 0, width = 0, start = 0;
            for (int s = 0; s < dimensions.StartRow; s++)
                start += CurrentWorksheet.Row(s).Height;


            for (int h = dimensions.StartRow; h < dimensions.EndRow; h++)
                height += CurrentWorksheet.Row(h).Height;

            for (int w = dimensions.StartColumn; w < dimensions.EndColumn; w++)
                width += CurrentWorksheet.Column(w).Width;

            double pointToPixel = 0.75;

            start /= pointToPixel;
            height /= pointToPixel;
            width /= 0.1423;

            return new PixelDimensions
            {
                Width = width,
                Height = height,
                Start = start
            };
        }

        #endregion


        #region -- Dispose --

        public void Dispose()
        {
            if (Package != null)
                Package.Dispose();
        }

        #endregion
    }

    public class EPPlusGraphData
    {
        public EPPlusGraphData()
        {
            HideTable = false;
        }

        public string Name { get; set; }
        public string Title { get; set; }

        public bool HideTable { get; set; }

        public EPPlusDataTable Data { get; set; }

        public List<EPPlusGraphSeries> Series { get; set; }
    }

    public class EPPlusGraphSeries
    {
        public string Name { get; set; }
        public int XColumn { get; set; }
        public int YColumn { get; set; }
        public eChartType ChartType { get; set; }
    }

    public class EPPlusDataTable
    {
        public EPPlusDataTable()
        {
            ColumnTextColour = "#35BFF0"; //io studios default
            ColumnbckColour = "#EE2831";

            TableTitleTextColour = "#000000";
            TableTitlebckColour = "#EEEEEE";
            //TableTitle = "Testing Table Title Styling!";

            Columns = Columns ?? new List<string>();
            Rows = Rows ?? new List<List<object>>();
        }

        public string ColumnTextColour { get; set; }
        public string ColumnbckColour { get; set; }

        public string TableTitle { get; set; }
        public string SubTitleDateRangeStart { get; set; }
        public string SubTitleDateRangeEnd { get; set; }
        public string TableTitleTextColour { get; set; }
        public string TableTitlebckColour { get; set; }

        public List<string> Columns { get; set; }
        public List<string> ColumnSubTitles { get; set; }
        public List<List<object>> Rows { get; set; }
    }

    public class TableDimensions
    {
        public int StartRow { get; set; }
        public int StartColumn { get; set; }

        public int EndRow { get; set; }
        public int EndColumn { get; set; }
    }

    public class PixelDimensions
    {
        public double Start { get; set; }
        public double Width { get; set; }
        public double Height { get; set; }
    }

    public static class DocumentExtensions
    {
        public static XmlDocument ToXmlDocument(this XDocument xDocument)
        {
            var xmlDocument = new XmlDocument();
            using (var xmlReader = xDocument.CreateReader())
            {
                xmlDocument.Load(xmlReader);
            }
            return xmlDocument;
        }


    }
}
