import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Hero } from '../models/Hero';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HeroesService {
  private apiUrl: string = 'http://localhost:3000';
  private http = inject(HttpClient);

  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading$: Observable<boolean> = this.isLoading.asObservable();

  constructor() {}

  fetchAllHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.apiUrl}/heroes`);
  }

  fetchPaginatedHeroes(
    page: number,
    pageSize: number,
    searchTerm?: string
  ): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.apiUrl}/heroes`, {
      params: {
        _page: page.toString(),
        _limit: pageSize.toString(),
        name_like: searchTerm ?? '',
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
