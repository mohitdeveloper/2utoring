import { Component, OnInit, ViewChild, Inject, EventEmitter, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'dialog-content-example-dialog',
    templateUrl: 'dialog-content-example.html',
})
export class DialogContentExampleDialog {
    @Output() onSubmit = new EventEmitter<any>();
    @Output() onDelete = new EventEmitter<any>();
    submitBtnText: any = 'Save';
    
    selectedWeekDay: any;
    slotIndex: any;
    fromTime = { hour: 13, minute: 30 };
    toTime = {hour:13,minute:45}
    showAlert: boolean = false;
    alert: any;
    oldFromTime: any;
    oldToTime: any;
    selectedDate: any;
    selectedWeekIndex: any;
    isDeleteVisible: boolean = false;
    events: any;
    weekDayLabel:any;
    isSubmit:boolean  = false;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
        this.selectedWeekDay = data.selectedWeekDay?data.selectedWeekDay:data.selectedDate.date;
        this.weekDayLabel = data.selectedWeekDay?"WeekDay":"Date";
        this.selectedDate = data.selectedDate;
        this.selectedWeekIndex= data.selectedWeekIndex;
        this.events = data.selectedWeekDay?data.events:Object.values(data.events);
        if (data.fromTime) {
            let [fromHour, fromMinute] = data.fromTime.split(":");
            let [toHour, toMinute] = data.toTime.split(":");
            this.fromTime = { hour: parseInt(fromHour), minute: parseInt(fromMinute) };
            this.toTime = { hour: parseInt(toHour), minute: parseInt(toMinute) }
            this.oldFromTime = data.fromTime;
            this.oldToTime = data.toTime;
            this.isDeleteVisible = true;
            this.slotIndex = data.slotIndex;
            this.submitBtnText = "Update";
        } else {
            this.submitBtnText = "Save"
            this.oldFromTime = "";
            this.oldToTime = "";
            this.isDeleteVisible = false;
            this.slotIndex = -1;


        }
    }
    submit(isDelete = false) {
        
        this.isSubmit = true;
        this.showAlert = true;
        if (this.fromTime.hour > this.toTime.hour || (this.fromTime.hour == this.toTime.hour && this.fromTime.minute > this.toTime.minute)) {
            this.alert = {
                type: 'danger',
                message: 'To Time must be greater than from time'
            }
            this.isSubmit = false;
            return;
        } else {
            this.alert= {
                type: 'success',
                message: isDelete?'Time Slot Removed':(!this.oldFromTime?'Time slot added':'Time Slot Update')
            }
        }
            
        
        let fromTime = (this.fromTime.hour < 10 ? '0' : '') + this.fromTime.hour + ":" + (this.fromTime.minute < 10 ? '0' : '') + this.fromTime.minute;
        let toTime = (this.toTime.hour < 10 ? '0' : '') + this.toTime.hour + ":" + (this.toTime.minute < 10 ? '0' : '') + this.toTime.minute;

        let x1:any = new Date(null, null, null, this.fromTime.hour, this.fromTime.minute);
        let x2:any = new Date(null, null, null, this.toTime.hour, this.toTime.minute);

        let diff = x2.getTime()-x1.getTime();
        diff = diff/1000;
        let minutesDiff = Math.floor(diff/60)

        if(minutesDiff>60){
            this.alert = {
                type: 'danger',
                message: 'Time slot must be less than or equal to 60 minutes'
            }
            this.isSubmit = false;
            this.showAlert = true;
            return;
        }
        if (this.events && !isDelete) {
            let exIndex=-1;
            //let evts:any;
            /*if(this.slotIndex==-1){
                evts = Object.values(this.events);
                exIndex = evts.findIndex(r=>r.from_time==this.oldFromTime && r.to_time==this.oldToTime)
            }else{
                exIndex = this.slotIndex;
                evts = this.events;
            }*/
            exIndex = this.events.findIndex(r=>r.from_time==this.oldFromTime && r.to_time==this.oldToTime)

            if (this.events.length > 0) {
                let isSlotExist = this.events.some((item, index) => {
                    let [fth, ftm] = item.from_time.split(":");
                    let [tth, ttm] = item.to_time.split(":");
                    fth = parseInt(fth);
                    ftm = parseInt(ftm);
                    tth = parseInt(tth);
                    ttm = parseInt(ttm);

                    let y1 = new Date(null, null, null,fth,ftm);
                    let y2 = new Date(null, null, null,tth,ttm);
                    if (x1 < y2 && x2 > y1 && (index !=exIndex )) {
                        return true;
                    }

                   


                });
                if (isSlotExist) {
                    this.showAlert = true;
                    this.alert = {
                        type: 'danger',
                        message: 'Time Slot Already Exist Or Overlapping'
                    }
                    this.isSubmit = false;
                    return;
                }
            }
         
        }

        
        if(this.weekDayLabel=="Date"){
            this.events.push({
                from_time: fromTime,
                to_time: toTime
            })
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
            slotIndex: this.slotIndex
        };
        this.onSubmit.emit(dataRec);
        if(this.oldFromTime){
            this.oldFromTime = fromTime;
            this.oldToTime = toTime;
        }
        
        
        
 
    }

    
}
