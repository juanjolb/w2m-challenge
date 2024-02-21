import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Hero } from '../models/Hero';
import { MatListModule } from '@angular/material/list';
import { DeleteDialogComponent } from './delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-card',
  standalone: true,
  imports: [MatCardModule, MatListModule, MatButtonModule, RouterLink],
  template: `
    <mat-card>
      <mat-card-header>
        <div mat-card-avatar></div>
        <mat-card-title>{{ hero.name }}</mat-card-title>
        <mat-card-subtitle>{{ hero.biography.publisher }}</mat-card-subtitle>
      </mat-card-header>
      <img mat-card-image [src]="hero.images.md" [alt]="hero.name + ' image'" />
      <mat-card-content>
        <mat-list>
          <mat-list-item
            ><strong>Aliases: </strong
            >{{ hero.biography.aliases }}</mat-list-item
          >
          <mat-list-item
            ><strong>Place of birth: </strong
            >{{ hero.biography.placeOfBirth }}</mat-list-item
          >
          <mat-list-item
            ><strong>Power: </strong>{{ hero.powerstats.power }}</mat-list-item
          >
        </mat-list>
      </mat-card-content>
      <mat-card-actions>
        <button
          mat-stroked-button
          appereance="outline"
          [routerLink]="['/heroes/edit', hero.id]"
        >
          Edit
        </button>
        <button
          mat-stroked-button
          appereance="outline"
          color="warn"
          (click)="openDeleteDialog()"
        >
          Delete
        </button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: `
    mat-card {
      background: #f5f5f5;
    }
    mat-card-actions {
      display: flex;
      justify-content: space-between;
    }
  `,
})
export class HeroCardComponent {
  @Input({ required: true }) hero!: Hero;
  @Output() onDeleteHero: EventEmitter<number> = new EventEmitter<number>();
  private dialog = inject(MatDialog);

  openDeleteDialog() {
    this.dialog
      .open(DeleteDialogComponent, {
        data: this.hero,
      })
      .afterClosed()
      .subscribe((hero) => {
        if (!hero) return;
        // Remove the hero from the list
        this.onDeleteHero.emit(hero.id);
      });
  }
}
