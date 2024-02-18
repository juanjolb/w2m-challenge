import { Component, Inject, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Hero } from '../models/Hero';
import { HeroesService } from '../services/heroes.service';
import { AlertService } from '../services/alert-service.service';

@Component({
  selector: 'app-delete-dialog',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>Delete heroe</h2>
    <mat-dialog-content>
      <p>Are you sure you want to delete this hereo?</p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Cancel</button>
      <button
        mat-button
        mat-dialog-close
        cdkFocusInitial
        color="warn"
        (click)="deleteHero()"
      >
        Delete
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    mat-dialog-actions {
      display: flex;
      justify-content: flex-end;
    }
  `,
})
export class DeleteDialogComponent {
  heroesService = inject(HeroesService);
  alertService = inject(AlertService);

  constructor(
    @Inject(MAT_DIALOG_DATA) public hero: Hero,
    public dialog: MatDialogRef<DeleteDialogComponent>
  ) {}

  deleteHero() {
    this.heroesService.deleteHeroById(this.hero.id).subscribe({
      next: () => {
        this.alertService.alertSuccess('Hero deleted successfully');
        this.dialog.close(this.hero);
      },
      error: () => this.alertService.alertError('Error deleting hero'),
    });
  }
}
