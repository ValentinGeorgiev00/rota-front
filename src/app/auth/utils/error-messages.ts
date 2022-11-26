import { FormControl } from "@angular/forms";

export const getErrMsg = (control: FormControl, field: string): string | null => {
		if(control.hasError('required')){
			return `${field} is required.`
		}
		if(control.hasError('minlength')){
			return `${field} should be at least ${control.errors?.['minlength'].requiredLength} characters long.`
		}
		if(control.hasError('maxlength')){
			return `${field} should not exceed ${control.errors?.['maxlength'].requiredLength} characters.`
		}
		if(control.hasError('pattern') && field === 'Email'){
			return `${field} is invalid.`
		}
		if(control.hasError('pattern') && field === 'Password'){
			return `${field} should contain at least 1 lowercase, uppercase and digit.`
		}

		return null;
	}
