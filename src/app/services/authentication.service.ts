import { Injectable } from '@angular/core';
import {
	HttpClient,
	HttpErrorResponse,
	HttpHeaders,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginResponse } from '../models/login-response.model';
import { CLIENT_ID_SECRET } from '../constants/constants';
import { Buffer } from 'buffer';
import { RegisterRequest } from '../models/register-request';

@Injectable({
	providedIn: 'root',
})
export class AuthenticationService {
	readonly url: string = environment.baseUrl;
	private headers = new HttpHeaders().append(
		'Authorization',
		`Basic ${Buffer.from(CLIENT_ID_SECRET).toString('base64')}`
	);

	constructor(private http: HttpClient) { }

	login$(
		email: string,
		password: string,
		grant_type: string
	): Observable<LoginResponse> {
		const formdata: FormData = new FormData();
		formdata.append('grant_type', grant_type);
		formdata.append('password', password);
		formdata.append('username', email);

		return this.http
			.post<LoginResponse>(`${this.url}/oauth/token`, formdata, {
				headers: this.headers
			})
			.pipe(
				catchError((error: HttpErrorResponse) => {
					if (error.status === 400) {
						return throwError(() => new Error('Invalid email or password.'));
					}

					return throwError(() => new Error('Something went wrong.'));
				})
			);
	}

	register$(data: RegisterRequest): Observable<void> {
		return this.http.post<any>(`${this.url}/users/`, data)
			.pipe(
				catchError((error: HttpErrorResponse) => {
					if (error.status === 409) {
						return throwError(() => new Error('This email is already in use.'));
					}

					if (error.status === 400) {
						return throwError(() => new Error('Name, password or image is invalid.'));
					}

					return throwError(() => new Error('Something went wrong.'));
				})
			);
	}

}
