export interface RegisterRequest {
	name: string;
	email: string;
	password: string;
	driverLicence: string | null;
}
