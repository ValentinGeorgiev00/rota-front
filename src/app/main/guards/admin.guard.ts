import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local.service';
import { Observable } from 'rxjs';



@Injectable({
	providedIn: 'root'
})
export class AdminGuard implements CanActivate {
	constructor(
		private localStorageService: LocalStorageService
	) { }

	canActivate(): boolean {
		if (this.localStorageService.getUserRole() === 'ADMIN') {
			return true;
		}

		return false;
	}
}
