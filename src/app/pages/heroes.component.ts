import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { HeroesService } from '../services/heroes.service';
import { Hero } from '../models/Hero';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { HeroCardComponent } from '../components/hero-card.component';
import { SearchBarComponent } from '../components/search-bar.component';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-heroes',
  standalone: true,
  template: `
    <div class="heroes-actions">
      <app-search-bar (search)="onSearchHeroe($event)"></app-search-bar>
      <button
        mat-raised-button
        color="primary"
        [routerLink]="['/heroes/create']"
      >
        Add Hero
      </button>
    </div>

    <div class="heroes-grid">
      @for (heroe of heroesList(); track heroe.id){
      <app-hero-card
        [hero]="heroe"
        (onDeleteHero)="deleteHero($event)"
      ></app-hero-card>
      }
    </div>

    <mat-paginator
      [pageSize]="pageSize()"
      [pageSizeOptions]="pageSizeOptions"
      [length]="totalSize()"
    >
    </mat-paginator>
  `,
  styles: `
    .heroes-actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
    .heroes-grid {
      display: grid; 
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem; 
    }
    .mat-mdc-paginator {
      background: #eee  !important;
    }
  `,
  imports: [
    MatPaginatorModule,
    HeroCardComponent,
    SearchBarComponent,
    MatButtonModule,
    RouterLink,
  ],
})
export class HeroesComponent implements OnInit, AfterViewInit {
  private heroesService = inject(HeroesService);
  heroesList = signal<Hero[]>([]);
  totalSize = signal<number>(0);
  pageSize = signal<number>(10);
  currentPage = signal<number>(1);
  pageSizeOptions: number[] = [5, 10, 25, 50];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.paginator.page.subscribe((event) => {
      this.pageSize.set(event.pageSize);
      this.currentPage.set(event.pageIndex + 1);
      this.fetchHeroes();
    });
  }

  ngOnInit(): void {
    this.fetchHeroesTotalSize();
    this.fetchHeroes();
  }

  /*
   * Function triggered by the search-bar output component
   */
  onSearchHeroe(searchTerm: string): void {
    if (!searchTerm) {
      // reset paginator with default values again
      this.fetchHeroesTotalSize();
      this.fetchHeroes();
      return;
    }
    // reset paginator
    this.paginator.firstPage();
    this.currentPage.set(1);

    this.fetchHeroes(searchTerm);
  }

  fetchHeroes(searchterm?: string): void {
    this.heroesService
      .fetchPaginatedHeroes(this.currentPage(), this.pageSize(), searchterm)
      .subscribe({
        next: (heroes) => {
          this.heroesList.set(heroes);
          searchterm && this.totalSize.set(heroes.length);
        },
        error: (err) => console.error(err),
      });
  }

  /*
   * Fetch the total number of heroes to set the paginator length
   *	 This is a workaround because the API does not provide a total size
   */
  fetchHeroesTotalSize(): void {
    this.heroesService.fetchAllHeroes().subscribe({
      next: (heroes) => this.totalSize.set(heroes.length),
      error: (err) => console.error(err),
    });
  }

  deleteHero(id: number): void {
    this.heroesList.set(this.heroesList().filter((h) => h.id !== id));
  }
}
