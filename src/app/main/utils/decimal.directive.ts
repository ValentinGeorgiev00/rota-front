import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
	selector: '[twoDecimalNumber]'
})
export class TwoDecimalNumberDirective {

	private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
	private specialKeys: string[] = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete', 'F5'];

	constructor(private el: ElementRef) {
	}
	@HostListener('keydown', ['$event'])
	onKeyDown(event: KeyboardEvent) {
		if (this.specialKeys.indexOf(event.key) !== -1) {
			return;
		}

		let current: string = this.el.nativeElement.value;
		const position = this.el.nativeElement.selectionStart;
		const next: string = `${current.slice(0, position)}${event.key}${current.slice(position)}`;
		if (next && !String(next).match(this.regex)) {
			event.preventDefault();
		}

	}
}
