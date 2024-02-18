import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Hero } from '../models/Hero';
import { HttpClient } from '@angular/common/http';
import { PaginatedHeroes } from '../models/PaginatedHeroes';

@Injectable({
  providedIn: 'root',
})
export class HeroesService {
  private apiUrl: string = 'http://localhost:3000';
  private http = inject(HttpClient);

  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$: Observable<boolean> = this.isLoading.asObservable();

  constructor() {}

  fetchAllHeroes(searchTerm?: string): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.apiUrl}/heroes`);
  }

  fetchPaginatedHeroes(
    page: number,
    pageSize: number,
    searchTerm?: string
  ): Observable<PaginatedHeroes> {
    return this.http.get<PaginatedHeroes>(`${this.apiUrl}/heroes`, {
      params: {
        // 'data.name_like': searchTerm || '',
        _page: page.toString(),
        _per_page: pageSize.toString(),
      },
    });
  }

  fetchHeroById(id: number): Observable<Hero> {
    return this.http.get<Hero>(`${this.apiUrl}/heroes/${id}`);
  }

  updateHeroById(hero: Hero): Observable<Hero> {
    return this.http.put<Hero>(`${this.apiUrl}/heroes/${hero.id}`, hero);
  }

  createHero(hero: Omit<Hero, 'id'>): Observable<Hero> {
    return this.http.post<Hero>(`${this.apiUrl}/heroes`, hero);
  }

  deleteHeroById(id: number): Observable<Hero> {
    return this.http.delete<Hero>(`${this.apiUrl}/heroes/${id}`);
  }
}
