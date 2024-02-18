import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { HeroesService } from './services/heroes.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { delay } from 'rxjs';
import { SpinnerOverlayComponent } from './components/spinner-overlay.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatDividerModule,
    SpinnerOverlayComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'w2m-challenge';

  isLoadingSubject = inject(HeroesService).isLoading$;
  isLoading: boolean = false;

  ngOnInit() {
    this.isLoadingSubject
      .pipe(delay(0))
      .subscribe((isLoading) => (this.isLoading = isLoading));
  }
}
