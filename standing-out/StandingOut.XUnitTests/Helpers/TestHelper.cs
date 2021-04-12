using Microsoft.Extensions.Configuration;

namespace StandingOut.XUnitTests.Helpers
{
    public static class TestHelper
    {
        public static IConfigurationRoot GetIConfigurationRoot(string outputPath)
        {
            return new ConfigurationBuilder()
                .SetBasePath(outputPath)
                .AddJsonFile("appsettings.json", optional: true)
                .AddEnvironmentVariables()
                .Build();
        }

        public static TestConfigurationSettings GetApplicationConfiguration(string outputPath)
        {
            var configuration = new TestConfigurationSettings();

            var iConfig = GetIConfigurationRoot(System.IO.Directory.GetCurrentDirectory());

            iConfig
                .GetSection("TestConfigurationSettings")
                .Bind(configuration);

            return configuration;
        }
    }
}
