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
exports.SearchComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var index_1 = require("../../services/index");
var $ = require("jquery");
var SearchComponent = /** @class */ (function () {
    function SearchComponent(subjectsService, subjectCategoriesService, studyLevelsService, classSessionsService, location) {
        this.subjectsService = subjectsService;
        this.subjectCategoriesService = subjectCategoriesService;
        this.studyLevelsService = studyLevelsService;
        this.classSessionsService = classSessionsService;
        this.location = location;
        this.toLoadFilters = 2;
        this.loadedFilters = 0;
        this.title = title;
        this.canUserBuy = canUserBuy;
        this.isLoggedIn = isLoggedIn;
        this.isGuardian = isGuardian;
        this.subjectCategoryId = null;
        this.searchModel = {
            take: 8,
            page: page,
            totalPages: 1,
            subject: subject == '' ? null : subject,
            subjectCategory: subjectCategory == '' ? null : subjectCategory,
            studyLevelUrl: studyLevelUrl == '' ? null : studyLevelUrl,
            isUnder16: isUnder16,
            search: search
        };
        this.subjects = [];
        this.filteredSubjects = [];
        this.subjectCategories = [];
        this.filteredSubjectCategories = [];
        this.studyLevels = [];
        this.results = { paged: null, data: null };
        this.searchModelSubmitted = false;
        this.lastIsUnder16 = this.searchModel.isUnder16;
    }
    SearchComponent.prototype.resetUrl = function () {
        var queryString = '';
        var url = '';
        if (this.searchModel.subject != null) {
            url += "/subject/" + encodeURIComponent(this.searchModel.subject);
        }
        if (this.searchModel.subjectCategory != null) {
            url += "/learn/" + encodeURIComponent(this.searchModel.subjectCategory);
        }
        if (this.searchModel.studyLevelUrl != null) {
            url += "/level/" + encodeURIComponent(this.searchModel.studyLevelUrl);
        }
        if (this.searchModel.isUnder16 != null && this.searchModel.isUnder16 == false) {
            queryString += (queryString == '' ? '?' : '&') + 'under=' + this.searchModel.isUnder16;
        }
        if (this.searchModel.search != null && this.searchModel.search != '') {
            queryString += (queryString == '' ? '?' : '&') + 'search=' + encodeURIComponent(this.searchModel.search);
        }
        if (this.searchModel.page > 1) {
            queryString += (queryString == '' ? '?' : '&') + 'page=' + this.searchModel.page;
        }
        this.location.go("find-a-lesson" + url, queryString);
    };
    ;
    SearchComponent.prototype.reloadData = function () {
        this.searchModel.page = 1;
        this.resetUrl();
        this.getLessons();
    };
    ;
    SearchComponent.prototype.next = function () {
        this.searchModel.page++;
        this.resetUrl();
        this.getLessons();
    };
    ;
    SearchComponent.prototype.previous = function () {
        this.searchModel.page--;
        this.resetUrl();
        this.getLessons();
    };
    ;
    SearchComponent.prototype.getLessons = function () {
        var _this = this;
        $('.loading').show();
        this.classSessionsService.getPagedCards(this.searchModel)
            .subscribe(function (success) {
            _this.lastIsUnder16 = _this.searchModel.isUnder16;
            _this.results = success;
            _this.searchModelSubmitted = true;
            // These could not match is someone was to go away for a period, come back and refresh/use link, and that page no longer exist
            if (_this.results.paged.page != _this.searchModel.page) {
                _this.searchModel.page = _this.results.paged.page;
                _this.resetUrl();
            }
            $('.loading').hide();
        }, function (error) {
            console.log(error);
        });
    };
    ;
    // To ensure proper filtering
    SearchComponent.prototype.incrementLoadFilters = function () {
        this.loadedFilters++;
        if (this.toLoadFilters <= this.loadedFilters) {
            if (this.searchModel.subject != null) {
                // SUBJECT SELECTED ONLY
                this.filteredSubjects = this.subjects;
                this.changeSubject();
                if (this.searchModel.subjectCategory != null) {
                    // BOTH SELECTED
                    for (var i = 0; i < this.filteredSubjectCategories.length; i++) {
                        if (this.searchModel.subjectCategory == this.filteredSubjectCategories[i].url) {
                            this.subjectCategoryId = this.filteredSubjectCategories[i].id;
                            this.changeSubjectCategory();
                            break;
                        }
                    }
                }
            }
            else {
                if (this.searchModel.subjectCategory != null) {
                    // CATEGORY SELECTED ONLY
                    // If gets here someone played with the url so will make best guess
                    this.filteredSubjects = this.subjects;
                    this.filteredSubjectCategories = this.subjectCategories;
                    for (var i = 0; i < this.subjectCategories.length; i++) {
                        if (this.searchModel.subjectCategory == this.subjectCategories[i].url) {
                            this.subjectCategoryId = this.subjectCategories[i].id;
                            this.changeSubjectCategory();
                            break;
                        }
                    }
                }
                else {
                    // NEITHER SELECTED
                    this.filteredSubjects = this.subjects;
                    this.filteredSubjectCategories = this.subjectCategories;
                }
            }
        }
    };
    ;
    SearchComponent.prototype.getSubjects = function () {
        var _this = this;
        this.subjectsService.getOptions()
            .subscribe(function (success) {
            _this.subjects = success;
            _this.incrementLoadFilters();
        }, function (error) {
            console.log(error);
        });
    };
    ;
    SearchComponent.prototype.getSubjectCategories = function () {
        var _this = this;
        this.subjectCategoriesService.getOptions()
            .subscribe(function (success) {
            _this.subjectCategories = success;
            _this.incrementLoadFilters();
        }, function (error) {
            console.log(error);
        });
    };
    ;
    SearchComponent.prototype.getStudyLevels = function () {
        var _this = this;
        this.studyLevelsService.getOptions()
            .subscribe(function (success) {
            _this.studyLevels = success;
        }, function (error) {
            console.log(error);
        });
    };
    ;
    SearchComponent.prototype.ngOnInit = function () {
        this.getLessons();
        this.getSubjects();
        this.getSubjectCategories();
        this.getStudyLevels();
    };
    ;
    SearchComponent.prototype.changeSubjectCategory = function () {
        if (this.subjectCategoryId == null) {
            this.filteredSubjects = this.subjects;
            this.searchModel.subjectCategory = null;
        }
        else {
            for (var i = 0; i < this.filteredSubjectCategories.length; i++) {
                if (this.filteredSubjectCategories[i].id == this.subjectCategoryId) {
                    this.searchModel.subjectCategory = this.filteredSubjectCategories[i].url;
                    for (var j = 0; j < this.subjects.length; j++) {
                        if (this.subjects[j].id == this.filteredSubjectCategories[i].parentValue) {
                            this.filteredSubjects = [this.subjects[j]];
                            if (this.searchModel.subject == null) {
                                this.searchModel.subject = this.subjects[j].url;
                                this.filteredSubjectCategories = this.subjectCategoriesToShow();
                            }
                            break;
                        }
                    }
                    break;
                }
            }
        }
    };
    ;
    SearchComponent.prototype.changeSubject = function () {
        if (this.searchModel.subject != null) {
            if (this.searchModel.subjectCategory != null) {
                for (var i = 0; i < this.subjectCategories.length; i++) {
                    if (this.subjectCategories[i].url == this.searchModel.subjectCategory) {
                        if (this.subjectCategories[i].parentUrl != this.searchModel.subject) {
                            this.searchModel.subjectCategory = null;
                        }
                        break;
                    }
                }
            }
            this.filteredSubjectCategories = this.subjectCategoriesToShow();
        }
        else {
            this.subjectCategoryId = null;
            this.searchModel.subjectCategory = null;
            this.filteredSubjectCategories = this.subjectCategories;
            this.filteredSubjects = this.subjects;
        }
    };
    ;
    SearchComponent.prototype.subjectCategoriesToShow = function () {
        var toShow = [];
        for (var i = 0; i < this.subjectCategories.length; i++) {
            if (this.subjectCategories[i].parentUrl == this.searchModel.subject) {
                toShow.push(this.subjectCategories[i]);
            }
        }
        return toShow;
    };
    ;
    SearchComponent.prototype.onType = function (event) {
        if (event.key === "Enter") {
            this.reloadData();
        }
    };
    ;
    SearchComponent = __decorate([
        core_1.Component({
            selector: 'app-search',
            templateUrl: './search.component.html'
        }),
        __metadata("design:paramtypes", [index_1.SubjectsService, index_1.SubjectCategoriesService,
            index_1.StudyLevelsService, index_1.ClassSessionsService,
            common_1.Location])
    ], SearchComponent);
    return SearchComponent;
}());
exports.SearchComponent = SearchComponent;
//# sourceMappingURL=search.component.js.map