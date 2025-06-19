import { Directive, Input, HostListener, ElementRef, Renderer2 } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Directive({
  selector: '[appDisableOnSubmit]'
})
export class DisableOnSubmitDirective {

  @Input('appDisableOnSubmit') asyncOperation?: Observable<any>;

  private subscription?: Subscription;

  constructor(private el: ElementRef<HTMLFormElement>, private renderer: Renderer2) {}

  @HostListener('ngSubmit', ['$event'])
  onSubmit(event: Event): void {
    const submitButton = this.el.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement;

    if (!submitButton) return;

    this.setDisabled(submitButton, true);

    if (this.asyncOperation) {
      this.subscription = this.asyncOperation.subscribe({
        next: () => {},
        error: () => this.setDisabled(submitButton, false),
        complete: () => this.setDisabled(submitButton, false),
      });
    } else {
      setTimeout(() => this.setDisabled(submitButton, false), 2000);
    }
  }


  private setDisabled(button: HTMLButtonElement, value: boolean) {
    this.renderer.setProperty(button, 'disabled', value);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
