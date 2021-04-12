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
exports.SearchMiniComponent = void 0;
var core_1 = require("@angular/core");
var index_1 = require("../../services/index");
var SearchMiniComponent = /** @class */ (function () {
    function SearchMiniComponent(subjectsService, subjectCategoriesService, studyLevelsService) {
        this.subjectsService = subjectsService;
        this.subjectCategoriesService = subjectCategoriesService;
        this.studyLevelsService = studyLevelsService;
        this.subject = null;
        this.subjectCategory = null;
        this.subjectCategoryUrl = null; // Separate id and url here as potential for duplicate categories between groups
        this.studyLevelUrl = null;
        this.isUnder16 = true;
        this.subjects = [];
        this.filteredSubjects = [];
        this.subjectCategories = [];
        this.filteredSubjectCategories = [];
        this.studyLevels = [];
    }
    SearchMiniComponent.prototype.buildUrl = function () {
        var queryString = '';
        var url = '';
        if (this.subject != null) {
            url += "/subject/" + encodeURIComponent(this.subject);
        }
        if (this.subjectCategory != null) {
            url += "/learn/" + encodeURIComponent(this.subjectCategoryUrl);
        }
        if (this.studyLevelUrl != null) {
            url += "/level/" + encodeURIComponent(this.studyLevelUrl);
        }
        if (this.isUnder16 != null && this.isUnder16 == false) {
            queryString += (queryString == '' ? '?' : '&') + 'under=' + this.isUnder16;
        }
        return "/find-a-lesson" + url + queryString;
    };
    ;
    SearchMiniComponent.prototype.getSubjects = function () {
        var _this = this;
        this.subjectsService.getOptions()
            .subscribe(function (success) {
            _this.subjects = success;
            _this.filteredSubjects = success;
        }, function (error) {
            console.log(error);
        });
    };
    ;
    SearchMiniComponent.prototype.getSubjectCategories = function () {
        var _this = this;
        this.subjectCategoriesService.getOptions()
            .subscribe(function (success) {
            _this.subjectCategories = success;
            _this.filteredSubjectCategories = success;
        }, function (error) {
            console.log(error);
        });
    };
    ;
    SearchMiniComponent.prototype.getStudyLevels = function () {
        var _this = this;
        this.studyLevelsService.getOptions()
            .subscribe(function (success) {
            _this.studyLevels = success;
        }, function (error) {
            console.log(error);
        });
    };
    ;
    SearchMiniComponent.prototype.search = function () {
        window.location.href = this.buildUrl();
    };
    ;
    SearchMiniComponent.prototype.ngOnInit = function () {
        this.getSubjects();
        this.getSubjectCategories();
        this.getStudyLevels();
    };
    ;
    SearchMiniComponent.prototype.changeSubjectCategory = function () {
        if (this.subjectCategory == null) {
            this.filteredSubjects = this.subjects;
            this.subjectCategoryUrl = null;
        }
        else {
            for (var i = 0; i < this.filteredSubjectCategories.length; i++) {
                if (this.filteredSubjectCategories[i].id == this.subjectCategory) {
                    this.subjectCategoryUrl = this.filteredSubjectCategories[i].url;
                    for (var j = 0; j < this.subjects.length; j++) {
                        if (this.subjects[j].id == this.filteredSubjectCategories[i].parentValue) {
                            this.filteredSubjects = [this.subjects[j]];
                            if (this.subject == null) {
                                this.subject = this.subjects[j].url;
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
    SearchMiniComponent.prototype.changeSubject = function () {
        if (this.subject != null) {
            if (this.subjectCategory != null) {
                for (var i = 0; i < this.subjectCategories.length; i++) {
                    if (this.subjectCategories[i].url == this.subjectCategory) {
                        if (this.subjectCategories[i].parentUrl != this.subject) {
                            this.subjectCategory = null;
                        }
                        break;
                    }
                }
            }
            this.filteredSubjectCategories = this.subjectCategoriesToShow();
        }
        else {
            this.subjectCategory = null;
            this.subjectCategoryUrl = null;
            this.filteredSubjectCategories = this.subjectCategories;
            this.filteredSubjects = this.subjects;
        }
    };
    ;
    SearchMiniComponent.prototype.subjectCategoriesToShow = function () {
        var toShow = [];
        for (var i = 0; i < this.subjectCategories.length; i++) {
            if (this.subjectCategories[i].parentUrl == this.subject) {
                toShow.push(this.subjectCategories[i]);
            }
        }
        return toShow;
    };
    ;
    SearchMiniComponent = __decorate([
        core_1.Component({
            selector: 'app-search-mini',
            templateUrl: './search-mini.component.html'
        }),
        __metadata("design:paramtypes", [index_1.SubjectsService, index_1.SubjectCategoriesService,
            index_1.StudyLevelsService])
    ], SearchMiniComponent);
    return SearchMiniComponent;
}());
exports.SearchMiniComponent = SearchMiniComponent;
//# sourceMappingURL=search-mini.component.js.map