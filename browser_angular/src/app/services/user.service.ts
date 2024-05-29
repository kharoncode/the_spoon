import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user';

@Injectable({
   providedIn: 'root',
})
export class UserService {
   private usersUrl = 'http://127.0.0.1:5000/users';
   constructor(private http: HttpClient) {}

   getUsers(): Observable<User[]> {
      return this.http.get<User[]>(this.usersUrl);
   }
}
