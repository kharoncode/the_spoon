import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../services/user';
import { NgFor } from '@angular/common';
import { TablesService } from '../../services/tables.service';
import { Table } from '../../services/table';

@Component({
   selector: 'app-option',
   standalone: true,
   imports: [NgFor],
   templateUrl: './option.component.html',
   styleUrl: './option.component.scss',
})
export class OptionComponent implements OnInit {
   usersList: User[] = [];
   tablesList: Table[] = [];
   constructor(
      private userService: UserService,
      private tableService: TablesService
   ) {}
   ngOnInit(): void {
      this.userService.getUsers().subscribe({
         next: (users) => {
            this.usersList = users;
         },
      });

      this.tableService.getTables().subscribe({
         next: (tables) => {
            this.tablesList = tables;
         },
      });
   }
}
