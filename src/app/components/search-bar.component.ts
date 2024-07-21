import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule],
  template: `
    <mat-form-field appearance="outline">
      <input
        #searchInput
        matInput
        placeholder="Search heroe"
        (keyup)="searchValue($event)"
      />
    </mat-form-field>
  `,
  styles: `
    mat-form-field {
      width: 320px;
    }
    .mat-mdc-text-field-wrapper {
    background-color: white !important;
    border-bottom: none !important;
}

.mat-mdc-form-field-focus-overlay {
  background-color: white !important;
}

  `,
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @Output() search = new EventEmitter<string>();
  private searchText$ = new Subject<string>();

  searchValue(event: any) {
    this.searchText$.next(event.target.value);
  }

  ngOnInit() {
    // Debounce the search input, so we don't send a request on every keystroke
    this.searchText$
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        this.search.emit(value);
      });
  }

  searchHeroe(event: any) {
    this.search.emit(event.target.value);
  }

  ngOnDestroy() {
    this.searchText$.unsubscribe();
  }
}
