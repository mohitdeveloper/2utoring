import { Component, OnInit } from '@angular/core';
import { UserDetail } from '../../../models/index';
import { UsersService } from '../../../services/index';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TickModal } from '../../../partials/tick-modal/tick-modal';

declare var title: any;

@Component({
    selector: 'app-user-student-settings',
    templateUrl: './user-student-settings.component.html'
})

export class UserStudentSettingsComponent implements OnInit {
    constructor(private usersService: UsersService, private formBuilder: FormBuilder,
        private modalService: NgbModal) { }

    title: string = title;
    user: UserDetail = null;

    userForm: FormGroup;
    userFormSubmitted: boolean;
    get userFormControls() { return this.userForm.controls; };

    getUser(): void {
        this.usersService.getMy()
            .subscribe(success => {
                this.user = success;
                this.setupUserForm(this.user);
            }, error => {
                console.log(error);
            });
    };

    setupUserForm(user: UserDetail): void {
        this.userForm = this.formBuilder.group({
            firstName: [user.firstName, [Validators.required, Validators.maxLength(250)]],
            lastName: [user.lastName, [Validators.required, Validators.maxLength(250)]],
            dateOfBirth: [{ value: user.dateOfBirth, disabled: true }],
            telephoneNumber: [user.telephoneNumber, [Validators.required, Validators.maxLength(250), Validators.pattern('^[0-9]+$')]],
            email: [{ value: user.email, disabled: true }],
            mobileNumber: [user.mobileNumber, [Validators.maxLength(250), Validators.pattern('^[0-9]+$')]],
            marketingAccepted: [user.marketingAccepted, []],

            dateOfBirthDay: [{ value: new Date(user.dateOfBirth).getDate(), disabled: true }],
            dateOfBirthMonth: [{ value: new Date(user.dateOfBirth).getMonth() + 1, disabled: true }],
            dateOfBirthYear: [{ value: new Date(user.dateOfBirth).getFullYear(), disabled: true }],
        });
    };

    submitUserForm(): void {
        this.userFormSubmitted = true;
        if (this.userForm.valid) {
            this.usersService.updateStudentSettings(this.userForm.value)
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

    ngOnInit() {
        this.getUser();
    };

    back() {
        window.location.href = '/my/timetable';
    };
}
