import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

	constructor(
		private router: Router,
		private localStorageService: LocalStorageService
	) {
	}

	get accessToken(): string | null {
		return this.localStorageService.getAccessToken();
	}

	onLogout(): void {
		this.localStorageService.removeAccessToken();
		this.router.navigate(['/auth','login']);
	}
}
