import { Component, OnInit } from '@angular/core';

declare var tutorId: any;

@Component({
  selector: 'app-tutor-profile-public-wrapper',
    templateUrl: './tutor-profile-public-wrapper.component.html'
})
export class TutorProfilePublicWrapperComponent implements OnInit {

    tutorId: string = tutorId;

  constructor() { }

  ngOnInit(): void {
  }

}
