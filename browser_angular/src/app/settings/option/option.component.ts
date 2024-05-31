import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../services/user';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { TablesService } from '../../services/tables.service';
import { Table, Table_body } from '../../services/table';
import {
   FormControl,
   FormGroup,
   FormsModule,
   ReactiveFormsModule,
   Validators,
} from '@angular/forms';
import { ModalComponent } from '../../components/modal/modal.component';
import { TableFormComponent } from '../../components/table-form/table-form.component';

@Component({
   selector: 'app-option',
   standalone: true,
   imports: [
      NgFor,
      NgIf,
      NgClass,
      FormsModule,
      ReactiveFormsModule,
      ModalComponent,
      TableFormComponent,
   ],
   templateUrl: './option.component.html',
   styleUrl: './option.component.scss',
})
export class OptionComponent implements OnInit {
   usersList: User[] = [];
   tablesList: Table[] = [];
   tableSelected: Table;

   tableForm = new FormGroup({
      name: new FormControl('Nouvelle Table', [
         Validators.required,
         Validators.maxLength(30),
      ]),
      size: new FormControl(1, [Validators.required, Validators.min(1)]),
   });

   tableError = {
      edit: { isError: false, message: '' },
      add: { isError: false, message: '' },
   };
   isOpen: boolean = false;

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

   setOpen() {
      this.isOpen = !this.isOpen;
      this.tableError.edit.isError = false;
   }

   handleAddTableSubmit(data: Table_body) {
      this.tableForm.valid &&
         this.tableService.postTable(data).subscribe({
            next: (tables) => {
               this.tablesList = tables;
               this.tableError.add = { isError: false, message: '' };
            },
            error: (error) => {
               this.tableError.add = {
                  isError: true,
                  message: error.error.result,
               };
               console.log('---ERROR---', error);
            },
         });
   }

   handleEditTableSubmit(data: Table_body) {
      const newData = {
         id: this.tableSelected.id,
         name: data.name,
         size: data.size,
      };
      this.tableService.updateTable(newData).subscribe({
         next: (result) => {
            this.tablesList = result;
            this.tableError.edit = { isError: false, message: '' };
            this.setOpen();
         },
         error: (error) => {
            this.tableError.edit = {
               isError: true,
               message: error.error.result,
            };
            console.log('---ERROR--', error);
         },
      });
   }

   handleDelete(id: number, db: string) {
      if (db === 'tables') {
         this.tableService.deleteTable({ id: id }).subscribe({
            next: (tables) => {
               this.tablesList = tables;
            },
            error: (error) => {
               console.log('---ERROR---', error);
            },
         });
      } else if (db === 'users') {
         this.userService.deleteUser({ id: id }).subscribe({
            next: (users) => {
               this.usersList = users;
            },
            error: (error) => {
               console.log('---ERROR---', error);
            },
         });
      }
   }

   editTable(table: Table) {
      this.tableSelected = table;
      this.setOpen();
   }
}
