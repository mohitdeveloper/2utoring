using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using StandingOutStore.Business.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DTO = StandingOut.Data.DTO;
using Models = StandingOut.Data.Models;

namespace StandingOutStore.Controllers
{
    public class SearchController : Controller
    {
        private readonly UserManager<Models.User> _UserManager;
        private readonly ISubjectService _SubjectService;
        private readonly ISubjectCategoryService _SubjectCategoryService;
        private readonly IStudyLevelService _StudyLevelService;

        public SearchController(UserManager<Models.User> userManager, ISubjectService subjectService,
            ISubjectCategoryService subjectCategoryService, IStudyLevelService studyLevelService)
        {
            _UserManager = userManager;
            _SubjectService = subjectService;
            _SubjectCategoryService = subjectCategoryService;
            _StudyLevelService = studyLevelService;
        }

        // Search mvc post to be used from index -> search page itself makes use of API
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Post(DTO.LessonSearch model)
        {
            string url = "";

            if (!string.IsNullOrWhiteSpace(model.Subject))
                url += $"/subject/{Uri.EscapeDataString(model.Subject)}";

            if (!string.IsNullOrWhiteSpace(model.SubjectCategory))
                url += $"/learn/{Uri.EscapeDataString(model.SubjectCategory)}";

            if (!string.IsNullOrWhiteSpace(model.StudyLevelUrl))
                url += $"/level/{Uri.EscapeDataString(model.StudyLevelUrl)}";

            var baseRoute = Url.RouteUrl("Search");

            return Redirect($"{baseRoute}{url}");
        }


        public async Task<IActionResult> Index(bool under = true, string search = null, int page = 1)
        {
            var request = Request;
            var data = await GetRouteData(request);

            string subject = data.GetValueOrDefault("subject");
            string category = data.GetValueOrDefault("learn");
            string level = data.GetValueOrDefault("level");

            ViewBag.SubjectId = subject;
            ViewBag.SubjectCategoryId = category;
            ViewBag.StudyLevelId = level;
            ViewBag.IsUnder16 = under;
            ViewBag.Search = search;
            ViewBag.Page = page < 1 ? 1 : page;
            ViewBag.CanUserBuy = !(User.Identity.IsAuthenticated && (await _UserManager.IsInRoleAsync(await _UserManager.FindByEmailAsync(User.Identity.Name), "Tutor") || User.IsInRole("Admin")));
            ViewBag.IsLoggedIn = User.Identity.IsAuthenticated;
            if (User.Identity.IsAuthenticated)
            {
                var user = await _UserManager.FindByNameAsync(User.Identity.Name);
                ViewBag.IsGuardian = user.IsParent;
            }
            else
                ViewBag.IsGuardian = false;

            await GenerateMeta(subject, category, level);
            return View();
        }


        private async Task<Dictionary<string, string>> GetRouteData(HttpRequest request)
        {
            var searchParams = new Dictionary<string, string>();
            try
            {
                var data = request.RouteValues.GetValueOrDefault("data");

                if (data != null)
                {
                    var tokens = data.ToString().Split('/');

                    for (var i = 0; i < tokens.Length; i++)
                    {
                        searchParams.Add(tokens[i], tokens[++i].ToLower());
                    }
                }
            }
            catch
            {
                // do nothing
            }

            return searchParams;
        }

        private async Task GenerateMeta(string subjectUrl = null, string categoryUrl = null, string levelUrl = null)
        {
            Models.Subject subject = null;
            Models.SubjectCategory category = null;
            Models.StudyLevel studyLevel = null;

            string title = "";
            string description = "View all of the ";
            string additionalKeywords = "";

            bool first = true;


            if (!string.IsNullOrWhiteSpace(levelUrl))
            {
                studyLevel = await _StudyLevelService.GetByUrl(levelUrl);

                if (studyLevel != null)
                {
                    if (!first)
                    {
                        title += ", ";
                        description += ", ";
                        additionalKeywords += ", ";
                    }

                    title += studyLevel.Name;
                    description += studyLevel.Name;
                    additionalKeywords += studyLevel.Name;

                    first = false;
                }
            }


            if (!string.IsNullOrWhiteSpace(subjectUrl))
            {
                subject = await _SubjectService.GetByUrl(subjectUrl);

                if (subject != null)
                {
                    if (!first)
                    {
                        title += ", ";
                        description += ", ";
                        additionalKeywords += ", ";
                    }

                    title += subject.Name;
                    description += subject.Name;
                    additionalKeywords += subject.Name;
                    first = false;
                }
            }

            if (!string.IsNullOrWhiteSpace(categoryUrl))
            {
                category = await _SubjectCategoryService.GetByUrl(categoryUrl);

                if (category != null)
                {
                    if (!first)
                    {
                        title += ", ";
                        description += ", ";
                        additionalKeywords += ", ";
                    }

                    title += category.Name;
                    description += category.Name;
                    additionalKeywords += category.Name;

                    first = false;
                }
            }



            if (first)
            {
                title = "Find a Lesson";
                description = "Search by subject, age group and level to discover and buy online classes of your choosing.";
            }
            else
            {
                title += " Lessons";
                description += " Lessons";
            }




            ViewData["Title"] = title;
            ViewBag.Description = description;
            ViewBag.AdditionalKeywords = additionalKeywords;
        }

        public async Task<IActionResult> MainSearch()
        {
            ViewData["Title"] = ":: Search ::";
            ViewBag.Description = "Search by subject, age group and level to discover and buy online classes of your choosing.";
            ViewBag.AdditionalKeywords = "course,classroom,subject,level";
            return View();
        }

        [Route("tutor-course-search")]
        public async Task<IActionResult> TutorCourseSearch()
        {
            ViewData["Title"] = ":: Course Search ::";
            ViewBag.Description = "Search by subject, age group and level to discover and buy online classes of your choosing.";
            ViewBag.AdditionalKeywords = "course,classroom,subject,level";
            return View();
        }

        [Route("tutor-search")]
        public async Task<IActionResult> TutorSearch()
        {
            ViewData["Title"] = ":: Tutor Search ::";
            ViewBag.Description = "Search by subject, age group and level to discover and buy online classes of your choosing.";
            ViewBag.AdditionalKeywords = "course,classroom,subject,level";
            return View();
        }
       
        [Route("course-search")]
        [Route("find-a-lesson")]
        public async Task<IActionResult> CourseSearch()
        {
            ViewData["Title"] = ":: Course Search ::";
            ViewBag.Description = "Search by subject, age group and level to discover and buy online classes of your choosing.";
            ViewBag.AdditionalKeywords = "course,classroom,subject,level";
            return View();
        }
    }
}
