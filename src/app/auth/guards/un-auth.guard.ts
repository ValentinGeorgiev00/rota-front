import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local.service';

@Injectable({
	providedIn: 'root'
})
export class UnAuthGuard implements CanActivate {
	constructor(
		private localStorageService: LocalStorageService,
		private router: Router
	) { }

	canActivate(): boolean {
		const token = this.localStorageService.getAccessToken();
		if (!token) {
			return true;
		} else {
			this.router.navigate(['/']);

			return false;
		}
	}
}
