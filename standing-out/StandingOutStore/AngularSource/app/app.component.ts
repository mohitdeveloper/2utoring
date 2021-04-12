import { Component, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Calendar } from '@fullcalendar/core'; // include this line
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})

export class AppComponent implements OnInit, AfterViewInit {

    calendarOptions = {
        plugins: [dayGridPlugin],
        initialView: 'dayGridMonth'
    };

    calendarName: string;

    constructor(private http: HttpClient) {
        this.mode = document.getElementById("app-angular").getAttribute("app-mode");
        //this.mode = 'tutor-register';
        this.calendarName = Calendar.name; // add this line in your constructor 
    }

    mode: string;

    ngOnInit() {
        //console.log(this.calendarName);
    }

    ngAfterViewInit() {
    }
}
