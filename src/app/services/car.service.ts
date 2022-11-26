import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable  } from 'rxjs';
import { environment } from '../../environments/environment';
import { Car } from '../models/car.model';

@Injectable({
	providedIn: 'root',
})
export class CarService {

	readonly url: string = environment.baseUrl;

	constructor(private http: HttpClient) { }

	getAll$(): Observable<Car[]> {
		return this.http.get<Car[]>(`${this.url}/cars/`);
	}

	create$(data: Car): Observable<void> {
		return this.http.post<void>(`${this.url}/cars/`, data);
	}
}
