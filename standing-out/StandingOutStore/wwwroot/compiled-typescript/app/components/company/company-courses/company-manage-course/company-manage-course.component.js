"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyManageCourseComponent = void 0;
var core_1 = require("@angular/core");
var services_1 = require("../../../../services");
var $ = require("jquery");
var forms_1 = require("@angular/forms");
var ngx_toastr_1 = require("ngx-toastr");
var calender_scheduler_component_1 = require("../../../calender-scheduler/calender-scheduler.component");
var course_upload_dialog_component_1 = require("../../../courses/course-upload-dialog/course-upload-dialog.component");
var dialog_1 = require("@angular/material/dialog");
var invite_student_dialog_component_1 = require("../../../courses/invite-student-dialog/invite-student-dialog.component");
var subject_studylevel_create_dialog_component_1 = require("../../../subject-studylevel-setup/subject-studylevel-create-dialog/subject-studylevel-create-dialog.component");
var google_link_modal_1 = require("../../../utilities/google-link-modal/google-link-modal");
var save_confirm_dialog_component_1 = require("../../../courses/save-confirm/save-confirm-dialog.component");
var CompanyManageCourseComponent = /** @class */ (function () {
    function CompanyManageCourseComponent(subjectStudyLevelSetupService, tutorsService, dialog, coursesService, companyService, toastr, fb, subjectService, ClassSessionsService, StudyLevelsService, SubjectCategoriesService, sessionInvitesService, cdref) {
        this.subjectStudyLevelSetupService = subjectStudyLevelSetupService;
        this.tutorsService = tutorsService;
        this.dialog = dialog;
        this.coursesService = coursesService;
        this.companyService = companyService;
        this.toastr = toastr;
        this.fb = fb;
        this.subjectService = subjectService;
        this.ClassSessionsService = ClassSessionsService;
        this.StudyLevelsService = StudyLevelsService;
        this.SubjectCategoriesService = SubjectCategoriesService;
        this.sessionInvitesService = sessionInvitesService;
        this.cdref = cdref;
        //@HostListener('window:beforeunload')
        //doSomething() {
        //    alert(1);
        //}
        this.stripeCountry = stripeCountry;
        this.subjectData = [];
        this.tutorsData = [];
        this.subjectCategories = [];
        this.StudyLevels = [];
        this.selectedTutorsData = [];
        this.selectedSubjectId = '';
        this.selectedLevelText = '';
        this.selectedLevelId = '';
        this.selectedTutorId = '';
        this.selectedSubjectCategoryId = '';
        this.selectedClassSizeValue = 1;
        this.showAvailabilityPopup = false;
        this.selectedTutorData = {};
        this.started = false;
        this.completed = false;
        this.cancelled = false;
        this.published = true;
        this.errorObj = [{ 'key': 4, 'value': 'Please select level!' }, { 'key': 6, 'value': 'Please click next to save calendar changes!' }, { 'key': 7, 'value': 'Please enter course details!' }, { 'key': 9, 'value': 'Please enter lesson details!' }];
        this.tutorAvailable = false;
        this.gotTutors = false;
        this.hasGoogleAccountLinked = false;
        this.timeTableLessionId = '';
        this.lessonTabs = ['Present & Future', 'Previous'];
        this.selectedlessonTabs = this.lessonTabs[0];
        this.incompleteStep = null;
        this.dayList = [];
        this.daysArray = [
            { day: "Monday", status: false },
            { day: "Tuesday", status: false },
            { day: "Wednesday", status: false },
            { day: "Thursday", status: false },
            { day: "Friday", status: false },
            { day: "Saturday", status: false },
            { day: "Sunday", status: false }
        ];
        this.selectedEvent = [];
        this.selectedDays = [];
        this.CompanycompanyCourseFormSubmitted = false;
        this.isCourseFormVisible = false;
        this.editedCourse = null;
        this.maxRetry = 0;
        this.courseId = '';
        this.isOver18Allowed = true;
        this.allowedPrivateLesson = -1;
        this.allowedPublicLesson = -1;
        this.pricePerPersonEditAllowed = true;
        this.maxSizeOfClass = 0;
        this.isUploadGreenBtn = {};
        this.sessionMediaCount = {};
        //New variable
        this.currentStep = 1;
        this.editSlot = false;
        this.stepMove = 0;
        this.isFinished = "No";
        this.tutorSearchQuery = {
            "dayOfWeek": -1,
            "slotTime": "00:00",
            "noOfWeek": 0,
            "subjectId": null,
            "studyLevelId": null,
        };
        this.isUpdateAndFinished = false;
        this.isChangeDetected = false;
        this.isUpdated = false;
    }
    Object.defineProperty(CompanyManageCourseComponent.prototype, "CompanyCourseFormCompanyControls", {
        get: function () { return this.CompanyCourseForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(CompanyManageCourseComponent.prototype, "contactFormGroup", {
        // returns all form groups under contacts
        get: function () {
            return this.classSessions.get('contacts');
        },
        enumerable: false,
        configurable: true
    });
    CompanyManageCourseComponent.prototype.onResize = function (event) {
        this.screenSize = event.target.innerWidth;
        if (this.screenSize <= 768) {
            $('.mfs').css('display', 'none');
            $('#myOtherLessonView').css('display', 'block');
        }
        else {
            $('#myOtherLessonView').css('display', 'none');
            $('.mfs').css('display', 'block');
        }
        if (this.screenSize >= 1300) {
            $('.mfs').css('display', 'none');
            $('#myOtherLessonView').css('display', 'block');
        }
        else {
            $('#myOtherLessonView').css('display', 'none');
            $('.mfs').css('display', 'block');
        }
    };
    CompanyManageCourseComponent.prototype.getScreenSize = function (event) {
        this.scrHeight = window.innerHeight;
        this.scrWidth = window.innerWidth;
        console.log(this.scrHeight, this.scrWidth);
        if (this.scrWidth <= 768) {
            setTimeout(function () {
                $('tr.fc-scrollgrid-section-body').eq(0).hide();
                $('.mfs').css('display', 'none');
                $('#myOtherLessonView').css('display', 'block');
            }, 300);
        }
        else {
            $('#myOtherLessonView').css('display', 'none');
            $('.mfs').css('display', 'block');
        }
        if (this.scrWidth >= 1350) {
            setTimeout(function () {
                $('.mfs').css('display', 'block');
                $('#myOtherLessonView').css('display', 'none');
            }, 300);
        }
        if (this.scrWidth <= 768) {
            setTimeout(function () {
                $('.fc-today-button').addClass('col-12');
                $('button.fc-today-button.fc-button.fc-button-primary.col-12').css('margin-left', '0');
            }, 300);
        }
        else {
            setTimeout(function () {
                $('.fc-today-button').removeClass('col-12');
            }, 300);
        }
    };
    CompanyManageCourseComponent.prototype.ngOnInit = function () {
        var _this = this;
        $('.loading').show();
        this.getScreenSize();
        if (localStorage.getItem('origin')) {
            this.isUpdateAndFinished = true;
        }
        this.subjectStudyLevelSetupService.getUserType()
            .subscribe(function (success) {
            _this.userType = success;
            if (_this.userType == 'CompanyTutor') {
                _this.pricePerPersonEditAllowed = false;
            }
        }, function (error) {
        });
        this.selectedTutorId = null; ///change by dynamic tutor id
        this.getAllSubject();
        this.CompanyCourseForm = this.fb.group({
            isUnder18: [false, [forms_1.Validators.required]],
            courseType: ['0', [forms_1.Validators.required]],
            //startDate: [],
            //endDate: [],
            requiresGoogleAccount: [false],
            subjectId: ['', [forms_1.Validators.required]],
            subjectCategoryId: ['9df87a2b-c750-4870-8fd7-0a9360429098'],
            studyLevelId: ['', [forms_1.Validators.required]],
            name: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(50)]],
            description: ['', [forms_1.Validators.maxLength(999)]],
            maxClassSize: [1, [forms_1.Validators.required]],
            tutorId: [this.selectedTutorId],
            pricePerPerson: [this.pricePerPerson, [forms_1.Validators.required, forms_1.Validators.min(5)]],
            //pricePerPerson: [15, [Validators.required, Validators.min(5)]],
            started: [false],
            completed: [false],
            cancelled: [false],
            published: [true],
            //companyId: [this.companyId],
            classSessions: this.fb.array([])
        });
        // set classSessions to this field
        this.classSessions = this.CompanyCourseForm.get('classSessions');
        //to set empyt  from arry initially
        ///this.classSessions.removeAt(0);
        var courseId = new URL(location.href).searchParams.get("courseId");
        this.timeTableLessionId = new URL(location.href).searchParams.get("lessonId");
        if (localStorage.getItem('courseId')) {
            this.courseId = localStorage.getItem('courseId');
            this.onCourseEdit(this.courseId);
        }
        else {
            localStorage.clear();
        }
        this.currentStep = localStorage.getItem("currentStep") ? parseInt(localStorage.getItem("currentStep")) : 1;
        this.stepMove = localStorage.getItem("stepMove") ? parseInt(localStorage.getItem("stepMove")) : 0;
        this.isFinished = localStorage.getItem("isFinished") ? localStorage.getItem("isFinished") : "No";
        if (this.currentStep == 10) {
            $('body').css('background-image', "url('/')");
        }
        this.companyService.getSubScriptionFeature().subscribe(function (res) {
            //this.CompanyCourseForm.controls['maxClassSize'].setValue(res.tutorDashboard_CreateLesson_Session_MaxPersons);
            //this.isUnder18Allowed = res.tutorDashboard_CreateCourse_Under18;
            /*if(this.isUnder18Allowed){
                this.CompanyCourseForm.controls.isUnder18.disable();

            }*/
            _this.isUnder18Allowed = true;
            //this.maxSizeOfClass = 5;
            _this.maxSizeOfClass = res.tutorDashboard_CreateLesson_Session_MaxPersons;
            _this.allowedPrivateLesson = res.tutorDashboard_CreateCourse_PrivateLessonCount;
            _this.allowedPublicLesson = res.tutorDashboard_CreateCourse_PublicLessonCount;
        }, function (err) { });
        //to check dbs approved for any company tutor
        this.companyService.checkCompanyUsersHasDBS().subscribe(function (success) {
            _this.isDBSApprove = success;
        }, function (error) {
        });
    };
    CompanyManageCourseComponent.prototype.ngAfterViewInit = function () {
        if (this.currentStep == 6) {
            this.calendarRef.addLessonButton();
        }
    };
    CompanyManageCourseComponent.prototype.ngAfterViewChecked = function () {
        this.cdref.detectChanges();
    };
    // contact formgroup
    CompanyManageCourseComponent.prototype.createContact = function (data, mode) {
        if (mode === void 0) { mode = 'created'; }
        var classSize;
        var subjectCategoryId;
        var subjectId;
        var isUnder18;
        var courseType;
        var defValues = {
            name: '',
            subjectCategoryId: null,
            requiresGoogleAccount: false,
            lessonDescriptionBody: 'Description',
            classSessionId: null,
            baseTutorDirectoryId: null,
            sessionDirectoryName: null,
            sessionDirectoryId: null,
            baseStudentDirectoryId: null,
            sharedStudentDirectoryId: null,
            masterStudentDirectoryName: null,
            masterStudentDirectoryId: null,
        };
        if (data && mode == 'created') {
            var date = data._def.extendedProps.custom.date;
            var time = data._def.title;
            defValues.name = 'Lesson-' + date + '(' + time + ')',
                classSize = parseInt(this.CompanyCourseForm.value.maxClassSize);
            //this.selectedSubjectCategoryId = this.CompanyCourseForm.value.subjectCategoryId;
            this.selectedSubjectId = this.CompanyCourseForm.value.subjectId;
            isUnder18 = this.CompanyCourseForm.value.isUnder18;
            courseType = this.CompanyCourseForm.value.courseType;
            this.selectedLevelId = this.CompanyCourseForm.value.studyLevelId;
            //this.getPricePerPerson(subjectId, this.selectedLevelId)
        }
        if (mode == 'edited') {
            var tmpStartDate = data.startDate.split("T");
            var tmpStartTime = tmpStartDate[1].split(":");
            var tmpEndTime = (data.endDate.split("T")[1]).split(":");
            date = tmpStartDate[0];
            time = tmpStartTime[0] + ':' + tmpStartTime[1] + "-" + tmpEndTime[0] + ":" + tmpEndTime[1];
            defValues = {
                name: data.name,
                subjectCategoryId: data.subjectCategoryId,
                requiresGoogleAccount: data.requiresGoogleAccount ? data.requiresGoogleAccount : false,
                lessonDescriptionBody: data.lessonDescriptionBody,
                baseTutorDirectoryId: data.baseTutorDirectoryId,
                sessionDirectoryName: data.sessionDirectoryName,
                sessionDirectoryId: data.sessionDirectoryId,
                baseStudentDirectoryId: data.baseStudentDirectoryId,
                sharedStudentDirectoryId: data.sharedStudentDirectoryId,
                masterStudentDirectoryName: data.masterStudentDirectoryName,
                masterStudentDirectoryId: data.masterStudentDirectoryId,
                classSessionId: data.classSessionId,
            };
            this.pricePerPerson = data.pricePerPerson;
            classSize = this.editedCourse.maxClassSize;
            //this.selectedSubjectCategoryId = this.editedCourse.subjectCategoryId;
            this.selectedSubjectId = this.editedCourse.subjectId;
            isUnder18 = this.editedCourse.isUnder18;
            courseType = this.editedCourse.courseType;
            this.selectedLevelId = this.editedCourse.studyLevelId;
            this.selectedSubjectText = this.editedCourse.subjectName;
            this.selectedLevelText = this.editedCourse.studyLevelName;
        }
        return this.fb.group({
            name: [defValues.name, forms_1.Validators.compose([forms_1.Validators.required])],
            startDate: [date],
            endDate: [date],
            complete: [false],
            masterFilesCopied: [false],
            readMessagesTutor: [1],
            ended: [false],
            started: [false],
            chatActive: [false],
            hasEmailAttachment: [false],
            maxPersons: [classSize],
            pricePerPerson: [this.pricePerPerson, [forms_1.Validators.required, forms_1.Validators.min(5)]],
            studyLevelId: [this.selectedLevelId],
            subjectId: [this.selectedSubjectId],
            subjectCategoryId: [defValues.subjectCategoryId],
            isUnder16: [isUnder18 ? isUnder18 : false],
            type: [courseType ? courseType : 0],
            requiresGoogleAccount: [defValues.requiresGoogleAccount, forms_1.Validators.compose([forms_1.Validators.required])],
            lessonDescriptionBody: [defValues.lessonDescriptionBody, [forms_1.Validators.maxLength(499)]],
            baseTutorDirectoryId: [defValues.baseTutorDirectoryId],
            sessionDirectoryName: [defValues.sessionDirectoryName],
            sessionDirectoryId: [defValues.sessionDirectoryId],
            baseStudentDirectoryId: [defValues.baseStudentDirectoryId],
            sharedStudentDirectoryId: [defValues.sharedStudentDirectoryId],
            masterStudentDirectoryName: [defValues.masterStudentDirectoryName],
            masterStudentDirectoryId: [defValues.masterStudentDirectoryId],
            leassonSubject: [this.selectedSubjectText],
            leassonLevel: [this.selectedLevelText],
            leassonTopic: [''],
            leassonTime: [time],
            classSessionId: [defValues.classSessionId]
        });
    };
    // add a contact form group
    CompanyManageCourseComponent.prototype.addContact = function (data) {
        this.classSessions.push(this.createContact(data));
    };
    // remove contact from group
    CompanyManageCourseComponent.prototype.removeContact = function (index) {
        this.classSessions.removeAt(index);
    };
    // get the formgroup under contacts form array
    CompanyManageCourseComponent.prototype.getContactsFormGroup = function (index) {
        var formGroup = this.classSessions.controls[index];
        return formGroup;
    };
    CompanyManageCourseComponent.prototype.setActive = function (day, status) {
        this.daysArray.forEach(function (object) {
            if (object.day == day.day) {
                if (day.status == true) {
                    day.status = false;
                }
                else {
                    day.status = true;
                }
            }
        });
    };
    //get all subjects list
    CompanyManageCourseComponent.prototype.getAllSubject = function () {
        var _this = this;
        //this.subjectService.get()
        //this.subjectService.getTutorCompanysubjects()
        //    .subscribe(success => {
        //        this.subjectData = success;
        //        $('.loading').hide();
        //    }, error => {
        //    });
        this.companyService.getCompanyTutorsSubject().subscribe(function (success) {
            _this.subjectData = success;
            $('.loading').hide();
        }, function (error) {
        });
    };
    //get all study levels
    //getStudyLevels() {
    //    //this.StudyLevelsService.get()
    //    this.StudyLevelsService.getTutorCompanyLevels()
    //        .subscribe(success => {
    //            this.StudyLevels = success;
    //            $('.loading').hide();
    //        }, error => {
    //        });
    //}
    //get study levels on subject change
    CompanyManageCourseComponent.prototype.getStudyLevels = function (id) {
        var _this = this;
        //this.StudyLevelsService.get()
        //this.StudyLevelsService.getTutorCompanyLevelsBySubject(id)
        //    .subscribe(success => {
        //        this.StudyLevels = success;
        //        $('.loading').hide();
        //    }, error => {
        //    });
        this.companyService.getCompanyTutorsLevelBySubject(id).subscribe(function (success) {
            _this.StudyLevels = success;
            $('.loading').hide();
        }, function (error) {
        });
    };
    //get all tutors list on level selection
    CompanyManageCourseComponent.prototype.getAllTutors = function () {
        var _this = this;
        $('.loading').show();
        var subjectData = {
            "subjectId": this.selectedSubjectId,
            "studyLevelId": this.selectedLevelId,
            "IsGoogleEnabled": false
        };
        if (!this.selectedSubjectId || !this.selectedLevelId) {
            return;
        }
        this.companyService.getAllCompanyTutors(subjectData)
            .subscribe(function (success) {
            if (success.length > 0) {
                $('.loading').hide();
                _this.selectedTutorId = success[0].tutorId;
                _this.tutorsData = success;
                _this.getSelectedTutorDetails(_this.selectedTutorId);
            }
            else {
                _this.toastr.warning('Courses can only be added once tutors have been registered. Please invite your tutors to register from the tutor option in the menu bar!');
            }
        }, function (error) {
            $('.loading').hide();
        });
    };
    //get class sessions (level)
    CompanyManageCourseComponent.prototype.getPaged = function () {
        var _this = this;
        this.coursesService.getPaged(1)
            .subscribe(function (success) {
            _this.classSessionsData = success;
            $('.loading').hide();
        }, function (error) {
            _this.classSessionsData = [];
        });
    };
    CompanyManageCourseComponent.prototype.getEventsOnSidebar = function (eventObj, action) {
        if (action === void 0) { action = "add"; }
        debugger;
        if (action == 'add' && (this.CompanyCourseForm.controls['subjectId'].value == "" || this.CompanyCourseForm.controls['studyLevelId'].value == "")) {
            this.toastr.error('Please select Subject and Level');
            return;
        }
        //let lessonType = this.CompanyCourseForm.controls['courseType'].value;
        //if (lessonType == 1 && this.allowedPrivateLesson == this.classSessions.length && action == 'add') {
        //    this.toastr.error('Over sequence limit for private lessons.');
        //    return;
        //}
        //if (lessonType == 0 && this.allowedPublicLesson == this.classSessions.length && action == 'add') {
        //    this.toastr.error('Over sequence limit for public lessons.');
        //    return;
        //}
        var event = action == 'add' ? eventObj.event : eventObj;
        if (event) {
            var tmpChk = void 0;
            tmpChk = this.selectedEvent.some(function (p, i) {
                if (p.extendedProps.custom.date == event.extendedProps.custom.date &&
                    p.title == event.title) {
                    return true;
                }
            });
            if (tmpChk) {
                if (action == 'add') {
                    this.toastr.warning('This event already selected!');
                }
                return;
            }
            if (action == 'add') {
                //this.calendarRef.newChange = true;
                //this.incompleteStep = 5;
                // this.addContact(event);
                //var subjectId = this.CompanyCourseForm.value.subjectId;
                //var studyLevelId = this.CompanyCourseForm.value.studyLevelId;
                //set price per person
                //this.getPricePerPerson(subjectId, studyLevelId, event);
                this.addContact(event);
                event.typeOfEvent = 'add';
                this.isChangeDetected = true;
            }
            ;
            debugger;
            this.selectedEvent.push(event);
            //if (localStorage.getItem('courseId') && action == 'add') { 
            //    //this.incompleteStep = 5;
            //    //this.submitCompanyCourseForm(5);
            //}
            //if(action=='edit'){
            this.sortLessonForm(action);
            //}
        }
    };
    CompanyManageCourseComponent.prototype.submitCompanyCourseForm = function (step) {
        var _this = this;
        console.log(this.CompanyCourseForm);
        //this.CompanyCourseForm.markAllAsTouched();
        //let d = new Date();
        //let n = d.getTimezoneOffset() * -1;
        //let offsetStr = Math.floor(n / 60) + ':' + n % 60;
        var d = new Date();
        var n = d.getTimezoneOffset() * -1;
        var c = Math.floor(n / 60);
        c = (c < 10 ? '0' : '') + c;
        //let offsetStr = c + ':' + n % 60;
        var ms = n % 60;
        ms = (ms < 10 ? '0' : '') + ms;
        var offsetStr = c + ':' + ms;
        //let lessonType = this.CompanyCourseForm.controls['courseType'].value;
        //if (lessonType == 1 && this.classSessions.length > this.allowedPrivateLesson ) {
        //    this.toastr.error('Over sequence limit for private lessons.');
        //    return;
        //}
        //if (lessonType == 0 && this.classSessions.length > this.allowedPublicLesson) {
        //    this.toastr.error('Over sequence limit for public lessons.');
        //    return;
        //}
        this.CompanyCourseForm.value.courseId;
        this.CompanycompanyCourseFormSubmitted = true;
        if (this.CompanyCourseForm.valid) {
            var obj = __assign({}, this.CompanyCourseForm.getRawValue());
            obj.creatorUserId = this.selectedTutorsData["userId"];
            if (this.courseId) {
                obj.courseId = this.courseId;
            }
            //obj.classSessions = obj.classSessions.map(c => {
            //    let tt = c.leassonTime.split("-");
            //    c.startDate = c.startDate + "T" + tt[0] + ":00+" + offsetStr;
            //    c.endDate = c.endDate + "T" + tt[1] + ":00+" + offsetStr;
            //    let d1: any = new Date(c.startDate);
            //    let d2: any = new Date(c.endDate);
            //    let diffMs = Math.abs(d2 - d1); // milliseconds between now & Christmas
            //    let diffMins = Math.floor((diffMs / 1000) / 60); // minutes
            //    
            //    c.detailsDuration = diffMins;
            //    return c;
            //})
            //lesson setup
            var subjectId_1 = this.CompanyCourseForm.get('subjectId').value;
            var studyLevelId_1 = this.CompanyCourseForm.get('studyLevelId').value;
            var isFolderExistsCount_1 = 0;
            obj.classSessions = obj.classSessions.map(function (c) {
                var tt = c.leassonTime.split("-");
                c.startDate = c.startDate + "T" + tt[0] + ":00";
                c.endDate = c.endDate + "T" + tt[1] + ":00";
                var d1 = new Date(c.startDate);
                var d2 = new Date(c.endDate);
                var n = d1.getTimezoneOffset() * -1;
                var c1 = Math.floor(n / 60);
                c1 = (c1 < 10 ? '0' : '') + c1;
                //let offsetStr = c + ':' + n % 60;
                var ms = n % 60;
                ms = (ms < 10 ? '0' : '') + ms;
                var offsetStr = '+' + c1 + ':' + ms;
                c.startDate = c.startDate + offsetStr;
                c.endDate = c.endDate + offsetStr;
                var diffMs = Math.abs(d2 - d1); // milliseconds between now & Christmas
                var diffMins = Math.floor((diffMs / 1000) / 60); // minutes
                c.detailsDuration = diffMins;
                c.requiresGoogleAccount = _this.CompanyCourseForm.controls['requiresGoogleAccount'].value;
                c.isUnder16 = _this.CompanyCourseForm.controls['isUnder18'].value;
                c.ownerId = _this.selectedTutorsData["userId"];
                c.subjectId = subjectId_1;
                c.studyLevelId = studyLevelId_1;
                ;
                if (!c.baseTutorDirectoryId) {
                    isFolderExistsCount_1++;
                }
                return c;
            });
            if (obj.classSessions.length > 0 && isFolderExistsCount_1 > 0 && this.CompanyCourseForm.controls['requiresGoogleAccount'].value) {
                $('#drive-loding').show();
            }
            else {
                $('.loading').show();
            }
            if (obj.courseId) {
                this.isChangeDetected = false;
                this.isUpdated = true;
                this.companyService.updateCompanyCourse(obj)
                    .subscribe(function (success) {
                    debugger;
                    //if any of slots has been used by any other users
                    if (success.isClassSessionExist) {
                        _this.classSessions.clear();
                        _this.selectedEvent = [];
                        _this.onCourseEdit(_this.courseId);
                        _this.setCurrentStep(6);
                        _this.toastr.warning('Some of your selected slots have already been taken! Please select available slots!');
                        $('.loading').hide();
                        return;
                    }
                    (_this.classSessions).clear();
                    _this.editedCourse = success;
                    _this.courseId = success.courseId;
                    success.classSessions.sort(function (a, b) {
                        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
                    });
                    success.classSessions.map(function (c, i) {
                        _this.sessionMediaCount[c.classSessionId] = c.sessionMediaCount > 0 ? true : false;
                        _this.classSessions.push(_this.createContact(c, 'edited'));
                        var tmpStartDate = c.startDate.split("T");
                        var tmpStartTime = tmpStartDate[1].split(":");
                        var tmpEndTime = (c.endDate.split("T")[1]).split(":");
                        var ev = {
                            start: new Date(c.startDate),
                            title: tmpStartTime[0] + ':' + tmpStartTime[1] + "-" + tmpEndTime[0] + ":" + tmpEndTime[1],
                            extendedProps: {
                                custom: {
                                    date: tmpStartDate[0]
                                }
                            }
                        };
                        _this.getEventsOnSidebar(ev, 'edit');
                    });
                    $('.loading').hide();
                    $('#drive-loding').hide();
                    _this.isUpdated = false;
                    if (step == 13) {
                        _this.toastr.success('Course updated successfully!');
                        _this.coursesService.clearData();
                        window.location.href = "/admin/courses";
                    }
                    //this.onCourseEdit(obj.courseId);  
                    //location.reload();
                    //this.CompanyCourseForm.reset();
                }, function (error) {
                    $('.loading').hide();
                    $('#drive-loding').hide();
                });
            }
            else {
                this.companyService.saveCompanyCourse(obj)
                    .subscribe(function (success) {
                    debugger;
                    //if any of slots has been used by any other users
                    if (success.isClassSessionExist) {
                        _this.classSessions.clear();
                        _this.selectedEvent = [];
                        _this.setCurrentStep(6);
                        _this.toastr.warning('Some of your selected slots have already been taken! Please select available slots!');
                        $('.loading').hide();
                        return;
                    }
                    (_this.classSessions).clear();
                    _this.editedCourse = success;
                    _this.courseId = success.courseId;
                    localStorage.setItem('courseId', _this.courseId);
                    success.classSessions.map(function (c, i) {
                        _this.sessionMediaCount[c.classSessionId] = c.sessionMediaCount > 0 ? true : false;
                        _this.classSessions.push(_this.createContact(c, 'edited'));
                        var tmpStartDate = c.startDate.split("T");
                        var tmpStartTime = tmpStartDate[1].split(":");
                        var tmpEndTime = (c.endDate.split("T")[1]).split(":");
                        var ev = {
                            start: new Date(c.startDate),
                            title: tmpStartTime[0] + ':' + tmpStartTime[1] + "-" + tmpEndTime[0] + ":" + tmpEndTime[1],
                            extendedProps: {
                                custom: {
                                    date: tmpStartDate[0]
                                }
                            }
                        };
                        _this.getEventsOnSidebar(ev, 'edit');
                    });
                    $('.loading').hide();
                    $('#drive-loding').hide();
                    //let courseId = success;
                    //this.onCourseEdit(courseId);
                    //this.CompanyCourseForm.reset();
                    if (step == 13) {
                        _this.toastr.success('Course created successfully!');
                        _this.coursesService.clearData();
                        window.location.href = "/admin/courses";
                    }
                }, function (error) {
                    $('.loading').hide();
                    $('#drive-loding').hide();
                });
            }
        }
    };
    //lesson delete
    CompanyManageCourseComponent.prototype.deletSelectedEvent = function (event, index, sortingType) {
        var _this = this;
        if (sortingType === void 0) { sortingType = 'yes'; }
        debugger;
        if (!event) {
            event = this.selectedEvent[index];
        }
        $('.loading').show();
        var id = event.extendedProps.custom.date + "-" + event.title;
        var ev = this.calendarRef.calendarApi.getEventById(id);
        if (ev) {
            //this.isChangeDetected = true;
            var csp = ev.extendedProps.custom;
            var custom = {
                date: csp.date,
                fromTime: csp.fromTime,
                toTime: csp.toTime,
                type: csp.type,
                slotType: csp.slotType,
                titleClass: 'ava-slot'
            };
            if (ev.extendedProps.custom.type == 'weekEvent') {
                custom = {
                    date: csp.date,
                    fromTime: csp.fromTime,
                    toTime: csp.toTime,
                    type: 'weekEvent',
                    selectedWeekIndex: csp.selectedWeekIndex,
                    repeatedDays: csp.repeatedDays,
                    noOfWeek: csp.noOfWeek,
                    recurStart: csp.recurStart,
                    slotType: 0,
                    titleClass: 'ava-slot',
                    originDate: csp.originDate
                };
            }
            var event_1 = {
                title: ev.title,
                start: ev.start,
                end: ev.end,
                allday: false,
                editable: false,
                custom: custom,
                id: ev.id
            };
            ev.remove();
            this.calendarRef.calendarApi.addEvent(event_1);
        }
        var classSessioId = this.getContactsFormGroup(index);
        if (classSessioId) {
            classSessioId = classSessioId.controls['classSessionId'];
        }
        if (classSessioId && classSessioId.value) {
            this.coursesService.deleteLesson(classSessioId.value)
                .subscribe(function (success) {
                $('.loading').hide();
            }, function (error) {
                $('.loading').hide();
            });
            this.toastr.success('Event deleted successfully!');
        }
        else {
            $('.loading').hide();
            this.toastr.success('Event deleted successfully!');
        }
        debugger;
        this.removeContact(index);
        this.selectedEvent.splice(index, 1); //remove the mached object from the original array
        if (this.selectedEvent.length == 0) {
            //this.incompleteStep = 5;
            //this.calendarRef.newChange = true;
            this.setCurrentStep(6);
            setTimeout(function () {
                _this.calendarRef.calendarApi.render();
            }, 200);
        }
        if (sortingType == 'yes') {
            this.sortLessonForm('delete');
        }
    };
    CompanyManageCourseComponent.prototype.onSubjectChange = function ($event) {
        if ($event) {
            //set incomplete step
            if (localStorage.getItem('courseId')) {
                this.incompleteStep = 4;
            }
            else {
                this.incompleteStep = null;
            }
            this.selectedSubjectText = $event.target.options[$event.target.options.selectedIndex].text;
            var id = $event.target.options[$event.target.options.selectedIndex].value;
            this.getSubjectCategory(id);
            if (id != this.selectedSubjectId) {
                this.CompanyCourseForm.patchValue({ "studyLevelId": "" });
                this.selectedSubjectId = id;
                this.getStudyLevels(id);
            }
        }
        else {
            this.selectedSubjectText = this.editedCourse.subjectName;
            this.getStudyLevels(this.editedCourse.subjectId);
            this.getSubjectCategory(this.selectedSubjectId);
        }
        //this.getPricePerPersonOnClassSizeChange(this.selectedSubjectId, this.selectedLevelId, this.selectedClassSizeValue)
        //to get the price for leasson
        //let text, id;
        //if ($event) {
        //    text = $event.target.options[$event.target.options.selectedIndex].text;
        //    id = $event.target.options[$event.target.options.selectedIndex].value;
        //    this.selectedSubjectText = text;
        //} else {
        //    id = this.editedCourse.subjectId;
        //}
        //this.selectedSubjectText = text;
        // this.selectedSubjectId = id;
        //this.SubjectCategoriesService.getOptionsFiltered(id)
        //    .subscribe(success => {
        //        if (success != null) {
        //            this.selectedSubjectId = id;
        //            this.subjectCategories = success;
        //        }
        //    }, error => {
        //    });
        //this.currentStep = 4;
        //this.getStudyLevels(id)
    };
    CompanyManageCourseComponent.prototype.onLevelChange = function (levelText, levelId) {
        this.incompleteStep = null;
        this.selectedLevelId = levelId;
        this.selectedLevelText = levelText;
        this.getPricePerPersonOnClassSizeChange(this.selectedSubjectId, this.selectedLevelId, this.selectedClassSizeValue);
        //load all tutors mached with selected subject and level
        this.getAllTutors();
        //to get the price for leasson
        //let levelText = $event.target.options[$event.target.options.selectedIndex].text;
        //let levelId = $event.target.options[$event.target.options.selectedIndex].value;
        //this.selectedLevelText = levelText;
        //this.selectedLevelId = levelId;
    };
    CompanyManageCourseComponent.prototype.onClassSizeChange = function ($event) {
        //to get the price for leasson
        var text, id;
        if ($event) {
            //text = $event.target.options[$event.target.options.selectedIndex].text;
            //this.selectedClassSizeValue = $event.target.options[$event.target.options.selectedIndex].value;
            //this.selectedClassSizeValue = this.CompanyCourseForm.get('maxClassSize').value;
            this.selectedClassSizeValue = $event._value;
            this.getPricePerPersonOnClassSizeChange(this.selectedSubjectId, this.selectedLevelId, this.selectedClassSizeValue);
            this.selectedClassSizeValue = $event.value;
            this.CompanyCourseForm.patchValue({ 'maxClassSize': this.selectedClassSizeValue });
            this.CompanyCourseForm.controls['maxClassSize'].markAsDirty();
        }
    };
    //get price per person
    //getPricePerPerson(subjectId, studyLevelId, event) {
    //    $('.loading').show();
    //    this.getPriceObjectIds = {
    //        //'CompanyId': this.companyId,
    //        'SubjectId': subjectId,
    //        'StudyLevelId': studyLevelId
    //    };
    //    this.companyService.getPricePerPerson(this.getPriceObjectIds)
    //        .subscribe(success => {
    //            this.pricePerPerson = success.pricePerPerson;
    //        }, err => {
    //        });
    //}
    // Get Subject Cagetory by Subject
    CompanyManageCourseComponent.prototype.getSubjectCategory = function (id) {
        var _this = this;
        this.SubjectCategoriesService.getOptionsFiltered(id)
            .subscribe(function (success) {
            if (success != null) {
                //this.selectedSubjectId = id;
                _this.subjectCategories = success;
            }
        }, function (error) {
        });
    };
    //get price per person
    CompanyManageCourseComponent.prototype.getPricePerPerson = function (subjectId, studyLevelId, event) {
        var _this = this;
        $('.loading').show();
        this.getPriceObjectIds = {
            'SubjectId': subjectId,
            'StudyLevelId': studyLevelId
        };
        this.companyService.getPricePerPerson(this.getPriceObjectIds)
            .subscribe(function (success) {
            $('.loading').hide();
            if (_this.CompanyCourseForm.value.maxClassSize > 1) {
                _this.pricePerPerson = success.groupPricePerPerson;
            }
            else {
                _this.pricePerPerson = success.pricePerPerson;
            }
            //this.pricePerPerson = success.pricePerPerson;
            _this.CompanyCourseForm.controls["pricePerPerson"].setValue(_this.pricePerPerson);
            _this.addContact(event);
            _this.sortLessonForm('edit');
        }, function (err) {
            $('.loading').hide();
            _this.toastr.warning('Please select subject and level to get the price per person!');
            return false;
        });
    };
    //get price per person
    CompanyManageCourseComponent.prototype.getPricePerPersonOnClassSizeChange = function (subjectId, studyLevelId, classSize) {
        var _this = this;
        if (this.selectedSubjectId && this.selectedLevelId) {
            //$('.loading').show();
            this.getPriceObjectIds = {
                'SubjectId': subjectId,
                'StudyLevelId': studyLevelId
            };
            this.companyService.getPricePerPerson(this.getPriceObjectIds)
                .subscribe(function (success) {
                //$('.loading').hide();
                if (classSize > 1) {
                    _this.pricePerPerson = success.groupPricePerPerson;
                }
                else {
                    _this.pricePerPerson = success.pricePerPerson;
                }
                _this.CompanyCourseForm.controls["pricePerPerson"].setValue(_this.pricePerPerson);
                _this.classSessions.controls.map(function (ev) {
                    ev.patchValue({ "pricePerPerson": _this.pricePerPerson });
                });
            }, function (err) {
                // $('.loading').hide();
                //this.toastr.warning('Please select subject and level to get the price per person!');
                //return false;
            });
        }
    };
    CompanyManageCourseComponent.prototype.onTutorSelection = function ($event) {
        var _this = this;
        this.tutorAvailable = true;
        $('.loading').show();
        var id;
        if ($event) {
            id = $event.target.options[$event.target.options.selectedIndex].value;
            this.selectedTutorId = id;
        }
        else {
            id = this.selectedTutorId;
        }
        if (id != '') {
            this.companyService.getTutorAvailabilities(id)
                .subscribe(function (success) {
                if (success != null) {
                    _this.selectedTutorsData = success;
                    _this.hasGoogleAccountLinked = _this.selectedTutorsData['hasGoogleAccountLinked'];
                    //this.hasGoogleAccountLinked = true;
                    $('.loading').hide();
                }
            }, function (error) {
            });
        }
        else {
            $('.loading').hide();
        }
    };
    CompanyManageCourseComponent.prototype.searchTutorByAvailability = function (inputSearchTime, totalRequiredSlot) {
        var _this = this;
        if (inputSearchTime.value != "" && this.tutorSearchQuery.dayOfWeek != -1 && parseInt(totalRequiredSlot.value) > 0) {
            $('.loading').show();
            this.tutorSearchQuery.noOfWeek = parseInt(totalRequiredSlot.value);
            this.tutorSearchQuery.slotTime = inputSearchTime.value;
            this.tutorSearchQuery.subjectId = this.selectedSubjectId;
            this.tutorSearchQuery.studyLevelId = this.selectedLevelId;
            this.companyService.getTutorByAvailability(this.tutorSearchQuery)
                .subscribe(function (success) {
                if (success != null) {
                    if (success.length > 0) {
                        _this.tutorsData = success;
                        _this.getSelectedTutorDetails(_this.tutorsData[0].tutorId);
                        debugger;
                        $('.loading').hide();
                    }
                    else {
                        _this.toastr.warning('No tutors found for this selected time slots!');
                        _this.getAllTutors();
                        $('.loading').hide();
                    }
                }
            }, function (error) {
                $('.loading').hide();
            });
        }
        else {
            this.toastr.error('Please select day and time!');
        }
    };
    CompanyManageCourseComponent.prototype.onChangeWeek = function ($event) {
        var dayOfWeek = $event.target.options[$event.target.options.selectedIndex].value;
        this.tutorSearchQuery.dayOfWeek = parseInt(dayOfWeek);
    };
    //onTutorSelection($event) {
    //    this.tutorAvailable = true;
    //    $('.loading').show();
    //    let id = $event.target.options[$event.target.options.selectedIndex].value;
    //    this.selectedTutorId = id;
    //    this.companyService.getTutorAvailabilities(id)
    //        .subscribe(success => {
    //            if (success != null) {
    //                this.selectedTutorsData = success;
    //                $('.loading').hide();
    //            }
    //        }, error => {
    //        });
    //}
    //onTutorSelectionFromSearch(id) {
    //    this.tutorAvailable = true;
    //    $('.loading').show();
    //    this.selectedTutorId = id;
    //    this.companyService.getTutorAvailabilities(id)
    //        .subscribe(success => {
    //            if (success != null) {
    //                this.selectedTutorsData = success;
    //                $('.loading').hide();
    //            }
    //        }, error => {
    //        });
    //}
    CompanyManageCourseComponent.prototype.getTutorAvailability = function (id) {
        var _this = this;
        this.tutorAvailable = true;
        $('.loading').show();
        this.selectedTutorId = id;
        this.companyService.getTutorAvailabilities(id)
            .subscribe(function (success) {
            if (success != null) {
                _this.selectedTutorsData = success;
                _this.dbsApprovalStatus = _this.selectedTutorsData['dbsApprovalStatus'];
                /*if (this.dbsApprovalStatus == 'Approved' ) {
                    this.isUnder18Allowed = true;
                    this.CompanyCourseForm.controls["isUnder18"].setValue(true);
                } else {
                    this.isUnder18Allowed = false;
                    this.CompanyCourseForm.controls["isUnder18"].setValue(false);
                }*/
                //set profileApprovalStatus
                _this.profileApprovalStatus = _this.selectedTutorsData["profileApprovalStatus"];
                _this.hasGoogleAccountLinked = _this.selectedTutorsData['hasGoogleAccountLinked'];
                if (_this.hasGoogleAccountLinked) {
                    //this.CompanyCourseForm.patchValue({ "requiresGoogleAccount": true });
                    localStorage.removeItem('hasGoogleAccountLinked');
                }
                else {
                    //this.CompanyCourseForm.patchValue({ "requiresGoogleAccount": false });
                    localStorage.removeItem('hasGoogleAccountLinked');
                }
                //$('.loading').hide();
            }
        }, function (error) {
        });
    };
    CompanyManageCourseComponent.prototype.onFileSelect = function (event) {
        this.selectedFile = event.target.files[0];
    };
    CompanyManageCourseComponent.prototype.onKeyCourseTime = function (courseTime) {
        this.courseTime = courseTime;
    };
    CompanyManageCourseComponent.prototype.onKeyWeeks = function (courseWeeks) {
        this.searchCourseWeeks = courseWeeks;
    };
    CompanyManageCourseComponent.prototype.searchTutors = function () {
        var _this = this;
        this.selectedDays = [];
        this.daysArray.forEach(function (object) {
            if (object.status == true) {
                _this.selectedDays.push(object.day);
            }
        });
        this.searchParams = {
            'selectedDays': this.selectedDays.toString(),
            'courseTime': '0001-01-01T' + this.courseTime + 'Z',
            'weeks': this.searchCourseWeeks
        };
        if (this.selectedDays && this.courseTime && this.searchCourseWeeks) {
            $('.loading').show();
            this.companyService.getAvailableCompanyTutors(this.searchParams)
                .subscribe(function (success) {
                if (success != null) {
                    $('.loading').hide();
                    _this.gotTutors = true;
                    _this.tutorsGetFromSearch = success;
                    $('.loading').hide();
                }
            }, function (error) {
            });
        }
        else {
            this.toastr.warning('Please select days, time and weeks');
            return false;
        }
    };
    //showCourseForm() {
    //    if (Object.keys(this.selectedTutorsData).length == 0) {
    //        this.toastr.warning('Your profile or dbs status not approved');
    //        this.isCourseFormVisible = false;
    //        return false;
    //    }
    //    let profileApprovalStatus = this.selectedTutorsData["profileApprovalStatus"];
    //    let dbsApprovalStatus = this.selectedTutorsData["dbsApprovalStatus"]
    //    if ((profileApprovalStatus == "Pending" && dbsApprovalStatus == "Pending")
    //        || (profileApprovalStatus == "Pending" && dbsApprovalStatus == "Approved")
    //        || (profileApprovalStatus == "Pending" && dbsApprovalStatus == "NotRequired")) {
    //        this.toastr.warning('You are not allow to create a course');
    //        this.isCourseFormVisible = false;
    //        return false;
    //    }
    //    if ((profileApprovalStatus == "Approved" && dbsApprovalStatus == "Pending")) {
    //        //under-18=false and over-18=true
    //        this.isUnder18Allowed = false;
    //        this.isOver18Allowed = true;
    //    }
    //    if ((profileApprovalStatus == "Approved" && dbsApprovalStatus == "Approved")) {
    //        //under-18=true and over-18=true
    //        this.isUnder18Allowed = true;
    //        this.isOver18Allowed = true;
    //    }
    //    if ((profileApprovalStatus == "NotRequired" && dbsApprovalStatus == "NotRequired")) {
    //        //under-18=false and over-18=true
    //        this.isUnder18Allowed = false;
    //        this.isOver18Allowed = true;
    //    }
    //    if ((profileApprovalStatus == "Approved" && dbsApprovalStatus == "NotRequired")) {
    //        //under-18=false and over-18=true
    //        this.isUnder18Allowed = false;
    //        this.isOver18Allowed = true;
    //    }
    //    this.courseId = '';
    //    let tutorAvailabilities = this.selectedTutorsData['tutorAvailabilities'];
    //    this.selectedTutorsData['tutorAvailabilities'] = tutorAvailabilities;
    //    this.isCourseFormVisible = true;
    //    this.editedCourse = {};
    //    this.selectedEvent = [];
    //    (this.classSessions).clear();
    //    //this.CompanyCourseForm.reset();
    //    this.isUploadGreenBtn = {};
    //}
    CompanyManageCourseComponent.prototype.onCourseEdit = function (courseId) {
        var _this = this;
        debugger;
        $('.loading').show();
        (this.classSessions).clear();
        this.isUploadGreenBtn = {};
        this.courseId = courseId;
        var cType = {
            'Public': 1,
            'Private': 0
        };
        this.coursesService.getEditedCourse(courseId).subscribe(function (res) {
            _this.isCourseFormVisible = true;
            _this.editedCourse = res;
            _this.selectedEvent = [];
            _this.pricePerPerson = res.pricePerPerson;
            _this.CompanyCourseForm.patchValue({
                name: res.name,
                description: res.description,
                isUnder18: res.isUnder18,
                subjectId: res.subjectId,
                subjectCategoryId: res.subjectCategoryId,
                studyLevelId: res.studyLevelId,
                maxClassSize: res.maxClassSize,
                courseType: cType[res.courseType],
                pricePerPerson: res.pricePerPerson,
            });
            _this.dbsApprovalStatus = res.dbsApprovalStatus;
            _this.isUnder18CheckForInvite = res.isUnder18;
            _this.selectedTutorId = res.tutorId;
            _this.selectedClassSizeValue = res.maxClassSize;
            _this.selectedSubjectId = res.subjectId;
            _this.selectedLevelId = res.studyLevelId;
            _this.onSubjectChange('');
            ;
            //this.getTutorAvailability(this.selectedTutorId);
            //push selected tutor data in form
            _this.getSelectedTutorDetails(_this.selectedTutorId);
            //this.getSubjectCategory(this.selectedSubjectId); 
            if (res.classSessions.length == 0) {
                //this.calendarRef.newChange = false;
                _this.setCurrentStep(6);
                setTimeout(function () {
                    _this.calendarRef.calendarApi.render();
                }, 200);
            }
            res.classSessions.sort(function (a, b) {
                return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
            });
            res.classSessions.map(function (c, i) {
                _this.sessionMediaCount[c.classSessionId] = c.sessionMediaCount > 0 ? true : false;
                _this.classSessions.push(_this.createContact(c, 'edited'));
                var tmpStartDate = c.startDate.split("T");
                var tmpStartTime = tmpStartDate[1].split(":");
                var tmpEndTime = (c.endDate.split("T")[1]).split(":");
                var ev = {
                    start: new Date(c.startDate),
                    title: tmpStartTime[0] + ':' + tmpStartTime[1] + "-" + tmpEndTime[0] + ":" + tmpEndTime[1],
                    id: tmpStartDate[0] + '-' + tmpStartTime[0] + ':' + tmpStartTime[1] + "-" + tmpEndTime[0] + ":" + tmpEndTime[1],
                    extendedProps: {
                        custom: {
                            date: tmpStartDate[0]
                        }
                    }
                };
                _this.getEventsOnSidebar(ev, 'edit');
            });
            _this.CompanyCourseForm.valueChanges.subscribe(function () {
                //debugger;
                for (var field in _this.CompanyCourseForm.controls) {
                    if (_this.CompanyCourseForm.controls[field].dirty && !_this.isUpdated) {
                        _this.isChangeDetected = true;
                        console.log('in value change');
                    }
                }
            });
            if (_this.timeTableLessionId) {
                _this.scrollTo(_this.timeTableLessionId);
            }
            $('.loading').hide();
        }, function (err) {
            $('.loading').hide();
        });
    };
    //delete courses
    CompanyManageCourseComponent.prototype.onCourseDelete = function (courseId) {
        var _this = this;
        $('.loading').show();
        //soft delete course from database
        this.coursesService.deleteCourse(courseId)
            .subscribe(function (success) {
            //this.getPaged();
            $('.loading').hide();
            _this.toastr.success('Course deleted successfully!');
            location.reload();
        }, function (error) {
            $('.loading').hide();
        });
    };
    CompanyManageCourseComponent.prototype.getFileUploadWindow = function (classSessionId, index) {
        var _this = this;
        {
            var dialogRef = this.dialog.open(course_upload_dialog_component_1.CourseUploadDialogComponent, {
                maxWidth: '80vw',
                maxHeight: '85%',
                panelClass: ["my-dialog", "myClass"],
                data: {
                    classSessionId: classSessionId,
                    selectedTutorId: this.selectedTutorId
                }
            });
            dialogRef.componentInstance.passData.subscribe(function (classSessionRef) {
                _this.isUploadGreenBtn[index] = classSessionRef.sessionMedias.length > 0 ? true : false;
            });
        }
    };
    //to update and create folders on drive if hasgoogleaccount true and on checked
    CompanyManageCourseComponent.prototype.googleDriverFolderCreation = function (classSessionId, status, index) {
        var _this = this;
        if (classSessionId) {
            $('.loading').show();
            var googleRequiredParam = {
                'classSessionId': classSessionId,
                'status': status
            };
            this.coursesService.checkAndCreateGoogleDriverFolders(googleRequiredParam)
                .subscribe(function (success) {
                _this.getContactsFormGroup(index).controls['baseTutorDirectoryId'].setValue(success.baseTutorDirectoryId);
                _this.getContactsFormGroup(index).controls['sessionDirectoryName'].setValue(success.sessionDirectoryName);
                _this.getContactsFormGroup(index).controls['sessionDirectoryId'].setValue(success.sessionDirectoryId);
                _this.getContactsFormGroup(index).controls['baseStudentDirectoryId'].setValue(success.baseStudentDirectoryId);
                _this.getContactsFormGroup(index).controls['sharedStudentDirectoryId'].setValue(success.sharedStudentDirectoryId);
                _this.getContactsFormGroup(index).controls['masterStudentDirectoryName'].setValue(success.masterStudentDirectoryName);
                _this.getContactsFormGroup(index).controls['masterStudentDirectoryId'].setValue(success.masterStudentDirectoryId);
                $('.loading').hide();
            }, function (error) {
                $('.loading').hide();
            });
        }
    };
    //get invite sutdents
    CompanyManageCourseComponent.prototype.getInviteStudentsWindow = function ($event) {
        if (!$event.target.checked) {
            return;
        }
        var allowAccess;
        if (this.editedCourse.companyId != null && this.editedCourse.companyStripeConnectAccountId != null && this.editedCourse.companyIDVerificationtStatus == "Approved") {
            allowAccess = true;
        }
        else if (this.editedCourse.stripeConnectAccountId && this.editedCourse.tutorIDVerificationtStatus == "Approved") {
            allowAccess = true;
        }
        else {
            allowAccess = false;
        }
        if ((this.editedCourse.started || this.editedCourse.published) && allowAccess && this.classSessions.controls.length > 0) {
            localStorage.setItem('clasSize', this.maxSizeOfClass.toString());
            var dialogRef = this.dialog.open(invite_student_dialog_component_1.InviteStudentDialogComponent, {
                maxWidth: '80vw',
                maxHeight: '90%',
                width: '55%',
                panelClass: ['myClass'],
                data: {
                    classSessionId: this.classSessions.controls[0].get('classSessionId').value,
                    selectedTutorId: this.selectedTutorId
                }
            });
            dialogRef.afterClosed().subscribe(function () {
                $event.target.checked = false;
                localStorage.removeItem('clasSize');
            });
        }
        else {
            this.toastr.error('Action not allowed.');
            $event.target.checked = false;
            return false;
        }
        //if (this.classSessions.controls.length > 0) {
        //    localStorage.setItem('clasSize', this.maxSizeOfClass.toString());
        //    const dialogRef = this.dialog.open(InviteStudentDialogComponent, {
        //        maxWidth: '55vw',
        //        width: '100%',
        //        panelClass: ['myClass'],
        //        data: {
        //            classSessionId: this.classSessions.controls[0].get('classSessionId').value,
        //            selectedTutorId: this.selectedTutorId
        //        }
        //    });
        //    dialogRef.afterClosed().subscribe(() => {
        //        $event.target.checked = false;
        //        localStorage.removeItem('clasSize');
        //    });
        //}
    };
    CompanyManageCourseComponent.prototype.counterMaxSize = function (i) {
        return new Array(i);
    };
    CompanyManageCourseComponent.prototype.sortLessonForm = function (action) {
        this.selectedEvent.sort(function (a, b) {
            return (a.start).getTime() - (b.start).getTime();
        });
        if (action == 'add' || action == 'delete') {
            this.arrangeSerialNumberOnEvent();
        }
        //let tempFormArr = this.classSessions.value;
        //tempFormArr.sort((a, b) => {
        //    let fDate = new Date(a.startDate + " "+ a.leassonTime.split('-')[0]);
        //    let sDate = new Date(b.startDate + " "+b.leassonTime.split('-')[0]);
        //    return fDate.getTime() - sDate.getTime();
        //});  
        //this.classSessions.patchValue(tempFormArr);
    };
    CompanyManageCourseComponent.prototype.scrollTo = function (id) {
        setTimeout(function () {
            var elementList = document.getElementById(id);
            var element = elementList;
            element.scrollIntoView({ behavior: 'smooth' });
        }, 500);
    };
    CompanyManageCourseComponent.prototype.finish = function () {
        window.location.href = "/tutor/courses";
    };
    //----------------------------------------------------------new implements----------------------------------------------------
    CompanyManageCourseComponent.prototype.setCurrentStep = function (step, moveNext, isSubmit) {
        //window.scrollTo(0, 0);
        var _this = this;
        if (moveNext === void 0) { moveNext = 'Y'; }
        if (isSubmit === void 0) { isSubmit = true; }
        var $container = $("html,body");
        var $scrollTo = $('#scroolHere');
        //$container.animate({ scrollTop: $scrollTo.offset().top - $container.offset().top + $container.scrollTop(), scrollLeft: 0 }, 300); 
        $container.animate({ scrollTop: $scrollTo.offset().top - 10, scrollLeft: 0 }, 300);
        $('body').css('background-image', "url('/images/oval-left.svg')");
        if (this.currentStep == 6 && step != 6 && this.selectedEvent.length == 0) {
            this.toastr.error("Please select at least one slot!");
            return;
        }
        if (this.incompleteStep != null) {
            step = this.incompleteStep;
            this.currentStep = step;
            this.showErrorMessages(this.incompleteStep);
            //this.incompleteStep == null;
            return;
        }
        //if (this.calendarRef.newChange) {
        //    if (this.currentStep == 6 && !isSubmit) {
        //        this.toastr.error("Please save calendar data!");
        //        return;
        //    }
        //    this.saveAvailability();
        //    this.incompleteStep = null;
        //    this.submitCompanyCourseForm(step);
        //    //this.toastr.error("Please save calendar data!");
        //    //return;
        //}
        if (step > this.currentStep && moveNext == 'N' && !this.courseId)
            return;
        switch (step) {
            case 4:
                {
                    if (!this.checkSubject()) {
                        return;
                    }
                    this.currentStep = step;
                    break;
                }
            case 5:
                {
                    this.getScreenSize();
                    if (!this.checkSubjectLevel()) {
                        return;
                    }
                }
            case 6: {
                setTimeout(function () {
                    _this.calendarRef.calendarApi.render();
                    _this.calendarRef.addLessonButton();
                }, 200);
                this.currentStep = step;
                break;
            }
            case 7:
                {
                    if (isSubmit) {
                        if (this.classSessions.controls.length == 0) {
                            this.toastr.error("Please select at least one slot!");
                            return;
                        }
                    }
                    this.currentStep = step;
                    break;
                }
            case 8:
                {
                    if (!this.checkCourseName()) {
                        return;
                    }
                    if (isSubmit) {
                        this.submitCompanyCourseForm(step);
                    }
                    this.currentStep = step;
                    break;
                }
            case 9:
                {
                    if (isSubmit) {
                        this.submitCompanyCourseForm(step);
                    }
                    this.currentStep = step;
                    break;
                }
            case 10:
                {
                    if (!this.checkLessonDetails()) {
                        return;
                    }
                    $('body').css('background-image', "url('/')");
                    if (isSubmit) {
                        this.submitCompanyCourseForm(step);
                    }
                    //if (this.classSessions.controls.length > 1 && this.profileApprovalStatus == 'Approved') {
                    //    this.currentStep = step;
                    //} else {
                    //    this.toastr.error("At least two class sessions and profile approval required!");
                    //    this.currentStep = 10;
                    //}
                    this.currentStep = step;
                    break;
                }
            case 12: {
                this.isFinished = "Yes";
                localStorage.setItem("isFinished", this.isFinished);
                this.currentStep = step;
                if (!this.isUpdateAndFinished) {
                    this.coursesService.courseNotification(this.courseId).subscribe(function (success) {
                        console.log(success);
                    });
                }
                break;
            }
            case 13:
                {
                    if (isSubmit) {
                        debugger;
                        this.emailObj = JSON.parse(localStorage.getItem('inviteEmailArray'));
                        this.sendInviteEmail(this.emailObj);
                        this.submitCompanyCourseForm(step);
                        return;
                    }
                    break;
                }
            default:
                this.currentStep = step;
        }
        if (step - 1 > this.stepMove) {
            this.stepMove = step - 1;
        }
        if (step != 13) {
            localStorage.setItem("currentStep", this.currentStep.toString());
            localStorage.setItem("stepMove", this.stepMove.toString());
        }
    };
    //popup for google link
    CompanyManageCourseComponent.prototype.googleLink = function ($event) {
        var _this = this;
        if ($event.target.checked) {
            if (!this.hasGoogleAccountLinked) {
                localStorage.setItem('hasGoogleAccountLinked', '1');
                var dialogRef = this.dialog.open(google_link_modal_1.GoogleLinkModal, {
                    maxWidth: '60vw',
                    //width: '100%',
                    panelClass: ["myClass"],
                    hasBackdrop: false,
                    data: {
                        'id': ''
                    }
                });
                dialogRef.afterClosed().subscribe(function (showSnackBar) {
                    if (showSnackBar) {
                        $event.target.checked = false;
                        _this.CompanyCourseForm.patchValue({ "requiresGoogleAccount": false });
                        localStorage.removeItem('hasGoogleAccountLinked');
                    }
                });
            }
        }
    };
    //send invite email at the time of create new course
    CompanyManageCourseComponent.prototype.sendInviteEmail = function (sessionInvitesNew) {
        debugger;
        this.sessionInvitesService.createMultiple(sessionInvitesNew)
            .subscribe(function (success) {
            //if (success != '') {
            //    this.toastr.success('Invitation sent successfully!.');
            //} else {
            //    this.toastr.warning('No new invitation sent!');
            //}
            $('.loading').hide();
        }, function (error) { });
    };
    //to open popup window add subject price
    CompanyManageCourseComponent.prototype.addPriceForSubjects = function () {
        var _this = this;
        var dialogRef = this.dialog.open(subject_studylevel_create_dialog_component_1.SubjectStudylevelCreateDialogComponent, {
            maxWidth: '60vw',
            //width: '100%',
            //height: '72%',
            panelClass: ["myClass"],
            autoFocus: false,
            data: {}
        });
        dialogRef.afterClosed().subscribe(function (showSnackBar) {
            if (showSnackBar) {
                _this.getAllSubject();
            }
        });
    };
    CompanyManageCourseComponent.prototype.addPriceForLevels = function () {
        var _this = this;
        var dialogRef = this.dialog.open(subject_studylevel_create_dialog_component_1.SubjectStudylevelCreateDialogComponent, {
            maxWidth: '60vw',
            //width: '100%',
            //height: '72%',
            panelClass: ["myClass"],
            autoFocus: false,
            data: {
                'subjectId': this.selectedSubjectId,
            }
        });
        dialogRef.afterClosed().subscribe(function (showSnackBar) {
            if (showSnackBar) {
                _this.getAllSubject();
                _this.getStudyLevels(_this.selectedSubjectId);
                //this.CompanyCourseForm.controls.subjectId.setValue(this.selectedSubjectId);
                _this.CompanyCourseForm.controls["subjectId"].setValue(_this.selectedSubjectId);
            }
        });
    };
    CompanyManageCourseComponent.prototype.checkSubject = function () {
        var subjectId = this.CompanyCourseForm.get("subjectId").value;
        if (!subjectId) {
            this.toastr.error("Please select subject");
            return false;
        }
        return true;
        //if (subjectId != this.selectedSubjectId) {
        //    this.CompanyCourseForm.patchValue({ "studyLevelId": "" });
        //    this.selectedSubjectId = subjectId;
        //    this.getStudyLevels(subjectId);
        //}
        //return true;
        //if (this.currentStep - 1 > this.stepMove) {
        //    this.stepMove = this.currentStep - 1
        //}
    };
    CompanyManageCourseComponent.prototype.checkSubjectLevel = function () {
        var studyLevelId = this.CompanyCourseForm.get("studyLevelId").value;
        if (!studyLevelId) {
            this.toastr.error("Please select level");
            return false;
        }
        this.selectedLevelId = studyLevelId;
        this.getPricePerPersonOnClassSizeChange(this.selectedSubjectId, this.selectedLevelId, this.selectedClassSizeValue);
        return true;
    };
    CompanyManageCourseComponent.prototype.checkCourseName = function () {
        var courseName = this.CompanyCourseForm.get("name").value;
        if (!courseName) {
            this.toastr.error("Please enter course name!");
            return false;
        }
        else {
            return true;
        }
    };
    CompanyManageCourseComponent.prototype.checkLessonDetails = function () {
        if (this.classSessions.valid) {
            return true;
        }
        else {
            this.toastr.error("Please enter lesson details!");
            return false;
        }
    };
    CompanyManageCourseComponent.prototype.setCourseType = function ($event) {
        this.isChangeDetected = true;
        if ($event.target.checked) {
            this.CompanyCourseForm.patchValue({ "courseType": 1 });
        }
        else {
            this.CompanyCourseForm.patchValue({ "courseType": 0 });
        }
    };
    CompanyManageCourseComponent.prototype.getStartDate = function () {
        if (this.classSessions.controls[0]) {
            var sDate = this.classSessions.controls[0].get('startDate').value;
            this.CompanyCourseForm.patchValue({ 'startDate': this.createCourseDate(new Date(sDate)) });
            sDate = sDate.split('-').reverse().join('/');
            return sDate;
        }
        else {
            return '';
        }
    };
    CompanyManageCourseComponent.prototype.getEndDate = function () {
        if (this.classSessions.controls[this.classSessions.length - 1]) {
            var eDate = this.classSessions.controls[this.classSessions.length - 1].get('endDate').value;
            this.CompanyCourseForm.patchValue({ 'endDate': this.createCourseDate(new Date(eDate)) });
            eDate = eDate.split('-').reverse().join('/');
            return eDate;
        }
        else {
            return '';
        }
    };
    CompanyManageCourseComponent.prototype.getTotleLessonPrice = function () {
        var totalPrice = 0;
        this.classSessions.controls.map(function (ev) {
            totalPrice = totalPrice + ev.get("pricePerPerson").value;
        });
        return totalPrice;
    };
    CompanyManageCourseComponent.prototype.createCourseDate = function (dt) {
        var tzo = -dt.getTimezoneOffset(), dif = tzo >= 0 ? '+' : '-', pad = function (num) {
            var norm = Math.floor(Math.abs(num));
            return (norm < 10 ? '0' : '') + norm;
        };
        return dt.getFullYear() +
            '-' + pad(dt.getMonth() + 1) +
            '-' + pad(dt.getDate()) +
            'T' + pad(dt.getHours()) +
            ':' + pad(dt.getMinutes()) +
            ':' + pad(dt.getSeconds()) +
            dif + pad(tzo / 60) +
            ':' + pad(tzo % 60);
    };
    //saveAvailability() {
    //    let obj = this.calendarRef.addedEvents;
    //    if (this.calendarRef.deletedEvents.length > 0) {
    //        Array.prototype.push.apply(obj, this.calendarRef.deletedEvents);
    //    }
    //    this.tutorsService.saveAvailability(obj).subscribe(success => {
    //        $('.loading').hide();
    //        //this.calendarRef.newChange = false;
    //    }, error => {
    //        $('.loading').hide();
    //    });
    //}
    CompanyManageCourseComponent.prototype.checkCourseNameOnBlur = function () {
        var courseName = this.CompanyCourseForm.get("name").value;
        if (!courseName) {
            this.incompleteStep = 7;
            return false;
        }
        else {
            this.incompleteStep = null;
            return true;
        }
    };
    CompanyManageCourseComponent.prototype.checkLessonDetailsOnBlur = function () {
        if (this.classSessions.valid) {
            this.incompleteStep = null;
            return true;
        }
        else {
            this.incompleteStep = 9;
            return false;
        }
    };
    CompanyManageCourseComponent.prototype.setAgeRange = function ($event) {
        if ($event.target.checked) {
            this.CompanyCourseForm.controls["isUnder18"].setValue(true);
        }
        else {
            this.CompanyCourseForm.controls["isUnder18"].setValue(false);
        }
    };
    CompanyManageCourseComponent.prototype.showErrorMessages = function (nonCompleteStep) {
        var _this = this;
        this.errorObj.map(function (item) {
            if (item.key == nonCompleteStep) {
                _this.toastr.error(item.value);
            }
            ;
        });
    };
    CompanyManageCourseComponent.prototype.addMoreLessons = function (stepCount) {
        var _this = this;
        this.setCurrentStep(stepCount);
        setTimeout(function () {
            _this.calendarRef.calendarApi.render();
        }, 200);
    };
    CompanyManageCourseComponent.prototype.arrangeSerialNumberOnEvent = function () {
        var _this = this;
        if (localStorage.getItem('courseId') && !this.editedCourse) {
            setTimeout(function () {
                _this.arrangeSerialNumberOnEvent();
            }, 1000);
        }
        this.selectedEvent.map(function (s, i) {
            //let ev = this.calendarRef.calendarApi.getEventById(s.id);
            var id = s.extendedProps.custom.date + "-" + s.title;
            var ev = _this.calendarRef.calendarApi.getEventById(id);
            var event = ev.extendedProps.custom.type == 'dateEvent' ? _this.getSingleEvent(ev, i) : _this.getPatternEvent(ev, i);
            if (ev) {
                ev.remove();
            }
            _this.calendarRef.calendarApi.addEvent(event);
        });
        this.calendarRef.calendarApi.render();
    };
    CompanyManageCourseComponent.prototype.getSingleEvent = function (ev, i) {
        var event = {
            title: ev.title,
            start: ev.start,
            end: ev.end,
            allday: false,
            editable: false,
            custom: {
                date: ev.extendedProps.custom.date,
                fromTime: ev.extendedProps.custom.fromTime,
                toTime: ev.extendedProps.custom.toTime,
                type: 'dateEvent',
                slotType: 2,
                titleClass: 'ava-slot slot-active',
                serialNumber: i + 1
            },
            id: ev.id
        };
        return event;
    };
    CompanyManageCourseComponent.prototype.getPatternEvent = function (ev, i) {
        var event = {
            title: ev.title,
            start: ev.start,
            end: ev.end,
            allday: false,
            editable: false,
            id: ev.id,
            custom: {
                date: ev.extendedProps.custom.date,
                fromTime: ev.extendedProps.custom.fromTime,
                toTime: ev.extendedProps.custom.toTime,
                type: 'weekEvent',
                selectedWeekIndex: ev.extendedProps.custom.selectedWeekIndex,
                repeatedDays: ev.extendedProps.custom.repeatedDays,
                noOfWeek: ev.extendedProps.custom.noOfWeek,
                recurStart: ev.extendedProps.custom.recurStart,
                slotType: 0,
                titleClass: 'ava-slot slot-active',
                originDate: ev.extendedProps.custom,
                serialNumber: i + 1
            }
        };
        return event;
    };
    CompanyManageCourseComponent.prototype.getSelectedTutorDetails = function (tutorId) {
        var _this = this;
        $('.loading').show();
        this.companyService.getTutorsDetails(tutorId)
            .subscribe(function (success) {
            _this.selectedTutorData = success;
            _this.getTutorAvailability(tutorId);
            _this.CompanyCourseForm.controls["tutorId"].setValue(tutorId);
            if (!localStorage.getItem('courseId')) {
                _this.selectedEvent = [];
                _this.classSessions.clear();
            }
            $('.loading').hide();
        }, function (error) {
        });
    };
    CompanyManageCourseComponent.prototype.getSelectedTutorIdFromOnTutorSelection = function ($event) {
        var id = $event.target.options[$event.target.options.selectedIndex].value;
        if (!localStorage.getItem('courseId')) {
            this.selectedEvent = [];
            this.classSessions.clear();
        }
        this.getSelectedTutorDetails(id);
        this.CompanyCourseForm.controls["tutorId"].setValue(id);
    };
    CompanyManageCourseComponent.prototype.exitCourse = function () {
        var _this = this;
        if (!this.isChangeDetected) {
            window.location.href = "/admin/courses";
            return;
        }
        var dialogRef = this.dialog.open(save_confirm_dialog_component_1.SaveConfirmDialog, {
            hasBackdrop: false,
            data: {}
        });
        dialogRef.afterClosed().subscribe(function (showSnackBar) {
            if (showSnackBar) {
                _this.submitCompanyCourseForm(13);
            }
            else {
                window.location.href = "/admin/courses";
            }
        });
    };
    CompanyManageCourseComponent.prototype.resetCalendar = function () {
        //debugger;
        var temp = __spreadArrays(this.selectedEvent);
        for (var i = temp.length - 1; i >= 0; i--) {
            var a = temp[i];
            console.log("Index", i);
            if (a.typeOfEvent == 'add') {
                this.deletSelectedEvent(a, i, 'no');
            }
        }
        this.sortLessonForm('delete');
    };
    __decorate([
        core_1.ViewChild('calendarRef', { static: false }),
        __metadata("design:type", calender_scheduler_component_1.CalenderSchedulerComponent)
    ], CompanyManageCourseComponent.prototype, "calendarRef", void 0);
    __decorate([
        core_1.HostListener('window:resize', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], CompanyManageCourseComponent.prototype, "onResize", null);
    CompanyManageCourseComponent = __decorate([
        core_1.Component({
            selector: 'app-company-manage-course',
            templateUrl: './company-manage-course.component.html',
            styleUrls: ['./company-manage-course.component.css']
        }),
        __metadata("design:paramtypes", [services_1.SubjectStudyLevelSetupService,
            services_1.TutorsService,
            dialog_1.MatDialog,
            services_1.CoursesService,
            services_1.CompanyService,
            ngx_toastr_1.ToastrService,
            forms_1.FormBuilder,
            services_1.SubjectsService,
            services_1.ClassSessionsService,
            services_1.StudyLevelsService,
            services_1.SubjectCategoriesService,
            services_1.SessionInvitesService,
            core_1.ChangeDetectorRef])
    ], CompanyManageCourseComponent);
    return CompanyManageCourseComponent;
}());
exports.CompanyManageCourseComponent = CompanyManageCourseComponent;
//# sourceMappingURL=company-manage-course.component.js.map