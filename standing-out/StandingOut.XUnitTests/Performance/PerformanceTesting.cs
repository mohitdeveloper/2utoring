using Sel = OpenQA.Selenium.Interactions;
using StandingOut.XUnitTests.Base;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;
using Xunit.Abstractions;
using OpenQA.Selenium;

namespace StandingOut.XUnitTests.Performance
{
    public class PerformanceTesting
    {
        public ITestOutputHelper _output;
        public List<Tuple<BaseClient, Tuple<string, string>, string>> _Clients = new List<Tuple<BaseClient, Tuple<string, string>, string>>();

        public string baseUrl = "https://test.2utoring.com"; // old url "https://localhost:44373";
        // ECom store is used by Tutor and Students and is part of main site itself.
        // The classroom is loaded from the main site e.g. "https://test.2utoring.com"  
        // e.g https://testclassroom.2utoring.com/c/dd9cd836-367c-442b-5ac5-08d82befaf5c

        public int maxSessions = 1;
        public int maxUsers = 5;
        public int maxToDo = 10;
        public int maxChatToDo = 10;
        public int maxWhiteboardToDo = 10;
        
        public List<string> sessionsUrls = new List<string>()
        {
            "/classroom/sessions/main/D679A003-3D85-40D2-956C-B1240B89CFC2",
            "/classroom/sessions/main/7163160F-8D04-4624-81A6-08D6A9334A1B"
        };
        public List<Tuple<string, string>> sessionParticipants = new List<Tuple<string, string>>()
        {
            new Tuple<string, string>("testtutor12345@gmail.com", "PASSWORD.123"),
            new Tuple<string, string>("2utoringparticipant1@gmail.com", "Omega2017$"),
            //new Tuple<string, string>("2utoringparticipant2@gmail.com", "Omega2017$"),
            new Tuple<string, string>("2utoringparticipant3@gmail.com", "Omega2017$"),
            new Tuple<string, string>("2utoringparticipant4@gmail.com", "Omega2017$"),
            //new Tuple<string, string>("2utoringparticipant7@gmail.com", "Omega2017$"),
            new Tuple<string, string>("teststudentabc102@gmail.com", "PASSWORDABC")
        };

        public List<string> paneButtons = new List<string>()
        {
            "fullPaneButton",
            "halfPaneButton",
            "thirdPaneButton",
            "quadPaneButton"
        };

        public readonly int _ClientSize = 1;
        public List<int> portsUsed = new List<int>();

        public PerformanceTesting(ITestOutputHelper output)
        {
            _output = output;
            maxSessions = (maxSessions < sessionsUrls.Count ? maxSessions : sessionsUrls.Count);
            maxUsers = (maxUsers < sessionParticipants.Count ? maxUsers : sessionParticipants.Count);
            for (int i = 0; i < maxSessions; i++)
            {
                for (int j = 0; j < maxUsers; j++)
                {
                    _Clients.Add(new Tuple<BaseClient, Tuple<string, string>, string>(new BaseClient(output),
                    sessionParticipants[j],
                    sessionsUrls[i]));
                }
            }
        }

        [Fact]
        public async Task PerformLoadTest()
        {

            Random rnd = new Random();
            
            Parallel.ForEach(_Clients, client =>
            {
                try
                {

                    // make web request using l.id 
                    // process the data somehow

                    int delay = rnd.Next(1, 13);
                    int port = rnd.Next(4000, 5000);
                    if (portsUsed.Count == 1000)
                        throw new Exception("NO PORTS LEFT!");
                    else
                    {
                        while (portsUsed.Contains(port))
                        {
                            port = rnd.Next(4000, 5000);
                        }
                        portsUsed.Add(port);
                    }

                    //init and wait a random amount of time
                    client.Item1.Initialise(port);
                    Thread.Sleep(delay);

                    //nav and login
                    client.Item1.NavigateExternal(baseUrl + "/Identity/Account/Login");
                    Thread.Sleep(1000);
                    client.Item1.Click("Google");
                    Thread.Sleep(1000);

                    //login creds for google
                    try
                    {
                        client.Item1.ClickLinkText("Use another account");
                        Thread.Sleep(1000);
                    }
                    catch (Exception ex)
                    {
                        // Note this button isn't nessasarily there
                    }

                    client.Item1.SetValueByName("identifier", client.Item2.Item1);
                    Thread.Sleep(1000);
                    client.Item1.Click("identifierNext");
                    Thread.Sleep(1000);
                    client.Item1.SetValueByName("password", client.Item2.Item2);
                    Thread.Sleep(1000);
                    client.Item1.Click("passwordNext");
                    Thread.Sleep(1000);
                    client.Item1.ClickLinkText("Advanced");
                    Thread.Sleep(1000);
                    client.Item1.ClickLinkText("Go to Test Api (unsafe)");//"Go to 2utoring.com (unsafe)");
                    Thread.Sleep(1000);
                    client.Item1.Click("submit_approve_access");
                    Thread.Sleep(1000);

                    //enter classroom
                    client.Item1.NavigateExternal(baseUrl + client.Item3);
                    Thread.Sleep(10000);

                    // Set Panes
                    client.Item1.Click(paneButtons[1]);
                    Thread.Sleep(500);
                    client.Item1.Click("chatInstanceButton_0");
                    Thread.Sleep(500);
                    client.Item1.Click("chatToggle");
                    Thread.Sleep(500);
                    client.Item1.Click("tool_0_Whiteboard");
                    Thread.Sleep(5000);
                    client.Item1.Click("tool_1_Browser");
                    Thread.Sleep(1000);
                    
                    //client.Item1.SetValue("fillColourInput", NewColour(rnd));
                    //client.Item1.SetValue("fillColourBorder", NewColour(rnd));
                    //Thread.Sleep(500);

                    // Join webcam
                    //client.Item1.Click("classroomWebcamController");
                    //Thread.Sleep(500);
                    //client.Item1.Click("button-join");
                    //Thread.Sleep(500);

                    // DO TEN THINGS
                    for (var k = 0; k < maxToDo; k++)
                    {
                        switch (rnd.Next(1, 3))
                        {
                            case 1:
                                DoChat(client.Item1, rnd);
                                break;
                            case 2:
                                DoWhiteboard(client.Item1, rnd);
                                break;
                            default:
                                k--;
                                break;
                        }
                    }
                }
                catch (Exception ex)
                {

                }
                finally //ensure we shut down all browsers otherwise someones laptop will not be happy
                {
                    if (client != null)
                    {
                        try { client.Item1.Dispose(); } catch { }
                    }
                }
            });

            Assert.True(true);
        }

        private string NewColour(Random rnd)
        {
            return "#" + rnd.Next(0, 15).ToString("X") + rnd.Next(0, 15).ToString("X") + rnd.Next(0, 15).ToString("X");
        }

        private void DoChat(BaseClient client, Random rnd)
        {
            client.Click("chatToggle");
            Thread.Sleep(500);
            // Do some text chat
            for (var i = 0; i < maxChatToDo; i++)
            {
                string testString = string.Empty;
                int topPoint = rnd.Next(1, 10);
                for (var j = 0; j < topPoint; j++)
                {
                    testString += "I AM TYPING A TEST STRING. ";
                }
                client.SetValue("chatMessageBox", testString);
                Thread.Sleep(500);
                client.Click("chatSendBtn");
                Thread.Sleep(500);
            }
            client.Click("chatToggle");
            Thread.Sleep(500);
        }

        private void DoWhiteboard(BaseClient client, Random rnd)
        {
            // Do some whiteboard
            IWebElement tempBoard = client.GetDriver().FindElement(By.Id("canvas_temp_0"));
            for (var i = 0; i < maxWhiteboardToDo; i++)
            {
                try
                {
                    switch (rnd.Next(1, 6))
                    {
                        case 1:
                            DrawCustomLine(client, rnd, tempBoard);
                            break;
                        case 2:
                            DrawEraser(client, rnd, tempBoard);
                            break;
                        case 3:
                            DrawFill(client, rnd, tempBoard);
                            break;
                        case 4:
                            DrawShape(client, rnd, tempBoard);
                            break;
                        case 5:
                            DrawSelection(client, rnd, tempBoard);
                            break;
                        default:
                            i--;
                            break;
                    }
                    //client.SetValue("fillColourInput", NewColour(rnd));
                    //client.SetValue("fillColourBorder", NewColour(rnd));
                    Thread.Sleep(500);
                }
                catch (Exception ex)
                {
                    try
                    {
                        client.GetDriver().SwitchTo().Alert().Dismiss();
                    }
                    catch (Exception ex2)
                    {
                        try
                        {
                            client.GetDriver().SwitchTo().Alert().Dismiss();
                        }
                        catch (Exception ex3)
                        {

                        }
                    }
                }
            }
        }

        private void DrawCustomLine(BaseClient client, Random rnd, IWebElement tempBoard)
        {
            client.Click("drawTool_0");
            Thread.Sleep(500);
            Sel.Actions builder = new Sel.Actions(client.GetDriver());
            builder.MoveToElement(tempBoard, rnd.Next(100, 600), rnd.Next(100, 600))
                .ClickAndHold()
                .MoveToElement(tempBoard, rnd.Next(100, 600), rnd.Next(100, 600))
                .MoveToElement(tempBoard, rnd.Next(100, 600), rnd.Next(100, 600))
                .MoveToElement(tempBoard, rnd.Next(100, 600), rnd.Next(100, 600))
                .MoveToElement(tempBoard, rnd.Next(100, 600), rnd.Next(100, 600))
                .Release()
                .Build()
                .Perform();
        }

        private void DrawEraser(BaseClient client, Random rnd, IWebElement tempBoard)
        {
            client.Click("eraserTool_0");
            Thread.Sleep(500);
            Sel.Actions builder = new Sel.Actions(client.GetDriver());
            builder.MoveToElement(tempBoard, rnd.Next(100, 600), rnd.Next(100, 600))
                .ClickAndHold()
                .MoveToElement(tempBoard, rnd.Next(100, 600), rnd.Next(100, 600))
                .MoveToElement(tempBoard, rnd.Next(100, 600), rnd.Next(100, 600))
                .MoveToElement(tempBoard, rnd.Next(100, 600), rnd.Next(100, 600))
                .MoveToElement(tempBoard, rnd.Next(100, 600), rnd.Next(100, 600))
                .Release()
                .Build()
                .Perform();
        }

        private void DrawFill(BaseClient client, Random rnd, IWebElement tempBoard)
        {
            client.Click("fillTool_0");
            Thread.Sleep(500);
            Sel.Actions builder = new Sel.Actions(client.GetDriver());
            builder.MoveToElement(tempBoard, rnd.Next(100, 600), rnd.Next(100, 600))
                .Click()
                .Build()
                .Perform();
        }

        private void DrawShape(BaseClient client, Random rnd, IWebElement tempBoard)
        {
            client.Click("shapeTool_0");
            Thread.Sleep(500);
            switch (rnd.Next(1, 12))
            {
                case 1:
                    client.Click("shapeLineTool_0");
                    break;
                case 2:
                    client.Click("shapeRectangleTool_0");
                    break;
                case 3:
                    client.Click("shapeCircleTool_0");
                    break;
                case 4:
                    client.Click("shapeEllipseTool_0");
                    break;
                case 5:
                    client.Click("shapeTriangleTool_0");
                    break;
                case 6:
                    client.Click("shapeRTriangleTool_0");
                    break;
                case 7:
                    client.Click("shapePentagonTool_0");
                    break;
                case 8:
                    client.Click("shapeHexagonTool_0");
                    break;
                case 9:
                    client.Click("shapeOctagonTool_0");
                    break;
                case 10:
                    client.Click("shapeRhombusTool_0");
                    break;
                case 11:
                    client.Click("shapeCuboidTool_0");
                    break;
                default:
                    client.Click("shapeLineTool_0");
                    break;
            }
            
            Thread.Sleep(500);
            Sel.Actions builder = new Sel.Actions(client.GetDriver());
            builder.MoveToElement(tempBoard, rnd.Next(100, 600), rnd.Next(100, 600))
                .ClickAndHold()
                .MoveToElement(tempBoard, rnd.Next(100, 600), rnd.Next(100, 600))
                .Release()
                .MoveToElement(tempBoard, 90, 90)
                .Click()
                .Build()
                .Perform();
        }

        private void DrawSelection(BaseClient client, Random rnd, IWebElement tempBoard)
        {
            client.Click("selectionTool_0");
            Thread.Sleep(500);
            Sel.Actions builder = new Sel.Actions(client.GetDriver());
            var xS = rnd.Next(100, 600);
            var xE = rnd.Next(100, 600);
            var yS = rnd.Next(100, 600);
            var yE = rnd.Next(100, 600);
            builder.MoveToElement(tempBoard, xS, yS)
                .ClickAndHold()
                .MoveToElement(tempBoard, xE, yE)
                .Release()
                .MoveToElement(tempBoard, (xS + xE) / 2, (yS + yE) / 2)
                .ClickAndHold()
                .MoveToElement(tempBoard, xS > xE ? xS : xE, yS > yE ? yS : yE)
                .Release()
                .MoveToElement(tempBoard, 90, 90)
                .Click()
                .Build()
                .Perform();
        }
    }
}
