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
exports.CoursesComponent = void 0;
var core_1 = require("@angular/core");
var services_1 = require("../../../services");
var $ = require("jquery");
var forms_1 = require("@angular/forms");
var ngx_toastr_1 = require("ngx-toastr");
var calender_scheduler_component_1 = require("../../calender-scheduler/calender-scheduler.component");
var course_upload_dialog_component_1 = require("../../courses/course-upload-dialog/course-upload-dialog.component");
var dialog_1 = require("@angular/material/dialog");
var google_link_modal_1 = require("../../utilities/google-link-modal/google-link-modal");
var save_confirm_dialog_component_1 = require("../../courses/save-confirm/save-confirm-dialog.component");
var CoursesComponent = /** @class */ (function () {
    function CoursesComponent(subjectStudyLevelSetupService, tutorsService, dialog, coursesService, companyService, toastr, fb, subjectService, parentStudentCourseService, ClassSessionsService, StudyLevelsService, SubjectCategoriesService, stripeService, usersService, sessionInvitesService, settingsService, cdref) {
        this.subjectStudyLevelSetupService = subjectStudyLevelSetupService;
        this.tutorsService = tutorsService;
        this.dialog = dialog;
        this.coursesService = coursesService;
        this.companyService = companyService;
        this.toastr = toastr;
        this.fb = fb;
        this.subjectService = subjectService;
        this.parentStudentCourseService = parentStudentCourseService;
        this.ClassSessionsService = ClassSessionsService;
        this.StudyLevelsService = StudyLevelsService;
        this.SubjectCategoriesService = SubjectCategoriesService;
        this.stripeService = stripeService;
        this.usersService = usersService;
        this.sessionInvitesService = sessionInvitesService;
        this.settingsService = settingsService;
        this.cdref = cdref;
        this.subjectData = [];
        this.tutorsData = [];
        this.subjectCategories = [];
        this.StudyLevels = [];
        this.selectedTutorsData = {};
        this.selectedSubjectId = '';
        this.selectedLevelText = '';
        this.selectedLevelId = '';
        this.selectedTutorId = '';
        this.selectedSubjectCategoryId = '';
        this.selectedClassSizeValue = 1;
        this.showAvailabilityPopup = false;
        this.started = false;
        this.completed = false;
        this.cancelled = false;
        this.published = true;
        this.errorObj = [{ 'key': 4, 'value': 'Please select level!' }, { 'key': 5, 'value': 'Please click next to save calendar changes!' }, { 'key': 6, 'value': 'Please enter course details!' }, { 'key': 8, 'value': 'Please enter lesson details!' }];
        this.isAuthenticated = isAuthenticated;
        this.tutorAvailable = false;
        this.gotTutors = false;
        this.hasGoogleAccountLinked = false;
        this.timeTableLessionId = '';
        this.lessonTabs = ['Present & Future', 'Previous'];
        this.selectedlessonTabs = this.lessonTabs[0];
        this.incompleteStep = null;
        this.paymentCard = null;
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
        this.validationMsgs = { 'emailAddress': [{ type: 'email', message: 'Enter a valid email' }] };
        this.CompanycompanyCourseFormSubmitted = false;
        this.isCourseFormVisible = false;
        this.maxRetry = 0;
        this.courseId = '';
        this.isUnder18Allowed = false;
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
        //isUpdateAndFinished: boolean = false;
        this.isChangeDetected = false;
        this.isUpdated = false;
        this.user = null;
        this.parentStudentUserType = 'child';
    }
    Object.defineProperty(CoursesComponent.prototype, "emailFormData", {
        get: function () { return this.emailForm.get('emailAddress'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CoursesComponent.prototype, "CompanyCourseFormCompanyControls", {
        get: function () { return this.CompanyCourseForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    Object.defineProperty(CoursesComponent.prototype, "contactFormGroup", {
        // returns all form groups under contacts
        get: function () {
            return this.classSessions.get('contacts');
        },
        enumerable: false,
        configurable: true
    });
    CoursesComponent.prototype.onResize = function (event) {
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
    CoursesComponent.prototype.getScreenSize = function (event) {
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
    CoursesComponent.prototype.ngOnInit = function () {
        var _this = this;
        $('.loading').show();
        this.getScreenSize();
        //this.selectedTutorId = "34F4FB64-5FCD-4FB0-F9CA-08D869EAA4FB";///change by dynamic tutor id
        this.selectedTutorId = localStorage.getItem('tutorId'); ///change by dynamic tutor id
        if (!this.selectedTutorId) {
            //localStorage.removeItem('tutorId');
            window.location.href = '/';
            return;
        }
        this.getAllSubject();
        this.getTutorAvailability(this.selectedTutorId);
        this.CompanyCourseForm = this.fb.group({
            ipAddress: [this.ipAddress],
            uniqueNumber: [this.uniqueNumber],
            isUnder18: [false, [forms_1.Validators.required]],
            courseType: ['0', [forms_1.Validators.required]],
            startDate: [],
            endDate: [],
            requiresGoogleAccount: [false],
            name: ['', [forms_1.Validators.required, forms_1.Validators.maxLength(60)]],
            description: ['', [forms_1.Validators.maxLength(999)]],
            subjectId: ['', [forms_1.Validators.required]],
            subjectCategoryId: ['9df87a2b-c750-4870-8fd7-0a9360429098'],
            studyLevelId: ['', [forms_1.Validators.required]],
            maxClassSize: [1, [forms_1.Validators.required]],
            tutorId: [this.selectedTutorId],
            pricePerPerson: [this.pricePerPerson, [forms_1.Validators.required, forms_1.Validators.min(5)]],
            //pricePerPerson: [15, [Validators.required, Validators.min(5)]],
            started: [false],
            completed: [false],
            cancelled: [false],
            published: [true],
            //companyId: [this.companyId],
            classSessions: this.fb.array([]),
            emailForm: this.fb.array([])
        });
        // set classSessions to this field
        this.classSessions = this.CompanyCourseForm.get('classSessions');
        this.emailForm = this.CompanyCourseForm.get('emailForm');
        //to set empyt  from arry initially
        if (localStorage.getItem('courseId')) {
            this.courseId = localStorage.getItem('courseId');
            this.onCourseEdit(this.courseId);
        }
        //else {
        //    localStorage.clear();
        //}
        debugger;
        //set if step 10 and not logged in then set step back to 9
        if (this.isAuthenticated == 'False' && localStorage.getItem('currentStep') == '10' && localStorage.getItem('courseId')) {
            localStorage.setItem('currentStep', '9');
        }
        if (this.isAuthenticated == 'True' && localStorage.getItem('currentStep') == '9' && localStorage.getItem('courseId')) {
            localStorage.setItem('currentStep', '10');
        }
        //else {
        //    this.currentStep = localStorage.getItem("currentStep") ? parseInt(localStorage.getItem("currentStep")) : 1;
        //}
        this.currentStep = localStorage.getItem("currentStep") ? parseInt(localStorage.getItem("currentStep")) : 1;
        this.stepMove = localStorage.getItem("stepMove") ? parseInt(localStorage.getItem("stepMove")) : 0;
        this.isFinished = localStorage.getItem("isFinished") ? localStorage.getItem("isFinished") : "No";
        this.parentStudentCourseService.getSubScriptionFeatureByTutor(this.selectedTutorId).subscribe(function (res) {
            _this.maxSizeOfClass = res.tutorDashboard_CreateLesson_Session_MaxPersons;
            _this.allowedPrivateLesson = res.tutorDashboard_CreateCourse_PrivateLessonCount;
            _this.allowedPublicLesson = res.tutorDashboard_CreateCourse_PublicLessonCount;
            //create send invitation form
            _this.createEmailFormGroup(_this.maxSizeOfClass);
        }, function (err) {
        });
        var courseId = new URL(location.href).searchParams.get("courseId");
        this.timeTableLessionId = new URL(location.href).searchParams.get("lessonId");
        if (isAuthenticated == 'True') {
            this.getUser();
        }
    };
    CoursesComponent.prototype.ngAfterViewInit = function () {
        if (this.currentStep == 5) {
            this.calendarRef.addLessonButton();
        }
    };
    CoursesComponent.prototype.ngAfterViewChecked = function () {
        this.cdref.detectChanges();
    };
    // contact formgroup
    CoursesComponent.prototype.createContact = function (data, mode) {
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
            lessonDescriptionBody: '',
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
            name: [defValues.name, forms_1.Validators.compose([forms_1.Validators.required, forms_1.Validators.maxLength(60)])],
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
    CoursesComponent.prototype.addContact = function (data) {
        this.classSessions.push(this.createContact(data));
    };
    // remove contact from group
    CoursesComponent.prototype.removeContact = function (index) {
        this.classSessions.removeAt(index);
    };
    // get the formgroup under contacts form array
    CoursesComponent.prototype.getContactsFormGroup = function (index) {
        var formGroup = this.classSessions.controls[index];
        return formGroup;
    };
    CoursesComponent.prototype.setActive = function (day, status) {
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
    CoursesComponent.prototype.getAllSubject = function () {
        var _this = this;
        //this.subjectService.get()
        this.parentStudentCourseService.getTutorCompanysubjects(this.selectedTutorId)
            .subscribe(function (success) {
            debugger;
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
    CoursesComponent.prototype.getStudyLevels = function (id) {
        var _this = this;
        //this.StudyLevelsService.get()
        this.parentStudentCourseService.getTutorCompanyLevelsBySubject(this.selectedTutorId, id)
            .subscribe(function (success) {
            _this.StudyLevels = success;
            $('.loading').hide();
        }, function (error) {
        });
    };
    //get class sessions (level)
    CoursesComponent.prototype.getPaged = function () {
        var _this = this;
        this.coursesService.getPaged(1)
            .subscribe(function (success) {
            _this.classSessionsData = success;
            $('.loading').hide();
        }, function (error) {
            _this.classSessionsData = [];
        });
    };
    CoursesComponent.prototype.getEventsOnSidebar = function (eventObj, action) {
        if (action === void 0) { action = "add"; }
        if (action == 'add') {
            var msg = '';
            if (this.CompanyCourseForm.controls['subjectId'].value == "") {
                this.currentStep = 3;
                msg = 'Please select Subject!';
                this.toastr.error(msg);
                return;
            }
            else if (this.CompanyCourseForm.controls['studyLevelId'].value == "") {
                this.currentStep = 4;
                msg = 'Please select Level!';
                this.toastr.error(msg);
                return;
            }
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
                this.calendarRef.newChange = true;
                //this.incompleteStep = 5;
                // this.addContact(event);
                //var subjectId = this.CompanyCourseForm.value.subjectId;
                //var studyLevelId = this.CompanyCourseForm.value.studyLevelId;
                //set price per person
                //this.getPricePerPerson(subjectId, studyLevelId, event);
                this.addContact(event);
                event.typeOfEvent = 'add';
                this.isChangeDetected = true;
                console.log('set event on sidebar');
            }
            ;
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
    CoursesComponent.prototype.submitCompanyCourseForm = function (step) {
        var _this = this;
        debugger;
        if (this.incompleteStep != null) {
            this.showErrorMessages(this.incompleteStep);
            return;
        }
        this.CompanyCourseForm.controls["tutorId"].setValue(this.selectedTutorId);
        var d = new Date();
        var n = d.getTimezoneOffset() * -1;
        var c = Math.floor(n / 60);
        c = (c < 10 ? '0' : '') + c;
        //let offsetStr = c + ':' + n % 60;
        var ms = n % 60;
        ms = (ms < 10 ? '0' : '') + ms;
        var offsetStr = c + ':' + ms;
        this.CompanyCourseForm.value.courseId;
        this.CompanycompanyCourseFormSubmitted = true;
        if (this.CompanyCourseForm.valid) {
            var obj = __assign({}, this.CompanyCourseForm.getRawValue());
            obj.creatorUserId = this.selectedTutorsData["userId"];
            if (this.courseId) {
                obj.courseId = this.courseId;
            }
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
                obj.ipAddress = this.ipAddress,
                    obj.uniqueNumber = this.uniqueNumber,
                    //this.unsubScribeChanges();
                    this.isChangeDetected = false;
                this.isUpdated = true;
                this.parentStudentCourseService.updateCompanyCourse(obj)
                    .subscribe(function (success) {
                    //if any of slots has been used by any other users
                    if (success.isClassSessionExist) {
                        _this.classSessions.clear();
                        _this.selectedEvent = [];
                        _this.onCourseEdit(_this.courseId);
                        _this.setCurrentStep(5);
                        _this.toastr.warning('Some of your selected slots have already been taken! Please select available slots!');
                        $('.loading').hide();
                        return;
                    }
                    _this.CompanyCourseForm.reset();
                    (_this.classSessions).clear();
                    _this.setCourseForm(success);
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
                    if (step == 11) {
                        _this.toastr.success('Course updated successfully!');
                        _this.coursesService.clearData();
                        //window.location.href = "/tutor/courses"
                    }
                    //this.currentStep = step;
                }, function (error) {
                    $('.loading').hide();
                    $('#drive-loding').hide();
                });
            }
            else {
                this.parentStudentCourseService.saveCompanyCourse(obj)
                    .subscribe(function (success) {
                    //if any of slots has been used by any other users
                    if (success.isClassSessionExist) {
                        _this.classSessions.clear();
                        _this.selectedEvent = [];
                        _this.setCurrentStep(5);
                        _this.toastr.warning('Some of your selected slots have already been taken! Please select available slots!');
                        $('.loading').hide();
                        return;
                    }
                    (_this.classSessions).clear();
                    _this.editedCourse = success;
                    _this.courseId = success.courseId;
                    _this.ipAddress = success.ipAddress;
                    _this.uniqueNumber = success.uniqueNumber;
                    localStorage.setItem('uniqueNumber', _this.uniqueNumber);
                    localStorage.setItem('courseId', _this.courseId);
                    var promises = success.classSessions.map(function (c, i) {
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
                        console.log("insert", i);
                    });
                    Promise.all(promises).then(function (resp) {
                        $('.loading').hide();
                        $('#drive-loding').hide();
                    }).catch(function (err) {
                        $('.loading').hide();
                        $('#drive-loding').hide();
                    });
                    //let courseId = success;
                    //this.onCourseEdit(courseId);
                    //this.CompanyCourseForm.reset();
                    if (step == 11) {
                        _this.toastr.success('Course created successfully!');
                        _this.coursesService.clearData();
                        //window.location.href = "/tutor/courses"
                    }
                    //this.currentStep = step;
                }, function (error) {
                    $('.loading').hide();
                    $('#drive-loding').hide();
                });
            }
        }
    };
    //lesson delete
    CoursesComponent.prototype.deletSelectedEvent = function (event, index, sortingType) {
        var _this = this;
        if (sortingType === void 0) { sortingType = 'yes'; }
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
        //let classSessioId = this.getContactsFormGroup(index).controls['classSessionId'];
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
        this.removeContact(index);
        this.selectedEvent.splice(index, 1); //remove the mached object from the original array
        console.log(this.selectedEvent, index);
        if (this.selectedEvent.length == 0) {
            //this.incompleteStep = 5;
            this.calendarRef.newChange = true;
            this.setCurrentStep(5);
            setTimeout(function () {
                _this.calendarRef.calendarApi.render();
            }, 200);
        }
        //this.sortLessonForm('delete');
        if (sortingType == 'yes') {
            this.sortLessonForm('delete');
        }
    };
    CoursesComponent.prototype.onSubjectChange = function ($event) {
        if ($event) {
            this.isChangeDetected = true;
            console.log('subject change');
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
    CoursesComponent.prototype.onLevelChange = function (levelText, levelId) {
        //this.isChangeDetected = true;
        this.incompleteStep = null;
        this.selectedLevelId = levelId;
        this.selectedLevelText = levelText;
        this.getPricePerPersonOnClassSizeChange(this.selectedSubjectId, this.selectedLevelId, this.selectedClassSizeValue);
        //to get the price for leasson
        //let levelText = $event.target.options[$event.target.options.selectedIndex].text;
        //let levelId = $event.target.options[$event.target.options.selectedIndex].value;
        //this.selectedLevelText = levelText;
        //this.selectedLevelId = levelId;
    };
    CoursesComponent.prototype.onClassSizeChange = function ($event) {
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
            this.isChangeDetected = true;
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
    CoursesComponent.prototype.getSubjectCategory = function (id) {
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
    CoursesComponent.prototype.getPricePerPerson = function (subjectId, studyLevelId, event) {
        var _this = this;
        $('.loading').show();
        this.getPriceObjectIds = {
            'tutorId': this.selectedTutorId,
            'SubjectId': subjectId,
            'StudyLevelId': studyLevelId
        };
        debugger;
        this.parentStudentCourseService.getPricePerPerson(this.getPriceObjectIds)
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
    CoursesComponent.prototype.getPricePerPersonOnClassSizeChange = function (subjectId, studyLevelId, classSize) {
        var _this = this;
        if (this.selectedSubjectId && this.selectedLevelId) {
            $('.loading').show();
            this.getPriceObjectIds = {
                'tutorId': this.selectedTutorId,
                'SubjectId': subjectId,
                'StudyLevelId': studyLevelId
            };
            debugger;
            this.parentStudentCourseService.getPricePerPerson(this.getPriceObjectIds)
                .subscribe(function (success) {
                $('.loading').hide();
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
                $('.loading').hide();
                //this.toastr.warning('Please select subject and level to get the price per person!');
                //return false;
            });
        }
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
    CoursesComponent.prototype.getTutorAvailability = function (id) {
        var _this = this;
        this.tutorAvailable = true;
        $('.loading').show();
        this.selectedTutorId = id;
        this.parentStudentCourseService.getTutorAvailabilities(id)
            .subscribe(function (success) {
            if (success != null) {
                _this.selectedTutorsData = success;
                _this.dbsApprovalStatus = _this.selectedTutorsData['dbsApprovalStatus'];
                if (_this.dbsApprovalStatus == 'Approved') {
                    _this.isUnder18Allowed = true;
                    //this.CompanyCourseForm.controls["isUnder18"].setValue(true);
                }
                else {
                    //this.isUnder18Allowed = false;
                    _this.isUnder18Allowed = false;
                    //this.CompanyCourseForm.controls["isUnder18"].setValue(false);
                }
                //set profileApprovalStatus
                _this.profileApprovalStatus = _this.selectedTutorsData["profileApprovalStatus"];
                _this.hasGoogleAccountLinked = _this.selectedTutorsData['hasGoogleAccountLinked'];
                _this.CompanyCourseForm.patchValue({ 'requiresGoogleAccount': _this.selectedTutorsData['hasGoogleAccountLinked'] });
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
    CoursesComponent.prototype.onFileSelect = function (event) {
        this.selectedFile = event.target.files[0];
        console.log(this.selectedFile.name);
    };
    CoursesComponent.prototype.onKeyCourseTime = function (courseTime) {
        this.courseTime = courseTime;
    };
    CoursesComponent.prototype.onKeyWeeks = function (courseWeeks) {
        this.searchCourseWeeks = courseWeeks;
    };
    CoursesComponent.prototype.searchTutors = function () {
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
    CoursesComponent.prototype.setCourseForm = function (res) {
        debugger;
        var cType = {
            'Public': 1,
            'Private': 0
        };
        this.ipAddress = res.ipAddress,
            this.uniqueNumber = res.uniqueNumber,
            this.isCourseFormVisible = true;
        this.editedCourse = res;
        this.selectedEvent = [];
        this.pricePerPerson = res.pricePerPerson;
        this.CompanyCourseForm.patchValue({
            name: res.name,
            ipAddress: this.ipAddress,
            uniqueNumber: this.uniqueNumber,
            description: res.description,
            isUnder18: res.isUnder18,
            subjectId: res.subjectId,
            subjectCategoryId: res.subjectCategoryId,
            studyLevelId: res.studyLevelId,
            maxClassSize: res.maxClassSize,
            courseType: cType[res.courseType],
            requiresGoogleAccount: res.requiresGoogleAccount,
            pricePerPerson: res.pricePerPerson,
            started: false,
            completed: false,
            cancelled: false,
            published: true,
        });
        this.dbsApprovalStatus = res.dbsApprovalStatus;
        this.isUnder18CheckForInvite = res.isUnder18;
        this.selectedTutorId = res.tutorId;
        this.selectedClassSizeValue = res.maxClassSize;
        this.selectedSubjectId = res.subjectId;
        this.selectedLevelId = res.studyLevelId;
        this.onSubjectChange('');
        this.subScribeChanges();
    };
    CoursesComponent.prototype.onCourseEdit = function (courseId) {
        var _this = this;
        $('.loading').show();
        (this.classSessions).clear();
        this.isUploadGreenBtn = {};
        this.courseId = courseId;
        //this.coursesService.getEditedCourse(courseId).subscribe(res => {
        this.parentStudentCourseService.getEditedCourse(courseId).subscribe(function (res) {
            _this.setCourseForm(res);
            if (res.uniqueNumber != localStorage.getItem('uniqueNumber')) {
                localStorage.clear();
                window.location.href = "/";
            }
            //this.getSubjectCategory(this.selectedSubjectId); 
            if (res.classSessions.length == 0) {
                _this.calendarRef.newChange = false;
                _this.setCurrentStep(5);
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
            if (_this.timeTableLessionId) {
                _this.scrollTo(_this.timeTableLessionId);
            }
            $('.loading').hide();
        }, function (err) {
            $('.loading').hide();
        });
    };
    CoursesComponent.prototype.getFileUploadWindow = function (classSessionId, index) {
        var _this = this;
        {
            var dialogRef = this.dialog.open(course_upload_dialog_component_1.CourseUploadDialogComponent, {
                maxWidth: '80vw',
                height: '90%',
                width: '100%',
                panelClass: ["my-dialog", "myClass"],
                autoFocus: false,
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
    CoursesComponent.prototype.googleDriverFolderCreation = function (classSessionId, status, index) {
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
    //getInviteStudentsWindow($event) {
    //    if (!$event.target.checked) {
    //        return;
    //    }
    //    if (this.classSessions.controls.length > 0) {
    //        localStorage.setItem('clasSize', this.maxSizeOfClass.toString());
    //        const dialogRef = this.dialog.open(InviteStudentDialogComponent, {
    //            maxWidth: '55vw',
    //            width: '100%',
    //            panelClass: ['myClass'],
    //            data: {
    //                classSessionId: this.classSessions.controls[0].get('classSessionId').value,
    //                selectedTutorId: this.selectedTutorId
    //            }
    //        });
    //        dialogRef.afterClosed().subscribe(() => {
    //            $event.target.checked = false;
    //            localStorage.removeItem('clasSize');
    //        });
    //    }
    //}
    CoursesComponent.prototype.counterMaxSize = function (i) {
        return new Array(i);
    };
    CoursesComponent.prototype.sortLessonForm = function (action) {
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
    CoursesComponent.prototype.scrollTo = function (id) {
        setTimeout(function () {
            var elementList = document.getElementById(id);
            var element = elementList;
            element.scrollIntoView({ behavior: 'smooth' });
        }, 500);
    };
    CoursesComponent.prototype.finish = function () {
        window.location.href = "/tutor/courses";
    };
    //----------------------------------------------------------new implements----------------------------------------------------
    CoursesComponent.prototype.setCurrentStep = function (step, moveNext, isSubmit) {
        var _this = this;
        if (moveNext === void 0) { moveNext = 'Y'; }
        if (isSubmit === void 0) { isSubmit = true; }
        debugger;
        //window.scrollTo(0, 0);
        var $container = $("html,body");
        var $scrollTo = $('#scroolHere');
        //$container.animate({ scrollTop: $scrollTo.offset().top - $container.offset().top + $container.scrollTop(), scrollLeft: 0 }, 300); 
        $container.animate({ scrollTop: $scrollTo.offset().top - 10, scrollLeft: 0 }, 300);
        if (this.currentStep == 5 && step != 5 && this.selectedEvent.length == 0) {
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
        if (this.calendarRef.newChange) {
            if (this.currentStep == 5 && !isSubmit) {
                this.toastr.error("Please save calendar data!");
                return;
            }
            //this.saveAvailability();
            this.incompleteStep = null;
            if (localStorage.getItem('courseId')) {
                this.submitCompanyCourseForm(step);
            }
            //this.toastr.error("Please save calendar data!");
            //return;
        }
        //if (step == 8) {
        //    this.sendInvitation();
        //}
        if (step > this.currentStep && moveNext == 'N')
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
                    if (!this.checkSubjectLevel()) {
                        return;
                    }
                    setTimeout(function () {
                        _this.calendarRef.calendarApi.render();
                        _this.calendarRef.addLessonButton();
                    }, 200);
                    this.currentStep = step;
                    break;
                }
            case 6:
                {
                    this.currentStep = step;
                    break;
                }
            case 7:
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
            case 8:
                {
                    if (isSubmit) {
                        this.sendInvitation();
                        //this.submitCompanyCourseForm(step);
                    }
                    this.currentStep = step;
                    break;
                }
            case 9:
                {
                    debugger;
                    if (this.checkUserAuthentication()) {
                        this.setCurrentStep(10, 'Skip');
                        return;
                    }
                    this.currentStep = step;
                    break;
                }
            case 10:
                {
                    debugger;
                    if (moveNext != 'Skip' && !this.redireToLoginOrRegistration()) {
                        return;
                    }
                    this.currentStep = step;
                    break;
                }
            case 11: {
                this.isFinished = "Yes";
                localStorage.setItem("isFinished", this.isFinished);
                this.currentStep = step;
                //this.coursesService.courseNotification(this.courseId).subscribe(success => {
                //    console.log(success);
                //});
                break;
            }
            default:
                this.currentStep = step;
        }
        if (step - 1 > this.stepMove) {
            this.stepMove = step - 1;
        }
        if (step != 11) {
            localStorage.setItem("currentStep", this.currentStep.toString());
            localStorage.setItem("stepMove", this.stepMove.toString());
        }
    };
    //popup for google link
    CoursesComponent.prototype.googleLink = function ($event) {
        var _this = this;
        if ($event.target.checked) {
            if (!this.hasGoogleAccountLinked) {
                localStorage.setItem('hasGoogleAccountLinked', '1');
                var dialogRef = this.dialog.open(google_link_modal_1.GoogleLinkModal, {
                    maxWidth: '60vw',
                    width: '100%',
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
    CoursesComponent.prototype.checkSubject = function () {
        var subjectId = this.CompanyCourseForm.get("subjectId").value;
        if (!subjectId) {
            this.toastr.error("Please select subject");
            return false;
        }
        return true;
    };
    CoursesComponent.prototype.checkSubjectLevel = function () {
        var studyLevelId = this.CompanyCourseForm.get("studyLevelId").value;
        if (!studyLevelId) {
            this.toastr.error("Please select level");
            return false;
        }
        this.selectedLevelId = studyLevelId;
        this.getPricePerPersonOnClassSizeChange(this.selectedSubjectId, this.selectedLevelId, this.selectedClassSizeValue);
        return true;
    };
    CoursesComponent.prototype.checkCourseName = function () {
        var courseName = this.CompanyCourseForm.get("name").value;
        if (!courseName) {
            this.toastr.error("Please enter course name!");
            return false;
        }
        else {
            return true;
        }
    };
    CoursesComponent.prototype.checkUserAuthentication = function () {
        if (isAuthenticated == 'True') {
            return true;
        }
    };
    CoursesComponent.prototype.setCourseType = function ($event) {
        this.isChangeDetected = true;
        console.log('set course');
        if ($event.target.checked) {
            //public =1
            this.CompanyCourseForm.patchValue({ "courseType": 1 });
            this.classSessions.controls.map(function (ev) {
                ev.patchValue({ "type": 1 });
            });
        }
        else {
            //private =0
            this.CompanyCourseForm.patchValue({ "courseType": 0 });
            this.classSessions.controls.map(function (ev) {
                ev.patchValue({ "type": 0 });
            });
        }
    };
    CoursesComponent.prototype.getStartDate = function () {
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
    CoursesComponent.prototype.getEndDate = function () {
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
    CoursesComponent.prototype.getTotleLessonPrice = function () {
        var totalPrice = 0;
        this.classSessions.controls.map(function (ev) {
            totalPrice = totalPrice + ev.get("pricePerPerson").value;
        });
        return totalPrice;
    };
    CoursesComponent.prototype.createCourseDate = function (dt) {
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
    //        //$('.loading').hide();
    //        this.calendarRef.newChange = false;
    //    }, error => {
    //        //$('.loading').hide();
    //    });
    //}
    CoursesComponent.prototype.checkCourseNameOnBlur = function () {
        var courseName = this.CompanyCourseForm.get("name").value;
        if (!courseName) {
            this.incompleteStep = 6;
            return false;
        }
        else {
            this.incompleteStep = null;
            return true;
        }
    };
    CoursesComponent.prototype.checkLessonDetailsOnBlur = function () {
        if (this.classSessions.valid) {
            this.incompleteStep = null;
            return true;
        }
        else {
            this.incompleteStep = 8;
            return false;
        }
    };
    CoursesComponent.prototype.setAgeRange = function ($event) {
        if ($event.target.checked) {
            this.CompanyCourseForm.controls["isUnder18"].setValue(true);
        }
        else {
            this.CompanyCourseForm.controls["isUnder18"].setValue(false);
        }
    };
    CoursesComponent.prototype.showErrorMessages = function (nonCompleteStep) {
        var _this = this;
        this.errorObj.map(function (item) {
            if (item.key == nonCompleteStep) {
                _this.toastr.error(item.value);
            }
            ;
        });
    };
    CoursesComponent.prototype.addMoreLessons = function (stepCount) {
        var _this = this;
        this.setCurrentStep(stepCount);
        setTimeout(function () {
            _this.calendarRef.calendarApi.render();
        }, 200);
    };
    CoursesComponent.prototype.arrangeSerialNumberOnEvent = function () {
        var _this = this;
        if (localStorage.getItem('courseId') && !this.editedCourse) {
            setTimeout(function () {
                _this.arrangeSerialNumberOnEvent();
            }, 1000);
        }
        this.selectedEvent.map(function (s, i) {
            debugger;
            //let ev = this.calendarRef.calendarApi.getEventById(s.id);
            var id = s.extendedProps.custom.date + "-" + s.title;
            var ev = _this.calendarRef.calendarApi.getEventById(id);
            var event = ev.extendedProps.custom.type == 'dateEvent' ? _this.getSingleEvent(ev, i) : _this.getPatternEvent(ev, i);
            console.log(s);
            if (ev) {
                ev.remove();
            }
            _this.calendarRef.calendarApi.addEvent(event);
        });
        this.calendarRef.calendarApi.render();
    };
    CoursesComponent.prototype.getSingleEvent = function (ev, i) {
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
    CoursesComponent.prototype.getPatternEvent = function (ev, i) {
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
    CoursesComponent.prototype.exitCourse = function () {
        var _this = this;
        if (!this.isChangeDetected) {
            window.location.href = "/tutor/courses";
            return;
        }
        var dialogRef = this.dialog.open(save_confirm_dialog_component_1.SaveConfirmDialog, {
            hasBackdrop: false,
            data: {}
        });
        dialogRef.afterClosed().subscribe(function (showSnackBar) {
            if (showSnackBar) {
                _this.submitCompanyCourseForm(11);
            }
            else {
                window.location.href = "/tutor/courses";
            }
        });
    };
    //unsubScribeChanges() {
    //}
    CoursesComponent.prototype.subScribeChanges = function () {
        var _this = this;
        this.subscription = this.CompanyCourseForm.valueChanges.subscribe(function () {
            for (var field in _this.CompanyCourseForm.controls) {
                if (_this.CompanyCourseForm.controls[field].dirty && !_this.isUpdated) {
                    _this.isChangeDetected = true;
                    console.log('in value change', _this.CompanyCourseForm.controls[field].dirty, field);
                }
            }
        });
    };
    //to get aboutYouPage 
    CoursesComponent.prototype.alreadyUser = function () {
        //$('#aboutYouPage').css('display', 'block');
        window.location.href = '/course-sign-in/' + this.courseId + '/MyCourse';
        //window.location.href = '/course-sign-in/' + this.courseId;
    };
    CoursesComponent.prototype.createUser = function () {
        $('#aboutYouPage').css('display', 'block');
    };
    CoursesComponent.prototype.onAboutCourseSelection = function (userType) {
        this.parentStudentUserType = userType;
    };
    CoursesComponent.prototype.redireToLoginOrRegistration = function () {
        var _this = this;
        if (this.isAuthenticated == 'True') {
            return false;
        }
        if (this.parentStudentUserType == 'child') {
            //window.location.href = '/course-sign-in/' + this.courseId + '/' + this.parentStudentUserType;
            this.settingsService.getIdentitySiteUrl()
                .subscribe(function (success) {
                //window.location.href = '/course-' + (this.isGuardian ? 'guardian' : 'student') + '-enroll/' + this.course.courseId;
                window.location.href = success + '/Account/Register?returnUrl=' + window.location.origin + '/course-student-enroll/' + _this.courseId;
            }, function (error) {
            });
            return true;
        }
        if (this.parentStudentUserType == 'parent') {
            //window.location.href = '/course-sign-in/' + this.courseId + '/' + this.parentStudentUserType;
            this.settingsService.getIdentitySiteUrl()
                .subscribe(function (success) {
                window.location.href = success + '/Account/Register?returnUrl=' + window.location.origin + '/course-guardian-enroll/' + _this.courseId;
            }, function (error) {
            });
            return true;
        }
    };
    CoursesComponent.prototype.getUser = function () {
        var _this = this;
        this.usersService.getMy()
            .subscribe(function (success) {
            _this.user = success;
        }, function (error) {
            console.log(error);
        });
    };
    ;
    CoursesComponent.prototype.createEmailFormGroup = function (classSize) {
        //let formArray = this.fb.array([]);
        for (var i = 0; i < classSize; i++) {
            this.emailForm.push(new forms_1.FormGroup({ 'emailAddress': new forms_1.FormControl('', forms_1.Validators.email) }));
        }
        //return formArray;
    };
    //send invitation
    CoursesComponent.prototype.sendInvitation = function () {
        var emailArray = this.CompanyCourseForm.controls.emailForm;
        if (!emailArray.valid) {
            $('.loading').hide();
            this.toastr.error('Please enter valid email address!');
            return;
        }
        ;
        this.addToInvitesByEmailss(emailArray.value);
    };
    CoursesComponent.prototype.addToInvitesByEmailss = function (emailData) {
        if (!emailData || emailData.length === 0 || this.classSessions.length == 0)
            return;
        var myEmailsToInvite = [];
        var classId = this.classSessions.controls[0].value.classSessionId;
        emailData.map(function (email) {
            //if (email.emailAddress != '' && email.emailAddress != null) {
            if (email.emailAddress) {
                myEmailsToInvite.push({
                    'classSessionId': classId,
                    'email': email.emailAddress,
                    'userId': null
                });
                localStorage.setItem('inviteEmailArray', JSON.stringify(myEmailsToInvite));
            }
        });
        //if (myEmailsToInvite.length > 0) {
        //    $('.loading').show();
        //    this.sessionInvitesService.createMultiple(myEmailsToInvite)
        //        .subscribe(
        //            success => {
        //                if (success != '') {
        //                    this.toastr.success('Invitation sent successfully!.');
        //                } else {
        //                    this.toastr.warning('No new invitation sent!');
        //                }
        //                $('.loading').hide();
        //            },
        //            error => { });
        //}
    };
    CoursesComponent.prototype.resetCalendar = function () {
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
    ], CoursesComponent.prototype, "calendarRef", void 0);
    __decorate([
        core_1.HostListener('window:resize', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], CoursesComponent.prototype, "onResize", null);
    CoursesComponent = __decorate([
        core_1.Component({
            selector: 'app-parent-student-course',
            templateUrl: './courses.component.html',
            styleUrls: ['./courses.component.css', '../../../../../wwwroot/lib/assets/css/app.css']
        }),
        __metadata("design:paramtypes", [services_1.SubjectStudyLevelSetupService,
            services_1.TutorsService,
            dialog_1.MatDialog,
            services_1.CoursesService,
            services_1.CompanyService,
            ngx_toastr_1.ToastrService,
            forms_1.FormBuilder,
            services_1.SubjectsService,
            services_1.ParentStudentCoursesService,
            services_1.ClassSessionsService,
            services_1.StudyLevelsService,
            services_1.SubjectCategoriesService,
            services_1.StripeService,
            services_1.UsersService,
            services_1.SessionInvitesService,
            services_1.SettingsService,
            core_1.ChangeDetectorRef])
    ], CoursesComponent);
    return CoursesComponent;
}());
exports.CoursesComponent = CoursesComponent;
//# sourceMappingURL=courses.component.js.map