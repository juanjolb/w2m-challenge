import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Alignment, Gender, Hero } from '../models/Hero';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HeroesService } from '../services/heroes.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AlertService } from '../services/alert-service.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { InputUppercaseDirective } from '../shared/directives/input-uppercase.directive';

@Component({
  selector: 'app-hero-actions',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    CommonModule,
    InputUppercaseDirective,
  ],
  template: `
    <div>
      @if (editableHero()){
      <h2>Edit {{ editableHero()!.name }}</h2>
      } @else {
      <h2>Create Hero</h2>
      }
      <form [formGroup]="hero" class="hero-form" (submit)="handleSubmit()">
        <mat-form-field appereance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" appInputUppercase />
        </mat-form-field>
        <mat-form-field appereance="outline">
          <mat-label>Aliases</mat-label>
          <input matInput formControlName="aliases" />
        </mat-form-field>
        <mat-form-field appereance="outline">
          <mat-label>Place of birth</mat-label>
          <input matInput formControlName="place_birth" />
        </mat-form-field>
        <mat-form-field appereance="outline">
          <mat-label>Power</mat-label>
          <input matInput formControlName="power" type="number" />
        </mat-form-field>
        <div class="form-actions">
          <button mat-raised-button (click)="handleBack()" type="button">
            Back
          </button>
          <button mat-raised-button color="primary" [disabled]="isValid">
            Save
          </button>
        </div>
      </form>
    </div>
  `,
  styles: `
  h2 {text-align: center;}
  .hero-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
  .hero-form mat-form-field {
    min-width: 320px;
    width: 100%;
  }
  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }
  `,
})
export class HeroActionsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private heroesService = inject(HeroesService);
  private alertService = inject(AlertService);
  editableHero = signal<Hero | null>(null);
  allHeroes = signal<Hero[]>([]);

  hero = this.fb.group({
    name: ['', [Validators.required]],
    aliases: ['', [Validators.required]],
    place_birth: ['', [Validators.required]],
    power: [0, [Validators.required]],
  });

  get isValid() {
    return !this.hero.valid || this.hero.pristine;
  }

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // get id from route params
    // fetch hero by id and set form values
    this.activatedRoute.params.subscribe((params) => {
      if (!params['id']) return;
      this.heroesService.fetchHeroById(params['id']).subscribe((hero: Hero) => {
        this.editableHero.set(hero);
        // cannot patch value so we do it manually for each field
        this.hero.controls['name'].setValue(hero.name.toUpperCase());
        this.hero.controls['aliases'].setValue(
          hero.biography.aliases.join(', ')
        );
        this.hero.controls['place_birth'].setValue(hero.biography.placeOfBirth);
        this.hero.controls['power'].setValue(hero.powerstats.power);
      });
    });
  }

  editHero() {
    // get form values and update hero
    const newHero: Hero = {
      ...this.editableHero()!,
      name: this.hero.value.name!.toLocaleUpperCase(),
      biography: {
        ...this.editableHero()!.biography,
        aliases: this.hero.value.aliases!.split(','),
        placeOfBirth: this.hero.value.place_birth!,
      },
      powerstats: {
        ...this.editableHero()!.powerstats,
        power: this.hero.value.power!,
      },
    };

    this.heroesService.updateHeroById(newHero).subscribe({
      next: (hero: Hero) => {
        this.alertService.alertSuccess('Hero updated successfully');
        this.router.navigate(['/heroes']);
      },
      error: (error) =>
        this.alertService.alertError('Error updating hero', error),
    });
  }

  createHero() {
    // Check that hero does not exist
    this.heroesService.fetchAllHeroes().subscribe({
      next: (heroes: Hero[]) => {
        const name = this.hero.value.name!.toUpperCase();
        if (heroes.some((hero) => hero.name.toUpperCase() === name)) {
          this.alertService.alertError('Hero already exists');
          return;
        }
        // get form values and create hero
        const newHero: Omit<Hero, 'id'> = {
          ...this.defaultHero,
          name: name,
          images: {
            ...this.defaultHero.images!,
            // from heroes list, get a random image
            md: heroes[Math.floor(Math.random() * heroes.length)].images.md,
          },
          biography: {
            ...this.defaultHero.biography!,
            aliases: this.hero.value.aliases!.split(','),
            placeOfBirth: this.hero.value.place_birth!,
          },
          powerstats: {
            ...this.defaultHero.powerstats!,
            power: this.hero.value.power!,
          },
        };
        this.heroesService.createHero(newHero).subscribe({
          next: (hero: Hero) => {
            this.alertService.alertSuccess('Hero created successfully');
            this.router.navigate(['/heroes']);
          },
          error: (error) =>
            this.alertService.alertError('Error creating hero', error),
        });
      },
      error: (error) =>
        this.alertService.alertError('Error fetching heroes', error),
    });
  }

  get defaultHero(): Omit<Hero, 'id'> {
    return {
      name: 'Abraxas',
      slug: '5-abraxas',
      powerstats: {
        intelligence: 88,
        strength: 63,
        speed: 83,
        durability: 100,
        power: 100,
        combat: 55,
      },
      appearance: {
        gender: 'Male' as Gender,
        race: 'Cosmic Entity',
        height: ['-', '0 cm'],
        weight: ['- lb', '0 kg'],
        eyeColor: 'Blue',
        hairColor: 'Black',
      },
      biography: {
        fullName: 'Abraxas',
        alterEgos: 'No alter egos found.',
        aliases: ['Test'],
        placeOfBirth: 'Within Eternity',
        firstAppearance: 'Fantastic Four Annual #2001',
        publisher: 'Marvel Comics',
        alignment: 'bad' as Alignment,
      },
      work: {
        occupation: 'Dimensional destroyer',
        base: '-',
      },
      connections: {
        groupAffiliation: 'Cosmic Beings',
        relatives: 'Eternity ("Father")',
      },
      images: {
        xs: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/xs/5-abraxas.jpg',
        sm: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/sm/5-abraxas.jpg',
        md: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/md/5-abraxas.jpg',
        lg: 'https://cdn.jsdelivr.net/gh/akabab/superhero-api@0.3.0/api/images/lg/5-abraxas.jpg',
      },
    };
  }

  handleSubmit() {
    // if we have params id then we are editing a hero else we are creating a new one
    this.editableHero() ? this.editHero() : this.createHero();
  }

  handleBack() {
    history.back();
  }
}
