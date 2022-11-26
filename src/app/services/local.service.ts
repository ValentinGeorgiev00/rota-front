import { Injectable } from '@angular/core';
import { ACCESS_TOKEN } from '../constants/constants';
import { Buffer } from 'buffer';

@Injectable({
	providedIn: 'root'
})
export class LocalStorageService {
	setAccessToken(token: string): void {
		localStorage.setItem(ACCESS_TOKEN, token);
	}

	removeAccessToken(): void {
		localStorage.removeItem(ACCESS_TOKEN);
	}

	getAccessToken(): string | null {
		const accessToken = localStorage.getItem(ACCESS_TOKEN);
		if (accessToken) {
			return accessToken;
		} else {
			return null;
		}
	}

	getUserRole(): string | null {
		const payload = this.getPayloadFromAccessToken();
		if (payload) {
			return JSON.parse(Buffer.from(payload, 'base64').toString('ascii')).authorities[0];
		}

		return null;
	}

	private getPayloadFromAccessToken(): string | undefined {
		return this.getAccessToken()?.split('.')[1];
	}
}
