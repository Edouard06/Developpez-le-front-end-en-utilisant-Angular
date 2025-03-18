import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { OlympicService } from '../services/olympic.service'; // Ajustez le chemin si besoin
import { OlympicCountry } from '../models/olympic';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private olympicService: OlympicService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    const idParam: string | null = route.paramMap.get('id');

    if (!idParam || isNaN(+idParam) || +idParam <= 0) {
      return of(this.router.createUrlTree(['/not-found']));
    }

    return this.olympicService.getOlympics().pipe(
      map((countries: OlympicCountry[] | null) => {
        if (!countries) {
          return this.router.createUrlTree(['/not-found']);
        }
        const found = countries.some(country => country.id === +idParam);
        if (!found) {
          return this.router.createUrlTree(['/not-found']);
        }
        return true;
      }),
      catchError(() => {
        return of(this.router.createUrlTree(['/not-found']));
      })
    );
  }
}
