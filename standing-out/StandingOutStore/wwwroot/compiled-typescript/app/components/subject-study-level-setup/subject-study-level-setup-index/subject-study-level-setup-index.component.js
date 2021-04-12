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
var core_1 = require("@angular/core");
var index_1 = require("../../../models/index");
var index_2 = require("../../../services/index");
var $ = require("jquery");
var forms_1 = require("@angular/forms");
var table_1 = require("@angular/material/table");
var SubjectStudyLevelSetupIndexComponent = /** @class */ (function () {
    function SubjectStudyLevelSetupIndexComponent(subjectsService, studyLevelsService, pricingService) {
        this.subjectsService = subjectsService;
        this.studyLevelsService = studyLevelsService;
        this.pricingService = pricingService;
        //displayedColumns: string[] = ['position', 'name', 'level', 'price', 'action'];
        this.displayedColumns = ['position', 'name', 'level', 'price', 'action'];
        this.editing = false;
        this.showEeditingbtn = false;
        this.showEeditingbtnAlt = false;
        this.selectedValues = [];
        this.title = 'Price Management';
        this.dataSource = new table_1.MatTableDataSource(this.tmpData);
        this.owningEntityId = document.getElementById("app-angular").getAttribute("owningEntityId") || null;
        this.setupTypeAttrib = document.getElementById("app-angular").getAttribute("setupType") || null;
        this.searchModel = new index_1.SubjectStudyLevelSearchModel;
        this.searchModel.subjectStudyLevelSetupType =
            (this.setupTypeAttrib.toLocaleLowerCase() == "tutor") ? index_1.SubjectStudyLevelSetupType.Tutor : index_1.SubjectStudyLevelSetupType.Company;
        this.searchModel.owningEntityId = this.owningEntityId;
    }
    // Populate initial set of data values
    SubjectStudyLevelSetupIndexComponent.prototype.ngOnInit = function () {
        this.getExistingPricesData(); // Already 
        this.getAllSubjectsData();
        this.getStudyLevelsData();
    };
    ;
    SubjectStudyLevelSetupIndexComponent.prototype.getExistingPricesData = function () {
        var _this = this;
        console.log("SearchModel:", this.searchModel);
        this.pricingService.getPaged(this.searchModel).subscribe(function (result) {
            console.log("Paged Data:", result);
            _this.mapExistingData(result);
        }, function (error) { });
    };
    SubjectStudyLevelSetupIndexComponent.prototype.getAllSubjectsData = function () {
        var _this = this;
        this.subjectsService.get().subscribe(function (subjects) {
            _this.allSubjects = subjects;
        }, function (error) { });
    };
    SubjectStudyLevelSetupIndexComponent.prototype.getStudyLevelsData = function () {
        var _this = this;
        this.studyLevelsService.get().subscribe(function (studyLevels) {
            _this.allStudyLevels = studyLevels;
        }, function (error) { });
    };
    // Paged data..
    SubjectStudyLevelSetupIndexComponent.prototype.mapExistingData = function (pagedData) {
        this.tmpData = pagedData.data.map(function (entity, index) {
            var dataItem = new index_1.SubjectStudyLevelSetup();
            dataItem.position = index;
            dataItem.action = '';
            dataItem.subjectName = entity.subjectName;
            dataItem.subjectId = entity.subjectId;
            dataItem.studyLevelId = entity.studyLevelId;
            dataItem.studyLevelName = entity.studyLevelName;
            dataItem.pricePerPerson = entity.pricePerPerson;
            return dataItem;
        });
        this.dataSource = new table_1.MatTableDataSource(this.tmpData);
        var toGroups = pagedData.data.map(function (entity, index) {
            return new forms_1.FormGroup({
                position: new forms_1.FormControl(index, forms_1.Validators.required),
                subjectStudyLevelSetupId: new forms_1.FormControl(entity.subjectStudyLevelSetupId, forms_1.Validators.required),
                subjectId: new forms_1.FormControl(entity.subjectId, forms_1.Validators.required),
                subjectName: new forms_1.FormControl(entity.subjectName, forms_1.Validators.required),
                studyLevelId: new forms_1.FormControl(entity.studyLevelId, forms_1.Validators.required),
                price: new forms_1.FormControl(entity.studyLevelName, forms_1.Validators.required),
                action: new forms_1.FormControl('', forms_1.Validators.required)
            }, { updateOn: "blur" });
        });
        this.controls = new forms_1.FormArray(toGroups);
    };
    // UI refers to this.
    SubjectStudyLevelSetupIndexComponent.prototype.addRow = function (currentIndex) {
        this.selectedValues = [];
        // this.showEeditingbtnAlt = true;
        this.editingIndex = currentIndex + 1;
        // this.showEeditingbtn = true;
        this.editing = false;
        var nextRowIndex = this.dataSource.data.length + 1;
        var newEntry = new index_1.SubjectStudyLevelSetup();
        newEntry.position = nextRowIndex;
        newEntry.subjects = this.allSubjects; // name: ['English', 'Maths', 'Physics', 'Science'], // Subjects list
        newEntry.studyLevels = this.allStudyLevels;
        // level: ['1', '2', '3', '4'], // Study levels list
        newEntry.pricePerPerson = 0; // '0'
        newEntry.action = '';
        this.dataSource.data.push(newEntry);
        this.dataSource.filter = "";
        $('body').find('i.myCustomTest').show();
        $('body').find('i.myCustomTest_' + currentIndex).hide();
    };
    // DELETE record
    SubjectStudyLevelSetupIndexComponent.prototype.deleteRowData = function (row_obj, index) {
        this.editing = false;
        $('i.myCustomTest').show();
        this.dataSource.data = this.dataSource.data.filter(function (value, key) {
            return key + 1 != row_obj;
        });
    };
    // Used by redundant updateField (unused hence)
    //getControl(index, fieldName) {
    //    const a = this.controls.at(index).get(fieldName) as FormControl;
    //    return this.controls.at(index).get(fieldName) as FormControl;
    //}
    // Unused
    //updateField(index, field) {
    //    const control = this.getControl(index, field);
    //    if (control.valid) {
    //        // this.pricingService.update(index, field, control.value);
    //    }
    //}
    // unused
    //inputBlurGetData(positionId, inputVal) {
    //    if (this.tmpData.length > 0) {
    //        for (var i in this.tmpData) {
    //            if (this.tmpData[i].position == positionId) {
    //                this.tmpData[i].price = inputVal;
    //            }
    //        }
    //    }
    //    this.dataSource.data = this.tmpData;
    //}
    // UI refers to this
    SubjectStudyLevelSetupIndexComponent.prototype.allowRowEdit = function (positionId, index) {
        this.editing = true;
        this.showEeditingbtn = false;
        this.selectedRowIndex = positionId;
        this.editingIndex = positionId;
        $('i.myCustomTest').show();
        $('.myCustomTest_' + index).hide();
    };
    // SAVE the record
    SubjectStudyLevelSetupIndexComponent.prototype.saveRowData = function (positionId, index) {
        this.selectedRowIndex = positionId;
        this.editing = false;
        // this.showEeditingbtn = true;
        // $('.myCustomTest_'+positionId).css('display','none');
        this.editingIndex = -1;
        $('.myCustomTest_' + index).show();
    };
    // Subject column
    SubjectStudyLevelSetupIndexComponent.prototype.onSubjectChange = function (selectedValue, positionId) {
        this.selectedRowIndex = positionId;
        this.selectedValues.push({ 'subject': selectedValue.value });
        if (this.selectedValues.length >= 3) {
            this.editing = true;
            this.showEeditingbtn = false;
            this.showEeditingbtnAlt = true;
        }
    };
    // Study level column
    SubjectStudyLevelSetupIndexComponent.prototype.onLevelChange = function (selectedValue, positionId) {
        this.selectedRowIndex = positionId;
        this.selectedValues.push({ 'level': selectedValue.value });
        if (this.selectedValues.length >= 3) {
            this.editing = true;
            this.showEeditingbtn = false;
            this.showEeditingbtnAlt = true;
        }
    };
    // Price 
    SubjectStudyLevelSetupIndexComponent.prototype.onPriceChange = function (selectedValue, positionId) {
        this.selectedRowIndex = positionId;
        this.selectedValues.push({ 'price': selectedValue });
        if (this.selectedValues.length >= 3) {
            this.editing = true;
            this.showEeditingbtn = false;
            this.showEeditingbtnAlt = true;
        }
    };
    SubjectStudyLevelSetupIndexComponent = __decorate([
        core_1.Component({
            selector: 'app-subject-study-level-setup-index',
            styleUrls: ['./subject-study-level-setup-index.component.css'],
            templateUrl: './subject-study-level-setup-index.component.html',
            //animations: [rowsAnimation],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __metadata("design:paramtypes", [index_2.SubjectsService, index_2.StudyLevelsService,
            index_2.SubjectStudyLevelSetupService])
    ], SubjectStudyLevelSetupIndexComponent);
    return SubjectStudyLevelSetupIndexComponent;
}());
exports.SubjectStudyLevelSetupIndexComponent = SubjectStudyLevelSetupIndexComponent;
//# sourceMappingURL=subject-study-level-setup-index.component.js.map