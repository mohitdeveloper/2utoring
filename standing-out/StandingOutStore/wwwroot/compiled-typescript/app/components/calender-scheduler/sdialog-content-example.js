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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SDialogContentExampleDialog = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var SDialogContentExampleDialog = /** @class */ (function () {
    function SDialogContentExampleDialog(data) {
        this.data = data;
        this.onSubmit = new core_1.EventEmitter();
        this.onDelete = new core_1.EventEmitter();
        this.submitBtnText = 'Save';
        this.fromTime = { hour: 13, minute: 30 };
        this.toTime = { hour: 13, minute: 45 };
        this.showAlert = false;
        this.isDeleteVisible = false;
        this.isSubmit = false;
        this.selectedWeekDay = data.selectedWeekDay ? data.selectedWeekDay : data.selectedDate.date;
        this.weekDayLabel = data.selectedWeekDay ? "WeekDay" : "Date";
        this.selectedDate = data.selectedDate;
        this.selectedWeekIndex = data.selectedWeekIndex;
        this.events = data.selectedWeekDay ? data.events : Object.values(data.events);
        if (data.fromTime) {
            var _a = data.fromTime.split(":"), fromHour = _a[0], fromMinute = _a[1];
            var _b = data.toTime.split(":"), toHour = _b[0], toMinute = _b[1];
            this.fromTime = { hour: parseInt(fromHour), minute: parseInt(fromMinute) };
            this.toTime = { hour: parseInt(toHour), minute: parseInt(toMinute) };
            this.oldFromTime = data.fromTime;
            this.oldToTime = data.toTime;
            this.isDeleteVisible = true;
            this.slotIndex = data.slotIndex;
            this.submitBtnText = "Update";
        }
        else {
            this.submitBtnText = "Save";
            this.oldFromTime = "";
            this.oldToTime = "";
            this.isDeleteVisible = false;
            this.slotIndex = -1;
        }
    }
    SDialogContentExampleDialog.prototype.submit = function (isDelete) {
        var _this = this;
        if (isDelete === void 0) { isDelete = false; }
        this.isSubmit = true;
        this.showAlert = true;
        if (this.fromTime.hour > this.toTime.hour || (this.fromTime.hour == this.toTime.hour && this.fromTime.minute > this.toTime.minute)) {
            this.alert = {
                type: 'danger',
                message: 'To Time must be greater than from time'
            };
            this.isSubmit = false;
            return;
        }
        else {
            this.alert = {
                type: 'success',
                message: isDelete ? 'Time Slot Removed' : (!this.oldFromTime ? 'Time slot added' : 'Time Slot Update')
            };
        }
        var fromTime = (this.fromTime.hour < 10 ? '0' : '') + this.fromTime.hour + ":" + (this.fromTime.minute < 10 ? '0' : '') + this.fromTime.minute;
        var toTime = (this.toTime.hour < 10 ? '0' : '') + this.toTime.hour + ":" + (this.toTime.minute < 10 ? '0' : '') + this.toTime.minute;
        var x1 = new Date(null, null, null, this.fromTime.hour, this.fromTime.minute);
        var x2 = new Date(null, null, null, this.toTime.hour, this.toTime.minute);
        var diff = x2.getTime() - x1.getTime();
        diff = diff / 1000;
        var minutesDiff = Math.floor(diff / 60);
        if (minutesDiff > 60) {
            this.alert = {
                type: 'danger',
                message: 'Time slot must be less than or equal to 60 minutes'
            };
            this.isSubmit = false;
            this.showAlert = true;
            return;
        }
        if (this.events && !isDelete) {
            var exIndex_1 = -1;
            //let evts:any;
            /*if(this.slotIndex==-1){
                evts = Object.values(this.events);
                exIndex = evts.findIndex(r=>r.from_time==this.oldFromTime && r.to_time==this.oldToTime)
            }else{
                exIndex = this.slotIndex;
                evts = this.events;
            }*/
            exIndex_1 = this.events.findIndex(function (r) { return r.from_time == _this.oldFromTime && r.to_time == _this.oldToTime; });
            if (this.events.length > 0) {
                var isSlotExist = this.events.some(function (item, index) {
                    var _a = item.from_time.split(":"), fth = _a[0], ftm = _a[1];
                    var _b = item.to_time.split(":"), tth = _b[0], ttm = _b[1];
                    fth = parseInt(fth);
                    ftm = parseInt(ftm);
                    tth = parseInt(tth);
                    ttm = parseInt(ttm);
                    var y1 = new Date(null, null, null, fth, ftm);
                    var y2 = new Date(null, null, null, tth, ttm);
                    if (x1 < y2 && x2 > y1 && (index != exIndex_1)) {
                        return true;
                    }
                });
                if (isSlotExist) {
                    this.showAlert = true;
                    this.alert = {
                        type: 'danger',
                        message: 'Time Slot Already Exist Or Overlapping'
                    };
                    this.isSubmit = false;
                    return;
                }
            }
        }
        if (this.weekDayLabel == "Date") {
            this.events.push({
                from_time: fromTime,
                to_time: toTime
            });
        }
        var dataRec = {
            fromTime: fromTime,
            toTime: toTime,
            fromHour: this.fromTime.hour,
            fromMinute: this.fromTime.minute,
            toHour: this.toTime.hour,
            toMinute: this.toTime.minute,
            oldFromTime: this.oldFromTime,
            oldToTime: this.oldToTime,
            selectedDate: this.selectedDate,
            isDelete: isDelete,
            slotIndex: this.slotIndex
        };
        this.onSubmit.emit(dataRec);
        if (this.oldFromTime) {
            this.oldFromTime = fromTime;
            this.oldToTime = toTime;
        }
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], SDialogContentExampleDialog.prototype, "onSubmit", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], SDialogContentExampleDialog.prototype, "onDelete", void 0);
    SDialogContentExampleDialog = __decorate([
        core_1.Component({
            selector: 'sdialog-content-example-dialog',
            templateUrl: 'sdialog-content-example.html',
        }),
        __param(0, core_1.Inject(dialog_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [Object])
    ], SDialogContentExampleDialog);
    return SDialogContentExampleDialog;
}());
exports.SDialogContentExampleDialog = SDialogContentExampleDialog;
//# sourceMappingURL=sdialog-content-example.js.map