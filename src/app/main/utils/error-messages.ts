import { FormControl } from "@angular/forms";

export const getErrMsg = (control: FormControl, field: string): string | null => {
	if (control.hasError('required')) {
		return `${field} is required.`;
	}
	if (control.hasError('minlength')) {
		return `${field} should be at least ${control.errors?.['minlength'].requiredLength} characters long.`;
	}
	if (control.hasError('maxlength')) {
		return `${field} should not exceed ${control.errors?.['maxlength'].requiredLength} characters.`;
	}
	if (control.hasError('pattern')) {
		if (field === 'Price per day') {
			return `${field} is invalid, should be positive decimal number.`;
		}

		if (field === 'Make') {
			return `${field} should consist only latin characters.`
		}
		if (field === 'Model') {
			return `${field} should consist only uppercase latin characters and digits.`
		}

		return `${field} is invalid`;
	}
	if (control.hasError('numberTooBig')) {
		return `${field} should not exceed 12.`;
	}
	if (control.hasError('numberTooSmall')) {
		return `${field} should not be less than 0.`;
	}
	if (control.hasError('invalidNumber')) {
		return `${field} is invalid, should be a number between 0 and 12.`;
	}
	if (control.hasError('invalidPlate')) {
		return `${field} is invalid, should be standart Bulgarian vehicle plate number.`;
	}

	return null;
};
