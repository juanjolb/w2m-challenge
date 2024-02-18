import { Component } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-spinner-overlay',
  standalone: true,
  imports: [MatProgressSpinner],
  template: `
    <div class="spinner-overlay">
      <mat-progress-spinner
        class="spinner"
        [diameter]="100"
        [mode]="'indeterminate'"
      ></mat-progress-spinner>
    </div>
  `,
  styles: `
  .spinner-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
  }
  .spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  `,
})
export class SpinnerOverlayComponent {}
