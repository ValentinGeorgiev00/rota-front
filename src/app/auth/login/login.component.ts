import { Component, OnInit } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { take } from 'rxjs/operators';
import { NotificationService } from 'src/app/services/notification.service';
import { LocalStorageService } from 'src/app/services/local.service';
import { getErrMsg } from '../utils/error-messages';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})

export class LoginComponent implements OnInit {
	form!: FormGroup;
	getErrMsg: Function = getErrMsg;

	constructor(
		private formBuilder: FormBuilder,
		private notificationService: NotificationService,
		private router: Router,
		private authService: AuthenticationService,
		private localStorageService: LocalStorageService
	) { }

	ngOnInit(): void {
		this.buildForm();
	}

	get emailFormControl(): FormControl {
		return this.form.get('email') as FormControl;
	}

	get passwordFormControl(): FormControl {
		return this.form.get('password') as FormControl;
	}

	submit(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
		} else {
			this.authService
				.login$(
					this.form.value.email,
					this.form.value.password,
					this.form.value.grant_type
				)
				.pipe(take(1))
				.subscribe({
					next: (res) => {
						this.localStorageService.setAccessToken(
							res.access_token
						);
						this.router.navigate([''])
						this.notificationService.message(
							'The user has logged succesfully.'
						);
					},
					error: (err: Error) => {
						this.notificationService.message(err.message);
					},
				});
		}
	}


	private buildForm(): void {
		this.form = this.formBuilder.group({
			email: [
				'',
				[
					Validators.required,
					Validators.pattern('^[\\w\\-.]+@(?:[\\w\\-]+\\.)+[\\w\\-]{2,}$'),
					Validators.maxLength(100),
					Validators.minLength(6)
				],
			],
			password: ['',
				[
					Validators.required,
					Validators.minLength(8),
					Validators.maxLength(64),
					Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,64}$')
				]
			],
			grant_type: ['password']
		});
	}
}
