import { SessionGroupsService } from "../../services";
import { OnInit, Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { SessionGroupDraggable } from "../../models";

@Component({
    selector: 'app-session-groups-modal',
    templateUrl: './session-groups-modal.component.html'
})
export class SessionGroupsModalComponent implements OnInit{    
    constructor(private activeModal: NgbActiveModal, private formBuilder: FormBuilder, private toastr: ToastrService,
        private sessionGroupsService: SessionGroupsService) { }

    classSessionId: string;
    group: SessionGroupDraggable;
    groupForm: FormGroup = this.formBuilder.group({});
    groupFormSubmitted: boolean = false;
    get groupFormControls() { return this.groupForm.controls; }

    ngOnInit(): void {
        this.setupForm()
    };

    setupForm(): void {
        this.groupForm = this.formBuilder.group({

            classSessionId: [this.group.classSessionId],
            sessionGroupId: [this.group.sessionGroupId],
            name: [this.group.name, [Validators.required, Validators.maxLength(250)]],
        });
    };

    save(group: SessionGroupDraggable): void {
        this.groupFormSubmitted = true;

        if (this.groupForm.valid) {
            $('.loading').show();
            this.group = group;

            if (this.group.sessionGroupId !== undefined && this.group.sessionGroupId != null && this.group.sessionGroupId != '') {
                this.sessionGroupsService.update(this.classSessionId, this.group.sessionGroupId, this.group).subscribe(success => {
                    this.group = success;
                    this.toastr.success('Save successful.', 'Success');

                    this.group.accordianCollapsed = false;
                    this.activeModal.close(this.group);
                }, err => {
                    this.toastr.error('Save Unsuccessful.', 'Error');
                    this.activeModal.close(null);
                    $('.loading').hide();
                });
            } else {
                this.sessionGroupsService.create(this.classSessionId, this.group).subscribe(success => {
                    this.group = success;
                    this.toastr.success('Save successful.', 'Success');

                    this.group.accordianCollapsed = false;
                    this.activeModal.close(this.group);
                }, err => {
                    this.toastr.error('Save Unsuccessful.', 'Error');
                    this.activeModal.close(null);
                    $('.loading').hide();
                });
            }
        }
    };

    closeModal() {
        this.activeModal.dismiss();
    };
}