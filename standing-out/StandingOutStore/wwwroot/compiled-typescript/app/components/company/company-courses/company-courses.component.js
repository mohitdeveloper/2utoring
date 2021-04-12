"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyCoursesComponent = void 0;
var core_1 = require("@angular/core");
var services_1 = require("../../../services");
var $ = require("jquery");
var forms_1 = require("@angular/forms");
var ngx_toastr_1 = require("ngx-toastr");
var dialog_1 = require("@angular/material/dialog");
var CompanyCoursesComponent = /** @class */ (function () {
    function CompanyCoursesComponent(dialog, coursesService, companyService, toastr, fb, subjectService, ClassSessionsService, StudyLevelsService, SubjectCategoriesService, usersService) {
        this.dialog = dialog;
        this.coursesService = coursesService;
        this.companyService = companyService;
        this.toastr = toastr;
        this.fb = fb;
        this.subjectService = subjectService;
        this.ClassSessionsService = ClassSessionsService;
        this.StudyLevelsService = StudyLevelsService;
        this.SubjectCategoriesService = SubjectCategoriesService;
        this.usersService = usersService;
        this.lessonTabs = ['Present & Future', 'Previous'];
        this.selectedlessonTabs = this.lessonTabs[0];
        this.isCourseAddButton = false;
        this.alertMessage = null;
        //company: Company;
        //subjectData: Array<any> = [];
        //tutorsData: Array<any> = [];
        //subjectCategories: Array<any> = [];
        //StudyLevels: Array<any> = [];
        //selectedTutorsData: Array<any> = [];
        //tutorsGetFromSearch: {};
        //getPriceObjectIds: {};
        //classSessionsData: {};
        //searchParams: {};
        //selectedSubjectText: any;
        //selectedSubjectId: any = '';
        //selectedLevelText: any = '';
        //selectedLevelId: any = '';
        //selectedTutorId: any = '';
        //selectedSubjectCategoryId: any = '';
        ////companyId: any;
        //pricePerPerson: number;
        //tutorAvailable: boolean = false;
        //gotTutors: boolean = false;
        //isCourseFormVisible: boolean = false;
        //tutorDropDown: boolean;
        //hasGoogleAccountLinked: boolean = false;
        //isCourseAddButton: boolean = false;
        //selectedClassSizeValue: number;
        //dbsApprovalStatus: string;
        //isUnder18CheckForInvite: boolean;
        //isUploadGreenBtn = {};
        //sessionMediaCount = {};
        //weekDaysList: string;
        //courseTime: Time;
        //searchCourseWeeks: Number;
        //lessonTabs: string[] = ['Present & Future', 'Previous'];
        //selectedlessonTabs = this.lessonTabs[0];
        //dayList: Array<any> = [];
        //daysArray = [
        //    { day: "Monday", status: false },
        //    { day: "Tuesday", status: false },
        //    { day: "Wednesday", status: false },
        //    { day: "Thursday", status: false },
        //    { day: "Friday", status: false },
        //    { day: "Saturday", status: false },
        //    { day: "Sunday", status: false }
        //];
        //selectedEvent = [];
        //selectedDays = [];
        //CompanyCourseForm: FormGroup;
        //public classSessions: FormArray;
        //CompanycompanyCourseFormSubmitted: boolean = false;
        //get CompanyCourseFormCompanyControls() { return this.CompanyCourseForm.controls };
        //// returns all form groups under contacts
        //get contactFormGroup() {
        //    return this.classSessions.get('contacts') as FormArray;
        //}
        //editedCourse: any;
        //courseId: any = '';
        //@ViewChild('calendarRef') calendarRef: CalenderComponent;
        //isUnder18Allowed: boolean = true;
        //allowedPrivateLesson: any = '';
        //allowedPublicLesson: any = '';
        this.maxSizeOfClass = 0;
    }
    CompanyCoursesComponent.prototype.ngOnInit = function () {
        var _this = this;
        $('.loading').show();
        //    // this.pricePerPerson = 25.00;
        //    //current we are using company id statically once will get setup pk's code in our machine will make it dynamic.
        //    this.getAllSubject();
        this.getAllTutors();
        this.getUserAlertMessage();
        //    this.getStudyLevels();
        //    this.CompanyCourseForm = this.fb.group({
        //        isUnder18: ['', [Validators.required]],
        //        courseType: ['', [Validators.required]],
        //        name: ['', [Validators.required, Validators.maxLength(50)]],
        //        subjectId: ['', [Validators.required]],
        //        subjectCategoryId: ['', [Validators.required]],
        //        studyLevelId: ['', [Validators.required]],
        //        maxClassSize: ['', [Validators.required]],
        //        tutorId: [this.selectedTutorId],
        //        pricePerPerson: ['', [Validators.required, Validators.min(5)]],
        //        started: [false],
        //        completed: [false],
        //        cancelled: [false],
        //        published: [true],
        //        classSessions: this.fb.array([this.createContact('')])
        //    });
        //    // set classSessions to this field
        //    this.classSessions = this.CompanyCourseForm.get('classSessions') as FormArray;
        //    //to set empyt  from arry initially
        //    this.classSessions.removeAt(0);
        this.companyService.getSubScriptionFeature().subscribe(function (res) {
            $('.loading').hide();
            //debugger;
            //this.CompanyCourseForm.controls['maxClassSize'].setValue(res.tutorDashboard_CreateLesson_Session_MaxPersons);
            //this.isUnder18Allowed = res.tutorDashboard_CreateCourse_Under18;
            /*if(this.isUnder18Allowed){
                this.CompanyCourseForm.controls.isUnder18.disable();

            }*/
            //this.isUnder18Allowed = false;
            //this.maxSizeOfClass = 5;
            _this.maxSizeOfClass = res.tutorDashboard_CreateLesson_Session_MaxPersons;
            //this.allowedPrivateLesson = res.tutorDashboard_CreateCourse_PrivateLessonCount;
            //this.allowedPublicLesson = res.tutorDashboard_CreateCourse_PublicLessonCount
        }, function (err) {
        });
    };
    CompanyCoursesComponent.prototype.createCourse = function () {
        this.coursesService.clearData();
        window.location.href = "/admin/courses/manage-course";
    };
    //delete courses
    CompanyCoursesComponent.prototype.onCourseDelete = function (courseId) {
        var _this = this;
        $('.loading').show();
        //soft delete course from database
        this.coursesService.deleteCourse(courseId)
            .subscribe(function (success) {
            //this.getPaged();
            _this.toastr.success('Course deleted successfully!');
            location.reload();
            $('.loading').hide();
        }, function (error) {
            $('.loading').hide();
        });
    };
    //// contact formgroup
    //createContact(data, mode = 'created'): FormGroup {
    //    let classSize;
    //    let subjectCategoryId;
    //    let subjectId;
    //    let isUnder18
    //    let courseType;
    //    let defValues = {
    //        name: null,
    //        requiresGoogleAccount: null,
    //        lessonDescriptionBody: null,
    //        classSessionId: null,
    //        baseTutorDirectoryId: null,
    //        sessionDirectoryName: null,
    //        sessionDirectoryId: null,
    //        baseStudentDirectoryId: null,
    //        sharedStudentDirectoryId: null,
    //        masterStudentDirectoryName: null,
    //        masterStudentDirectoryId: null,
    //    }
    //    if (data && mode == 'created') {
    //        var date = data._def.extendedProps.custom.date
    //        var time = data._def.title;
    //        classSize = parseInt(this.CompanyCourseForm.value.maxClassSize);
    //        this.selectedSubjectCategoryId = this.CompanyCourseForm.value.subjectCategoryId;
    //        this.selectedSubjectId = this.CompanyCourseForm.value.subjectId;
    //        isUnder18 = this.CompanyCourseForm.value.isUnder18;
    //        courseType = this.CompanyCourseForm.value.courseType;
    //        this.selectedLevelId = this.CompanyCourseForm.value.studyLevelId;
    //        //this.getPricePerPerson(subjectId, this.selectedLevelId, '')
    //    }
    //    if (mode == 'edited') {
    //        let tmpStartDate = data.startDate.split("T");
    //        let tmpStartTime = tmpStartDate[1].split(":");
    //        let tmpEndTime = (data.endDate.split("T")[1]).split(":");
    //        date = tmpStartDate[0];
    //        time = tmpStartTime[0] + ':' + tmpStartTime[1] + "-" + tmpEndTime[0] + ":" + tmpEndTime[1];
    //        defValues = {
    //            name: data.name,
    //            requiresGoogleAccount: data.requiresGoogleAccount ? data.requiresGoogleAccount : false,
    //            lessonDescriptionBody: data.lessonDescriptionBody,
    //            baseTutorDirectoryId: data.baseTutorDirectoryId, 
    //            sessionDirectoryName: data.sessionDirectoryName,
    //            sessionDirectoryId: data.sessionDirectoryId,
    //            baseStudentDirectoryId: data.baseStudentDirectoryId,
    //            sharedStudentDirectoryId: data.sharedStudentDirectoryId,
    //            masterStudentDirectoryName: data.masterStudentDirectoryName,
    //            masterStudentDirectoryId: data.masterStudentDirectoryId,
    //            classSessionId: data.classSessionId
    //        }
    //        this.pricePerPerson = data.pricePerPerson;
    //        classSize = this.editedCourse.maxClassSize;
    //        this.selectedSubjectCategoryId = this.editedCourse.subjectCategoryId;
    //        this.selectedSubjectId = this.editedCourse.subjectId;
    //        isUnder18 = this.editedCourse.isUnder18;
    //        courseType = this.editedCourse.courseType;
    //        this.selectedLevelId = this.editedCourse.studyLevelId;
    //        this.selectedSubjectText = this.editedCourse.subjectName;
    //        this.selectedLevelText = this.editedCourse.studyLevelName;
    //    }
    //    return this.fb.group({
    //        name: [defValues.name, Validators.compose([Validators.required])],
    //        startDate: [date],
    //        endDate: [date],
    //        complete: [false],
    //        masterFilesCopied: [false],
    //        readMessagesTutor: [1],
    //        ended: [false],
    //        started: [false],
    //        chatActive: [false],
    //        hasEmailAttachment: [false],
    //        maxPersons: [classSize],
    //        pricePerPerson: [this.pricePerPerson, [Validators.required, Validators.min(5)]],
    //        studyLevelId: [this.selectedLevelId],
    //        subjectId: [this.selectedSubjectId],
    //        subjectCategoryId: [this.selectedSubjectCategoryId],
    //        isUnder16: [isUnder18 ? isUnder18 : false],
    //        type: [courseType ? courseType : 0],
    //        requiresGoogleAccount: [defValues.requiresGoogleAccount, Validators.compose([Validators.required])],
    //        lessonDescriptionBody: [defValues.lessonDescriptionBody, Validators.compose([Validators.required])],
    //        baseTutorDirectoryId: [defValues.baseTutorDirectoryId],
    //        sessionDirectoryName: [defValues.sessionDirectoryName],
    //        sessionDirectoryId: [defValues.sessionDirectoryId],
    //        baseStudentDirectoryId: [defValues.baseStudentDirectoryId],
    //        sharedStudentDirectoryId: [defValues.sharedStudentDirectoryId],
    //        masterStudentDirectoryName: [defValues.masterStudentDirectoryName],
    //        masterStudentDirectoryId: [defValues.masterStudentDirectoryId],
    //        leassonSubject: [this.selectedSubjectText],
    //        leassonLevel: [this.selectedLevelText],
    //        leassonTopic: [''],
    //        leassonTime: [time],
    //        classSessionId: [defValues.classSessionId]
    //    });
    //}
    //// add a contact form group
    //addContact(data) {
    //    this.classSessions.push(this.createContact(data));
    //}
    //// remove contact from group
    //removeContact(index) {
    //    this.classSessions.removeAt(index);
    //}
    //// get the formgroup under contacts form array
    //getContactsFormGroup(index): FormGroup {
    //    const formGroup = this.classSessions.controls[index] as FormGroup;
    //    return formGroup;
    //}
    //setActive(day, status) {
    //    this.daysArray.forEach(object => {
    //        if (object.day == day.day) {
    //            if (day.status == true) {
    //                day.status = false;
    //            } else {
    //                day.status = true;
    //            }
    //        }
    //    });
    //}
    ////get all subjects list
    //getAllSubject() {
    //    //this.subjectService.get()
    //    this.subjectService.getTutorCompanysubjects()
    //        .subscribe(success => {
    //            this.subjectData = success;
    //            $('.loading').hide();
    //        }, error => {
    //        });
    //}
    ////get study levels on subject change
    //getStudyLevels(id) {
    //    //this.StudyLevelsService.get()
    //    this.StudyLevelsService.getTutorCompanyLevelsBySubject(id)
    //        .subscribe(success => {
    //            this.StudyLevels = success;
    //            $('.loading').hide();
    //        }, error => {
    //        });
    //}
    ////get all tutors list
    CompanyCoursesComponent.prototype.getAllTutors = function () {
        var _this = this;
        this.companyService.getTutorByCompany()
            .subscribe(function (success) {
            //this.tutorsData = success;
            if (success.length > 0) {
                _this.isCourseAddButton = true;
            }
            else {
                _this.toastr.warning('Courses can only be added once tutors have been registered. Please invite your tutors to register from the tutor option in the menu bar!');
            }
            $('.loading').hide();
        }, function (error) {
        });
    };
    CompanyCoursesComponent.prototype.getUserAlertMessage = function () {
        var _this = this;
        this.usersService.userAlert()
            .subscribe(function (success) {
            _this.alertMessage = success;
        }, function (error) {
        });
    };
    CompanyCoursesComponent = __decorate([
        core_1.Component({
            selector: 'app-company-courses',
            templateUrl: './company-courses.component.html',
            styleUrls: ['./company-courses.component.css']
        }),
        __metadata("design:paramtypes", [dialog_1.MatDialog, services_1.CoursesService, services_1.CompanyService, ngx_toastr_1.ToastrService, forms_1.FormBuilder, services_1.SubjectsService, services_1.ClassSessionsService, services_1.StudyLevelsService, services_1.SubjectCategoriesService, services_1.UsersService])
    ], CompanyCoursesComponent);
    return CompanyCoursesComponent;
}());
exports.CompanyCoursesComponent = CompanyCoursesComponent;
//# sourceMappingURL=company-courses.component.js.map