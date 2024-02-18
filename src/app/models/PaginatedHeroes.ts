import { Hero } from './Hero';

export interface PaginatedHeroes {
  first: number;
  prev: null;
  next: number;
  last: number;
  pages: number;
  items: number;
  data: Hero[];
}
