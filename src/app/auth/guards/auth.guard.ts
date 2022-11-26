import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local.service';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanLoad {
	constructor(
		private router: Router,
		private localService: LocalStorageService
	) { }

	canLoad(): boolean {
		const token = this.localService.getAccessToken();
		if (token) {
			return true;
		} else {
			this.router.navigate(['auth', 'login']);

			return false;
		}
	}
}
