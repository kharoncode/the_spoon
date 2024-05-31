import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Table, Table_body, Table_body_with_id } from './table';

@Injectable({
   providedIn: 'root',
})
export class TablesService {
   private tablesUrl = 'http://127.0.0.1:5000/tables';
   private tableUrl = 'http://127.0.0.1:5000/table';
   constructor(private http: HttpClient) {}

   getTables(): Observable<Table[]> {
      return this.http.get<Table[]>(this.tablesUrl);
   }

   getTable(id: number): Observable<Table> {
      return this.http.get<Table>(this.tableUrl + `?id=${id}`);
   }

   postTable(body: Table_body): Observable<Table[]> {
      return this.http.post<Table[]>(this.tablesUrl, body);
   }

   updateTable(body: Table_body_with_id): Observable<Table[]> {
      return this.http.put<Table[]>(this.tablesUrl, body);
   }

   deleteTable(body: { id: number }): Observable<Table[]> {
      return this.http.delete<Table[]>(this.tablesUrl, {
         headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
         body: body,
      });
   }
}
