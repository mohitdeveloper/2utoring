import { Component, OnInit } from '@angular/core';

declare var tutorId: any;
declare var type: any;

@Component({
  selector: 'app-tutor-profile-wrapper',
  templateUrl: './tutor-profile-wrapper.component.html',
  styleUrls: ['./tutor-profile-wrapper.component.css']
})
export class TutorProfileWrapperComponent implements OnInit {

    tutorId: string = tutorId;
    type: string = type;

    constructor() {
        debugger;
        console.log(this.tutorId);

    }

  ngOnInit(): void {
  }

}
