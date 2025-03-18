import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { OlympicCountry } from '../models/olympic'; // ✅ Typage fort

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';

  private olympics$ = new BehaviorSubject<OlympicCountry[] | null>(null);

  constructor(private http: HttpClient) {}

  
  loadInitialData(): Observable<OlympicCountry[]> {
    return this.http.get<OlympicCountry[]>(this.olympicUrl).pipe(
      tap((data) => this.olympics$.next(data)),
      catchError((error) => {
        console.error('[OlympicService] Error loading data :', error);
        this.olympics$.next(null);
        return throwError(() => new Error('Error loading olympic data :.'));
      })
    );
  }

 
  getOlympics(): Observable<OlympicCountry[] | null> {
    return this.olympics$.asObservable();
  }
}
