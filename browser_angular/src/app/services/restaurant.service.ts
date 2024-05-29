import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Opening, Restaurant } from './restaurant';

@Injectable({
   providedIn: 'root',
})
export class RestaurantService {
   private openingUrl = 'http://127.0.0.1:5000/days';
   private restaurantsUrl = 'http://127.0.0.1:5000/restaurants';
   constructor(private http: HttpClient) {}

   getRestaurant(): Observable<Restaurant[]> {
      return this.http.get<Restaurant[]>(this.restaurantsUrl);
   }

   putRestaurant(body: Restaurant): Observable<Restaurant[]> {
      return this.http.put<Restaurant[]>(this.restaurantsUrl, body);
   }

   getOpening(): Observable<Opening> {
      return this.http.get<Opening>(this.openingUrl);
   }
}
