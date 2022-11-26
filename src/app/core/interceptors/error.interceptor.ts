import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { LocalStorageService } from 'src/app/services/local.service';
import { NotificationService } from 'src/app/services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

	constructor(
		private router: Router,
		private localStorageService: LocalStorageService,
		private notificationService: NotificationService
	) { }

	intercept(req: HttpRequest<any>, next: HttpHandler) {

		return next.handle(req).pipe(
			catchError((response: HttpErrorResponse) => {
				if (response.status === 401)  {
					this.localStorageService.removeAccessToken();
					this.router.navigate(['auth', 'login']);
					this.notificationService.message(
						'You are unauthorized.'
					);
				}

				throw response;
			})
		);
	}

}
