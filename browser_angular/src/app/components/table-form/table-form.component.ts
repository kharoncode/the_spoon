import {
   Component,
   EventEmitter,
   Input,
   OnChanges,
   Output,
} from '@angular/core';
import {
   FormControl,
   FormGroup,
   FormsModule,
   ReactiveFormsModule,
   Validators,
} from '@angular/forms';
import { Table, Table_body } from '../../services/table';
import { NgClass, NgIf } from '@angular/common';
import { ErrorMessageComponent } from '../error-message/error-message.component';

@Component({
   selector: 'app-table-form',
   standalone: true,
   imports: [
      FormsModule,
      ReactiveFormsModule,
      NgClass,
      NgIf,
      ErrorMessageComponent,
   ],
   templateUrl: './table-form.component.html',
   styleUrl: './table-form.component.scss',
})
export class TableFormComponent implements OnChanges {
   @Input() table: Table;
   @Input() content: { title: string | undefined; button: string };
   @Input() tableError: { isError: boolean; message: string };
   @Output() handleSubmit = new EventEmitter<Table_body>();

   ngOnChanges(): void {
      this.table &&
         this.tableForm.patchValue({
            name: this.table.name,
            size: this.table.size,
         });
   }

   tableForm = new FormGroup({
      name: new FormControl('', [
         Validators.required,
         Validators.maxLength(30),
      ]),
      size: new FormControl(1, [Validators.required, Validators.min(1)]),
   });

   handleFormSubmit($event: Event) {
      $event.preventDefault();
      const name = this.tableForm.value.name;
      const size = this.tableForm.value.size;
      if (!this.tableForm.valid) {
         return;
      }
      if (name && size) {
         const newTable = {
            name: name,
            size: size,
         };

         this.handleSubmit.emit(newTable);
      }
   }
}
