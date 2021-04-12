import { Component, OnInit } from '@angular/core';
import { UserGuardianDetail } from '../../../models/index';
import { UsersService } from '../../../services/index';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TickModal } from '../../../partials/tick-modal/tick-modal';

declare var title: any;

@Component({
    selector: 'app-user-guardian-settings',
    templateUrl: './user-guardian-settings.component.html'
})

export class UserGuardianSettingsComponent implements OnInit {
    constructor(private usersService: UsersService, private formBuilder: FormBuilder,
        private modalService: NgbModal) { }

    title: string = title;
    user: UserGuardianDetail = null;

    userForm: FormGroup;
    userFormSubmitted: boolean;
    get userFormControls() { return this.userForm.controls; };

    getUser(): void {
        this.usersService.getMyGuardian()
            .subscribe(success => {
                this.user = success;
                console.log(this.user);
                this.setupUserForm(this.user);
            }, error => {
                console.log(error);
            });
    };

    setupUserForm(user: UserGuardianDetail): void {
        this.userForm = this.formBuilder.group({
            firstName: [user.firstName, [Validators.required, Validators.maxLength(250)]],
            lastName: [user.lastName, [Validators.required, Validators.maxLength(250)]],
            telephoneNumber: [user.telephoneNumber, [Validators.required, Validators.maxLength(250), Validators.pattern('^[0-9]+$')]],
            email: [{ value: user.email, disabled: true }],
            mobileNumber: [user.mobileNumber, [Validators.maxLength(250), Validators.pattern('^[0-9]+$')]],
            marketingAccepted: [user.marketingAccepted, []],
            childFirstName: [user.childFirstName, [Validators.required, Validators.maxLength(250)]],
            childLastName: [user.childLastName, [Validators.required, Validators.maxLength(250)]],
            childDateOfBirth: [{ value: user.childDateOfBirth, disabled: true }],

            childDateOfBirthDay: [{ value: new Date(user.childDateOfBirth).getDate(), disabled: true }],
            childDateOfBirthMonth: [{ value: new Date(user.childDateOfBirth).getMonth() + 1, disabled: true }],
            childDateOfBirthYear: [{ value: new Date(user.childDateOfBirth).getFullYear(), disabled: true }],
        });
    };

    submitUserForm(): void {
        this.userFormSubmitted = true;
        if (this.userForm.valid) {
            this.usersService.updateGuardianSettings(this.userForm.value)
                .subscribe(success => {
                    this.user = success;
                    let navTo = '/my/timetable';
                    const modalRef = this.modalService.open(TickModal, { size: 'md' });

                    modalRef.componentInstance.title = 'Settings updated!';
                    modalRef.componentInstance.navTo = navTo;
                    modalRef.componentInstance.button = 'Back to timetable';

                    //handle the response
                    modalRef.result.then((result) => {
                    }, (reason) => {
                        window.location.href = navTo;
                    });
                }, error => {
                        console.log(error);
                });
        }
    };

    back(): void {
        window.location.href = '/my/timetable';
    };

    ngOnInit() {
        this.getUser();
    };
}
