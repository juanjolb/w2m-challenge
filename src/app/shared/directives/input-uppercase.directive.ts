import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[transformUpperCase]',
  standalone: true,
})
export class InputUppercaseDirective {
  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
  }
}
