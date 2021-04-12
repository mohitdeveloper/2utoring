import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TutorsService } from '../../../services';

@Component({
    selector: 'app-tutor-invite-modal',
    templateUrl: './tutor-invite-modal.html'
})
export class TutorInviteModalComponent {
    constructor(private activeModal: NgbActiveModal, private tutorsService: TutorsService) { }

    bulkEmailString: string;

    submit(): void {
        debugger;
        if (this.bulkEmailString != undefined && this.bulkEmailString != '') {
            this.activeModal.close(this.bulkEmailString);
        }
    }

    closeModal(): void {
        this.activeModal.dismiss(null);
    }
}