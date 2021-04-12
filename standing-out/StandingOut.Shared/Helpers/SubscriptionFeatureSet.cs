using StandingOut.Data.DTO;
using StandingOut.Data.Enums;
using StandingOut.Shared.Helpers.Extensions;
using StandingOut.Shared.Infrastructure.Exceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using Models = StandingOut.Data.Models;

namespace StandingOut.Shared
{
    [Serializable]
    public class SubscriptionFeatureSet
    {
        public SubscriptionFeatureSet(List<Models.SubscriptionFeature> subscriptionFeatures)
        {
            SubscriptionFeatures = subscriptionFeatures;
        }

        private List<Models.SubscriptionFeature> SubscriptionFeatures { get; }

        public int ClassSize(FeatureArea featureArea, FeatureContext context)
        {
            var subscriptionFeature = FindFeature(new Models.Feature { Name = "ClassSize", FeatureArea = featureArea.ToString(), Context = context.ToString() });
            if (subscriptionFeature?.Setting == null) throw new SettingNotFoundException("ClassSize setting not found");

            if (int.TryParse(subscriptionFeature.Setting.Trim(), out var returnVal))
            {
                return returnVal;
            }
            throw new InvalidSettingException("ClassSize value is invalid");
        }

        //public int GroupSize(FeatureArea featureArea, FeatureContext context)
        //{
        //    var subscriptionFeature = FindFeature(new Models.Feature { Name = "GroupSize", FeatureArea = featureArea.ToString(), Context = context.ToString() });
        //    if (subscriptionFeature?.Setting == null) throw new SettingNotFoundException("GroupSize setting not found");

        //    if (int.TryParse(subscriptionFeature.Setting.Trim(), out var returnVal))
        //    {
        //        return returnVal;
        //    }
        //    throw new InvalidSettingException("GroupSize value is invalid");
        //}

        public int MaxGroups(FeatureArea featureArea, FeatureContext context)
        {
            var subscriptionFeature = FindFeature(new Models.Feature { Name = "MaxGroups", FeatureArea = featureArea.ToString(), Context = context.ToString() });
            if (subscriptionFeature?.Setting == null) throw new SettingNotFoundException("MaxGroups setting not found");

            if (int.TryParse(subscriptionFeature.Setting.Trim(), out var returnVal))
            {
                return returnVal;
            }
            throw new InvalidSettingException("MaxGroups value is invalid");
        }

        // 30 in DB means 30% commission
        //public decimal CommissionPerStudent(FeatureArea featureArea, int studentCount)
        //{
        //    var subscriptionFeature = FindFeature(new Models.Feature { Name = "CommissionPerStudent", FeatureArea = featureArea.ToString(), Context = studentCount.ToString() });
        //    if (subscriptionFeature?.Setting == null) throw new SettingNotFoundException("CommissionPerStudent setting not found");

        //    if (decimal.TryParse(subscriptionFeature.Setting.Trim(), out var returnVal))
        //    {
        //        return returnVal;
        //    }
        //    throw new InvalidSettingException("CommissionPerStudent value is invalid");
        //}

        public List<CommissionPerStudentTier> GetCommissionPerStudentTiers(FeatureArea featureArea, FeatureContext context)
        {
            // Feature Name = 
            var featureName = "StudentAttendancePerMonthTier";
            var ruleCriteria = "StudentAttendanceRange";
            var retval = new List<CommissionPerStudentTier>();

            var subscriptionFeatures = GetFeatureSettingsForRuleCriteria(
                                    new Models.Feature
                                    {
                                        Name = featureName,
                                        FeatureArea = featureArea.ToString(),
                                        Context = context.ToString()
                                    }, ruleCriteria);

            foreach (var sf in subscriptionFeatures)
            {
                var tier = new CommissionPerStudentTier { RuleCriteria = sf.RuleCriteria, RuleMin = sf.RuleMin ?? 0, RuleMax = sf.RuleMax ?? 999999 };
                if (decimal.TryParse(sf.Setting.Trim(), out var decimalVal))
                {
                    tier.Setting = decimalVal;
                }else{ 
                    throw new InvalidSettingException($"CommissionPerStudent value is invalid for RuleCriteria {sf.RuleCriteria}");
                };
                retval.Add(tier);
            };
            return retval;
        }

        public int MinutesBeforeEntry(FeatureArea featureArea, FeatureContext context)
        {
            var subscriptionFeature = FindFeature(new Models.Feature { Name = "MinutesBeforeEntry", FeatureArea = featureArea.ToString(), Context = context.ToString() });
            if (subscriptionFeature?.Setting == null) throw new SettingNotFoundException("MinutesBeforeEntry setting not found");

            if (int.TryParse(subscriptionFeature.Setting.Trim(), out var returnVal))
            {
                return returnVal;
            }
            throw new InvalidSettingException("MinutesBeforeEntry value is invalid");
        }

        public bool PrivateLessons(FeatureArea featureArea, FeatureContext context)
        {
            var subscriptionFeature = FindFeature(new Models.Feature { Name = "PrivateLessons", FeatureArea = featureArea.ToString(), Context = context.ToString() });
            if (subscriptionFeature?.Setting == null) throw new SettingNotFoundException("PrivateLessons setting not found");

            if (subscriptionFeature.Setting.Trim().TryParseBool(out var returnVal))
            {
                return returnVal != null && returnVal.Value;
            }
            throw new InvalidSettingException("PrivateLessons value is invalid");
        }
        public bool SessionRecording(FeatureArea featureArea, FeatureContext context)
        {
            var subscriptionFeature = FindFeature(new Models.Feature { Name = "SessionRecording", FeatureArea = featureArea.ToString(), Context = context.ToString() });
            if (subscriptionFeature?.Setting == null) throw new SettingNotFoundException("SessionRecording setting not found");

            if (subscriptionFeature.Setting.Trim().TryParseBool(out var returnVal))
            {
                return returnVal != null && returnVal.Value;
            }
            throw new InvalidSettingException("SessionRecording value is invalid");
        }

        public bool TriPane(FeatureArea featureArea, FeatureContext context)
        {
            var subscriptionFeature = FindFeature(new Models.Feature { Name = "TriPane", FeatureArea = featureArea.ToString(), Context = context.ToString() });
            if (subscriptionFeature?.Setting == null) throw new SettingNotFoundException("TriPane setting not found");

            if (subscriptionFeature.Setting.Trim().TryParseBool(out var returnVal))
            {
                return returnVal != null && returnVal.Value;
            }
            throw new InvalidSettingException("TriPane value is invalid");
        }
        public bool QuadPane(FeatureArea featureArea, FeatureContext context)
        {
            var subscriptionFeature = FindFeature(new Models.Feature { Name = "QuadPane", FeatureArea = featureArea.ToString(), Context = context.ToString() });
            if (subscriptionFeature?.Setting == null) throw new SettingNotFoundException("QuadPane setting not found");

            if (subscriptionFeature.Setting.Trim().TryParseBool(out var returnVal))
            {
                return returnVal != null && returnVal.Value;
            }
            throw new InvalidSettingException("QuadPane value is invalid");
        }
        public bool ApprovalRequired(FeatureArea featureArea, FeatureContext context)
        {
            var subscriptionFeature = FindFeature(new Models.Feature { Name = "ApprovalRequired", FeatureArea = featureArea.ToString(), Context = context.ToString() });
            if (subscriptionFeature?.Setting == null) throw new SettingNotFoundException("ApprovalRequired setting not found");

            if (subscriptionFeature.Setting.Trim().TryParseBool(out var returnVal))
            {
                return returnVal != null && returnVal.Value;
            }
            throw new InvalidSettingException("ApprovalRequired value is invalid");
        }

        public bool Under18(FeatureArea featureArea, FeatureContext context)
        {
            var subscriptionFeature = FindFeature(new Models.Feature { Name = "Under18", FeatureArea = featureArea.ToString(), Context = context.ToString() });
            if (subscriptionFeature?.Setting == null) throw new SettingNotFoundException("Under18 setting not found");

            if (subscriptionFeature.Setting.Trim().TryParseBool(out var returnVal))
            {
                return returnVal != null && returnVal.Value;
            }
            throw new InvalidSettingException("Under18 value is invalid");
        }


        public bool CompletedLesson(FeatureArea featureArea, FeatureContext context)
        {
            var subscriptionFeature = FindFeature(new Models.Feature { Name = "CompletedLesson", FeatureArea = featureArea.ToString(), Context = context.ToString() });
            if (subscriptionFeature?.Setting == null) throw new SettingNotFoundException("CompletedLesson setting not found");

            if (subscriptionFeature.Setting.Trim().TryParseBool(out var returnVal))
            {
                return returnVal != null && returnVal.Value;
            }
            throw new InvalidSettingException("CompletedLesson value is invalid");
        }

        public int PrivateLessonCount(FeatureArea featureArea, FeatureContext context)
        {
            var subscriptionFeature = FindFeature(new Models.Feature { Name = "PrivateLessonCount", FeatureArea = featureArea.ToString(), Context = context.ToString() });
            if (subscriptionFeature?.Setting == null) throw new SettingNotFoundException("PrivateLessonCount setting not found");

            if (int.TryParse(subscriptionFeature.Setting.Trim(), out var returnVal))
            {
                return returnVal;
            }
            throw new InvalidSettingException("PrivateLessonCount value is invalid");
        }

        public int PublicLessonCount(FeatureArea featureArea, FeatureContext context)
        {
            var subscriptionFeature = FindFeature(new Models.Feature { Name = "PublicLessonCount", FeatureArea = featureArea.ToString(), Context = context.ToString() });
            if (subscriptionFeature?.Setting == null) throw new SettingNotFoundException("PublicLessonCount setting not found");

            if (int.TryParse(subscriptionFeature.Setting.Trim(), out var returnVal))
            {
                return returnVal;
            }
            throw new InvalidSettingException("PublicLessonCount value is invalid");
        }

        private Models.SubscriptionFeature FindFeature(Models.Feature feature)
        {
            return SubscriptionFeatures.FirstOrDefault(x => x.Feature.Name == feature.Name &&
                                                            x.Feature.Context == feature.Context &&
                                                            x.Feature.FeatureArea == feature.FeatureArea);
        }

        // Gets all tiers for a RuleCriteria
        private List<Models.SubscriptionFeature> GetFeatureSettingsForRuleCriteria(Models.Feature feature, string RuleCriteria)
        {
            return SubscriptionFeatures.Where(x => x.Feature.Name == feature.Name &&
                                                            x.Feature.Context == feature.Context &&
                                                            x.Feature.FeatureArea == feature.FeatureArea &&
                                                            x.RuleCriteria.ToLowerInvariant() == RuleCriteria.ToLowerInvariant()).ToList();
        }
    }

    // Only used by Store > ClassSessionsController
    public static class SubscriptionFeatureSetExtensions
    {
        public static ClassSessionFeatures ToClassSessionFeatures(this SubscriptionFeatureSet subscriptionFeatureSet)
        {
            var classSessionFeatures = new ClassSessionFeatures
            {
                TutorDashboard_CreateLesson_Session_MaxPersons =
                    subscriptionFeatureSet.ClassSize(FeatureArea.TutorDashboard, FeatureContext.CreateLesson),
                TutorDashboard_EditLesson_Session_MaxPersons =
                    subscriptionFeatureSet.ClassSize(FeatureArea.TutorDashboard, FeatureContext.EditLesson),
                TutorDashboard_CreateCourse_PrivateLessonCount =
                    subscriptionFeatureSet.PrivateLessonCount(FeatureArea.TutorDashboard, FeatureContext.CreateCourse),
                TutorDashboard_EditCourse_PrivateLessonCount =
                    subscriptionFeatureSet.PrivateLessonCount(FeatureArea.TutorDashboard, FeatureContext.EditCourse),
                TutorDashboard_CreateCourse_PublicLessonCount =
                    subscriptionFeatureSet.PublicLessonCount(FeatureArea.TutorDashboard, FeatureContext.CreateCourse),
                TutorDashboard_EditCourse_PublicLessonCount =
                    subscriptionFeatureSet.PublicLessonCount(FeatureArea.TutorDashboard, FeatureContext.EditCourse),
                Classroom_ClassroomEntryTime_MinutesBeforeEntry =
                    subscriptionFeatureSet.MinutesBeforeEntry(FeatureArea.Classroom, FeatureContext.ClassroomEntryTime),
                ClassroomTutorCommand_Groups_MaxGroups =
                    subscriptionFeatureSet.MaxGroups(FeatureArea.ClassroomTutorCommand, FeatureContext.Groups),
                TutorDashboard_Lesson_MaxGroups =
                    subscriptionFeatureSet.MaxGroups(FeatureArea.TutorDashboard, FeatureContext.Lesson),
                Menu_Panes_TriPaneEnabled =
                    subscriptionFeatureSet.TriPane(FeatureArea.ClassroomMenu, FeatureContext.Panes),
                Menu_Panes_QuadPaneEnabled =
                    subscriptionFeatureSet.QuadPane(FeatureArea.ClassroomMenu, FeatureContext.Panes),
                Classroom_EnterClass_SessionRecordingEnabled =
                    subscriptionFeatureSet.SessionRecording(FeatureArea.Classroom, FeatureContext.EnterClass),
                TutorDashboard_View_CompletedLesson =
                    subscriptionFeatureSet.CompletedLesson(FeatureArea.TutorDashboard, FeatureContext.View),
                StudentDashboard_View_CompletedLesson =
                    subscriptionFeatureSet.CompletedLesson(FeatureArea.StudentDashboard, FeatureContext.View),
                TutorDashboard_CreateCourse_Under18 =
                    subscriptionFeatureSet.Under18(FeatureArea.TutorDashboard, FeatureContext.CreateCourse),
                TutorDashboard_EditCourse_Under18 =
                    subscriptionFeatureSet.Under18(FeatureArea.TutorDashboard, FeatureContext.EditCourse),
                AdminDashboard_DBSApproval_ApprovalRequired =
                    subscriptionFeatureSet.ApprovalRequired(FeatureArea.AdminDashboard, FeatureContext.DBSApproval),
                AdminDashboard_ProfileApproval_ApprovalRequired =
                    subscriptionFeatureSet.ApprovalRequired(FeatureArea.AdminDashboard, FeatureContext.ProfileApproval),

                Admin_CommissionPerStudent_StudentAttendancePerMonthTiers = new List<CommissionPerStudentTier>(),

                //Admin_CommissionPerStudent = new decimal[10], // Cant set value as we dont know what the student count is?
            };

            //for (var i = 0; i <= 9; i++)
            //{
            //    classSessionFeatures.Admin_CommissionPerStudent[i] =
            //        subscriptionFeatureSet.CommissionPerStudent(FeatureArea.Admin, i + 1);
            //}

            classSessionFeatures.Admin_CommissionPerStudent_StudentAttendancePerMonthTiers =
                subscriptionFeatureSet.GetCommissionPerStudentTiers(FeatureArea.Admin, FeatureContext.CommissionPerStudent);

            return classSessionFeatures;
        }
    }
}
