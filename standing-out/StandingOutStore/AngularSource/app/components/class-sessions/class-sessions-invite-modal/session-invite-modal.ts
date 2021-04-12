import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SessionInvitesService } from '../../../services';

@Component({
    selector: 'app-session-invite-modal',
    templateUrl: './session-invite-modal.html'
})
export class SessionInviteModalComponent {
    constructor(private activeModal: NgbActiveModal, private sessionInvitesService: SessionInvitesService) { }

    classSessionId: string;
    bulkEmailString: string;

    submit(): void {
        if (this.bulkEmailString != undefined && this.bulkEmailString != '') {
            this.activeModal.close(this.bulkEmailString);
        }
    }

    closeModal(): void {
        this.activeModal.dismiss(null);
    }
}