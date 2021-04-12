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
exports.AvailabilityDialog = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var ngx_toastr_1 = require("ngx-toastr");
var AvailabilityDialog = /** @class */ (function () {
    function AvailabilityDialog(dialogRef, data, toastr) {
        this.dialogRef = dialogRef;
        this.data = data;
        this.toastr = toastr;
        this.onSubmit = new core_1.EventEmitter();
        this.onDelete = new core_1.EventEmitter();
        this.submitBtnText = 'Save';
        this.fromTime = { hour: 13, minute: 30 };
        this.toTime = { hour: 13, minute: 45 };
        this.showAlert = false;
        this.oldFromTime = '';
        this.oldToTime = '';
        this.isDeleteVisible = false;
        this.isSubmit = false;
        this.needConfirmation = false;
        this.typeTimeSlot = 1;
        this.excludedDatesInPattern = [];
        this.isOverlapSlot = 0;
        debugger;
        this.selectedDate = data.selectedDate;
        if (data.fromTime) {
            var _a = data.fromTime.split(":"), fromHour = _a[0], fromMinute = _a[1];
            var _b = data.toTime.split(":"), toHour = _b[0], toMinute = _b[1];
            this.fromTime = { hour: parseInt(fromHour), minute: parseInt(fromMinute) };
            this.toTime = { hour: parseInt(toHour), minute: parseInt(toMinute) };
            this.oldFromTime = data.fromTime;
            this.oldToTime = data.toTime;
            this.isDeleteVisible = true;
            this.addedIndex = data.addedIndex;
            this.submitBtnText = "Update";
        }
        else {
            this.submitBtnText = "Save";
            this.oldFromTime = "";
            this.oldToTime = "";
            this.isDeleteVisible = false;
            this.addedIndex = -1;
        }
    }
    AvailabilityDialog.prototype.submit = function (isDelete) {
        var _this = this;
        if (isDelete === void 0) { isDelete = false; }
        debugger;
        this.excludedDatesInPattern = [];
        var selectedWeeks = [];
        this.isSubmit = true;
        this.showAlert = true;
        var _a = this.inputFromTime.nativeElement.value.split(":"), fhh = _a[0], fmm = _a[1];
        var _b = this.inputToTime.nativeElement.value.split(":"), thh = _b[0], tmm = _b[1];
        if (!fhh || !fmm || !thh || !tmm) {
            this.toastr.error('Please select valid time!');
            return;
        }
        this.fromTime.hour = parseInt(fhh);
        this.fromTime.minute = parseInt(fmm);
        this.toTime.hour = parseInt(thh);
        this.toTime.minute = parseInt(tmm);
        if (this.fromTime.hour > this.toTime.hour || (this.fromTime.hour == this.toTime.hour && this.fromTime.minute > this.toTime.minute)) {
            this.toastr.error('To Time must be greater than from time');
            this.isSubmit = false;
            return;
        }
        var fromTime = (this.fromTime.hour < 10 ? '0' : '') + this.fromTime.hour + ":" + (this.fromTime.minute < 10 ? '0' : '') + this.fromTime.minute;
        var toTime = (this.toTime.hour < 10 ? '0' : '') + this.toTime.hour + ":" + (this.toTime.minute < 10 ? '0' : '') + this.toTime.minute;
        var x1 = new Date(null, null, null, this.fromTime.hour, this.fromTime.minute);
        var x2 = new Date(null, null, null, this.toTime.hour, this.toTime.minute);
        var diff = x2.getTime() - x1.getTime();
        diff = diff / 1000;
        var minutesDiff = Math.floor(diff / 60);
        if (minutesDiff > 60) {
            this.toastr.error('Time slot must be less than or equal to 60 minutes');
            this.isSubmit = false;
            return;
        }
        this.events = [];
        this.isOverlapSlot = 0;
        this.initializeWeekIndexes();
        if (!isDelete) {
            /*if (this.data.selectedDate.type == 'weekEvent') {
                this.data.selectedDate.repeatedDays.map(mm => {
                    //this.checkOverlap(x1, x2);
                })
            } else {
                selectedWeeks = this.getSelectedWeeks();
                if (selectedWeeks.length > 0) {
                    selectedWeeks.map(mm => {
                        this.events = this.data.that.weekdays[mm].events;
                        this.checkOverlap(x1, x2);
                    })
                } else {
                    this.events = this.data.that.eventOnDate[this.data.selectedDate.date] ? Object.values(this.data.that.eventOnDate[this.data.selectedDate.date]) : [];
                    this.checkOverlap(x1, x2);
                }
            }*/
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
            addedIndex: this.addedIndex,
            selectedWeekIndex: -1,
            noOfWeek: this.noOfWeek ? parseInt(this.noOfWeek.nativeElement.value) : 0,
            repeatedDays: [],
            recurStart: this.selectedDate.recurStart ? this.selectedDate.recurStart : ""
        };
        this.dataRec = dataRec;
        if (this.oldFromTime == "") {
            var selectedWeeks_1 = this.getSelectedWeeks();
            if (selectedWeeks_1.length > 0) {
                selectedWeeks_1.map(function (mm) {
                    _this.checkOverlapRecurEvent(fromTime, toTime, mm, 'add', dataRec.noOfWeek);
                    if (_this.isOverlapSlot > 0) {
                        return; //Means slot overlaps
                    }
                });
            }
            else {
                this.checkOverlapSingleEvent(fromTime, toTime);
            }
            if (this.isOverlapSlot > 0) {
                return; //Means slot overlaps
            }
            this.addEvents(dataRec, selectedWeeks_1);
        }
        else {
            if (this.selectedDate.type == 'weekEvent') {
                this.needConfirmation = true;
            }
            else if (!isDelete) {
                this.checkOverlapSingleEvent(fromTime, toTime);
                if (this.isOverlapSlot > 0) {
                    return; //Means slot overlaps
                }
                this.toastr.success('Time slot updated.');
                this.onSubmit.emit(this.dataRec);
                this.closeDialog();
            }
            else {
                this.toastr.success('Time slot has been removed.');
                this.onSubmit.emit(this.dataRec);
                this.closeDialog();
            }
        }
        /*if (this.oldFromTime) {
            this.oldFromTime = fromTime;
            this.oldToTime = toTime;
        }*/
    };
    AvailabilityDialog.prototype.ngAfterViewInit = function () {
        this.inputFromTime.nativeElement.value = this.data.fromTime;
        this.inputToTime.nativeElement.value = this.data.toTime;
    };
    AvailabilityDialog.prototype.addEvents = function (dataRec, selectedWeeks) {
        var _this = this;
        if (this.isRepeat.nativeElement.checked) {
            if (selectedWeeks.length == 0) {
                this.isSubmit = false;
                this.toastr.error("Please select repeated week.");
                return;
            }
            if (dataRec.noOfWeek > 50 || dataRec.noOfWeek < 2) {
                this.toastr.error("No of week must be between 2 and 50");
                return;
            }
            dataRec.excludedDatesInPattern = this.excludedDatesInPattern;
            selectedWeeks.map(function (r) {
                dataRec.selectedWeekIndex = r;
                dataRec.repeatedDays = selectedWeeks;
                _this.onSubmit.emit(dataRec);
            });
        }
        else {
            this.onSubmit.emit(dataRec);
        }
        this.toastr.success('Time slot added.');
        setTimeout(function () {
            _this.dialogRef.close();
        }, 3000);
    };
    AvailabilityDialog.prototype.getSelectedWeeks = function () {
        var weekdays = [];
        var arr = this.weekdayChkbox.toArray();
        arr.map(function (a) {
            if (a.nativeElement.checked) {
                weekdays.push(parseInt(a.nativeElement.value));
            }
        });
        return weekdays;
    };
    AvailabilityDialog.prototype.checkOverlapSingleEvent = function (fromTime, toTime, inputDate) {
        if (inputDate === void 0) { inputDate = ''; }
        var oldFromTime = this.data.fromTime;
        var checkDate = inputDate ? inputDate : this.selectedDate.date;
        var x1 = new Date(checkDate + 'T' + fromTime).getTime();
        var x2 = new Date(checkDate + 'T' + toTime).getTime();
        //let events = this.data.that.addedEvents;
        var events = this.data.that.eventOnDate[checkDate] ? Object.values(this.data.that.eventOnDate[checkDate]) : [];
        //let currDayOfWeek = new Date(this).getDay();
        if (events.length > 0) {
            //Old logic
            /*let isSlotExist = events.some((item, index) => {
                let y1, y2;
                if (item.dayOfWeek == -1 && item.startTime.split('T')[0] == this.selectedDate.date && index != this.addedIndex) {
                    y1 = new Date(item.startTime).getTime();
                    y2 = new Date(item.endTime).getTime();
                    if (x1 < y2 && x2 > y1) {
                        return true;
                    }
                }
            });*/
            var isSlotExist = events.some(function (item, index) {
                if (item.from_time != oldFromTime) {
                    var y1 = void 0, y2 = void 0;
                    y1 = new Date(checkDate + "T" + item.from_time).getTime();
                    y2 = new Date(checkDate + "T" + item.to_time).getTime();
                    if (x1 < y2 && x2 > y1) {
                        return true;
                    }
                }
            });
            if (isSlotExist) {
                if (inputDate == '') {
                    this.isOverlapSlot = this.isOverlapSlot + 1;
                    this.toastr.error('Time Slot Already Exist Or Overlapping');
                    this.isSubmit = false;
                    return;
                }
                else {
                    return 'overlap';
                }
            }
        }
    };
    AvailabilityDialog.prototype.checkOverlapRecurEvent = function (fromTime, toTime, weekDay, type, noOfWeek) {
        var _this = this;
        var oldFromTime = this.data.fromTime;
        var _a = fromTime.split(":"), fh = _a[0], fm = _a[1];
        var _b = toTime.split(":"), th = _b[0], tm = _b[1];
        fh = parseInt(fh);
        fm = parseInt(fm);
        th = parseInt(th);
        tm = parseInt(tm);
        var pStart, pEnd = new Date();
        if (type == 'add') {
            pStart = new Date(this.selectedDate.date);
            if (pStart.getDay() != weekDay) {
                pStart.setTime(pStart.getTime() + (weekDay + 7 - pStart.getDay()) % 7);
            }
        }
        else {
            var d1 = new Date();
            pStart = new Date(this.dataRec.recurStart);
            if (d1.getTime() > pStart.getTime()) {
                pStart = new Date();
            }
            if (pStart.getDay() != weekDay) {
                var duration_1 = weekDay + 7 - pStart.getDay() % 7;
                pStart.setTime(pStart.getTime() + (duration_1 * 24 * 60 * 60 * 1000));
            }
        }
        var duration = (noOfWeek - 1) * 7;
        pEnd.setTime(pStart.getTime() + (duration * 24 * 60 * 60 * 1000));
        pStart.setHours(fh, fm, 0, 0);
        pEnd.setHours(th, tm, 0, 0);
        var events = this.data.that.addedEvents;
        if (events.length > 0) {
            var pad_1 = function (n) { return n < 10 ? '0' + n : n; };
            var isSlotExist = events.some(function (item, index) {
                var weekDayIndex = -1;
                var stTime = new Date(item.startTime);
                var fromTimeInner = pad_1(stTime.getHours()) + ":" + pad_1(stTime.getMinutes());
                //let ogDate = this.data.selectedDate.originDate;
                //if (typeof ogDate == "object") {
                //    ogDate = this.data.selectedDate.originDate.originDate;
                //}
                var ogDate;
                var stDates;
                stDates = item.startTime.split('T')[0];
                if (type == 'edit') {
                    ogDate = _this.data.selectedDate.recurStart.toISOString();
                    ogDate = ogDate.split('T')[0];
                }
                if (type == 'edit' &&
                    stDates == ogDate
                    && fromTimeInner == oldFromTime
                    && item.dayOfWeek == weekDay) {
                    weekDayIndex = index;
                    _this.weekDayIndexes[weekDay] = index;
                }
                if (index != weekDayIndex) {
                    if (item.dayOfWeek == weekDay && item.slotType == 0 && _this.checkInPattern(item, pStart, pEnd, fromTime, toTime) && !_this.dataRec.isDelete) {
                        debugger;
                        console.log("In Week Here", item.startTime);
                        return true;
                    }
                    else if ((new Date(item.startTime).getDay() == weekDay) && _this.checkInPattern(item, pStart, pEnd, fromTime, toTime)) {
                        _this.excludedDatesInPattern.push(item.startTime.split("T")[0]);
                    }
                }
            });
            if (isSlotExist) {
                this.isOverlapSlot = this.isOverlapSlot + 1;
                this.toastr.error('Time Slot Already Exist Or Overlapping');
                this.isSubmit = false;
                return;
            }
        }
    };
    AvailabilityDialog.prototype.checkInPattern = function (item, pStart, pEnd, fromTime, toTime) {
        var x1, x2, y1, y2, end, eTime;
        var stDate = item.startTime.split("T")[0];
        if (stDate == '2020-12-24') {
            debugger;
        }
        var start = new Date(item.startTime);
        console.log("Start gg", start);
        if (item.dayOfWeek == -1) {
            var overlap = this.checkOverlapSingleEvent(fromTime, toTime, stDate);
            if (overlap == 'overlap') {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            end = new Date(item.endTime);
            var duration = (item.noOfWeek - 1) * 7;
            end.setTime(start.getTime() + (duration * 24 * 60 * 60 * 1000));
            eTime = item.endTime.split('T')[1];
            var _a = eTime.split(":"), eth = _a[0], etm = _a[1];
            end.setHours(eth, etm, 0, 0);
            console.log("Pstart", pStart);
            console.log("Pend", pEnd);
            console.log("start", start);
            console.log("end", end);
            if (pStart.getTime() < end.getTime() && pEnd.getTime() > start.getTime()) {
                x1 = new Date(stDate + 'T' + fromTime).getTime();
                x2 = new Date(stDate + 'T' + toTime).getTime();
                y1 = new Date(item.startTime).getTime();
                y2 = new Date(stDate + 'T' + eTime).getTime();
                if (x1 < y2 && x2 > y1) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        }
    };
    AvailabilityDialog.prototype.modifyTimeSlot = function () {
        var _this = this;
        var msg;
        if (this.data.selectedDate.type == 'weekEvent') {
            var noOfWeek_1 = parseInt(this.data.selectedDate.noOfWeek);
            if (this.typeTimeSlot == 2) {
                this.data.selectedDate.repeatedDays.some(function (r) {
                    _this.checkOverlapRecurEvent(_this.dataRec.fromTime, _this.dataRec.toTime, r, 'edit', noOfWeek_1);
                    if (_this.isOverlapSlot > 0 && !_this.dataRec.isDelete) {
                        return; //Means slot overlaps
                    }
                    _this.dataRec.excludedDatesInPattern = _this.excludedDatesInPattern;
                    _this.dataRec.noOfWeek = noOfWeek_1;
                    _this.dataRec.selectedWeekIndex = r;
                    _this.dataRec.addedIndex = _this.weekDayIndexes[r];
                    _this.dataRec.repeatedDays = _this.data.selectedDate.repeatedDays;
                    msg = 'Time slot' + (_this.dataRec.isDelete ? ' deleted.' : ' updated.');
                    _this.onSubmit.emit(_this.dataRec);
                });
            }
            else {
                this.checkOverlapSingleEvent(this.dataRec.fromTime, this.dataRec.toTime);
                if (this.isOverlapSlot > 0 && !this.dataRec.isDelete) {
                    return; //Means slot overlaps
                }
                this.dataRec.repeatedDays = this.data.selectedDate.repeatedDays;
                this.dataRec.noOfWeek = parseInt(this.data.selectedDate.noOfWeek);
                this.dataRec.selectedWeekIndex = -1;
                this.dataRec.addedIndex = -1;
                msg = 'Time slot' + (this.dataRec.isDelete ? ' deleted.' : ' updated.');
                this.onSubmit.emit(this.dataRec);
            }
        }
        else {
            this.onSubmit.emit(this.dataRec);
        }
        if (this.isOverlapSlot == 0) {
            this.toastr.success(msg);
        }
        this.closeDialog();
    };
    AvailabilityDialog.prototype.closeDialog = function () {
        this.dialogRef.close(true);
    };
    AvailabilityDialog.prototype.initializeWeekIndexes = function () {
        this.weekDayIndexes = {
            0: -1,
            1: -1,
            2: -1,
            3: -1,
            4: -1,
            5: -1,
            6: -1
        };
    };
    AvailabilityDialog.prototype.checkRepeated = function () {
        var checked = false;
        var arr = this.weekdayChkbox.toArray();
        arr.map(function (a) {
            if (a.nativeElement.checked) {
                checked = true;
            }
        });
        this.isRepeat.nativeElement.checked = checked;
    };
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], AvailabilityDialog.prototype, "onSubmit", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], AvailabilityDialog.prototype, "onDelete", void 0);
    __decorate([
        core_1.ViewChild('isRepeat'),
        __metadata("design:type", Object)
    ], AvailabilityDialog.prototype, "isRepeat", void 0);
    __decorate([
        core_1.ViewChild('noOfWeek'),
        __metadata("design:type", Object)
    ], AvailabilityDialog.prototype, "noOfWeek", void 0);
    __decorate([
        core_1.ViewChild('inputFromTime'),
        __metadata("design:type", Object)
    ], AvailabilityDialog.prototype, "inputFromTime", void 0);
    __decorate([
        core_1.ViewChild('inputToTime'),
        __metadata("design:type", Object)
    ], AvailabilityDialog.prototype, "inputToTime", void 0);
    __decorate([
        core_1.ViewChildren('weekdayChkbox'),
        __metadata("design:type", Object)
    ], AvailabilityDialog.prototype, "weekdayChkbox", void 0);
    AvailabilityDialog = __decorate([
        core_1.Component({
            selector: 'availability-dialog',
            templateUrl: 'availability-dialog.html',
            styleUrls: ['availability-dialog.css'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __param(1, core_1.Inject(dialog_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [dialog_1.MatDialogRef, Object, ngx_toastr_1.ToastrService])
    ], AvailabilityDialog);
    return AvailabilityDialog;
}());
exports.AvailabilityDialog = AvailabilityDialog;
//# sourceMappingURL=availability-dialog.js.map