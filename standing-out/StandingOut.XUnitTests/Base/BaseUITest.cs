using StandingOut.XUnitTests.Helpers;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Edge;
using OpenQA.Selenium.Firefox;
using OpenQA.Selenium.IE;
using OpenQA.Selenium.Support.UI;
using System;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.Versioning;
using System.Text;
using Xunit.Abstractions;

namespace StandingOut.XUnitTests.Base
{
    public abstract class BaseUITest
    {
        protected IWebDriver _driver;
        protected TestConfigurationSettings _configuration;
        ITestOutputHelper _output;

        public BaseUITest(ITestOutputHelper output)
        {
            _output = output;
        }

        public TestConfigurationSettings Config
        { get { return _configuration; } }

        //public ConfigSetting

        public void LogError(string testName, Exception ex)
        {

            string _folder = $"{_configuration.DirectoryRoot}";
            System.IO.Directory.CreateDirectory(_folder);

            _folder = $"{_folder}/{_configuration.Driver}";
            System.IO.Directory.CreateDirectory(_folder);

            _folder = $"{_folder}/{testName}";
            System.IO.Directory.CreateDirectory(_folder);

            Screenshot ss = ((ITakesScreenshot)_driver).GetScreenshot();
            ss.SaveAsFile($"{_folder}//{testName}.png", ScreenshotImageFormat.Png);

            string exceptionMessageFile = $"{_folder}//exception.txt";

            StringBuilder _sb = new StringBuilder();
            _sb.AppendLine($"Test:      {testName}");
            _sb.AppendLine($"Date/Time: {DateTime.Now.ToString()}");
            _sb.AppendLine($"Browser:   {_configuration.Driver} ({_configuration.Width}x{_configuration.Height})");
            _sb.AppendLine($"Actual:    {_driver.Manage().Window.Size}");
            _sb.AppendLine($"Headless:  {_configuration.Headless}");
            _sb.AppendLine($"Source:    {ex.Source}");

            _sb.AppendLine($"Core-Test:      {Assembly.GetEntryAssembly()?.GetCustomAttribute<TargetFrameworkAttribute>()?.FrameworkName}");

            _sb.AppendLine();
            _sb.AppendLine($"Exception: {ex.Message}");
            _sb.AppendLine();
            _sb.AppendLine("Stack Trace:");
            _sb.AppendLine(ex.StackTrace);
            StreamWriter writer = new StreamWriter(exceptionMessageFile);
            writer.Write(_sb.ToString());
            writer.Close();
            Dispose();
        }

        public void Initialise()
        {
            LogMessage($"Init: start");
            _configuration = TestHelper.GetApplicationConfiguration("test");
            LogMessage($"Init config: {_configuration}");
            string _folder = $"{_configuration.DirectoryRoot}";
            LogMessage($"Init folder: {_folder}");
            DirectoryInfo dir = System.IO.Directory.CreateDirectory(_folder);
            LogMessage($"Init created: {Directory.GetCreationTime(_folder)}");

            LogMessage($"Init driver: {_configuration.Driver}");
            switch (_configuration.Driver)
            {
                case "IE":
                    var IEOptions = new InternetExplorerOptions();
                    _driver = new InternetExplorerDriver(System.IO.Directory.GetCurrentDirectory(), IEOptions);
                    break;
                case "Edge":
                    var edgeOptions = new EdgeOptions();
                    _driver = new EdgeDriver(System.IO.Directory.GetCurrentDirectory(), edgeOptions);
                    break;
                case "Chrome":
                    var chromeOptions = new ChromeOptions();
                    //if (_configuration.Headless)
                    //{
                    //    chromeOptions.AddArgument("headless");
                    //}
                    chromeOptions.AddArgument("--disable-extensions");
                    //chromeOptions.AddArgument("--window-size=1920x1080");
                    // chromeOptions.AddArgument("start-maximized");
                    // chromeOptions.AddArgument("--kiosk");
                    _driver = new ChromeDriver(System.IO.Directory.GetCurrentDirectory(), chromeOptions);
                    break;
                case "Firefox":
                default:
                    var FirefoxOptions = new FirefoxOptions();
                    if (_configuration.Headless)
                    {
                        FirefoxOptions.AddArgument("--headless");
                    }
                    _driver = new FirefoxDriver(System.IO.Directory.GetCurrentDirectory(), FirefoxOptions);
                    break;
            }
            //_driver.Manage().Window.Size = (new System.Drawing.Size(_configuration.Width, _configuration.Height));
            _driver.Manage().Window.Maximize();

            //var _wait = new WebDriverWait(_driver, TimeSpan.FromSeconds(10));
            //_driver.Manage().Window.Maximize();
            //_driver.Manage().Window.FullScreen();

            _driver.Manage().Window.Position = new Point(0, 0);
            _driver.Manage().Window.Size = (new Size(_configuration.Width, _configuration.Height));
        }

        public void Dispose()
        {
            _driver.Quit();
            _driver.Dispose();
        }

        public void SetValue(string id, string value)
        {
            var element = _driver.FindElement(By.Id(id));
            switch (element.TagName.ToLower())
            {
                case "select":
                    SelectElement select = new SelectElement(element);
                    select.SelectByText(value);
                    break;
                default:
                    element.Clear();
                    element.SendKeys(value);
                    break;
            }
        }

        public void SetValueByName(string name, string value)
        {
            var element = _driver.FindElement(By.Name(name));
            switch (element.TagName.ToLower())
            {
                case "select":
                    SelectElement select = new SelectElement(element);
                    select.SelectByText(value);
                    break;
                default:
                    element.Clear();
                    element.SendKeys(value);
                    break;
            }
        }

        public void Sleep(int milliseconds = 1000)
        {
            System.Threading.Thread.Sleep(milliseconds);
        }

        public void Click(string id)
        {
            Click(id, null);
        }

        public void Click(string id, int? sleepMilliseconds)
        {
            LogMessage($"Click: {id}");
            var element = _driver.FindElement(By.Id(id));
            LogMessage($"Click: {id} - {element}");
            element.Click();
            LogMessage($"Click: {id} - clicked");
            if (sleepMilliseconds.HasValue && !Config.Headless)
            {
                Sleep(sleepMilliseconds.GetValueOrDefault(0));
            }
        }

        public void ClickLinkText(string text)
        {
            var element = _driver.FindElement(By.LinkText(text));
            element.Click();
        }

        public long Navigate(string url)
        {
            Stopwatch timer = Stopwatch.StartNew();
            if (!url.StartsWith("/")) { url = $"/{url}"; }
            _driver.Navigate().GoToUrl($"{_configuration.BaseUrl}{url}");
            timer.Stop();
            return timer.ElapsedMilliseconds;
        }

        public long NavigateExternal(string url)
        {
            Stopwatch timer = Stopwatch.StartNew();
            _driver.Navigate().GoToUrl(url);
            timer.Stop();
            return timer.ElapsedMilliseconds;
        }

        public string GetCurrentUrl()
        {
            return _driver.Url;
        }

        public string GetValue(string id)
        {
            var element = _driver.FindElement(By.Id(id));
            //todo extend
            if (element.TagName == "input")
            {
                return element.GetAttribute("value");
            }
            // clean the twotone styles
            return element.Text.Replace("<span>", "").Replace("</span>", "");
        }

        public bool IsVisible(string id)
        {
            LogMessage($"isVisible: {id}");
            try
            {
                return _driver.FindElement(By.Id(id)).Displayed;
            }
            catch (Exception)
            {
                LogMessage($"isVisible: {id} - Not Found");
                return false;
            }
        }

        public bool IsHidden(string id)
        {
            LogMessage($"isHidden: {id}");
            try
            {
                if (_driver.FindElement(By.Id(id)).Displayed)
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }
            catch (Exception)
            {
                LogMessage($"isHidden: {id} - Not Found");
                return false;
            }
        }

        public string GetAttribute(string id, string attribute)
        {
            return _driver.FindElement(By.Id(id)).GetAttribute(attribute);
        }

        public void LogMessage(string message)
        {
            _output.WriteLine(message);
        }

        public int GetItemCountByClass(string className)
        {
            var elements = _driver.FindElements(By.ClassName(className));
            return elements.Count();
        }
    }
}
