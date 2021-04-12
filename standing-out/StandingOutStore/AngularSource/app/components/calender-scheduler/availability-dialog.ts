import { Component, OnInit, ViewChild, Inject, EventEmitter, Output, ViewChildren, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'availability-dialog',
    templateUrl: 'availability-dialog.html',
    styleUrls: ['availability-dialog.css'],
    encapsulation: ViewEncapsulation.None
})
export class AvailabilityDialog {
    @Output() onSubmit = new EventEmitter<any>();
    @Output() onDelete = new EventEmitter<any>();
    submitBtnText: any = 'Save';

    addedIndex: any;
    fromTime = { hour: 13, minute: 30 };
    toTime = { hour: 13, minute: 45 }
    showAlert: boolean = false;
    alert: any;
    oldFromTime: any = '';
    oldToTime: any = '';
    selectedDate: any;
    isDeleteVisible: boolean = false;
    events: any;
    isSubmit: boolean = false;
    needConfirmation: boolean = false;
    typeTimeSlot: number = 1;
    dataRec: any;
    excludedDatesInPattern = [];
    @ViewChild('isRepeat') isRepeat;
    @ViewChild('noOfWeek') noOfWeek;
    @ViewChild('inputFromTime') inputFromTime;
    @ViewChild('inputToTime') inputToTime;
    @ViewChildren('weekdayChkbox') weekdayChkbox;
    isOverlapSlot: number = 0;
    weekDayIndexes:any;

    constructor(public dialogRef: MatDialogRef<AvailabilityDialog>, @Inject(MAT_DIALOG_DATA) public data: any, private toastr: ToastrService) {
        debugger;
        this.selectedDate = data.selectedDate;
        if (data.fromTime) {
            let [fromHour, fromMinute] = data.fromTime.split(":");
            let [toHour, toMinute] = data.toTime.split(":");
            this.fromTime = { hour: parseInt(fromHour), minute: parseInt(fromMinute) };
            this.toTime = { hour: parseInt(toHour), minute: parseInt(toMinute) }
            this.oldFromTime = data.fromTime;
            this.oldToTime = data.toTime;
            this.isDeleteVisible = true;
            this.addedIndex = data.addedIndex;
            this.submitBtnText = "Update";


        } else {
            this.submitBtnText = "Save"
            this.oldFromTime = "";
            this.oldToTime = "";
            this.isDeleteVisible = false;
            this.addedIndex = -1;


        }
    }
    submit(isDelete = false) {
        debugger;
        
        this.excludedDatesInPattern = [];
        let selectedWeeks = [];
        this.isSubmit = true;
        this.showAlert = true;
        let [fhh, fmm] = this.inputFromTime.nativeElement.value.split(":");
        let [thh, tmm] = this.inputToTime.nativeElement.value.split(":");
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


        let fromTime = (this.fromTime.hour < 10 ? '0' : '') + this.fromTime.hour + ":" + (this.fromTime.minute < 10 ? '0' : '') + this.fromTime.minute;
        let toTime = (this.toTime.hour < 10 ? '0' : '') + this.toTime.hour + ":" + (this.toTime.minute < 10 ? '0' : '') + this.toTime.minute;

        let x1: any = new Date(null, null, null, this.fromTime.hour, this.fromTime.minute);
        let x2: any = new Date(null, null, null, this.toTime.hour, this.toTime.minute);

        let diff = x2.getTime() - x1.getTime();
        diff = diff / 1000;
        let minutesDiff = Math.floor(diff / 60)

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


        let dataRec = {
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
            let selectedWeeks = this.getSelectedWeeks();
            if (selectedWeeks.length > 0) {
                selectedWeeks.map(mm => {
                    this.checkOverlapRecurEvent(fromTime, toTime, mm, 'add', dataRec.noOfWeek);
                    if (this.isOverlapSlot > 0) {
                        return; //Means slot overlaps
                    }
                })
            } else {
                this.checkOverlapSingleEvent(fromTime, toTime);
            }

            if (this.isOverlapSlot > 0) {
                return; //Means slot overlaps
            }
            this.addEvents(dataRec, selectedWeeks);

        } else {
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
            } else {
                this.toastr.success('Time slot has been removed.');
                this.onSubmit.emit(this.dataRec);
                this.closeDialog();
            }
        }


        /*if (this.oldFromTime) {
            this.oldFromTime = fromTime;
            this.oldToTime = toTime;
        }*/




    }

    ngAfterViewInit() {
        this.inputFromTime.nativeElement.value = this.data.fromTime;
        this.inputToTime.nativeElement.value = this.data.toTime;
    }

    addEvents(dataRec, selectedWeeks) {
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
            selectedWeeks.map(r => {
                dataRec.selectedWeekIndex = r;
                dataRec.repeatedDays = selectedWeeks;
                this.onSubmit.emit(dataRec);
            })
        } else {
            this.onSubmit.emit(dataRec);
        }
        this.toastr.success('Time slot added.');
        setTimeout(() => {
            this.dialogRef.close();
        }, 3000)


    }

    getSelectedWeeks() {
        let weekdays = [];
        let arr = this.weekdayChkbox.toArray();
        arr.map(a => {
            if (a.nativeElement.checked) {
                weekdays.push(parseInt(a.nativeElement.value));
            }
        })
        return weekdays;
    }

    checkOverlapSingleEvent(fromTime, toTime,inputDate='') {
        let oldFromTime = this.data.fromTime;
        let checkDate = inputDate?inputDate:this.selectedDate.date;
        let x1 = new Date(checkDate+ 'T' + fromTime).getTime();
        let x2 = new Date(checkDate + 'T' + toTime).getTime();
        //let events = this.data.that.addedEvents;
        let events = this.data.that.eventOnDate[checkDate] ? Object.values(this.data.that.eventOnDate[checkDate]) : [];

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

            let isSlotExist = events.some((item: any, index) => {
                if (item.from_time != oldFromTime) {
                    let y1, y2;
                    y1 = new Date(checkDate + "T" + item.from_time).getTime();
                    y2 = new Date(checkDate + "T" + item.to_time).getTime();
                    if (x1 < y2 && x2 > y1) {
                        return true;
                    }
                }
            });
            if (isSlotExist) {
                if(inputDate==''){
                    this.isOverlapSlot = this.isOverlapSlot + 1;
                    this.toastr.error('Time Slot Already Exist Or Overlapping');
                    this.isSubmit = false;
                    return;
                }else{
                    return 'overlap';
                }
            }
        }
    }

    checkOverlapRecurEvent(fromTime, toTime, weekDay, type, noOfWeek) {
        let oldFromTime = this.data.fromTime;
        let [fh, fm] = fromTime.split(":");
        let [th, tm] = toTime.split(":");
        fh = parseInt(fh);
        fm = parseInt(fm);
        th = parseInt(th);
        tm = parseInt(tm);
        let pStart, pEnd = new Date();
        
        if (type == 'add') {
            pStart = new Date(this.selectedDate.date);
            if (pStart.getDay() != weekDay) {
                pStart.setTime(pStart.getTime() + (weekDay + 7 - pStart.getDay()) % 7);
            }
        } else {
            let d1 = new Date();
            pStart = new Date(this.dataRec.recurStart);
            if (d1.getTime() > pStart.getTime()) {
                pStart = new Date();
            }

            if (pStart.getDay() != weekDay) {
                let duration = weekDay + 7 - pStart.getDay() % 7;
                pStart.setTime(pStart.getTime() + (duration * 24 * 60 * 60 * 1000));
            }
        }

        let duration = (noOfWeek - 1) * 7;
        pEnd.setTime(pStart.getTime() + (duration * 24 * 60 * 60 * 1000));

        pStart.setHours(fh, fm, 0, 0);
        pEnd.setHours(th, tm, 0, 0);

        let events = this.data.that.addedEvents;

        if (events.length > 0) {
            const pad = n => n < 10 ? '0' + n : n;

            let isSlotExist = events.some((item, index) => {
                let weekDayIndex = -1;
                let stTime = new Date(item.startTime);
                let fromTimeInner = pad(stTime.getHours()) + ":" + pad(stTime.getMinutes());
                //let ogDate = this.data.selectedDate.originDate;
                //if (typeof ogDate == "object") {
                //    ogDate = this.data.selectedDate.originDate.originDate;
                //}
                let ogDate;
                let stDates;
                stDates = item.startTime.split('T')[0];
                if (type == 'edit') {
                    ogDate = this.data.selectedDate.recurStart.toISOString();
                    ogDate = ogDate.split('T')[0];
                }
                if (type == 'edit' &&
                    stDates == ogDate
                    && fromTimeInner==oldFromTime
                    && item.dayOfWeek==weekDay
                    ){
                        weekDayIndex = index;
                    this.weekDayIndexes[weekDay] = index;
                }
                
                if (index != weekDayIndex) {
                    if (item.dayOfWeek == weekDay && item.slotType == 0 && this.checkInPattern(item, pStart, pEnd, fromTime, toTime) && !this.dataRec.isDelete) {
                        debugger;
                        console.log("In Week Here",item.startTime);
                        return true;
                    } else if ((new Date(item.startTime).getDay() == weekDay) && this.checkInPattern(item, pStart, pEnd, fromTime, toTime)) {
                        this.excludedDatesInPattern.push(item.startTime.split("T")[0])
                    }
                }

            }); 
            if (isSlotExist) {
                this.isOverlapSlot = this.isOverlapSlot + 1
                this.toastr.error('Time Slot Already Exist Or Overlapping');
                this.isSubmit = false;
                return;
            }
        }
    }

    checkInPattern(item, pStart, pEnd, fromTime, toTime) {
        let x1, x2, y1, y2, end, eTime;
        let stDate = item.startTime.split("T")[0];
        if (stDate == '2020-12-24') {
            debugger;
        }
        let start = new Date(item.startTime);
        console.log("Start gg",start);

        if (item.dayOfWeek == -1) {
            let overlap = this.checkOverlapSingleEvent(fromTime, toTime,stDate);
            if(overlap=='overlap'){
                return true
            }else{
                return false;
            }
        } else {
            end = new Date(item.endTime);
            let duration = (item.noOfWeek - 1) * 7;
            end.setTime(start.getTime() + (duration * 24 * 60 * 60 * 1000));
            eTime = item.endTime.split('T')[1];
            let [eth, etm] = eTime.split(":");
            end.setHours(eth, etm, 0, 0);
            console.log("Pstart",pStart);
            console.log("Pend",pEnd);
            console.log("start",start);
            console.log("end",end);
            if (pStart.getTime() < end.getTime() && pEnd.getTime() > start.getTime()) {
                x1 = new Date(stDate + 'T' + fromTime).getTime();
                x2 = new Date(stDate + 'T' + toTime).getTime();
                y1 = new Date(item.startTime).getTime();
                y2 = new Date(stDate + 'T' + eTime).getTime();
                if (x1 < y2 && x2 > y1) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }


    }
    modifyTimeSlot() { 
        let msg;
        if (this.data.selectedDate.type == 'weekEvent') {
            let noOfWeek = parseInt(this.data.selectedDate.noOfWeek);
            if (this.typeTimeSlot == 2) {
                this.data.selectedDate.repeatedDays.some(r => {
                    this.checkOverlapRecurEvent(this.dataRec.fromTime, this.dataRec.toTime, r, 'edit', noOfWeek);
                    if (this.isOverlapSlot > 0 && !this.dataRec.isDelete) {
                        return; //Means slot overlaps
                    }

                    this.dataRec.excludedDatesInPattern = this.excludedDatesInPattern

                    this.dataRec.noOfWeek = noOfWeek;
                    this.dataRec.selectedWeekIndex = r;
                    this.dataRec.addedIndex = this.weekDayIndexes[r];
                    this.dataRec.repeatedDays = this.data.selectedDate.repeatedDays;
                    msg = 'Time slot' + (this.dataRec.isDelete ? ' deleted.' : ' updated.')
                    this.onSubmit.emit(this.dataRec);
                })
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
                msg = 'Time slot' + (this.dataRec.isDelete ? ' deleted.' : ' updated.')
                this.onSubmit.emit(this.dataRec);
            }
        } else {
            this.onSubmit.emit(this.dataRec);

        }
        
        if (this.isOverlapSlot == 0) {
            this.toastr.success(msg);
        }
        this.closeDialog();
    }
    closeDialog() {
        this.dialogRef.close(true);
    }

    initializeWeekIndexes()
    {
        this.weekDayIndexes = {
            0: -1,
            1: -1,
            2: -1,
            3: -1,
            4: -1,
            5: -1,
            6: -1
        }
    }

    checkRepeated() {
        let checked = false;
        let arr = this.weekdayChkbox.toArray();
        arr.map(a => {
            if (a.nativeElement.checked) {
                checked = true;
            }
        })
        this.isRepeat.nativeElement.checked = checked;
    }
}
