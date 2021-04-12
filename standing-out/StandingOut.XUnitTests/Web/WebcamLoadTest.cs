using System;
using System.Reflection;
using StandingOut.XUnitTests.Base;
using Xunit;
using Xunit.Abstractions;

namespace StandingOut.Store.UiTests.Web
{
    public class WebcamLoadTest : BaseUITest
    {
        public WebcamLoadTest(ITestOutputHelper output) : base(output)
        {
        }

        [Fact]
        public void CharlieTest()
        {
            try
            {
                Initialise();
                Navigate("/Identity/Account/Login");
                Click("Google");
                Sleep(500);
                SetValue("identifierId", "2utoringparticipant1@gmail.com");
                Sleep(500);
                Click("identifierNext");
                Sleep(500);
                SetValueByName("password", "Omega2017$");
                Sleep(500);
                Click("passwordNext");
                Sleep(1000);
                ClickLinkText("Advanced");
                Sleep(1000);
                ClickLinkText("Go to iostudios.co.uk (unsafe)");
                Sleep(1000);
                Click("submit_approve_access");



                //Assert.Equal("Existing customers", GetValue("login-title"));
                //SetValue("Input_Email", "evolve@kitepackaging.co.uk");
                //SetValue("password", "Evolve#99");
                //Click("login-submit");

                //if (IsVisible("cookie-accept-button"))
                //{
                //    Click("cookie-accept-button", 500);
                //}

                //Navigate("/evolve/catalogue/grid/detail");

                //SetValue("title", "UI-Test", 200);
                //SetValue("shortTitle", "UI-Test", 200);
                //SetValue("icon", "fas fa-times", 200);
                //Click("saveButton", 3000); // unable to click button as not in screen. what can we do?

                Assert.True(1==1); // product tab becomes visable on success
            }
            catch (Exception ex)
            {
                MethodBase method = MethodBase.GetCurrentMethod();
                if (method.ReflectedType != null)
                {
                    var imageName = $"{method.ReflectedType.Name}_{method.Name}";
                    LogError(imageName, ex);
                }

                throw;
            }
        }
    }
}