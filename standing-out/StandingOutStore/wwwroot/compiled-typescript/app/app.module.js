"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var forms_1 = require("@angular/forms");
var animations_1 = require("@angular/platform-browser/animations");
var ngx_charts_1 = require("@swimlane/ngx-charts");
var ngx_toastr_1 = require("ngx-toastr");
var drag_drop_1 = require("@angular/cdk/drag-drop");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var ng2_file_upload_1 = require("ng2-file-upload");
var ng_select_1 = require("@ng-select/ng-select");
var ng_pick_datetime_1 = require("ng-pick-datetime");
var app_component_1 = require("./app.component");
var flex_layout_1 = require("@angular/flex-layout");
var ngx_gauge_1 = require("ngx-gauge");
var ngx_material_timepicker_1 = require("ngx-material-timepicker");
var slide_toggle_1 = require("@angular/material/slide-toggle");
//import { ImageCropperModule } from 'ngx-image-cropper';
var angular_cropperjs_1 = require("angular-cropperjs");
//custom pipe imports
//module imports
//service imports
var index_1 = require("./services/index");
//global component imports (these should be minimal)
//real items go here
var index_2 = require("./components/index");
//partial items go here
var index_3 = require("./partials/index");
var helpers_1 = require("./helpers");
var slider_1 = require("@angular/material/slider");
var table_1 = require("@angular/material/table");
//import { EditableComponent } from './helpers/editable/editable.component';
//import { ViewModeDirective } from './helpers/editable/view-mode.directive';
//import { EditModeDirective } from './helpers/editable/edit-mode.directive';
//import { FocusableDirective } from './components/subjects/focusable.directive';
//import { EditableOnEnterDirective } from './helpers/editable/edit-on-enter.directive';
var form_field_1 = require("@angular/material/form-field");
var input_1 = require("@angular/material/input");
var paginator_1 = require("@angular/material/paginator");
var select_1 = require("@angular/material/select");
var dialog_1 = require("@angular/material/dialog");
var dialog_2 = require("@angular/material/dialog");
var confirmation_dialog_component_1 = require("./components/company-register/company-register/confirmation-dialog.component");
var company_dashboard_component_1 = require("./components/company/company-dashboard/company-dashboard.component");
var angular_1 = require("@fullcalendar/angular");
var daygrid_1 = require("@fullcalendar/daygrid"); // a plugin	
var interaction_1 = require("@fullcalendar/interaction"); // a plugin	
var dialog_content_example_1 = require("./components/calender/dialog-content-example");
var tutor_courses_component_1 = require("./components/tutor/tutor-courses/tutor-courses.component");
var course_class_sessions_dialog_component_1 = require("./components/courses/course-class-sessions-dialog/course-class-sessions-dialog.component");
var common_1 = require("@angular/common");
var dbscheck_dialog_component_1 = require("./components/tutor/tutor-subscription-details/dbscheck-dialog.component");
var custom_date_pipe_1 = require("./pipe/custom-date-pipe");
var shortName_pipe_1 = require("./components/class-sessions/class-sessions-students/shortName.pipe");
var ngx_angular_autocomplete_1 = require("ngx-angular-autocomplete");
var scrolling_1 = require("@angular/cdk/scrolling");
var custom_random_image_pipe_1 = require("./pipe/custom-random-image-pipe");
var timegrid_1 = require("@fullcalendar/timegrid");
angular_1.FullCalendarModule.registerPlugins([
    daygrid_1.default,
    interaction_1.default,
    timegrid_1.default
]);
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            //components go here
            declarations: [
                //EditableComponent,
                //ViewModeDirective,
                //EditModeDirective,
                //FocusableDirective,
                //EditableOnEnterDirective,
                app_component_1.AppComponent,
                index_2.UsersIndexComponent,
                index_2.UtilitiesDeleteModal,
                index_2.UtilitiesAlertModal,
                index_2.GoogleLinkModal,
                index_2.TutorRegisterComponent,
                index_2.SearchComponent,
                index_2.LessonViewComponent,
                index_2.TutorProfileViewComponent,
                index_2.CompanyProfileViewComponent,
                index_2.StudentEnrollComponent,
                index_2.GuardianEnrollComponent,
                index_3.LessonCardComponent,
                index_3.TutorCardComponent,
                index_2.StudyLevelsIndexComponent,
                index_2.SubjectsIndexComponent,
                index_2.SubjectCategoriesIndexComponent,
                index_2.TutorsIndexComponent,
                index_3.PurchaseJourneyComponent,
                index_3.LessonSignInModal,
                index_3.CourseLessonSignInModal,
                index_3.LessonEnrollModal,
                index_3.LessonEnrollLinkedAccountModal,
                index_3.TickModal,
                index_2.TutorDetailsComponent,
                index_2.ClassSessionsIndexComponent,
                index_2.ClassSessionsDetailsComponent,
                index_2.ClassSessionsMaterialComponent,
                index_2.ClassSessionsStudentsComponent,
                index_2.SettingsPayoutComponent,
                index_2.SessionInviteModalComponent,
                index_2.ClassSessionsRegisterComponent,
                index_2.LessonTimetableComponent,
                index_2.SafeguardingCreateComponent,
                index_2.UserGuardianSettingsComponent,
                index_2.UserStudentSettingsComponent,
                index_3.PaymentCardComponent,
                index_2.ReceiptsIndexComponent,
                index_3.SearchMiniComponent,
                index_2.HomeIndexComponent,
                index_2.TutorProfileWrapperComponent,
                index_2.CompanyProfileWrapperComponent,
                index_2.CompanySubscriptionDetailsComponent,
                index_2.CompanyAccountDetailsComponent,
                index_2.TutorBankDetailsListComponent,
                index_2.TutorProfileEditComponent,
                index_2.TutorDashboardComponent,
                index_2.TutorAccountDetailsComponent,
                index_2.TutorDbsDetailsComponent,
                index_2.TutorProfilePublicWrapperComponent,
                index_2.CompanyProfilePublicWrapperComponent,
                index_2.TutorEarningsComponent,
                index_2.ClassSessionsIndexWrapperComponent,
                index_2.SafeguardingIndexComponent,
                index_2.TutorSubscriptionDetailsComponent,
                index_2.ClassSessionsAdminIndexComponent,
                index_2.ClassSessionAdminDetailsComponent,
                index_2.DashboardAdminComponent,
                index_3.ClassSessionMaterialUploaderComponent,
                index_2.DocumentPermissionModalComponent,
                index_2.SessionGroupsModalComponent,
                index_2.UserChangePasswordComponent,
                index_2.UserLinkAccountComponent,
                index_2.SubjectStudyLevelSetupIndexComponent,
                index_2.CompanyRegisterComponent,
                index_2.SubscriptionPlanComponent,
                confirmation_dialog_component_1.ConfirmationDialog,
                index_2.SaveConfirmDialog,
                index_2.MainSearchComponent,
                index_2.CoursesComponent,
                index_2.TutorSearchComponent,
                index_2.CourseDetailsComponent,
                index_3.PrivateTutorPlanCardComponent,
                index_3.CompanyPlanCardComponent, index_3.NoFeeTutorPlanCardComponent,
                index_3.ProfessionalTutorPlanCardComponent, index_3.StarterTutorPlanCardComponent, index_3.CourseCardComponent,
                company_dashboard_component_1.CompanyDashboardComponent,
                index_2.CompanyCoursesComponent,
                index_2.CompanyManageCourseComponent,
                index_2.CalenderComponent,
                dialog_content_example_1.DialogContentExampleDialog,
                index_2.CoursesIndexComponent,
                tutor_courses_component_1.TutorCoursesComponent,
                course_class_sessions_dialog_component_1.CourseClassSessionsDialogComponent,
                index_2.TutorInviteModalComponent,
                index_2.CourseUploadDialogComponent,
                index_2.InviteStudentDialogComponent,
                index_2.TutorInfoDialogComponent,
                index_2.SubjectStudylevelCreateDialogComponent,
                index_2.SubjectStudylevelInfoDialogComponent,
                index_2.CourseViewComponent,
                dbscheck_dialog_component_1.DbsCheckDialog,
                index_2.TutorCreateCourseComponent,
                index_2.TutorScheduleCalendarComponent,
                custom_date_pipe_1.CustomDatePipe,
                custom_random_image_pipe_1.CustomRandomPipe,
                index_2.CalenderSchedulerComponent,
                index_2.AvailabilityDialog,
                shortName_pipe_1.ShortNamePipe,
                index_2.WebsiteContactComponent
            ],
            entryComponents: [
                index_2.UtilitiesDeleteModal,
                index_2.UtilitiesAlertModal,
                index_2.GoogleLinkModal,
                index_3.LessonSignInModal,
                index_3.LessonEnrollModal,
                index_3.LessonEnrollLinkedAccountModal,
                index_2.SessionInviteModalComponent,
                index_3.TickModal,
                index_2.DocumentPermissionModalComponent,
                index_2.SessionGroupsModalComponent,
                confirmation_dialog_component_1.ConfirmationDialog,
                index_2.SaveConfirmDialog,
                dialog_content_example_1.DialogContentExampleDialog,
                index_2.CourseUploadDialogComponent,
                index_2.InviteStudentDialogComponent,
                index_2.TutorInfoDialogComponent,
                index_2.SubjectStudylevelCreateDialogComponent,
                index_2.SubjectStudylevelInfoDialogComponent,
                dbscheck_dialog_component_1.DbsCheckDialog,
                index_2.AvailabilityDialog
            ],
            exports: [
                index_2.UtilitiesDeleteModal,
                index_2.UtilitiesAlertModal,
                index_2.GoogleLinkModal,
                index_3.LessonSignInModal,
                index_3.LessonEnrollModal,
                index_3.LessonEnrollLinkedAccountModal,
                index_3.TickModal,
                index_2.DocumentPermissionModalComponent,
                index_2.SessionGroupsModalComponent,
                index_2.TutorInviteModalComponent
            ],
            //imports
            imports: [
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                angular_cropperjs_1.AngularCropperjsModule,
                platform_browser_1.BrowserModule,
                http_1.HttpClientModule,
                animations_1.BrowserAnimationsModule,
                ngx_charts_1.NgxChartsModule,
                ngx_toastr_1.ToastrModule.forRoot({ preventDuplicates: true }),
                drag_drop_1.DragDropModule,
                ng_bootstrap_1.NgbModule,
                ng2_file_upload_1.FileUploadModule,
                ng_select_1.NgSelectModule,
                ng_pick_datetime_1.OwlDateTimeModule,
                ng_pick_datetime_1.OwlNativeDateTimeModule,
                slider_1.MatSliderModule,
                table_1.MatTableModule,
                input_1.MatInputModule,
                form_field_1.MatFormFieldModule,
                paginator_1.MatPaginatorModule,
                select_1.MatSelectModule,
                flex_layout_1.FlexLayoutModule,
                dialog_1.MatDialogModule,
                ngx_gauge_1.NgxGaugeModule,
                angular_1.FullCalendarModule,
                ngx_material_timepicker_1.NgxMaterialTimepickerModule,
                ng_bootstrap_1.NgbCollapseModule,
                common_1.CommonModule,
                slide_toggle_1.MatSlideToggleModule,
                ngx_angular_autocomplete_1.NgxAutocompleteModule,
                scrolling_1.ScrollingModule,
            ],
            //services go here
            providers: [
                index_1.EnumsService,
                index_1.UsersService,
                index_1.TutorsService,
                index_1.TutorCertificatesService,
                index_1.TutorQualificationsService,
                index_1.TutorSubjectsService,
                index_1.CompanySubjectsService,
                index_1.StripeCountrysService,
                index_1.StripePlansService,
                index_1.SubjectsService,
                index_1.SubjectCategoriesService,
                index_1.StudyLevelsService,
                index_1.ClassSessionsService,
                index_1.StripeService,
                index_1.PromoCodeService,
                index_1.SessionMediasService,
                index_1.SessionInvitesService,
                index_1.SessionAttendeesService,
                index_1.SettingsService,
                index_1.SessionDocumentsService,
                index_1.SafeguardingReportsService,
                helpers_1.UtilitiesHelper,
                index_1.DashboardService,
                index_1.SessionGroupsService,
                index_1.ClassSessionFeaturesService,
                index_1.SubjectStudyLevelSetupService,
                index_1.CompanyService,
                index_1.CoursesService,
                index_1.MainSearchService,
                index_1.WebsiteContactService,
                index_1.ParentStudentCoursesService,
                { provide: ng_pick_datetime_1.OWL_DATE_TIME_LOCALE, useValue: 'gb' },
                { provide: dialog_2.MAT_DIALOG_DATA, useValue: {} },
                { provide: dialog_1.MatDialogRef, useValue: {} },
                common_1.DatePipe
            ],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map