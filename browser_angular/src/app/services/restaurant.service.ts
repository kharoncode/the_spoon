import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Opening } from './restaurant';

@Injectable({
   providedIn: 'root',
})
export class RestaurantService {
   private openingUrl = 'http://127.0.0.1:5000/days';
   constructor(private http: HttpClient) {}

   getOpening(): Observable<Opening> {
      return this.http.get<Opening>(this.openingUrl);
   }
}
