import {
  HttpEvent,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { HeroesService } from '../../services/heroes.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const isLoading = inject(HeroesService).isLoading;
  isLoading.next(true);
  console.log('Loading test');

  return next(req).pipe(
    map((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        isLoading.next(false);
      }
      return event;
    })
  );
};
