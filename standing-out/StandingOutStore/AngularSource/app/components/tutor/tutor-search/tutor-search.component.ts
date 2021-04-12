import { Component, OnInit, ViewChild } from '@angular/core';
import { TutorsService, MainSearchService, CoursesService, subjectImages } from 'AngularSource/app/services';
import { FormGroup, FormBuilder } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

declare var $: any;
declare var isAuthenticated: any;
@Component({
    selector: 'app-tutor-search',
    templateUrl: './tutor-search.component.html',
    styleUrls: ['./tutor-search.component.css']
})
export class TutorSearchComponent implements OnInit {
    @ViewChild('filterTime') filterTime;
    @ViewChild('courseCreateNow') courseCreateNow;

    profileTabActive = 'tab1';
    isShowMoreVisible: boolean = false;
    isAuthenticated = isAuthenticated;
    dataLimit: number = 10;
    currentLimit: number = this.dataLimit;
    setSearchType: string = 'Tutor';
    minCoursePrice: number;
    maxCoursePrice: number;
    userType: any;
    tutorArray = [];
    apiTutorList = [];
    apiCourseList = [];
    courseList = [];
    filterTutorName = "";
    filterTutorCompany = "";
    companyArray = [];
    subjects: {};
    studyLevels: {};
    daysObj = {
        'Sunday': 0,
        'Monday': 1,
        'Tuesday': 2,
        'Wednesday': 3,
        'Thursday': 4,
        'Friday': 5,
        'Saturday': 6
    }
    slider1: any;
    tutorFilter = {
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
    }

    currentTab: number = 1;
    tutorList = [];
    tutorOnDays: any = [
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
    constructor(private toastr: ToastrService,private fb: FormBuilder, private tutorsService: TutorsService, private mainSearchService: MainSearchService, private coursesService: CoursesService) { }

    tutorSearchForm: FormGroup;
    tutorSearchFormFormSubmitted: boolean = false;
    oneToOneMinPrice: number;
    oneToOneMaxPrice: number;
    groupMinPrice: number;
    groupMaxPrice: number;
    subjectsImages = subjectImages;

    get tutorSearchFormControls() { return this.tutorSearchForm.controls };


    ngOnInit(): void {


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
        } else {
            delete this.tutorFilter.subjectId;
        }
        if (localStorage.getItem('studyLevelId')) {
            this.tutorFilter.studyLevelId = localStorage.getItem('studyLevelId');
        } else {
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

    }

    searchTutor() {
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

        this.tutorsService.getTutorSearch(this.tutorFilter).subscribe(res => {
            //this.tutorOnDays = res.tutorOnDays;
            //this.tutorList = res.tutorList;
            $('.loading').hide();
            this.currentLimit = this.dataLimit;

            //this.isShowMoreVisible = res.tutorList.length > this.currentLimit ? true : false;
            //this.tutorList = res.tutorList.slice(0, this.currentLimit);
            if (this.tutorFilter.searchType == 'Tutor') {
                this.tutorList = res.tutorList;
                this.apiTutorList = res.tutorList;
            } else {
                this.apiCourseList = res.courseList;
                this.courseList = res.courseList;
            }
            this.buildAutoComplete();
            this.buildTutorDays();
            if (localStorage.getItem("CompanyName")) {
                this.selectedCompanySearchForm(null, localStorage.getItem("CompanyName"));
                $("#companyId1").val(localStorage.getItem("CompanyName"));
                localStorage.removeItem("CompanyName");
            }
            
        }, err => {
            $('.loading').hide();
        })
    }

    buildAutoComplete() {
        this.tutorArray = [];
        this.companyArray = [];
        let tempCompanyArray = [];
        let dupId = [];
        let obj;
        if (this.tutorFilter.searchType == 'Tutor') {
            obj = this.apiTutorList;
        } else {
            obj = this.apiCourseList;
        }
        obj.map(a => {
            debugger;
            let tutorName = this.tutorFilter.searchType == 'Tutor' ? a.userFullName : a.tutorName;
            if (tutorName && !dupId.includes(a.tutorId)) {
                let b = {
                    'tutorId': a.tutorId,
                    'userFullName': tutorName
                };
                dupId.push(a.tutorId);
                this.tutorArray.push(b);
            }
            if (a.currentCompany) {
                if (!tempCompanyArray.includes(a.currentCompany.companyId)) {
                    this.companyArray.push({
                        companyName: a.currentCompany.companyName,
                        companyId: a.currentCompany.companyId
                    })
                    tempCompanyArray.push(a.currentCompany.companyId);
                }
            }
        });
    }

    async getCourseCountDay(r) {
        return new Promise(async (resolve, reject) => {
            let cc = [0, 0, 0, 0, 0, 0, 0]
            if (r.classSessions && r.classSessions.count == 0) {
                resolve(cc);
            }
            let day;
            r.classSessions.map(k => {
                day = new Date(k.startDate).getDay();
                cc[day] = cc[day] + 1;
            });
            resolve(cc);
        });
    }

    async buildTutorDays() {
        debugger;
        if (this.tutorFilter.searchType != 'Course') {
            console.time("LL");
            let resp = await Promise.all(this.apiTutorList.map(async r => {
                r.slotData = await this.getAvailabilities(r);
                r.bookedSlot = await this.getBookedSlot(r);
                return r;
            })).then(resp => {
                debugger;
                this.apiTutorList = resp;
                this.generateSideBarDays(resp);
            });
            console.timeEnd("LL");
        } else {
            let resp = await Promise.all(this.apiCourseList.map(async r => {
                r.courseData = await this.getCourseCountDay(r);
                return r;
            })).then(resp => {
                this.apiCourseList = resp;
                this.generateSideBarDays(resp);
            });
        }


    }

    generateSideBarDays(resp,recreateSlider='Yes') {
        /*if (this.tutorFilter.SearchDay.length > 0) {
          return;
        }*/
        this.oneToOneMinPrice = Number.MAX_VALUE;
        this.oneToOneMaxPrice = Number.MIN_VALUE;
        this.groupMinPrice = Number.MAX_VALUE;
        this.groupMaxPrice = Number.MIN_VALUE;
        this.minCoursePrice = Number.MAX_VALUE;
        this.maxCoursePrice = Number.MIN_VALUE;
        let temp = [
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
            resp.map(rr => {
                debugger;
                if (rr.tutorPriceLesson) {
                    this.oneToOneMinPrice = rr.tutorPriceLesson.oneToOneMinPrice < this.oneToOneMinPrice ? rr.tutorPriceLesson.oneToOneMinPrice : this.oneToOneMinPrice;
                    this.oneToOneMaxPrice = rr.tutorPriceLesson.oneToOneMaxPrice > this.oneToOneMaxPrice ? rr.tutorPriceLesson.oneToOneMaxPrice : this.oneToOneMaxPrice;
                    this.groupMinPrice = rr.tutorPriceLesson.groupMinPrice < this.groupMinPrice ? rr.tutorPriceLesson.groupMinPrice : this.groupMinPrice;
                    this.groupMaxPrice = rr.tutorPriceLesson.groupMaxPrice > this.groupMaxPrice ? rr.tutorPriceLesson.groupMaxPrice : this.groupMaxPrice;
                }
                temp[0].tutorCount = temp[0].tutorCount + ((rr.slotData[0] - rr.bookedSlot[0]) >= this.tutorFilter.availabilityRequired ? 1 : 0);
                temp[1].tutorCount = temp[1].tutorCount + ((rr.slotData[1] - rr.bookedSlot[1]) >= this.tutorFilter.availabilityRequired ? 1 : 0);
                temp[2].tutorCount = temp[2].tutorCount + ((rr.slotData[2] - rr.bookedSlot[2]) >= this.tutorFilter.availabilityRequired ? 1 : 0);
                temp[3].tutorCount = temp[3].tutorCount + ((rr.slotData[3] - rr.bookedSlot[3]) >= this.tutorFilter.availabilityRequired ? 1 : 0);
                temp[4].tutorCount = temp[4].tutorCount + ((rr.slotData[4] - rr.bookedSlot[4]) >= this.tutorFilter.availabilityRequired ? 1 : 0);
                temp[5].tutorCount = temp[5].tutorCount + ((rr.slotData[5] - rr.bookedSlot[5]) >= this.tutorFilter.availabilityRequired ? 1 : 0);
                temp[6].tutorCount = temp[6].tutorCount + ((rr.slotData[6] - rr.bookedSlot[6]) >= this.tutorFilter.availabilityRequired ? 1 : 0);
            })
            debugger;
            if (resp.length > 0 && recreateSlider=='Yes') {
                this.intializePriceSlider('Tutor');
            }

        } else {
            debugger;
            resp.map(rr => {
                this.minCoursePrice = rr.classSessionsTotalAmount < this.minCoursePrice ? rr.classSessionsTotalAmount : this.minCoursePrice;
                this.maxCoursePrice = rr.classSessionsTotalAmount > this.maxCoursePrice ? rr.classSessionsTotalAmount : this.maxCoursePrice;
                temp[0].tutorCount = temp[0].tutorCount + (rr.courseData[0] > 0 ? 1 : 0);
                temp[1].tutorCount = temp[1].tutorCount + (rr.courseData[1] > 0 ? 1 : 0);
                temp[2].tutorCount = temp[2].tutorCount + (rr.courseData[2] > 0 ? 1 : 0);
                temp[3].tutorCount = temp[3].tutorCount + (rr.courseData[3] > 0 ? 1 : 0);
                temp[4].tutorCount = temp[4].tutorCount + (rr.courseData[4] > 0 ? 1 : 0);
                temp[5].tutorCount = temp[5].tutorCount + (rr.courseData[5] > 0 ? 1 : 0);
                temp[6].tutorCount = temp[6].tutorCount + (rr.courseData[6] > 0 ? 1 : 0);
            })
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


    }



    async getAvailabilities(r) {
        return new Promise(async (resolve, reject) => {
            let av = [0, 0, 0, 0, 0, 0, 0]
            if (r.tutorAvailabilities.length == 0) {
                resolve(av);
            }

            let currDate = new Date();
            let currUtc = currDate.getTime();
            let cd = 24 * 60 * 60 * 1000;
            let repeatedDates = [];
            r.tutorAvailabilities.map(k => {
                if (!repeatedDates.includes(k.startTime)) {
                    //if (r.userFullName == 'Abc Tutor') {
                    //    debugger;
                    //}

                    repeatedDates.push(k.startTime);
                    let d = new Date(k.startTime);
                    let dayOfWeek = d.getDay();
                    let addDays = k.noOfWeek * 7;
                    d.setTime(d.getTime() + addDays * 24 * 60 * 60 * 1000);
                    if (d.getTime() > currUtc) {
                        if (k.noOfWeek == 0) {
                            av[dayOfWeek] = av[dayOfWeek] + 1;
                        } else {
                            let diff = currUtc - (new Date(k.startTime).getTime());
                            if (diff > 0) {
                                diff = Math.ceil((diff / (cd)) / 7);
                                av[dayOfWeek] = av[dayOfWeek] + k.noOfWeek - diff;
                            } else {
                                av[dayOfWeek] = av[dayOfWeek] + k.noOfWeek;
                            }
                        }
                    }
                }


            })
            resolve(av);
        });
    }

    async getBookedSlot(r) {
        return new Promise(async (resolve, reject) => {
            let bs = [0, 0, 0, 0, 0, 0, 0];
            if (!r.tutorCourseList) {
                resolve(bs);
            } else {
                let currUTC = new Date().getTime();
                let stdate;
                let repeatedDates = [];
                r.tutorCourseList.map(cs => {
                    if (cs.classSessions) {
                        cs.classSessions.map(cds => {
                            if (!repeatedDates.includes(cds.startDate)) {
                                repeatedDates.push(cds.startDate);
                                stdate = new Date(cds.startDate);
                                if (stdate.getTime() >= currUTC) {
                                    //if (r.userFullName == 'Looks Roy' && stdate.getDay() == 5) {
                                    //    console.log(cds.startDate);
                                    //}
                                    bs[stdate.getDay()] = bs[stdate.getDay()] + 1;
                                }
                            }

                        })
                    }
                })
                resolve(bs);
            }


        });
    }


    async checkTimeSlot(r) {
        return new Promise(async (resolve, reject) => {
            if (!this.tutorFilter.time) {
                resolve(true);
                return;
            }

            if (!r.tutorAvailabilities && r.tutorAvailabilities.length == 0) {
                resolve(false);
                return;
            }
            const pad = n => n < 10 ? '0' + n : n;
            let date = new Date();
            let sp = this.tutorFilter.time.split(":");
            let fh: any = parseInt(sp[0]);
            let fm: any = parseInt(sp[1]);
            date.setHours(fh, fm, 0, 0);
            let beforeTime = new Date(date);
            let afterTime = new Date(date);
            beforeTime.setHours(beforeTime.getHours() - 1);
            afterTime.setHours(afterTime.getHours() + 1);
            let fromTime = pad(beforeTime.getHours()) + ':' + pad(beforeTime.getMinutes()) + ':00';
            let toTime = pad(afterTime.getHours()) + ':' + pad(afterTime.getMinutes()) + ':00';
            let x1, x2, y1, y2, stDate, stTime, endTime;
            let flag = r.tutorAvailabilities.some(kk => {
                stDate = kk.startTime.split("T")[0];
                stTime = kk.startTime.split("T")[1];
                endTime = kk.endTime.split("T")[1];
                x1 = new Date(stDate + 'T' + fromTime).getTime();
                x2 = new Date(stDate + 'T' + toTime).getTime();
                y1 = new Date(stDate + 'T' + stTime).getTime();
                y2 = new Date(stDate + 'T' + endTime).getTime();
                if (x1 < y2 && x2 > y1) {
                    return true;
                } else {
                    return false;
                }
            })
            resolve(flag);
        });
    }

    getSubjects(): void {
        this.mainSearchService.getAllTutorSubject()
            .subscribe(success => {
                this.subjects = success;
            }, error => {
                console.log(error);
            });
    };

    getStudyLevels(id): void {
        debugger;
        this.mainSearchService.getAllSubjectLevelBySubjectId(id)
            .subscribe(success => {
                this.studyLevels = success;
            }, error => {
                console.log(error);
            });
    };
    onSubjectChange($event) {
        if ($event) {
            let id = $event.target.options[$event.target.options.selectedIndex].value;
            debugger;
            if (id != '0') {
                this.getStudyLevels(id);
                this.tutorSearchForm.controls["subjectId"].setValue(id);
                this.tutorFilter.subjectId = id;
                //this.selectedSubjectId = this.tutorSearchForm.value.subjectId;
            } else {
                delete this.tutorFilter.subjectId;
                delete this.tutorFilter.studyLevelId;
            }
        }
    }
    onLevelChange($event) {
        if ($event) {
            let id = $event.target.options[$event.target.options.selectedIndex].value;
            debugger;
            if (id != '0') {
                //this.getStudyLevels(id);
                this.tutorSearchForm.controls["levelId"].setValue(id);
                this.tutorFilter.studyLevelId = id;
            } else {
                debugger;
                delete this.tutorFilter.studyLevelId;
            }
        }
    }

    ngAfterViewInit() {
        const that = this;
        this.intializePriceSlider();
        if (this.tutorFilter.searchType != 'Course') {
            this.initializeAvailabilitySlider();
        } else {
            this.intializeCourseDurationSlider();
            this.intializeMaxClassSizeSlider();
        }
    }



    initializeAvailabilitySlider() {
        let that = this;
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
    }

    intializePriceSlider(type = 'NA') {
        debugger;
        let min = 1;
        let max = 100;
        let values = [1, 100];
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
                return
            }
            $("#slider-range1").slider('destroy');
        }
        if (type == 'Course') {
            min = this.minCoursePrice;
            max = this.maxCoursePrice;
            values = [min, max];
            if (min == max) {
                return
            }
            $("#slider-range1").slider('destroy');
        }
        let that = this;
        if (that.tutorFilter.searchType == 'Course') {
            $('.slider-time02').html(max);
            $('.slider-time01').html(min);
        } else {
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
                } else {
                    $('.slider-time02').html(max + '/hr');
                    $('.slider-time01').html(min + '/hr');
                }
                that.tutorFilter.searchPricePerPerson.MinPrice = min;
                that.tutorFilter.searchPricePerPerson.MaxPrice = max;
                that.localFilter();
            }
        });
    }

    intializeMaxClassSizeSlider() {
        let that = this;
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
    }

    intializeCourseDurationSlider() {
        let that = this;
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
    }

    InitilizedRangeSlider(min, max) {
        let that = this;
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
    }

    showTab(currentTab) {
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
    }

    getFilterTime() {
        this.tutorFilter.time = this.filterTime.nativeElement.value;
        debugger;
        this.localFilter();
    }


    getSelectedDays($event) {
        let day = parseInt($event.target.value);
        if ($event.target.checked) {
            this.tutorFilter.SearchDay.push(day);
        } else {
            this.tutorFilter.SearchDay = this.tutorFilter.SearchDay.filter(a => a != day);
        }
        this.localFilter();
    }

    setAgeRange($event) {
        if ($event.target.checked) {
            this.tutorSearchForm.controls["isUnder18"].setValue(true);
            this.tutorFilter.isUnder18 = true;
        } else {
            this.tutorSearchForm.controls["isUnder18"].setValue(false);
            this.tutorFilter.isUnder18 = false;
        }
        //this.localFilter();
    }

    getTutorRecords() {
        this.tutorSearchFormFormSubmitted = true;
        if (this.tutorSearchForm.valid) {
            let obj = { ...this.tutorSearchForm.getRawValue() };

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
            }

            localStorage.setItem('isUnder18', obj.isUnder18);

            if (obj.levelId) {
                localStorage.setItem('studyLevelId', obj.levelId);
            } else {
                delete this.tutorFilter.studyLevelId;
            }
            if (obj.subjectId) {
                localStorage.setItem('subjectId', obj.subjectId);
            } else {
                delete this.tutorFilter.subjectId;
            }

            localStorage.setItem('searchType', obj.searchType);
            localStorage.setItem('sortType', obj.sortType);



            this.searchTutor();
        }
    }

    selectedTutorSearchForm($event) {
        let tutorName = $event.userFullName;
        if (this.filterTutorName != tutorName) {
            this.filterTutorName = tutorName;
            this.localFilter();
        }
    }
    selectedCompanySearchForm($event, searchVal = '') {

        let companyName = searchVal ? searchVal:$event.companyName;
        if (this.filterTutorCompany != companyName) {
            this.filterTutorCompany = companyName;
            this.localFilter();
        }
    }


    async localFilter(generate_price_slider = 'No') {
        debugger;
        this.currentLimit = this.dataLimit;
        if (this.tutorFilter.searchType != 'Course') {
            this.filterTutor(generate_price_slider);
        } else {
            this.filterCourse(generate_price_slider);
        }
    }

    async filterTutor(generate_price_slider = 'No') {
        this.tutorArray = [];
        this.companyArray = [];
        let tempCompanyArray = [];
        let dupId = []

        //console.time("Time this");
        const asyncFilter = async (arr, predicate) => {
            const results = await Promise.all(arr.map(predicate));

            return arr.filter((_v, index) => results[index]);
        }

        let tempTutorList;
        //this.currentLimit = 10;
        tempTutorList = await asyncFilter(this.apiTutorList, async (r) => {
            let checkTutorName = await this.checkTutorNameFilter(r);
            let checkTutorCompany = await this.checkCompanyNameFilter(r);
            let checkPrices = await this.checkMinMaxPrice(r);

            let checkAvailbility = await this.availabilityRequired(r);
            //let checkUnder18 = await this.isUnderCheck(r);
            if (r.userFullName == 'Starter Tutor') {
                debugger;
            }
            if (checkTutorName && checkTutorCompany &&
                checkPrices && checkAvailbility) {
                let timeCheck = await this.checkTimeSlot(r);

                if (timeCheck) {
                    if (r.userFullName && !dupId.includes(r.tutorId)) {
                        dupId.push(r.tutorId);
                        this.tutorArray.push({ 'tutorId': r.tutorId, 'userFullName': r.userFullName })
                    }
                    if (r.currentCompany) {
                        if (!tempCompanyArray.includes(r.currentCompany.companyId)) {
                            this.companyArray.push({
                                companyName: r.currentCompany.companyName,
                                companyId: r.currentCompany.companyId
                            })
                            tempCompanyArray.push(r.currentCompany.companyId);
                        }
                    }
                }
                return timeCheck
            } else {
                return false;
            }
        });
        this.isShowMoreVisible = tempTutorList.length > 10 ? true : false;
        this.tutorList = tempTutorList;

        this.generateSideBarDays(this.tutorList, generate_price_slider);
        //console.timeEnd("Time this");

    }


    async filterCourse(generate_price_slider = 'No') {
        //console.time("Time this Course");
        this.coursesService.imagesSequence = {};
        this.tutorArray = [];
        this.companyArray = [];
        let tempCompanyArray = [];
        let dupId = [];

        const asyncFilter = async (arr, predicate) => {
            const results = await Promise.all(arr.map(predicate));
            return arr.filter((_v, index) => {
                if (index == true) {
                }
                return results[index]
            });
        }

        this.courseList = await asyncFilter(this.apiCourseList, async (r) => {
            let checkTutorName = await this.checkTutorNameFilter(r);
            let checkTutorCompany = await this.checkCompanyNameFilter(r);
            let checkPrices = await this.checkMinMaxPriceCourse(r);
            let checkDay = await this.checkDayCourse(r);

            let checkCourseDuration = await this.filterCourseDuration(r);
            let checkDayMaxClassSize = await this.filterMaxClassSize(r);

            if (checkTutorName && checkTutorCompany && checkPrices && checkDay && checkCourseDuration && checkDayMaxClassSize) {
                let checkTime = this.checkCourseTime(r);

                if (checkTime) {
                    if (r.tutorName && !dupId.includes(r.tutorId)) {
                        dupId.push(r.tutorId);
                        this.tutorArray.push({ 'tutorId': r.tutorId, 'userFullName': r.tutorName })
                    }
                    if (r.currentCompany) {
                        if (!tempCompanyArray.includes(r.currentCompany.companyId)) {
                            this.companyArray.push({
                                companyName: r.currentCompany.companyName,
                                companyId: r.currentCompany.companyId
                            })
                            tempCompanyArray.push(r.currentCompany.companyId);
                        }
                    }
                }

                return checkTime;
            } else {
                return false;
            }
        });

        this.generateSideBarDays(this.courseList, generate_price_slider);


        console.timeEnd("Time this Course");
    }

    async checkTutorNameFilter(r) {
        return new Promise(async (resolve, reject) => {
            let tutorName = this.tutorFilter.searchType != 'Course' ? r.userFullName : r.tutorName;
            if (this.filterTutorName == "" || tutorName == this.filterTutorName) {
                resolve(true)
            }
            resolve(false)
        });
    }

    async checkCompanyNameFilter(r) {
        return new Promise(async (resolve, reject) => {
            if (this.filterTutorCompany == "" || (r.currentCompany && r.currentCompany.companyName == this.filterTutorCompany)) {
                resolve(true)
            }
            resolve(false)
        });

    }

    async checkMinMaxPrice(r) {
        return new Promise(async (resolve, reject) => {
            if (this.tutorFilter.searchPricePerPerson.MinPrice == -1) {
                resolve(true)
            } else if (this.tutorFilter.searchPricePerPerson.IsOneToOne) {
                if (r.tutorPriceLesson.oneToOneMinPrice >= this.tutorFilter.searchPricePerPerson.MinPrice
                    && this.tutorFilter.searchPricePerPerson.MaxPrice >= r.tutorPriceLesson.oneToOneMaxPrice) {
                    resolve(true)
                } else {
                    resolve(false);
                }
            } else {
                if (r.tutorPriceLesson.groupMinPrice >= this.tutorFilter.searchPricePerPerson.MinPrice
                    && this.tutorFilter.searchPricePerPerson.MaxPrice >= r.tutorPriceLesson.groupMaxPrice) {
                    resolve(true)
                } else {
                    resolve(false);
                }
            }
        });
    }


    async availabilityRequired(t) {
        return new Promise(async (resolve, reject) => {
            if (t.slotData.length == 0 && this.tutorFilter.availabilityRequired==1) {
                resolve(true);
            }

            if (this.tutorFilter.SearchDay.length > 0) {
                let flag = this.tutorFilter.SearchDay.some(tt => {

                    //|| (t.slotData[tt] == 0)
                    if (t.userFullName == 'Starter Tutor') {
                        debugger;
                    }
                    if (((t.slotData[tt] - t.bookedSlot[tt]) < this.tutorFilter.availabilityRequired) ) {

                        return true;
                    }
                });
                resolve(!flag);//Add this tutor
            } else {
                let flag = t.slotData.some((tt, index) => {
                    //if (t.userFullName == "Looks Roy") {
                    //    debugger;
                    //}
                    if (((tt - t.bookedSlot[index]) >= this.tutorFilter.availabilityRequired) || this.tutorFilter.availabilityRequired==1) {
                        return true;
                    }
                })
                resolve(flag);//Add this tutor
            }
        });

    }

    async isUnderCheck(r) {
        return new Promise(async (resolve, reject) => {
            if (!this.tutorFilter.isUnder18) {
                resolve(true);
            }

            if (r.tutorCourseList && r.tutorCourseList.length > 0) {
                let flag = r.tutorCourseList.some(kk => {
                    if (kk.isUnder18 == true) {
                        return true;
                    }
                })
                resolve(flag);
            } else {
                resolve(false);
            }
        });
    }


    showMoreData() {
        debugger;
        this.currentLimit = this.currentLimit + this.dataLimit;
        //this.tutorList = this.apiTutorList.slice(0, this.currentLimit);
    }

    clearSearchFilter(searchFilterType, isOneToOne = true) {
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
                }

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
                }

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
                }
                this.localFilter();
                break;

        }
    }

    async checkMinMaxPriceCourse(r) {
        return new Promise(async (resolve, reject) => {
            if (this.tutorFilter.searchPricePerPerson.MinPrice != -1) {
                if (this.tutorFilter.searchPricePerPerson.MinPrice <= r.classSessionsTotalAmount
                    && this.tutorFilter.searchPricePerPerson.MaxPrice >= r.classSessionsTotalAmount) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } else {
                resolve(true);
            }
        });
    }

    async checkDayCourse(r) {
        return new Promise(async (resolve, reject) => {
            if (this.tutorFilter.SearchDay.length == 0) {
                resolve(true)
            } else {
                let flag = this.tutorFilter.SearchDay.some(d => {
                    if (r.courseData[d] == 0) {
                        return true;
                    }
                })

                resolve(!flag);
            }
        });
    }

    async checkCourseTime(r) {
        return new Promise(async (resolve, reject) => {
            if (!this.tutorFilter.time) {
                resolve(true);
            } else {

                const pad = n => n < 10 ? '0' + n : n;
                let date = new Date();
                let sp = this.tutorFilter.time.split(":");
                let fh: any = parseInt(sp[0]);
                let fm: any = parseInt(sp[1]);
                date.setHours(fh, fm, 0, 0);
                let beforeTime = new Date(date);
                let afterTime = new Date(date);
                beforeTime.setHours(beforeTime.getHours() - 1);
                afterTime.setHours(afterTime.getHours() + 1);
                let fromTime = pad(beforeTime.getHours()) + ':' + pad(beforeTime.getMinutes()) + ':00';
                let toTime = pad(afterTime.getHours()) + ':' + pad(afterTime.getMinutes()) + ':00';
                let x1, x2, y1, y2, stDate, stTime, endTime;

                let flag = r.classSessions.some(kk => {
                    stDate = kk.startDate.split("T")[0];
                    stTime = kk.startDate.split("T")[1];
                    endTime = kk.endDate.split("T")[1];
                    x1 = new Date(stDate + 'T' + fromTime).getTime();
                    x2 = new Date(stDate + 'T' + toTime).getTime();
                    y1 = new Date(stDate + 'T' + stTime).getTime();
                    y2 = new Date(stDate + 'T' + endTime).getTime();
                    if (x1 < y2 && x2 > y1) {
                        return true;
                    } else {
                        return false;
                    }
                })

                resolve(flag);
            }
        });
    }

    async filterMaxClassSize(r) {
        return new Promise(async (resolve, reject) => {
            if (this.tutorFilter.SearchClassSize.MinClassSize == -1) {
                resolve(true);
            } else {
                let avClass = (r.maxClassSize - r.courseAttendeesCount);
                if (avClass >= this.tutorFilter.SearchClassSize.MinClassSize
                    && this.tutorFilter.SearchClassSize.MaxClassSize >= avClass
                ) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }

        });

    }

    async filterCourseDuration(r) {
        return new Promise(async (resolve, reject) => {
            if (this.tutorFilter.SearchCourseDuration.MinCourseDuration == -1 || this.tutorFilter.SearchCourseDuration.MinCourseDuration ==1) {
                resolve(true);
            } else {
                const date1 = new Date(r.startDate).getTime();
                const date2 = new Date(r.endDate).getTime();
                const diffTime = Math.abs(date2 - date1);
                let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                diffDays = diffDays / 7;
                if (diffDays >= this.tutorFilter.SearchCourseDuration.MinCourseDuration
                    && this.tutorFilter.SearchCourseDuration.MaxCourseDuration >= diffDays
                ) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        });
    }

    setSerachType($event) {
        this.tutorFilter.searchType = $event.target.value;
        this.tutorList = [];
        this.courseList = [];
        if (this.tutorFilter.searchType != 'Course') {
            localStorage.setItem("searchType","Tutor")
            setTimeout(() => {
                this.initializeAvailabilitySlider();
                this.resetFilterOnSearchTypeChange();
            }, 100);

        } else {
            localStorage.setItem("searchType", "Course")
            setTimeout(() => {
                this.intializeCourseDurationSlider();
                this.intializeMaxClassSizeSlider();
                this.resetFilterOnSearchTypeChange();
            }, 100);
        }
    }

    setSerachTypeCreateNow() {
        this.courseCreateNow.nativeElement.click();
    }

    resetFilterOnSearchTypeChange() {
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
        }
        this.searchTutor();
    }

    getUserType() {
        //get user type
        this.coursesService.getUserType()
            .subscribe(success => {
                this.userType = success;
                $('.loading').hide();
            }, error => {
            });
    }

    redirectMe(typ, id) {
        if (typ == 'myCourse') {
            localStorage.removeItem('expCourses')
            localStorage.setItem('tutorId', id)
            window.location.href = "my-course";
        }
        if (typ == 'tutorCourses') {
            localStorage.setItem('expCourses', 'True')
            window.location.href = "tutor/" + id;
        }
        if (typ == 'courseDetails') {
            localStorage.setItem('coid', id)
            localStorage.removeItem('expCourses')
            window.location.href = "course-details";
        }
        if (typ == 'viewTutor') {
            localStorage.removeItem('expCourses')
            window.location.href = "tutor/" + id;
        }
    }

    handleDesableBookTutor() {
        if (!['CompanyTutor', 'Tutor', 'Company'].includes(this.userType)) {
            //alert("Parent/Student")
            this.toastr.warning("If you can't find an appropriate time slot, send your chosen tutor a message from their profile area specifying your requirements.");
        } else {
            this.toastr.warning("Action not allowed.");
            //alert("CompanyTutor, Tutor, Company");
        }
    }

    trackByFn(index, item) {
        return item.courseId; // or item.id
    }

    setProfileTabActive(tabName) {
        if (this.profileTabActive == tabName) {
            this.profileTabActive = '';
        } else {
            this.profileTabActive = tabName;
        }
        
    }


}

