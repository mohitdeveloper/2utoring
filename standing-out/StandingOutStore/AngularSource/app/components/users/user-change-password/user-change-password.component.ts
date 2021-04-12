import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../../services/index';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from "ngx-toastr";

@Component({
    selector: 'app-user-change-password',
    templateUrl: './user-change-password.component.html',
    styleUrls: ['./user-change-password.component.css']
})
export class UserChangePasswordComponent implements OnInit {

    constructor(private usersService: UsersService, private formBuilder: FormBuilder, private toastr: ToastrService) { }

    passwordForm: FormGroup;
    passwordFormSubmitted: boolean;
    get passwordFormControls() { return this.passwordForm.controls; };

    ngOnInit(): void {
        this.setupPasswordForm();
    }

    setupPasswordForm(): void {
        this.passwordFormSubmitted = false;
        this.passwordForm = this.formBuilder.group({
            oldPassword: ['', [Validators.required, Validators.maxLength(250)]],
            password: ['', [Validators.required, Validators.maxLength(250), Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{9,})/)]],
            confirmPassword: ['', [Validators.required, Validators.maxLength(250), Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#\$%\^&\*])(?=.{9,})/)]],
        });
    };

    submitPasswordForm(): void {
        this.passwordFormSubmitted = true;
        if (this.passwordForm.value.password == this.passwordForm.value.confirmPassword && this.passwordForm.valid) {
            $('.loading').show();
            this.usersService.changePassword(this.passwordForm.value)
                .subscribe(success => {
                    if (success == true) {
                        this.toastr.success('Password change successfull', 'Success');
                        this.setupPasswordForm();
                        $('.loading').hide();
                    } else {
                        this.toastr.error('The old password entered was incorrect', 'Error');
                        $('.loading').hide();
                    }
                }, error => {
                    console.log(error);
                });
        }
    }

}
