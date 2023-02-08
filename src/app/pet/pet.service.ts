import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Pet } from './pet';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private petUrl = environment.baseUrl + 'api/pet';

  constructor(private http: HttpClient) { }

  getPets(): Observable<Pet[]> {
    console.log('this.petUrl', this.petUrl);
    return this.http.get<Pet[]>(this.petUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  getPet(id: string | null): Observable<Pet> {
    if (id === '') {
      return of(this.initializePet());
    }
    const url = `${this.petUrl}/${id}`;
    return this.http.get<Pet>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  createPet(pet: Pet): Observable<Pet> {
    pet.id = '';
    return this.http.post<Pet>(this.petUrl, pet)
      .pipe(
        catchError(this.handleError)
      );
  }

  deletePet(id: string): Observable<{}> {
    const url = `${this.petUrl}/${id}`;
    return this.http.delete<Pet>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  updatePet(pet: Pet): Observable<Pet> {
    const url = `${this.petUrl}/${pet.id}`;
    return this.http.put<Pet>(url, pet)
      .pipe(
        map(() => pet),
        catchError(this.handleError)
      );
  }

  private handleError(err: any) {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(() => errorMessage);
  }

  private initializePet(): Pet {
    return {
      id: "",
      name: "",
      breed: "",
      gender: ""
    };
  }
}
