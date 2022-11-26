import { Component, OnInit } from '@angular/core';
import {
	AbstractControl,
	FormBuilder,
	FormControl,
	FormGroup,
	ValidationErrors,
	ValidatorFn,
	Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { NotificationService } from '../../../services/notification.service';
import { MatDatepicker } from '@angular/material/datepicker';
import { getErrMsg } from '../../utils/error-messages';
import { CarService } from '../../../services/car.service';
import { type } from 'os';

@Component({
	selector: 'app-car-create',
	templateUrl: './car-create.component.html',
	styleUrls: ['./car-create.component.scss'],
})

export class CarCreateComponent implements OnInit {

	minDate: Date = new Date(1886, 0);
	maxDate: Date = new Date();

	types = ['Passenger', 'Cargo', 'Electric'];
	fuelTypes = ['Gasoline', 'Diesel', 'LPG', 'Electric'];
	extras = ['AC', 'Navigation', 'Autopilot', 'Android auto', 'Apple carplay', 'Child Seat'];
	codesMap = {
		'1053': '72',
		'72': '72',
		'65': '65',
		'1040': '65',
		'66': '66',
		'1042': '66',
		'69': '69',
		'1045': '69',
		'75': '75',
		'79': '79',
		'1054': '79',
		'80': '80',
		'1056': '80',
		'67': '67',
		'1057': '67',
		'84': '84',
		'1058': '84',
		'89': '89',
		'1059': '89',
		'88': '88',
		'1061': '88',
		'77': '77',
		'1052': '77',
		'48': '48',
		'49': '49',
		'50': '50',
		'51': '51',
		'52': '52',
		'53': '53',
		'54': '54',
		'55': '55',
		'56': '56',
		'57': '57',
	};
	regDoubleOpts = [
		'BT',
		'BP',
		'EB',
		'TX',
		'KH',
		'OB',
		'PA',
		'PK',
		'EH',
		'PB',
		'PP',
		'CC',
		'CH',
		'CM',
		'CO',
		'CA',
		'CB',
		'CT',
	];
	regSingleOpts = [
		'E',
		'A',
		'B',
		'K',
		'M',
		'P',
		'C',
		'T',
		'X',
		'H',
		'Y'
	];
	posibleCodes = [32, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 97, 1072, 1040, 98, 66, 1074, 1042, 101, 69, 1077, 1045, 107, 75, 1082, 1050, 109, 77, 1084, 1052, 104, 72, 1085, 1053, 111, 79, 1086, 1054, 112, 80, 1088, 1056, 99, 67, 1089, 1057, 116, 84, 1090, 1058, 121, 89, 1091, 1059, 120, 88, 1093, 1117];
	form!: FormGroup;
	getErrMsg: Function = getErrMsg;
	priceInput!: number;

	constructor(
		private formBuilder: FormBuilder,
		private notificationService: NotificationService,
		private router: Router,
		private carService: CarService,
	) { }

	ngOnInit(): void {
		this.buildForm();
	}

	get registrationNumberFormControl(): FormControl {
		return this.form.get('registrationNumber') as FormControl;
	}

	get carTypeFormControl(): FormControl {
		return this.form.get('carType') as FormControl;
	}

	get modelFormControl(): FormControl {
		return this.form.get('model') as FormControl;
	}

	get makeFormControl(): FormControl {
		return this.form.get('make') as FormControl;
	}

	get yearFormControl(): FormControl {
		return this.form.get('year') as FormControl;
	}

	get pricePerDayFormControl(): FormControl {
		return this.form.get('pricePerDay') as FormControl;
	}

	get fuelTypeFormControl(): FormControl {
		return this.form.get('fuelType') as FormControl;
	}

	get numberOfSeatsFormControl(): FormControl {
		return this.form.get('numberOfSeats') as FormControl;
	}

	get extrasFormControl(): FormControl {
		return this.form.get('extras') as FormControl;
	}

	chosenYear(event: Date, datepicker: MatDatepicker<Date>, inputField: HTMLInputElement): void {
		const date = new Date(event);
		this.yearFormControl.setValue(date.getFullYear());
		inputField.value = date.getFullYear().toString();
		this.yearFormControl.setErrors(null);
		datepicker.close();
	}

	openPicker(datepicker: MatDatepicker<Date>): void {
		if (!this.yearFormControl.value) {
			this.yearFormControl.setErrors(null);
			datepicker.open();
		}
	}

	formatPriceInput(price: HTMLInputElement): void {
		const priceArray = price.value.split('.');

		if (priceArray.length === 1 && !priceArray[0]) {
			return;
		}

		let wholePart = priceArray[0];
		let decimalPart = priceArray[1];

		wholePart = wholePart.length > 1 && wholePart[0] === '0' ? wholePart.replace(/^0+/, '') : wholePart;
		wholePart = !wholePart ? '0' : wholePart;
		decimalPart = !decimalPart ? '00' : decimalPart;
		decimalPart = decimalPart.length === 1 ? `${decimalPart}0` : decimalPart;

		this.pricePerDayFormControl.setValue(`${wholePart}.${decimalPart}`);
	}

	preventKeys(event: KeyboardEvent): void | boolean {
		if (event.key === 'e' || event.key === '-' || event.key === '.') {
			return false;
		}
	}

	formatSeatsInput(seats: HTMLInputElement): void {
		if (seats.value.length > 1 && seats.value[0] === '0') {
			seats.value = seats.value.replace(/^0+/, '');
			seats.value = seats.value === '' ? '0' : seats.value;
		}
	}

	submit(): void {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
		} else {
			const data = {
				...this.form.value,
				numberOfSeats: +this.form.value.numberOfSeats,
				pricePerDay: +this.form.value.pricePerDay,
				registrationNumber: this.form.value.registrationNumber.replace(/\s/g, '')
			};
			this.carService
				.create$(data)
				.pipe(take(1))
				.subscribe({
					next: () => {
						this.router.navigate(['cars']);
						this.notificationService.message('Successfully created a car.');
					}
				});
		}
	}

	formatLicensePlate(registrationNumberInput: HTMLInputElement): void {
		this.registrationNumberFormControl.setValue(registrationNumberInput.value.toUpperCase());
		const charArray = this.registrationNumberFormControl.value
			.replace(/\s/g, '')
			.split('')
			.map((c: string) => {
				const code = c.charCodeAt(0).toString();
				if (Object.keys(this.codesMap).includes(code)) {
					return String.fromCharCode(+this.codesMap[code as keyof Object]);
				}
				return String.fromCharCode(+code);
			});
		this.registrationNumberFormControl.setValue(charArray.join(''));
	}

	private isLicensePlateValid(controlField: string): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const group = control as FormGroup;
			const licensePlateControl = group.controls[controlField];
			const firstChar = licensePlateControl.value.slice(0, 1);
			const secondChar = licensePlateControl.value.slice(1, 2);
			const regularPlateNums = licensePlateControl.value.slice(1, 5);
			const regularPlateNums2 = licensePlateControl.value.slice(2, 6);
			const lastChar = licensePlateControl.value.slice(licensePlateControl.value.length-1, licensePlateControl.value.length)

			for (let i = 0; i < licensePlateControl.value.length; i++) {
				if (!this.posibleCodes.includes(licensePlateControl.value[i].charCodeAt(0))) {
					licensePlateControl.setErrors({
						invalidPlate: true
					});

					return { invalidPlate: true };
				}
			}

			if (+firstChar) {
				licensePlateControl.setErrors({
					invalidPlate: true
				});

				return { invalidPlate: true };
			}

			if (+secondChar && licensePlateControl.value.length > 7) {
				licensePlateControl.setErrors({
					invalidPlate: true
				});

				return { invalidPlate: true };
			}

			if (typeof secondChar === 'string' && !this.regDoubleOpts.includes(firstChar + secondChar) && licensePlateControl.value.replace(/\s/g, '').length > 7) {
				licensePlateControl.setErrors({ invalidPlate: true });

				return { invalidPlate: true };
			}

			if (licensePlateControl.value.length === 6 && (!+regularPlateNums || !+regularPlateNums2) && !this.posibleCodes.includes(lastChar.charCodeAt(0))) {
				licensePlateControl.setErrors({ invalidPlate: true });

				return { invalidPlate: true };
			}

			return null;

		};
	}

	private isNumberValid(controlField: string, startLimit: number, endLimit: number): ValidatorFn {
		return (control: AbstractControl): ValidationErrors | null => {
			const group = control as FormGroup;
			const input = +group.get(controlField)?.value;
			const numberControl = group.controls[controlField];
			const startPoint = +startLimit;
			const endPoint = +endLimit;

			if (('' + input).includes('.') && !input) {
				numberControl.setErrors({
					invalidNumber: true
				});

				return { invalidNumber: true };
			}

			if (input > endPoint) {
				numberControl.setErrors({
					numberTooBig: true
				});

				return { numberTooBig: true };
			}

			if (input < startPoint) {
				numberControl.setErrors({
					numberTooSmall: true
				});

				return { numberTooSmall: true };
			}

			return null;
		};
	}

	private buildForm(): void {
		this.form = this.formBuilder.group({
			registrationNumber: [
				'',
				[
					Validators.required,
					Validators.minLength(6),
					Validators.maxLength(8),
				],
			],
			carType: ['',
				[
					Validators.required,
				]
			],
			make: [
				'',
				[
					Validators.required,
					Validators.minLength(2),
					Validators.maxLength(256),
					Validators.pattern('^([A-Za-z0-9]+\\s)+[A-Za-z0-9]+$|^[A-Za-z0-9]+$'),
				],
			],
			model: [
				'',
				[
					Validators.required,
					Validators.minLength(2),
					Validators.maxLength(256),
					Validators.pattern('^([A-Za-z0-9]+\\s)+[A-Za-z0-9]+$|^[A-Za-z0-9]+$'),
				],
			],
			year: [
				'',
				[
					Validators.required,
				],
			],
			pricePerDay: [
				'',
				[
					Validators.required,
					Validators.pattern('[0-9]+\\.?[0-9]{2}')

				],
			],
			fuelType: [
				'',
				[
					Validators.required,
				],
			],
			numberOfSeats: [
				'',
				[
					Validators.required,
					Validators.minLength(0),
					Validators.maxLength(12),
					Validators.pattern('^[0-9]*$')
				]
			],
			extras: [
				[],
			]
		}, {
			validators: [this.isNumberValid('numberOfSeats', 0, 12), this.isLicensePlateValid('registrationNumber')]
		});
	}
}
