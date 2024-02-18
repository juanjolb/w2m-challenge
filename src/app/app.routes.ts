import { Routes } from '@angular/router';
import { HeroesComponent } from './pages/heroes.component';
import { HeroActionsComponent } from './pages/hero-actions.component';

export const routes: Routes = [
  { path: '', redirectTo: 'heroes', pathMatch: 'full' },
  { path: 'heroes', component: HeroesComponent },
  { path: 'heroes/edit/:id', component: HeroActionsComponent },
  { path: 'heroes/create', component: HeroActionsComponent },
];
