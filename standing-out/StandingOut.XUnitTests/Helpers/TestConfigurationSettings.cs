namespace StandingOut.XUnitTests.Helpers
{
    public class TestConfigurationSettings
    {
        public string BaseUrl { get; set; }
        public string DirectoryRoot { get; set; }
        public string Driver { get; set; }
        public bool Headless { get; set; }
        public int Height { get; set; }
        public int Width { get; set; }
        public string BuildNo { get; set; }
        public long MaxPageRenderTimeAllowed { get; set; }
        public string AdminPassword { get; set; }
    }
}
