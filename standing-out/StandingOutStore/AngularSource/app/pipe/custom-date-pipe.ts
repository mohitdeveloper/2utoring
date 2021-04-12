import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'customdatetime'
})
export class CustomDatePipe implements PipeTransform {

    transform(date: string, type: string): any {
        if (type == 'date') {
            return this.extractDate(date);
        }
        else {
            return this.extractTime(date);
        }
    }
    extractDate(dt) {
        return new DatePipe('en-US').transform(new Date(dt), "EEE d MMM y");
    }
    extractTime(tm) {
        let [hh, mm] = (tm.split('-')[0]).split(':');
        hh = parseInt(hh);
        mm = parseInt(mm);
        let dt = new Date();
        dt.setHours(hh, mm);
        return new DatePipe('en-US').transform(dt, "h:mm a");
    }
}