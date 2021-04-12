using StandingOut.XUnitTests.Base;
using System;
using System.Reflection;
using Xunit;
using Xunit.Abstractions;

namespace StandingOut.XUnitTests.Performance
{
    public class PerformanceLoadTimeTest : BaseUITest
    {
        public PerformanceLoadTimeTest(ITestOutputHelper output) : base(output)
        {
        }

        [Fact]
        public void PagePerformanceTest()
        {
            Initialise();

            long maxDuration = Config.MaxPageRenderTimeAllowed;
            try
            {
                NavigateToPage(@"https://www.google.co.uk", maxDuration, true);
                NavigateToPage("/", maxDuration);
                NavigateToPage("/Login", maxDuration);
            }
            catch (Exception ex)
            {
                MethodBase method = System.Reflection.MethodBase.GetCurrentMethod();
                var imageName = $"{method.ReflectedType.Name}_{method.Name}";
                base.LogError(imageName, ex);
                throw;
            }
            Dispose();
        }

        private void NavigateToPage(string url, long timeLimit, bool external = false)
        {
            long duration = external ? NavigateExternal(url) : Navigate(url);
            LogMessage($"Performance metric test: {url} - {duration}ms");
            Assert.True(duration < timeLimit, $"Route {url} page load time of {timeLimit}ms exceeded - time was {duration}ms");
        }
    }
}
