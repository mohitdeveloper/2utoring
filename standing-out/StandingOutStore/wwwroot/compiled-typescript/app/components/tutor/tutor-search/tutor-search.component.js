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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorSearchComponent = void 0;
var core_1 = require("@angular/core");
var services_1 = require("AngularSource/app/services");
var forms_1 = require("@angular/forms");
var ngx_toastr_1 = require("ngx-toastr");
var TutorSearchComponent = /** @class */ (function () {
    function TutorSearchComponent(toastr, fb, tutorsService, mainSearchService, coursesService) {
        this.toastr = toastr;
        this.fb = fb;
        this.tutorsService = tutorsService;
        this.mainSearchService = mainSearchService;
        this.coursesService = coursesService;
        this.profileTabActive = 'tab1';
        this.isShowMoreVisible = false;
        this.isAuthenticated = isAuthenticated;
        this.dataLimit = 10;
        this.currentLimit = this.dataLimit;
        this.setSearchType = 'Tutor';
        this.tutorArray = [];
        this.apiTutorList = [];
        this.apiCourseList = [];
        this.courseList = [];
        this.filterTutorName = "";
        this.filterTutorCompany = "";
        this.companyArray = [];
        this.daysObj = {
            'Sunday': 0,
            'Monday': 1,
            'Tuesday': 2,
            'Wednesday': 3,
            'Thursday': 4,
            'Friday': 5,
            'Saturday': 6
        };
        this.tutorFilter = {
            "searchType": "Tutor",
            "sortType": "Cheapest",
            "noOfCalling": 0,
            "subjectId": "",
            "studyLevelId": "",
            "isUnder18": false,
            "SearchDay": [],
            "time": null,
            "searchPricePerPerson": {
                "MinPrice": -1,
                "MaxPrice": -1,
                "IsOneToOne": true
            },
            "SearchClassSize": {
                "MinClassSize": -1,
                "MaxClassSize": -1
            },
            "availabilityRequired": 1,
            "SearchCourseDuration": {
                "MinCourseDuration": -1,
                "MaxCourseDuration": -1
            }
        };
        this.currentTab = 1;
        this.tutorList = [];
        this.tutorOnDays = [
            {
                dayOfWeek: 'Sunday',
                tutorCount: 0
            },
            {
                dayOfWeek: 'Monday',
                tutorCount: 0
            },
            {
                dayOfWeek: 'Tuesday',
                tutorCount: 0
            },
            {
                dayOfWeek: 'Wednesday',
                tutorCount: 0
            },
            {
                dayOfWeek: 'Thursday',
                tutorCount: 0
            },
            {
                dayOfWeek: 'Friday',
                tutorCount: 0
            },
            {
                dayOfWeek: 'Saturday',
                tutorCount: 0
            }
        ];
        this.tutorSearchFormFormSubmitted = false;
        this.subjectsImages = services_1.subjectImages;
    }
    Object.defineProperty(TutorSearchComponent.prototype, "tutorSearchFormControls", {
        get: function () { return this.tutorSearchForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    TutorSearchComponent.prototype.ngOnInit = function () {
        localStorage.removeItem('expCourses');
        localStorage.removeItem("tutorId");
        localStorage.removeItem("courseId");
        localStorage.removeItem("currentStep");
        localStorage.removeItem("stepMove");
        localStorage.removeItem("isFinished");
        if (localStorage.getItem('searchType')) {
            this.tutorFilter.searchType = localStorage.getItem('searchType');
            this.setSearchType = this.tutorFilter.searchType;
        }
        if (localStorage.getItem('subjectId')) {
            this.tutorFilter.subjectId = localStorage.getItem('subjectId');
            this.getStudyLevels(this.tutorFilter.subjectId);
        }
        else {
            delete this.tutorFilter.subjectId;
        }
        if (localStorage.getItem('studyLevelId')) {
            this.tutorFilter.studyLevelId = localStorage.getItem('studyLevelId');
        }
        else {
            delete this.tutorFilter.studyLevelId;
        }
        if (localStorage.getItem('sortType')) {
            this.tutorFilter.sortType = localStorage.getItem('sortType');
        }
        if (localStorage.getItem('isUnder18')) {
            this.tutorFilter.isUnder18 = JSON.parse(localStorage.getItem('isUnder18'));
        }
        this.currentTab = parseInt(localStorage.getItem('currentTab')) ? parseInt(localStorage.getItem('currentTab')) : 1;
        this.tutorSearchForm = this.fb.group({
            isUnder18: [this.tutorFilter.isUnder18],
            searchType: [this.setSearchType],
            subjectId: [this.tutorFilter.subjectId ? this.tutorFilter.subjectId : '0'],
            levelId: [this.tutorFilter.studyLevelId ? this.tutorFilter.studyLevelId : '0'],
            sortType: [this.tutorFilter.sortType]
        });
        this.searchTutor();
        this.getSubjects();
        if (this.isAuthenticated == 'True') {
            this.getUserType();
        }
    };
    TutorSearchComponent.prototype.searchTutor = function () {
        var _this = this;
        debugger;
        $('.loading').show();
        this.tutorFilter.noOfCalling = this.tutorFilter.noOfCalling + 1;
        if (this.tutorFilter.subjectId == '0') {
            delete this.tutorFilter.subjectId;
            localStorage.removeItem('subjectId');
            localStorage.removeItem('studyLevelId');
            delete this.tutorFilter.studyLevelId;
        }
        if (this.tutorFilter.studyLevelId == '0') {
            delete this.tutorFilter.studyLevelId;
            localStorage.removeItem('studyLevelId');
        }
        this.tutorsService.getTutorSearch(this.tutorFilter).subscribe(function (res) {
            //this.tutorOnDays = res.tutorOnDays;
            //this.tutorList = res.tutorList;
            $('.loading').hide();
            _this.currentLimit = _this.dataLimit;
            //this.isShowMoreVisible = res.tutorList.length > this.currentLimit ? true : false;
            //this.tutorList = res.tutorList.slice(0, this.currentLimit);
            if (_this.tutorFilter.searchType == 'Tutor') {
                _this.tutorList = res.tutorList;
                _this.apiTutorList = res.tutorList;
            }
            else {
                _this.apiCourseList = res.courseList;
                _this.courseList = res.courseList;
            }
            _this.buildAutoComplete();
            _this.buildTutorDays();
            if (localStorage.getItem("CompanyName")) {
                _this.selectedCompanySearchForm(null, localStorage.getItem("CompanyName"));
                $("#companyId1").val(localStorage.getItem("CompanyName"));
                localStorage.removeItem("CompanyName");
            }
        }, function (err) {
            $('.loading').hide();
        });
    };
    TutorSearchComponent.prototype.buildAutoComplete = function () {
        var _this = this;
        this.tutorArray = [];
        this.companyArray = [];
        var tempCompanyArray = [];
        var dupId = [];
        var obj;
        if (this.tutorFilter.searchType == 'Tutor') {
            obj = this.apiTutorList;
        }
        else {
            obj = this.apiCourseList;
        }
        obj.map(function (a) {
            debugger;
            var tutorName = _this.tutorFilter.searchType == 'Tutor' ? a.userFullName : a.tutorName;
            if (tutorName && !dupId.includes(a.tutorId)) {
                var b = {
                    'tutorId': a.tutorId,
                    'userFullName': tutorName
                };
                dupId.push(a.tutorId);
                _this.tutorArray.push(b);
            }
            if (a.currentCompany) {
                if (!tempCompanyArray.includes(a.currentCompany.companyId)) {
                    _this.companyArray.push({
                        companyName: a.currentCompany.companyName,
                        companyId: a.currentCompany.companyId
                    });
                    tempCompanyArray.push(a.currentCompany.companyId);
                }
            }
        });
    };
    TutorSearchComponent.prototype.getCourseCountDay = function (r) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var cc, day;
                        return __generator(this, function (_a) {
                            cc = [0, 0, 0, 0, 0, 0, 0];
                            if (r.classSessions && r.classSessions.count == 0) {
                                resolve(cc);
                            }
                            r.classSessions.map(function (k) {
                                day = new Date(k.startDate).getDay();
                                cc[day] = cc[day] + 1;
                            });
                            resolve(cc);
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    TutorSearchComponent.prototype.buildTutorDays = function () {
        return __awaiter(this, void 0, void 0, function () {
            var resp, resp;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        debugger;
                        if (!(this.tutorFilter.searchType != 'Course')) return [3 /*break*/, 2];
                        console.time("LL");
                        return [4 /*yield*/, Promise.all(this.apiTutorList.map(function (r) { return __awaiter(_this, void 0, void 0, function () {
                                var _a, _b;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0:
                                            _a = r;
                                            return [4 /*yield*/, this.getAvailabilities(r)];
                                        case 1:
                                            _a.slotData = _c.sent();
                                            _b = r;
                                            return [4 /*yield*/, this.getBookedSlot(r)];
                                        case 2:
                                            _b.bookedSlot = _c.sent();
                                            return [2 /*return*/, r];
                                    }
                                });
                            }); })).then(function (resp) {
                                debugger;
                                _this.apiTutorList = resp;
                                _this.generateSideBarDays(resp);
                            })];
                    case 1:
                        resp = _a.sent();
                        console.timeEnd("LL");
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, Promise.all(this.apiCourseList.map(function (r) { return __awaiter(_this, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _a = r;
                                        return [4 /*yield*/, this.getCourseCountDay(r)];
                                    case 1:
                                        _a.courseData = _b.sent();
                                        return [2 /*return*/, r];
                                }
                            });
                        }); })).then(function (resp) {
                            _this.apiCourseList = resp;
                            _this.generateSideBarDays(resp);
                        })];
                    case 3:
                        resp = _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TutorSearchComponent.prototype.generateSideBarDays = function (resp, recreateSlider) {
        var _this = this;
        if (recreateSlider === void 0) { recreateSlider = 'Yes'; }
        /*if (this.tutorFilter.SearchDay.length > 0) {
          return;
        }*/
        this.oneToOneMinPrice = Number.MAX_VALUE;
        this.oneToOneMaxPrice = Number.MIN_VALUE;
        this.groupMinPrice = Number.MAX_VALUE;
        this.groupMaxPrice = Number.MIN_VALUE;
        this.minCoursePrice = Number.MAX_VALUE;
        this.maxCoursePrice = Number.MIN_VALUE;
        var temp = [
            {
                dayOfWeek: 'Sunday',
                tutorCount: 0
            },
            {
                dayOfWeek: 'Monday',
                tutorCount: 0
            },
            {
                dayOfWeek: 'Tuesday',
                tutorCount: 0
            },
            {
                dayOfWeek: 'Wednesday',
                tutorCount: 0
            },
            {
                dayOfWeek: 'Thursday',
                tutorCount: 0
            },
            {
                dayOfWeek: 'Friday',
                tutorCount: 0
            },
            {
                dayOfWeek: 'Saturday',
                tutorCount: 0
            }
        ];
        if (this.tutorFilter.searchType != 'Course') {
            //console.log(resp);
            resp.map(function (rr) {
                debugger;
                if (rr.tutorPriceLesson) {
                    _this.oneToOneMinPrice = rr.tutorPriceLesson.oneToOneMinPrice < _this.oneToOneMinPrice ? rr.tutorPriceLesson.oneToOneMinPrice : _this.oneToOneMinPrice;
                    _this.oneToOneMaxPrice = rr.tutorPriceLesson.oneToOneMaxPrice > _this.oneToOneMaxPrice ? rr.tutorPriceLesson.oneToOneMaxPrice : _this.oneToOneMaxPrice;
                    _this.groupMinPrice = rr.tutorPriceLesson.groupMinPrice < _this.groupMinPrice ? rr.tutorPriceLesson.groupMinPrice : _this.groupMinPrice;
                    _this.groupMaxPrice = rr.tutorPriceLesson.groupMaxPrice > _this.groupMaxPrice ? rr.tutorPriceLesson.groupMaxPrice : _this.groupMaxPrice;
                }
                temp[0].tutorCount = temp[0].tutorCount + ((rr.slotData[0] - rr.bookedSlot[0]) >= _this.tutorFilter.availabilityRequired ? 1 : 0);
                temp[1].tutorCount = temp[1].tutorCount + ((rr.slotData[1] - rr.bookedSlot[1]) >= _this.tutorFilter.availabilityRequired ? 1 : 0);
                temp[2].tutorCount = temp[2].tutorCount + ((rr.slotData[2] - rr.bookedSlot[2]) >= _this.tutorFilter.availabilityRequired ? 1 : 0);
                temp[3].tutorCount = temp[3].tutorCount + ((rr.slotData[3] - rr.bookedSlot[3]) >= _this.tutorFilter.availabilityRequired ? 1 : 0);
                temp[4].tutorCount = temp[4].tutorCount + ((rr.slotData[4] - rr.bookedSlot[4]) >= _this.tutorFilter.availabilityRequired ? 1 : 0);
                temp[5].tutorCount = temp[5].tutorCount + ((rr.slotData[5] - rr.bookedSlot[5]) >= _this.tutorFilter.availabilityRequired ? 1 : 0);
                temp[6].tutorCount = temp[6].tutorCount + ((rr.slotData[6] - rr.bookedSlot[6]) >= _this.tutorFilter.availabilityRequired ? 1 : 0);
            });
            debugger;
            if (resp.length > 0 && recreateSlider == 'Yes') {
                this.intializePriceSlider('Tutor');
            }
        }
        else {
            debugger;
            resp.map(function (rr) {
                _this.minCoursePrice = rr.classSessionsTotalAmount < _this.minCoursePrice ? rr.classSessionsTotalAmount : _this.minCoursePrice;
                _this.maxCoursePrice = rr.classSessionsTotalAmount > _this.maxCoursePrice ? rr.classSessionsTotalAmount : _this.maxCoursePrice;
                temp[0].tutorCount = temp[0].tutorCount + (rr.courseData[0] > 0 ? 1 : 0);
                temp[1].tutorCount = temp[1].tutorCount + (rr.courseData[1] > 0 ? 1 : 0);
                temp[2].tutorCount = temp[2].tutorCount + (rr.courseData[2] > 0 ? 1 : 0);
                temp[3].tutorCount = temp[3].tutorCount + (rr.courseData[3] > 0 ? 1 : 0);
                temp[4].tutorCount = temp[4].tutorCount + (rr.courseData[4] > 0 ? 1 : 0);
                temp[5].tutorCount = temp[5].tutorCount + (rr.courseData[5] > 0 ? 1 : 0);
                temp[6].tutorCount = temp[6].tutorCount + (rr.courseData[6] > 0 ? 1 : 0);
            });
            if (resp.length > 0 && recreateSlider == 'Yes') {
                this.intializePriceSlider('Course');
            }
        }
        this.tutorOnDays = temp;
        //if (this.tutorFilter.searchPricePerPerson.IsOneToOne) {
        //    $(this.slider1).slider("destroy"); //force the view refresh, re-setting the current value
        //    this.InitilizedRangeSlider(this.oneToOneMinPrice, this.oneToOneMaxPrice);
        //}
        //else {
        //    $(this.slider1).slider("option", "min", this.groupMinPrice); // left handle should be at the left end, but it doesn't move
        //    $(this.slider1).slider("option", "max", this.groupMaxPrice); // left handle should be at the left end, but it doesn't move
        //    $(this.slider1).slider("value", [this.groupMinPrice, this.groupMaxPrice]); //force the view refresh, re-setting the current value
        //}
    };
    TutorSearchComponent.prototype.getAvailabilities = function (r) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var av, currDate, currUtc, cd, repeatedDates;
                        return __generator(this, function (_a) {
                            av = [0, 0, 0, 0, 0, 0, 0];
                            if (r.tutorAvailabilities.length == 0) {
                                resolve(av);
                            }
                            currDate = new Date();
                            currUtc = currDate.getTime();
                            cd = 24 * 60 * 60 * 1000;
                            repeatedDates = [];
                            r.tutorAvailabilities.map(function (k) {
                                if (!repeatedDates.includes(k.startTime)) {
                                    //if (r.userFullName == 'Abc Tutor') {
                                    //    debugger;
                                    //}
                                    repeatedDates.push(k.startTime);
                                    var d = new Date(k.startTime);
                                    var dayOfWeek = d.getDay();
                                    var addDays = k.noOfWeek * 7;
                                    d.setTime(d.getTime() + addDays * 24 * 60 * 60 * 1000);
                                    if (d.getTime() > currUtc) {
                                        if (k.noOfWeek == 0) {
                                            av[dayOfWeek] = av[dayOfWeek] + 1;
                                        }
                                        else {
                                            var diff = currUtc - (new Date(k.startTime).getTime());
                                            if (diff > 0) {
                                                diff = Math.ceil((diff / (cd)) / 7);
                                                av[dayOfWeek] = av[dayOfWeek] + k.noOfWeek - diff;
                                            }
                                            else {
                                                av[dayOfWeek] = av[dayOfWeek] + k.noOfWeek;
                                            }
                                        }
                                    }
                                }
                            });
                            resolve(av);
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    TutorSearchComponent.prototype.getBookedSlot = function (r) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var bs, currUTC_1, stdate_1, repeatedDates_1;
                        return __generator(this, function (_a) {
                            bs = [0, 0, 0, 0, 0, 0, 0];
                            if (!r.tutorCourseList) {
                                resolve(bs);
                            }
                            else {
                                currUTC_1 = new Date().getTime();
                                repeatedDates_1 = [];
                                r.tutorCourseList.map(function (cs) {
                                    if (cs.classSessions) {
                                        cs.classSessions.map(function (cds) {
                                            if (!repeatedDates_1.includes(cds.startDate)) {
                                                repeatedDates_1.push(cds.startDate);
                                                stdate_1 = new Date(cds.startDate);
                                                if (stdate_1.getTime() >= currUTC_1) {
                                                    //if (r.userFullName == 'Looks Roy' && stdate.getDay() == 5) {
                                                    //    console.log(cds.startDate);
                                                    //}
                                                    bs[stdate_1.getDay()] = bs[stdate_1.getDay()] + 1;
                                                }
                                            }
                                        });
                                    }
                                });
                                resolve(bs);
                            }
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    TutorSearchComponent.prototype.checkTimeSlot = function (r) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var pad, date, sp, fh, fm, beforeTime, afterTime, fromTime, toTime, x1, x2, y1, y2, stDate, stTime, endTime, flag;
                        return __generator(this, function (_a) {
                            if (!this.tutorFilter.time) {
                                resolve(true);
                                return [2 /*return*/];
                            }
                            if (!r.tutorAvailabilities && r.tutorAvailabilities.length == 0) {
                                resolve(false);
                                return [2 /*return*/];
                            }
                            pad = function (n) { return n < 10 ? '0' + n : n; };
                            date = new Date();
                            sp = this.tutorFilter.time.split(":");
                            fh = parseInt(sp[0]);
                            fm = parseInt(sp[1]);
                            date.setHours(fh, fm, 0, 0);
                            beforeTime = new Date(date);
                            afterTime = new Date(date);
                            beforeTime.setHours(beforeTime.getHours() - 1);
                            afterTime.setHours(afterTime.getHours() + 1);
                            fromTime = pad(beforeTime.getHours()) + ':' + pad(beforeTime.getMinutes()) + ':00';
                            toTime = pad(afterTime.getHours()) + ':' + pad(afterTime.getMinutes()) + ':00';
                            flag = r.tutorAvailabilities.some(function (kk) {
                                stDate = kk.startTime.split("T")[0];
                                stTime = kk.startTime.split("T")[1];
                                endTime = kk.endTime.split("T")[1];
                                x1 = new Date(stDate + 'T' + fromTime).getTime();
                                x2 = new Date(stDate + 'T' + toTime).getTime();
                                y1 = new Date(stDate + 'T' + stTime).getTime();
                                y2 = new Date(stDate + 'T' + endTime).getTime();
                                if (x1 < y2 && x2 > y1) {
                                    return true;
                                }
                                else {
                                    return false;
                                }
                            });
                            resolve(flag);
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    TutorSearchComponent.prototype.getSubjects = function () {
        var _this = this;
        this.mainSearchService.getAllTutorSubject()
            .subscribe(function (success) {
            _this.subjects = success;
        }, function (error) {
            console.log(error);
        });
    };
    ;
    TutorSearchComponent.prototype.getStudyLevels = function (id) {
        var _this = this;
        debugger;
        this.mainSearchService.getAllSubjectLevelBySubjectId(id)
            .subscribe(function (success) {
            _this.studyLevels = success;
        }, function (error) {
            console.log(error);
        });
    };
    ;
    TutorSearchComponent.prototype.onSubjectChange = function ($event) {
        if ($event) {
            var id = $event.target.options[$event.target.options.selectedIndex].value;
            debugger;
            if (id != '0') {
                this.getStudyLevels(id);
                this.tutorSearchForm.controls["subjectId"].setValue(id);
                this.tutorFilter.subjectId = id;
                //this.selectedSubjectId = this.tutorSearchForm.value.subjectId;
            }
            else {
                delete this.tutorFilter.subjectId;
                delete this.tutorFilter.studyLevelId;
            }
        }
    };
    TutorSearchComponent.prototype.onLevelChange = function ($event) {
        if ($event) {
            var id = $event.target.options[$event.target.options.selectedIndex].value;
            debugger;
            if (id != '0') {
                //this.getStudyLevels(id);
                this.tutorSearchForm.controls["levelId"].setValue(id);
                this.tutorFilter.studyLevelId = id;
            }
            else {
                debugger;
                delete this.tutorFilter.studyLevelId;
            }
        }
    };
    TutorSearchComponent.prototype.ngAfterViewInit = function () {
        var that = this;
        this.intializePriceSlider();
        if (this.tutorFilter.searchType != 'Course') {
            this.initializeAvailabilitySlider();
        }
        else {
            this.intializeCourseDurationSlider();
            this.intializeMaxClassSizeSlider();
        }
    };
    TutorSearchComponent.prototype.initializeAvailabilitySlider = function () {
        var that = this;
        //$("#slider-range").slider('destroy');
        $("#slider-range").slider({
            range: false,
            min: 1,
            max: 50,
            step: 1,
            values: [1],
            slide: function (e, ui) {
                var min = Math.floor(ui.values[0]);
                $('.slider-time').html(min + ' Week');
                that.tutorFilter.availabilityRequired = min;
                that.localFilter();
            }
        });
    };
    TutorSearchComponent.prototype.intializePriceSlider = function (type) {
        if (type === void 0) { type = 'NA'; }
        debugger;
        var min = 1;
        var max = 100;
        var values = [1, 100];
        if (type == 'Tutor') {
            if (this.tutorFilter.searchPricePerPerson.IsOneToOne) {
                min = this.oneToOneMinPrice;
                max = this.oneToOneMaxPrice;
                values = [min, max];
            }
            else {
                min = this.groupMinPrice;
                max = this.groupMaxPrice;
                values = [min, max];
            }
            if (min == max) {
                return;
            }
            $("#slider-range1").slider('destroy');
        }
        if (type == 'Course') {
            min = this.minCoursePrice;
            max = this.maxCoursePrice;
            values = [min, max];
            if (min == max) {
                return;
            }
            $("#slider-range1").slider('destroy');
        }
        var that = this;
        if (that.tutorFilter.searchType == 'Course') {
            $('.slider-time02').html(max);
            $('.slider-time01').html(min);
        }
        else {
            $('.slider-time02').html(max + '/hr');
            $('.slider-time01').html(min + '/hr');
        }
        //$("#slider-range1").slider('destroy');
        $("#slider-range1").slider({
            range: true,
            min: min,
            max: max,
            step: 1,
            values: values,
            slide: function (e, ui) {
                debugger;
                var min = Math.floor(ui.values[0]);
                var max = Math.floor(ui.values[1]);
                if (that.tutorFilter.searchType == 'Course') {
                    $('.slider-time02').html(max);
                    $('.slider-time01').html(min);
                }
                else {
                    $('.slider-time02').html(max + '/hr');
                    $('.slider-time01').html(min + '/hr');
                }
                that.tutorFilter.searchPricePerPerson.MinPrice = min;
                that.tutorFilter.searchPricePerPerson.MaxPrice = max;
                that.localFilter();
            }
        });
    };
    TutorSearchComponent.prototype.intializeMaxClassSizeSlider = function () {
        var that = this;
        //$("#slider-range3").slider('destroy');
        $("#slider-range3").slider({
            range: true,
            min: 1,
            max: 10,
            step: 1,
            values: [1, 10],
            slide: function (e, ui) {
                var min = Math.floor(ui.values[0]);
                $('.slider-time041').html(min);
                var max = Math.floor(ui.values[1]);
                $('.slider-time042').html(max);
                that.tutorFilter.SearchClassSize.MinClassSize = min;
                that.tutorFilter.SearchClassSize.MaxClassSize = max;
                that.localFilter();
            }
        });
    };
    TutorSearchComponent.prototype.intializeCourseDurationSlider = function () {
        var that = this;
        //$("#slider-range2").slider('destroy');
        $("#slider-range2").slider({
            range: true,
            min: 1,
            max: 50,
            step: 1,
            values: [1, 50],
            slide: function (e, ui) {
                var min = Math.floor(ui.values[0]);
                $('.slider-time021').html(min + ' Week');
                var max = Math.floor(ui.values[1]);
                $('.slider-time022').html(max + ' Week');
                that.tutorFilter.SearchCourseDuration.MinCourseDuration = min;
                that.tutorFilter.SearchCourseDuration.MaxCourseDuration = max;
                that.localFilter();
            }
        });
    };
    TutorSearchComponent.prototype.InitilizedRangeSlider = function (min, max) {
        var that = this;
        $("#slider-range1").slider({
            range: true,
            min: min,
            max: max,
            step: 1,
            values: [1, 100],
            slide: function (e, ui) {
                var min = Math.floor(ui.values[0]);
                $('.slider-time01').html(min + '/hr');
                var max = Math.floor(ui.values[1]);
                $('.slider-time02').html(max + '/hr');
                that.tutorFilter.searchPricePerPerson.MinPrice = min;
                that.tutorFilter.searchPricePerPerson.MaxPrice = max;
                that.filterTutorName = '';
                $('#tutorId1').val('');
                that.filterTutorCompany = '';
                $('#companyId1').val('');
                that.localFilter();
            }
        });
    };
    TutorSearchComponent.prototype.showTab = function (currentTab) {
        this.coursesService.imagesSequence = {};
        this.currentTab = currentTab;
        if (this.currentTab == 3) {
            this.tutorFilter.sortType = 'Popular';
            localStorage.setItem('sortType', this.tutorFilter.sortType);
            localStorage.setItem('currentTab', '3');
        }
        if (this.currentTab == 1) {
            this.tutorFilter.sortType = 'Cheapest';
            localStorage.setItem('sortType', this.tutorFilter.sortType);
            localStorage.setItem('currentTab', '1');
        }
        this.searchTutor();
    };
    TutorSearchComponent.prototype.getFilterTime = function () {
        this.tutorFilter.time = this.filterTime.nativeElement.value;
        debugger;
        this.localFilter();
    };
    TutorSearchComponent.prototype.getSelectedDays = function ($event) {
        var day = parseInt($event.target.value);
        if ($event.target.checked) {
            this.tutorFilter.SearchDay.push(day);
        }
        else {
            this.tutorFilter.SearchDay = this.tutorFilter.SearchDay.filter(function (a) { return a != day; });
        }
        this.localFilter();
    };
    TutorSearchComponent.prototype.setAgeRange = function ($event) {
        if ($event.target.checked) {
            this.tutorSearchForm.controls["isUnder18"].setValue(true);
            this.tutorFilter.isUnder18 = true;
        }
        else {
            this.tutorSearchForm.controls["isUnder18"].setValue(false);
            this.tutorFilter.isUnder18 = false;
        }
        //this.localFilter();
    };
    TutorSearchComponent.prototype.getTutorRecords = function () {
        this.tutorSearchFormFormSubmitted = true;
        if (this.tutorSearchForm.valid) {
            var obj = __assign({}, this.tutorSearchForm.getRawValue());
            this.tutorFilter = {
                "searchType": obj.searchType,
                "sortType": "Cheapest",
                "noOfCalling": 1,
                "subjectId": obj.subjectId,
                "studyLevelId": obj.levelId,
                "isUnder18": obj.isUnder18,
                "SearchDay": [],
                "time": null,
                "searchPricePerPerson": {
                    "MinPrice": -1,
                    "MaxPrice": -1,
                    "IsOneToOne": true
                },
                "SearchClassSize": {
                    "MinClassSize": -1,
                    "MaxClassSize": -1
                },
                "availabilityRequired": 1,
                "SearchCourseDuration": {
                    "MinCourseDuration": -1,
                    "MaxCourseDuration": -1
                }
            };
            localStorage.setItem('isUnder18', obj.isUnder18);
            if (obj.levelId) {
                localStorage.setItem('studyLevelId', obj.levelId);
            }
            else {
                delete this.tutorFilter.studyLevelId;
            }
            if (obj.subjectId) {
                localStorage.setItem('subjectId', obj.subjectId);
            }
            else {
                delete this.tutorFilter.subjectId;
            }
            localStorage.setItem('searchType', obj.searchType);
            localStorage.setItem('sortType', obj.sortType);
            this.searchTutor();
        }
    };
    TutorSearchComponent.prototype.selectedTutorSearchForm = function ($event) {
        var tutorName = $event.userFullName;
        if (this.filterTutorName != tutorName) {
            this.filterTutorName = tutorName;
            this.localFilter();
        }
    };
    TutorSearchComponent.prototype.selectedCompanySearchForm = function ($event, searchVal) {
        if (searchVal === void 0) { searchVal = ''; }
        var companyName = searchVal ? searchVal : $event.companyName;
        if (this.filterTutorCompany != companyName) {
            this.filterTutorCompany = companyName;
            this.localFilter();
        }
    };
    TutorSearchComponent.prototype.localFilter = function (generate_price_slider) {
        if (generate_price_slider === void 0) { generate_price_slider = 'No'; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                debugger;
                this.currentLimit = this.dataLimit;
                if (this.tutorFilter.searchType != 'Course') {
                    this.filterTutor(generate_price_slider);
                }
                else {
                    this.filterCourse(generate_price_slider);
                }
                return [2 /*return*/];
            });
        });
    };
    TutorSearchComponent.prototype.filterTutor = function (generate_price_slider) {
        if (generate_price_slider === void 0) { generate_price_slider = 'No'; }
        return __awaiter(this, void 0, void 0, function () {
            var tempCompanyArray, dupId, asyncFilter, tempTutorList;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.tutorArray = [];
                        this.companyArray = [];
                        tempCompanyArray = [];
                        dupId = [];
                        asyncFilter = function (arr, predicate) { return __awaiter(_this, void 0, void 0, function () {
                            var results;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Promise.all(arr.map(predicate))];
                                    case 1:
                                        results = _a.sent();
                                        return [2 /*return*/, arr.filter(function (_v, index) { return results[index]; })];
                                }
                            });
                        }); };
                        return [4 /*yield*/, asyncFilter(this.apiTutorList, function (r) { return __awaiter(_this, void 0, void 0, function () {
                                var checkTutorName, checkTutorCompany, checkPrices, checkAvailbility, timeCheck;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.checkTutorNameFilter(r)];
                                        case 1:
                                            checkTutorName = _a.sent();
                                            return [4 /*yield*/, this.checkCompanyNameFilter(r)];
                                        case 2:
                                            checkTutorCompany = _a.sent();
                                            return [4 /*yield*/, this.checkMinMaxPrice(r)];
                                        case 3:
                                            checkPrices = _a.sent();
                                            return [4 /*yield*/, this.availabilityRequired(r)];
                                        case 4:
                                            checkAvailbility = _a.sent();
                                            //let checkUnder18 = await this.isUnderCheck(r);
                                            if (r.userFullName == 'Starter Tutor') {
                                                debugger;
                                            }
                                            if (!(checkTutorName && checkTutorCompany &&
                                                checkPrices && checkAvailbility)) return [3 /*break*/, 6];
                                            return [4 /*yield*/, this.checkTimeSlot(r)];
                                        case 5:
                                            timeCheck = _a.sent();
                                            if (timeCheck) {
                                                if (r.userFullName && !dupId.includes(r.tutorId)) {
                                                    dupId.push(r.tutorId);
                                                    this.tutorArray.push({ 'tutorId': r.tutorId, 'userFullName': r.userFullName });
                                                }
                                                if (r.currentCompany) {
                                                    if (!tempCompanyArray.includes(r.currentCompany.companyId)) {
                                                        this.companyArray.push({
                                                            companyName: r.currentCompany.companyName,
                                                            companyId: r.currentCompany.companyId
                                                        });
                                                        tempCompanyArray.push(r.currentCompany.companyId);
                                                    }
                                                }
                                            }
                                            return [2 /*return*/, timeCheck];
                                        case 6: return [2 /*return*/, false];
                                    }
                                });
                            }); })];
                    case 1:
                        //this.currentLimit = 10;
                        tempTutorList = _a.sent();
                        this.isShowMoreVisible = tempTutorList.length > 10 ? true : false;
                        this.tutorList = tempTutorList;
                        this.generateSideBarDays(this.tutorList, generate_price_slider);
                        return [2 /*return*/];
                }
            });
        });
    };
    TutorSearchComponent.prototype.filterCourse = function (generate_price_slider) {
        if (generate_price_slider === void 0) { generate_price_slider = 'No'; }
        return __awaiter(this, void 0, void 0, function () {
            var tempCompanyArray, dupId, asyncFilter, _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        //console.time("Time this Course");
                        this.coursesService.imagesSequence = {};
                        this.tutorArray = [];
                        this.companyArray = [];
                        tempCompanyArray = [];
                        dupId = [];
                        asyncFilter = function (arr, predicate) { return __awaiter(_this, void 0, void 0, function () {
                            var results;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, Promise.all(arr.map(predicate))];
                                    case 1:
                                        results = _a.sent();
                                        return [2 /*return*/, arr.filter(function (_v, index) {
                                                if (index == true) {
                                                }
                                                return results[index];
                                            })];
                                }
                            });
                        }); };
                        _a = this;
                        return [4 /*yield*/, asyncFilter(this.apiCourseList, function (r) { return __awaiter(_this, void 0, void 0, function () {
                                var checkTutorName, checkTutorCompany, checkPrices, checkDay, checkCourseDuration, checkDayMaxClassSize, checkTime;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.checkTutorNameFilter(r)];
                                        case 1:
                                            checkTutorName = _a.sent();
                                            return [4 /*yield*/, this.checkCompanyNameFilter(r)];
                                        case 2:
                                            checkTutorCompany = _a.sent();
                                            return [4 /*yield*/, this.checkMinMaxPriceCourse(r)];
                                        case 3:
                                            checkPrices = _a.sent();
                                            return [4 /*yield*/, this.checkDayCourse(r)];
                                        case 4:
                                            checkDay = _a.sent();
                                            return [4 /*yield*/, this.filterCourseDuration(r)];
                                        case 5:
                                            checkCourseDuration = _a.sent();
                                            return [4 /*yield*/, this.filterMaxClassSize(r)];
                                        case 6:
                                            checkDayMaxClassSize = _a.sent();
                                            if (checkTutorName && checkTutorCompany && checkPrices && checkDay && checkCourseDuration && checkDayMaxClassSize) {
                                                checkTime = this.checkCourseTime(r);
                                                if (checkTime) {
                                                    if (r.tutorName && !dupId.includes(r.tutorId)) {
                                                        dupId.push(r.tutorId);
                                                        this.tutorArray.push({ 'tutorId': r.tutorId, 'userFullName': r.tutorName });
                                                    }
                                                    if (r.currentCompany) {
                                                        if (!tempCompanyArray.includes(r.currentCompany.companyId)) {
                                                            this.companyArray.push({
                                                                companyName: r.currentCompany.companyName,
                                                                companyId: r.currentCompany.companyId
                                                            });
                                                            tempCompanyArray.push(r.currentCompany.companyId);
                                                        }
                                                    }
                                                }
                                                return [2 /*return*/, checkTime];
                                            }
                                            else {
                                                return [2 /*return*/, false];
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.courseList = _b.sent();
                        this.generateSideBarDays(this.courseList, generate_price_slider);
                        console.timeEnd("Time this Course");
                        return [2 /*return*/];
                }
            });
        });
    };
    TutorSearchComponent.prototype.checkTutorNameFilter = function (r) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var tutorName;
                        return __generator(this, function (_a) {
                            tutorName = this.tutorFilter.searchType != 'Course' ? r.userFullName : r.tutorName;
                            if (this.filterTutorName == "" || tutorName == this.filterTutorName) {
                                resolve(true);
                            }
                            resolve(false);
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    TutorSearchComponent.prototype.checkCompanyNameFilter = function (r) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (this.filterTutorCompany == "" || (r.currentCompany && r.currentCompany.companyName == this.filterTutorCompany)) {
                                resolve(true);
                            }
                            resolve(false);
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    TutorSearchComponent.prototype.checkMinMaxPrice = function (r) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (this.tutorFilter.searchPricePerPerson.MinPrice == -1) {
                                resolve(true);
                            }
                            else if (this.tutorFilter.searchPricePerPerson.IsOneToOne) {
                                if (r.tutorPriceLesson.oneToOneMinPrice >= this.tutorFilter.searchPricePerPerson.MinPrice
                                    && this.tutorFilter.searchPricePerPerson.MaxPrice >= r.tutorPriceLesson.oneToOneMaxPrice) {
                                    resolve(true);
                                }
                                else {
                                    resolve(false);
                                }
                            }
                            else {
                                if (r.tutorPriceLesson.groupMinPrice >= this.tutorFilter.searchPricePerPerson.MinPrice
                                    && this.tutorFilter.searchPricePerPerson.MaxPrice >= r.tutorPriceLesson.groupMaxPrice) {
                                    resolve(true);
                                }
                                else {
                                    resolve(false);
                                }
                            }
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    TutorSearchComponent.prototype.availabilityRequired = function (t) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var flag, flag;
                        var _this = this;
                        return __generator(this, function (_a) {
                            if (t.slotData.length == 0 && this.tutorFilter.availabilityRequired == 1) {
                                resolve(true);
                            }
                            if (this.tutorFilter.SearchDay.length > 0) {
                                flag = this.tutorFilter.SearchDay.some(function (tt) {
                                    //|| (t.slotData[tt] == 0)
                                    if (t.userFullName == 'Starter Tutor') {
                                        debugger;
                                    }
                                    if (((t.slotData[tt] - t.bookedSlot[tt]) < _this.tutorFilter.availabilityRequired)) {
                                        return true;
                                    }
                                });
                                resolve(!flag); //Add this tutor
                            }
                            else {
                                flag = t.slotData.some(function (tt, index) {
                                    //if (t.userFullName == "Looks Roy") {
                                    //    debugger;
                                    //}
                                    if (((tt - t.bookedSlot[index]) >= _this.tutorFilter.availabilityRequired) || _this.tutorFilter.availabilityRequired == 1) {
                                        return true;
                                    }
                                });
                                resolve(flag); //Add this tutor
                            }
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    TutorSearchComponent.prototype.isUnderCheck = function (r) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var flag;
                        return __generator(this, function (_a) {
                            if (!this.tutorFilter.isUnder18) {
                                resolve(true);
                            }
                            if (r.tutorCourseList && r.tutorCourseList.length > 0) {
                                flag = r.tutorCourseList.some(function (kk) {
                                    if (kk.isUnder18 == true) {
                                        return true;
                                    }
                                });
                                resolve(flag);
                            }
                            else {
                                resolve(false);
                            }
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    TutorSearchComponent.prototype.showMoreData = function () {
        debugger;
        this.currentLimit = this.currentLimit + this.dataLimit;
        //this.tutorList = this.apiTutorList.slice(0, this.currentLimit);
    };
    TutorSearchComponent.prototype.clearSearchFilter = function (searchFilterType, isOneToOne) {
        if (isOneToOne === void 0) { isOneToOne = true; }
        debugger;
        switch (searchFilterType) {
            case 'Days':
                $('.weekDays').attr('checked', false);
                this.tutorFilter.SearchDay = [];
                this.localFilter();
                break;
            case 'Time':
                this.filterTime.nativeElement.value = '00:00';
                this.tutorFilter.time = null;
                this.localFilter();
                break;
            case 'Availability':
                $('.slider-time').html('1 Week');
                this.tutorFilter.availabilityRequired = 1;
                $("#slider-range").slider('destroy');
                this.initializeAvailabilitySlider();
                this.localFilter();
                break;
            case 'Price':
                /*if (this.tutorFilter.searchType == 'Tutor') {
                    $('.slider-time01').html('1 /hr');
                    $('.slider-time02').html('100 /hr');
                } else {
                    $('.slider-time01').html('1');
                    $('.slider-time02').html('100');
                }*/
                this.tutorFilter.searchPricePerPerson = {
                    "MinPrice": -1,
                    "MaxPrice": -1,
                    "IsOneToOne": isOneToOne
                };
                //$("#slider-range1").slider('destroy');
                //this.intializePriceSlider();
                this.localFilter('Yes');
                break;
            case 'AdSearch':
                $('#tutorId1').val('');
                $('#companyId1').val('');
                this.filterTutorName = "";
                this.filterTutorCompany = "";
                this.localFilter();
                break;
            case 'CourseDuration':
                $('.slider-time021').html('1 Week');
                $('.slider-time022').html('50 Week');
                $("#slider-range2").slider('destroy');
                this.intializeCourseDurationSlider();
                this.tutorFilter.SearchCourseDuration = {
                    "MinCourseDuration": -1,
                    "MaxCourseDuration": -1
                };
                this.localFilter();
                break;
            case 'classSize':
                $('.slider-time041').html('1');
                $('.slider-time042').html('10');
                $("#slider-range3").slider('destroy');
                this.intializeMaxClassSizeSlider();
                this.tutorFilter.SearchClassSize = {
                    "MinClassSize": -1,
                    "MaxClassSize": -1
                };
                this.localFilter();
                break;
        }
    };
    TutorSearchComponent.prototype.checkMinMaxPriceCourse = function (r) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (this.tutorFilter.searchPricePerPerson.MinPrice != -1) {
                                if (this.tutorFilter.searchPricePerPerson.MinPrice <= r.classSessionsTotalAmount
                                    && this.tutorFilter.searchPricePerPerson.MaxPrice >= r.classSessionsTotalAmount) {
                                    resolve(true);
                                }
                                else {
                                    resolve(false);
                                }
                            }
                            else {
                                resolve(true);
                            }
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    TutorSearchComponent.prototype.checkDayCourse = function (r) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var flag;
                        return __generator(this, function (_a) {
                            if (this.tutorFilter.SearchDay.length == 0) {
                                resolve(true);
                            }
                            else {
                                flag = this.tutorFilter.SearchDay.some(function (d) {
                                    if (r.courseData[d] == 0) {
                                        return true;
                                    }
                                });
                                resolve(!flag);
                            }
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    TutorSearchComponent.prototype.checkCourseTime = function (r) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var pad, date, sp, fh, fm, beforeTime, afterTime, fromTime_1, toTime_1, x1_1, x2_1, y1_1, y2_1, stDate_1, stTime_1, endTime_1, flag;
                        return __generator(this, function (_a) {
                            if (!this.tutorFilter.time) {
                                resolve(true);
                            }
                            else {
                                pad = function (n) { return n < 10 ? '0' + n : n; };
                                date = new Date();
                                sp = this.tutorFilter.time.split(":");
                                fh = parseInt(sp[0]);
                                fm = parseInt(sp[1]);
                                date.setHours(fh, fm, 0, 0);
                                beforeTime = new Date(date);
                                afterTime = new Date(date);
                                beforeTime.setHours(beforeTime.getHours() - 1);
                                afterTime.setHours(afterTime.getHours() + 1);
                                fromTime_1 = pad(beforeTime.getHours()) + ':' + pad(beforeTime.getMinutes()) + ':00';
                                toTime_1 = pad(afterTime.getHours()) + ':' + pad(afterTime.getMinutes()) + ':00';
                                flag = r.classSessions.some(function (kk) {
                                    stDate_1 = kk.startDate.split("T")[0];
                                    stTime_1 = kk.startDate.split("T")[1];
                                    endTime_1 = kk.endDate.split("T")[1];
                                    x1_1 = new Date(stDate_1 + 'T' + fromTime_1).getTime();
                                    x2_1 = new Date(stDate_1 + 'T' + toTime_1).getTime();
                                    y1_1 = new Date(stDate_1 + 'T' + stTime_1).getTime();
                                    y2_1 = new Date(stDate_1 + 'T' + endTime_1).getTime();
                                    if (x1_1 < y2_1 && x2_1 > y1_1) {
                                        return true;
                                    }
                                    else {
                                        return false;
                                    }
                                });
                                resolve(flag);
                            }
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    TutorSearchComponent.prototype.filterMaxClassSize = function (r) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var avClass;
                        return __generator(this, function (_a) {
                            if (this.tutorFilter.SearchClassSize.MinClassSize == -1) {
                                resolve(true);
                            }
                            else {
                                avClass = (r.maxClassSize - r.courseAttendeesCount);
                                if (avClass >= this.tutorFilter.SearchClassSize.MinClassSize
                                    && this.tutorFilter.SearchClassSize.MaxClassSize >= avClass) {
                                    resolve(true);
                                }
                                else {
                                    resolve(false);
                                }
                            }
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    TutorSearchComponent.prototype.filterCourseDuration = function (r) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                        var date1, date2, diffTime, diffDays;
                        return __generator(this, function (_a) {
                            if (this.tutorFilter.SearchCourseDuration.MinCourseDuration == -1 || this.tutorFilter.SearchCourseDuration.MinCourseDuration == 1) {
                                resolve(true);
                            }
                            else {
                                date1 = new Date(r.startDate).getTime();
                                date2 = new Date(r.endDate).getTime();
                                diffTime = Math.abs(date2 - date1);
                                diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                diffDays = diffDays / 7;
                                if (diffDays >= this.tutorFilter.SearchCourseDuration.MinCourseDuration
                                    && this.tutorFilter.SearchCourseDuration.MaxCourseDuration >= diffDays) {
                                    resolve(true);
                                }
                                else {
                                    resolve(false);
                                }
                            }
                            return [2 /*return*/];
                        });
                    }); })];
            });
        });
    };
    TutorSearchComponent.prototype.setSerachType = function ($event) {
        var _this = this;
        this.tutorFilter.searchType = $event.target.value;
        this.tutorList = [];
        this.courseList = [];
        if (this.tutorFilter.searchType != 'Course') {
            localStorage.setItem("searchType", "Tutor");
            setTimeout(function () {
                _this.initializeAvailabilitySlider();
                _this.resetFilterOnSearchTypeChange();
            }, 100);
        }
        else {
            localStorage.setItem("searchType", "Course");
            setTimeout(function () {
                _this.intializeCourseDurationSlider();
                _this.intializeMaxClassSizeSlider();
                _this.resetFilterOnSearchTypeChange();
            }, 100);
        }
    };
    TutorSearchComponent.prototype.setSerachTypeCreateNow = function () {
        this.courseCreateNow.nativeElement.click();
    };
    TutorSearchComponent.prototype.resetFilterOnSearchTypeChange = function () {
        this.coursesService.imagesSequence = {};
        this.tutorFilter = {
            "searchType": this.tutorFilter.searchType,
            "sortType": "Cheapest",
            "noOfCalling": 0,
            "subjectId": this.tutorFilter.subjectId,
            "studyLevelId": this.tutorFilter.studyLevelId,
            "isUnder18": this.tutorFilter.isUnder18,
            "SearchDay": [],
            "time": null,
            "searchPricePerPerson": {
                "MinPrice": -1,
                "MaxPrice": -1,
                "IsOneToOne": true
            },
            "SearchClassSize": {
                "MinClassSize": -1,
                "MaxClassSize": -1
            },
            "availabilityRequired": 1,
            "SearchCourseDuration": {
                "MinCourseDuration": -1,
                "MaxCourseDuration": -1
            }
        };
        this.searchTutor();
    };
    TutorSearchComponent.prototype.getUserType = function () {
        var _this = this;
        //get user type
        this.coursesService.getUserType()
            .subscribe(function (success) {
            _this.userType = success;
            $('.loading').hide();
        }, function (error) {
        });
    };
    TutorSearchComponent.prototype.redirectMe = function (typ, id) {
        if (typ == 'myCourse') {
            localStorage.removeItem('expCourses');
            localStorage.setItem('tutorId', id);
            window.location.href = "my-course";
        }
        if (typ == 'tutorCourses') {
            localStorage.setItem('expCourses', 'True');
            window.location.href = "tutor/" + id;
        }
        if (typ == 'courseDetails') {
            localStorage.setItem('coid', id);
            localStorage.removeItem('expCourses');
            window.location.href = "course-details";
        }
        if (typ == 'viewTutor') {
            localStorage.removeItem('expCourses');
            window.location.href = "tutor/" + id;
        }
    };
    TutorSearchComponent.prototype.handleDesableBookTutor = function () {
        if (!['CompanyTutor', 'Tutor', 'Company'].includes(this.userType)) {
            //alert("Parent/Student")
            this.toastr.warning("If you can't find an appropriate time slot, send your chosen tutor a message from their profile area specifying your requirements.");
        }
        else {
            this.toastr.warning("Action not allowed.");
            //alert("CompanyTutor, Tutor, Company");
        }
    };
    TutorSearchComponent.prototype.trackByFn = function (index, item) {
        return item.courseId; // or item.id
    };
    TutorSearchComponent.prototype.setProfileTabActive = function (tabName) {
        if (this.profileTabActive == tabName) {
            this.profileTabActive = '';
        }
        else {
            this.profileTabActive = tabName;
        }
    };
    __decorate([
        core_1.ViewChild('filterTime'),
        __metadata("design:type", Object)
    ], TutorSearchComponent.prototype, "filterTime", void 0);
    __decorate([
        core_1.ViewChild('courseCreateNow'),
        __metadata("design:type", Object)
    ], TutorSearchComponent.prototype, "courseCreateNow", void 0);
    TutorSearchComponent = __decorate([
        core_1.Component({
            selector: 'app-tutor-search',
            templateUrl: './tutor-search.component.html',
            styleUrls: ['./tutor-search.component.css']
        }),
        __metadata("design:paramtypes", [ngx_toastr_1.ToastrService, forms_1.FormBuilder, services_1.TutorsService, services_1.MainSearchService, services_1.CoursesService])
    ], TutorSearchComponent);
    return TutorSearchComponent;
}());
exports.TutorSearchComponent = TutorSearchComponent;
//# sourceMappingURL=tutor-search.component.js.map