import { Component, Input } from '@angular/core';
import { TutorCard } from '../../models/index';

@Component({
    selector: 'app-tutor-card',
    templateUrl: './tutor-card.component.html'
})

export class TutorCardComponent {
    constructor() { }

    @Input() tutor: TutorCard;


    getSubjectString(): string {
        if (this.tutor.subjects.length > 1) {
            return this.tutor.subjects.slice(0, this.tutor.subjects.length - 1).join(', ') + " & " + this.tutor.subjects[this.tutor.subjects.length - 1];
        }
        else if (this.tutor.subjects.length == 1) {
            return this.tutor.subjects[0];
        }
        else {
            return '';
        }
    };
}
