import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { switchMap, map, Observable, startWith, take, tap } from 'rxjs';
import { Car } from 'src/app/models/car.model';
import { CarService } from 'src/app/services/car.service';
import { LocalStorageService } from 'src/app/services/local.service';

@Component({
	selector: 'app-car-list',
	templateUrl: './car-list.component.html',
	styleUrls: ['./car-list.component.scss']
})
export class CarListComponent implements OnInit {

	@ViewChild(MatAutocompleteTrigger) autocomplete!: MatAutocompleteTrigger;

	form!: FormGroup;
	filteredOptions!: Observable<string[]>;
	cars!: Car[];
	filteredCars!: Car[];
	options!: string[];

	constructor(
		private formBuilder: FormBuilder,
		private carService: CarService,
        private localStorageService: LocalStorageService
	) { }

	get userRole(): string | null {
		return this.localStorageService.getUserRole();
	}

	get modelFormControl(): FormControl {
		return this.form.get('model') as FormControl;
	}

	ngOnInit(): void {
		this.buildForm();
		this.getAllCars();
	}

	submit(): void {
		if (this.modelFormControl.value) {
			const inputValue = this.modelFormControl.value.toLowerCase();
			this.filteredCars = this.cars.filter(c => c.model.toLowerCase().includes(inputValue));
			this.autocomplete.closePanel();

			return;
		}
		this.getAllCars();
		this.autocomplete.closePanel();
	}

	private getAllCars(): void {
		this.carService
			.getAll$()
			.pipe(
				tap((response: Car[]) => {
					this.filteredCars = response;
					this.cars = response;
					this.options = [... new Set(response.map(c => c.model))].sort();
				}),
				switchMap(() => {
					return this.filterAutocompleteOptions$();
				}),
				take(1)
			)
			.subscribe();

	}

	private filterAutocompleteOptions$(): Observable<string[]> {
		return this.filteredOptions = this.modelFormControl.valueChanges.pipe(
			startWith(''),
			map(value => this.filterOptions(value || '')),
		);
	}

	private filterOptions(value: string): string[] {
		const filterValue = value.toLowerCase();

		return this.options.filter(option => option.toLowerCase().includes(filterValue));
	}

	private buildForm(): void {
		this.form = this.formBuilder.group({
			model: [
				'',
			],
		});
	}

}
