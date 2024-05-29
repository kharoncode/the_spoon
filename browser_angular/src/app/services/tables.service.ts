import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Table } from './table';

@Injectable({
   providedIn: 'root',
})
export class TablesService {
   private tablesUrl = 'http://127.0.0.1:5000/tables';
   constructor(private http: HttpClient) {}

   getTables(): Observable<Table[]> {
      return this.http.get<Table[]>(this.tablesUrl);
   }
}
