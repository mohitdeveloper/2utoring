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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainSearchComponent = void 0;
var core_1 = require("@angular/core");
var services_1 = require("../../services");
var forms_1 = require("@angular/forms");
var MainSearchComponent = /** @class */ (function () {
    function MainSearchComponent(mainSearchService, fb) {
        this.mainSearchService = mainSearchService;
        this.fb = fb;
        this.setSearchType = 'Tutor';
        this.mainSearchFormFormSubmitted = false;
        this.isAuthenticated = isAuthenticated;
        this.tutorFilter = {
            "searchType": "Tutor",
            "subjectId": "",
            "studyLevelId": "",
            "isUnder18": false
        };
        debugger;
    }
    Object.defineProperty(MainSearchComponent.prototype, "mainSearchFormControls", {
        get: function () { return this.mainSearchForm.controls; },
        enumerable: false,
        configurable: true
    });
    ;
    MainSearchComponent.prototype.ngOnInit = function () {
        if (localStorage.getItem('searchType')) {
            this.setSearchType = localStorage.getItem('searchType');
            this.tutorFilter.searchType = localStorage.getItem('searchType');
        }
        this.getSubjects();
        //this.getStudyLevels();
        this.mainSearchForm = this.fb.group({
            isUnder18: [''],
            searchType: [this.setSearchType],
            subjectId: [''],
            levelId: [''],
            sortType: ['Cheapest']
        });
    };
    MainSearchComponent.prototype.getSubjects = function () {
        var _this = this;
        this.mainSearchService.getAllTutorSubject()
            .subscribe(function (success) {
            _this.subjects = success;
        }, function (error) {
            console.log(error);
        });
    };
    ;
    MainSearchComponent.prototype.getStudyLevels = function (id) {
        var _this = this;
        this.mainSearchService.getAllSubjectLevelBySubjectId(id)
            .subscribe(function (success) {
            _this.studyLevels = success;
        }, function (error) {
            console.log(error);
        });
    };
    ;
    MainSearchComponent.prototype.setAgeRange = function ($event) {
        if ($event.target.checked) {
            this.mainSearchForm.controls["isUnder18"].setValue(true);
        }
        else {
            this.mainSearchForm.controls["isUnder18"].setValue(false);
        }
    };
    MainSearchComponent.prototype.getRecords = function () {
        //we have to set localstorage and redirect to tutor search or course search page as per the selection
        this.mainSearchFormFormSubmitted = true;
        if (this.mainSearchForm.valid) {
            var obj = __assign({}, this.mainSearchForm.getRawValue());
            if (this.tutorFilter.searchType == 'Course') {
                localStorage.setItem('isUnder18', obj.isUnder18);
            }
            else {
                delete obj.isUnder18;
            }
            if (obj.levelId) {
                localStorage.setItem('studyLevelId', obj.levelId);
            }
            if (obj.subjectId) {
                localStorage.setItem('subjectId', obj.subjectId);
            }
            localStorage.setItem('searchType', obj.searchType);
            localStorage.setItem('sortType', obj.sortType);
            window.location.href = '/tutor-course-search';
        }
    };
    MainSearchComponent.prototype.onSubjectChange = function ($event) {
        if ($event) {
            var id = $event.target.options[$event.target.options.selectedIndex].value;
            if (id) {
                this.getStudyLevels(id);
                this.mainSearchForm.controls["subjectId"].setValue(id);
            }
        }
    };
    MainSearchComponent.prototype.onLevelChange = function ($event) {
        if ($event) {
            var id = $event.target.options[$event.target.options.selectedIndex].value;
            if (id) {
                //this.getStudyLevels(id);
                this.mainSearchForm.controls["levelId"].setValue(id);
            }
        }
    };
    MainSearchComponent.prototype.setSerachTypes = function ($event) {
        this.tutorFilter.searchType = $event.target.value;
        localStorage.setItem('searchType', this.tutorFilter.searchType);
    };
    MainSearchComponent = __decorate([
        core_1.Component({
            selector: 'app-main-search',
            templateUrl: './main-search.component.html',
            //styleUrls: ['../../../../wwwroot/lib/assets/css/global.css'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [services_1.MainSearchService,
            forms_1.FormBuilder])
    ], MainSearchComponent);
    return MainSearchComponent;
}());
exports.MainSearchComponent = MainSearchComponent;
//# sourceMappingURL=main-search.component.js.map