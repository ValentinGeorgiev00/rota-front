import { Component, OnInit } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormControl,
	FormGroup,
	ValidatorFn,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { take } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { RegisterRequest } from 'src/app/models/register-request';
import { getErrMsg } from '../utils/error-messages';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

	form!: FormGroup;
	driverLicense!: string | ArrayBuffer | null;
	fileName!: string | null;
	fileInputError: string | null = null;
	getErrMsg: Function = getErrMsg;

	constructor(
		private formBuilder: FormBuilder,
		private router: Router,
		private authService: AuthenticationService,
		private notificationService: NotificationService
	) { }

	ngOnInit(): void {
		this.buildForm();
	}

	get nameFormControl(): FormControl {
		return this.form.get('name') as FormControl;
	}

	get emailFormControl(): FormControl {
		return this.form.get('email') as FormControl;
	}

	get passwordFormControl(): FormControl {
		return this.form.get('password') as FormControl;
	}

	get rePasswordFormControl(): FormControl {
		return this.form.get('rePassword') as FormControl;
	}

	submit(): void {
		if (this.form.invalid || typeof this.fileInputError === 'string') {
			this.form.markAllAsTouched();

			return;
		}

		const data: RegisterRequest = {
			name: this.form.value.name,
			email: this.form.value.email,
			password: this.form.value.password,
			driverLicence: typeof this.driverLicense === 'string' ? this.driverLicense : null
		};

		this.authService
			.register$(data)
			.pipe(take(1))
			.subscribe({
				next: () => {
					this.router.navigate(['auth', 'login']);
					this.notificationService.message(
						'Successful registration.'
					);
				},
				error: (err: Error) => {
					this.notificationService.message(err.message);
				},
			});
	}


	selectImg(event: Event): void {
		const input = event.target as HTMLInputElement;
		const files: FileList | null = input.files;

		if (files) {
			const file: File = files[0];

			if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
				this.fileInputError = "Image should be in format - 'jpg' or 'png'.";

				return;
			}

			if (file.size > Math.pow(1024, 2)) {
				this.fileInputError = 'Image should not exceed 1Mb size.';

				return;
			}

			this.fileInputError = null;

			const reader = new FileReader();

			reader.onload = (event: ProgressEvent<FileReader>): void => {
				if (event.target) {
					this.driverLicense = event.target.result !== '' && event.target.result !== null ? event.target.result : null;
					this.fileName = file.name.length > 28 ? file.name.slice(0, 16) + '...' + file.name.slice(-9) : file.name;
				}
			};

			reader.readAsDataURL(file);
		}

	}

	clearImg(element: HTMLInputElement): void {
		element.value = '';
		this.fileInputError = null;
		this.fileName = null;
	}

	getRePasswordErrMsg(control: FormControl, field: string): string | null {
		if (control.hasError('required')) {
			return `${field} is required.`;
		}
		if (control.hasError('notMatch')) {
			return 'Passwords do not match.';
		}

		return null;
	}

	matchPasswords(
		password: string = 'password',
		passwordConfirm: string = 'rePassword'
	): ValidatorFn {
		return (formGroup: AbstractControl): { [key: string]: boolean; } | null => {
			const control = formGroup.value[password];
			const confirmControl = formGroup.value[passwordConfirm];
			const errors = formGroup.get(passwordConfirm)?.errors
				? formGroup.get(passwordConfirm)?.errors
				: {};

			if (control !== confirmControl) {
				if (confirmControl === '') {
					errors!['required'] = null;
				}
				errors!['notMatch'] = true;

				formGroup.get(passwordConfirm)?.setErrors(errors!, {
					emitEvent: true,
				});

				return { notMatch: true };
			}

			if (confirmControl !== '') {
				formGroup.get(passwordConfirm)?.setErrors(null, {
					emitEvent: true,
				});
			}

			if (
				formGroup.get(passwordConfirm)?.touched &&
				formGroup.get(password)?.touched &&
				confirmControl === '' &&
				control === ''
			) {
				errors!['notMatch'] = null;
				errors!['required'] = true;
			}

			return null;
		};
	}

	private buildForm(): void {
		this.form = this.formBuilder.group({
			name: [
				'',
				[
					Validators.required,
					Validators.minLength(2),
					Validators.maxLength(256)
				],
			],
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
			rePassword: ['',
				[
					Validators.required,
					Validators.minLength(8),
					Validators.maxLength(64),
					Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,64}$')
				]
			]
		},
			{
				validators: [this.matchPasswords()]
			}
		);

	}

}
