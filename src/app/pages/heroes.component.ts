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
      [length]="totalSize()"
      [pageSize]="pageSize()"
      [pageSizeOptions]="pageSizeOptions"
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
  pageSizeOptions: number[] = [5, 10, 25];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.paginator.page.subscribe((event) => {
      this.pageSize.set(event.pageSize);
      this.currentPage.set(event.pageIndex + 1);
      this.fetchHeroes();
    });
  }

  ngOnInit(): void {
    this.fetchHeroes();
  }

  /*
   * Function triggered by the search-bar output component
   * This function does not work because JSON-Server does not support nested queries
   * So we need to either paginate or search, but not both at the same time
   */
  onSearchHeroe(searchTerm: string): void {
    if (!searchTerm) {
      this.fetchHeroes();
      return;
    }

    // reset paginator
    this.paginator.firstPage();
    this.currentPage.set(1);

    alert(
      `Searched for ${searchTerm}\n\nThis function does not work because JSON-Server does not support nested queries, so we need to either paginate or search, but not both at the same time with JSON-Server.`
    );

    // this.heroesService
    //   .fetchPaginatedHeroes(this.currentPage(), this.pageSize(), searchTerm)
    //   .subscribe({
    //     next: (heroes) => {
    //       this.totalSize.set(heroes.items);
    //       this.heroesList.set(heroes.data);
    //     },
    //     error: (err) => console.error(err),
    //   });
  }

  fetchHeroes(): void {
    this.heroesService
      .fetchPaginatedHeroes(this.currentPage(), this.pageSize())
      .subscribe({
        next: (heroes) => {
          this.totalSize.set(heroes.items);
          this.heroesList.set(heroes.data);
        },
        error: (err) => console.error(err),
      });
  }

  deleteHero(id: number): void {
    this.heroesList.set(this.heroesList().filter((h) => h.id !== id));
  }
}
