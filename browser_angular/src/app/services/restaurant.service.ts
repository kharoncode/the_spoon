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

   getResaurant(): Observable<Restaurant[]> {
      return this.http.get<Restaurant[]>(this.restaurantsUrl);
   }

   getOpening(): Observable<Opening> {
      return this.http.get<Opening>(this.openingUrl);
   }
}
