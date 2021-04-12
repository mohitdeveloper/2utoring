import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Input } from '@angular/core';
import { Calendar } from '@fullcalendar/core'; // include this line
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ToastrModule } from 'ngx-toastr';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgbModule, NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { FileSelectDirective, FileUploadModule } from 'ng2-file-upload';
import { NgSelectModule } from '@ng-select/ng-select';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { AppComponent } from './app.component';
import { FlexLayoutModule } from "@angular/flex-layout";
import { NgxGaugeModule } from 'ngx-gauge';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
//import { ImageCropperModule } from 'ngx-image-cropper';
import { AngularCropperjsModule } from 'angular-cropperjs';


 

//custom pipe imports

//module imports

//service imports

import {
    EnumsService, UsersService, TutorsService, TutorCertificatesService, TutorQualificationsService, TutorSubjectsService, StripeCountrysService, StripePlansService,
    SubjectsService, SubjectCategoriesService, StudyLevelsService, ClassSessionsService, StripeService, PromoCodeService, SessionMediasService, SessionInvitesService,
    SessionAttendeesService, SettingsService, SessionDocumentsService, SafeguardingReportsService, DashboardService, SessionGroupsService, ClassSessionFeaturesService, WebsiteContactService,
    SubjectStudyLevelSetupService, CompanyService, CompanySubjectsService, CoursesService, MainSearchService, ParentStudentCoursesService
} from './services/index';

//global component imports (these should be minimal)
//real items go here
import {
    UsersIndexComponent, UtilitiesDeleteModal, UtilitiesAlertModal, GoogleLinkModal, TutorRegisterComponent, SearchComponent, LessonViewComponent,
    StudyLevelsIndexComponent, TutorProfileViewComponent, SubjectsIndexComponent, SubjectCategoriesIndexComponent, TutorsIndexComponent, StudentEnrollComponent,
    ClassSessionsIndexComponent, ClassSessionsDetailsComponent, TutorDetailsComponent, ClassSessionsMaterialComponent, ClassSessionsStudentsComponent,
    GuardianEnrollComponent, SessionInviteModalComponent, SettingsPayoutComponent, ClassSessionsRegisterComponent, LessonTimetableComponent, SafeguardingCreateComponent,
    UserGuardianSettingsComponent, UserStudentSettingsComponent, TutorProfileWrapperComponent, TutorProfileEditComponent, ReceiptsIndexComponent, HomeIndexComponent, TutorDashboardComponent,
    TutorAccountDetailsComponent, TutorDbsDetailsComponent, TutorProfilePublicWrapperComponent, TutorEarningsComponent, ClassSessionsIndexWrapperComponent, SafeguardingIndexComponent, TutorSubscriptionDetailsComponent,
    ClassSessionsAdminIndexComponent, ClassSessionAdminDetailsComponent, DashboardAdminComponent, DocumentPermissionModalComponent,
    SessionGroupsModalComponent, UserChangePasswordComponent, UserLinkAccountComponent, SubjectStudyLevelSetupIndexComponent, 
    CompanyRegisterComponent, SubscriptionPlanComponent,
    CompanyProfileWrapperComponent, CompanyProfileViewComponent, CompanyProfilePublicWrapperComponent, CompanySubscriptionDetailsComponent, CompanyAccountDetailsComponent, TutorBankDetailsListComponent, CompanyCoursesComponent, CompanyManageCourseComponent, CalenderComponent, CalenderSchedulerComponent, AvailabilityDialog, CoursesIndexComponent, TutorInviteModalComponent, CourseUploadDialogComponent, InviteStudentDialogComponent, SubjectStudylevelCreateDialogComponent, SubjectStudylevelInfoDialogComponent, CourseViewComponent, TutorInfoDialogComponent, TutorCreateCourseComponent, TutorScheduleCalendarComponent, SaveConfirmDialog, MainSearchComponent, CoursesComponent, TutorSearchComponent, CourseDetailsComponent, WebsiteContactComponent 
} from './components/index';
//partial items go here
import {
    LessonCardComponent, TutorCardComponent, LessonSignInModal, CourseLessonSignInModal, PurchaseJourneyComponent, TickModal, 
    PaymentCardComponent, SearchMiniComponent, ClassSessionMaterialUploaderComponent,
    LessonEnrollModal, LessonEnrollLinkedAccountModal, 
    CompanyPlanCardComponent, NoFeeTutorPlanCardComponent, PrivateTutorPlanCardComponent,
    ProfessionalTutorPlanCardComponent, StarterTutorPlanCardComponent, CourseCardComponent,
    } from './partials/index';

import { RouterModule } from '@angular/router';import { UtilitiesHelper } from './helpers';
import { ɵAnimationEngine } from '@angular/animations/browser';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table'; 

//import { EditableComponent } from './helpers/editable/editable.component';
//import { ViewModeDirective } from './helpers/editable/view-mode.directive';
//import { EditModeDirective } from './helpers/editable/edit-mode.directive';
//import { FocusableDirective } from './components/subjects/focusable.directive';
//import { EditableOnEnterDirective } from './helpers/editable/edit-on-enter.directive';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationDialog } from './components/company-register/company-register/confirmation-dialog.component';
import { CompanyDashboardComponent } from './components/company/company-dashboard/company-dashboard.component';	
import { FullCalendarModule } from '@fullcalendar/angular';	
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin	
import interactionPlugin from '@fullcalendar/interaction'; // a plugin	
import { DialogContentExampleDialog } from './components/calender/dialog-content-example';
import { TutorCoursesComponent } from './components/tutor/tutor-courses/tutor-courses.component';
import { CourseClassSessionsDialogComponent } from './components/courses/course-class-sessions-dialog/course-class-sessions-dialog.component';
import { CommonModule, DatePipe } from '@angular/common';
import { DbsCheckDialog } from './components/tutor/tutor-subscription-details/dbscheck-dialog.component';
import { CustomDatePipe } from './pipe/custom-date-pipe';
import { ShortNamePipe } from './components/class-sessions/class-sessions-students/shortName.pipe';
import { NgxAutocompleteModule } from 'ngx-angular-autocomplete' 
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CustomRandomPipe } from './pipe/custom-random-image-pipe';
import timeGridPlugin from '@fullcalendar/timegrid';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins	
    dayGridPlugin,	
    interactionPlugin,
    timeGridPlugin 
]);	





@NgModule({
    //components go here
    declarations: [ 
        //EditableComponent,
        //ViewModeDirective,
        //EditModeDirective,
        //FocusableDirective,
        //EditableOnEnterDirective,
        AppComponent,
        UsersIndexComponent,
        UtilitiesDeleteModal,
        UtilitiesAlertModal,
        GoogleLinkModal,
        TutorRegisterComponent,
        SearchComponent,
        LessonViewComponent,
        TutorProfileViewComponent,
        CompanyProfileViewComponent,
        StudentEnrollComponent,
        GuardianEnrollComponent,
        LessonCardComponent,
        TutorCardComponent,
        StudyLevelsIndexComponent,
        SubjectsIndexComponent,
        SubjectCategoriesIndexComponent,
        TutorsIndexComponent,
        PurchaseJourneyComponent,
        LessonSignInModal,
        CourseLessonSignInModal,
        LessonEnrollModal,
        LessonEnrollLinkedAccountModal,
        TickModal,
        TutorDetailsComponent,
        ClassSessionsIndexComponent,
        ClassSessionsDetailsComponent ,
        ClassSessionsMaterialComponent ,
        ClassSessionsStudentsComponent,
        SettingsPayoutComponent,
        SessionInviteModalComponent,
        ClassSessionsRegisterComponent,
        LessonTimetableComponent,
        SafeguardingCreateComponent,
        UserGuardianSettingsComponent,
        UserStudentSettingsComponent,
        PaymentCardComponent,
        ReceiptsIndexComponent,
        SearchMiniComponent,
        HomeIndexComponent,
        TutorProfileWrapperComponent,
        CompanyProfileWrapperComponent,
        CompanySubscriptionDetailsComponent,
        CompanyAccountDetailsComponent,
        TutorBankDetailsListComponent,
        TutorProfileEditComponent,
        TutorDashboardComponent,
        TutorAccountDetailsComponent,
        TutorDbsDetailsComponent,
        TutorProfilePublicWrapperComponent,
        CompanyProfilePublicWrapperComponent,
        TutorEarningsComponent,
        ClassSessionsIndexWrapperComponent,       
        SafeguardingIndexComponent,
        TutorSubscriptionDetailsComponent,
        ClassSessionsAdminIndexComponent,
        ClassSessionAdminDetailsComponent,
        DashboardAdminComponent,
        ClassSessionMaterialUploaderComponent,
        DocumentPermissionModalComponent,
        SessionGroupsModalComponent,
        UserChangePasswordComponent,
        UserLinkAccountComponent,
        SubjectStudyLevelSetupIndexComponent,
        CompanyRegisterComponent,
        SubscriptionPlanComponent,
        ConfirmationDialog,
        SaveConfirmDialog,
        MainSearchComponent,
        CoursesComponent,
        TutorSearchComponent,
        CourseDetailsComponent,
        PrivateTutorPlanCardComponent, 
        CompanyPlanCardComponent, NoFeeTutorPlanCardComponent, 
        ProfessionalTutorPlanCardComponent, StarterTutorPlanCardComponent, CourseCardComponent,
        CompanyDashboardComponent,	
        CompanyCoursesComponent,
        CompanyManageCourseComponent,
        CalenderComponent,	
        DialogContentExampleDialog,
        CoursesIndexComponent,
        TutorCoursesComponent,
        CourseClassSessionsDialogComponent,
        TutorInviteModalComponent,
        CourseUploadDialogComponent,
        InviteStudentDialogComponent,
        TutorInfoDialogComponent,
        SubjectStudylevelCreateDialogComponent,
        SubjectStudylevelInfoDialogComponent,
        CourseViewComponent,
        DbsCheckDialog,
        TutorCreateCourseComponent,
        TutorScheduleCalendarComponent,
        CustomDatePipe,
        CustomRandomPipe,
        CalenderSchedulerComponent,
        AvailabilityDialog,
        ShortNamePipe,
        WebsiteContactComponent
        
    ],
        
    entryComponents: [
        UtilitiesDeleteModal,
        UtilitiesAlertModal,
        GoogleLinkModal,
        LessonSignInModal,
        LessonEnrollModal,
        LessonEnrollLinkedAccountModal,
        SessionInviteModalComponent,
        TickModal,
        DocumentPermissionModalComponent,
        SessionGroupsModalComponent,
        ConfirmationDialog,
        SaveConfirmDialog,
        DialogContentExampleDialog,
        CourseUploadDialogComponent,
        InviteStudentDialogComponent,
        TutorInfoDialogComponent,
        SubjectStudylevelCreateDialogComponent,
        SubjectStudylevelInfoDialogComponent,
        DbsCheckDialog,
        AvailabilityDialog
    ],
    exports: [
        UtilitiesDeleteModal,
        UtilitiesAlertModal,
        GoogleLinkModal,
        LessonSignInModal,
        LessonEnrollModal,
        LessonEnrollLinkedAccountModal,
        TickModal,
        DocumentPermissionModalComponent,
        SessionGroupsModalComponent,
        TutorInviteModalComponent
    ],
    //imports
    imports: [
        FormsModule,
        ReactiveFormsModule,
        AngularCropperjsModule,
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule, //required for Toastr and Charts
        NgxChartsModule,
        ToastrModule.forRoot({ preventDuplicates: true}),
        DragDropModule,
        NgbModule,
        FileUploadModule,
        NgSelectModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        MatSliderModule,
        MatTableModule,
        MatInputModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatSelectModule,
        FlexLayoutModule,
        MatDialogModule,	
        NgxGaugeModule,
        FullCalendarModule,
        NgxMaterialTimepickerModule,
        NgbCollapseModule,
        CommonModule,
        MatSlideToggleModule,
        NgxAutocompleteModule,
        ScrollingModule,
        //ImageCropperModule
    ],
    //services go here
    providers: [
        EnumsService,
        UsersService,
        TutorsService,
        TutorCertificatesService,
        TutorQualificationsService,
        TutorSubjectsService,
        CompanySubjectsService,
        StripeCountrysService,
        StripePlansService,
        SubjectsService,
        SubjectCategoriesService,
        StudyLevelsService,
        ClassSessionsService,
        StripeService,
        PromoCodeService,
        SessionMediasService,
        SessionInvitesService,
        SessionAttendeesService,
        SettingsService,
        SessionDocumentsService,
        SafeguardingReportsService,
        UtilitiesHelper,
        DashboardService,
        SessionGroupsService,
        ClassSessionFeaturesService,
        SubjectStudyLevelSetupService,
        CompanyService,
        CoursesService,
        MainSearchService,
        WebsiteContactService,
        ParentStudentCoursesService,
        { provide: OWL_DATE_TIME_LOCALE, useValue: 'gb' },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        DatePipe
        
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }