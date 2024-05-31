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
import { NgClass, NgIf } from '@angular/common';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { User, User_body } from '../../services/user';
@Component({
   selector: 'app-user-form',
   standalone: true,
   imports: [
      FormsModule,
      ReactiveFormsModule,
      NgClass,
      NgIf,
      ErrorMessageComponent,
   ],
   templateUrl: './user-form.component.html',
   styleUrl: './user-form.component.scss',
})
export class UserFormComponent implements OnChanges {
   @Input() user: User_body;
   @Input() content: { title: string | undefined; button: string };
   @Input() userError: { isError: boolean; message: string };
   @Output() handleSubmit = new EventEmitter<User_body>();

   formError: string;

   ngOnChanges(): void {
      this.user &&
         this.userForm.patchValue({
            firstName: this.user.firstName,
            lastName: this.user.lastName,
            mail: this.user.mail,
            phone: this.user.phone,
            password: this.user.password,
         });
   }

   userForm = new FormGroup({
      firstName: new FormControl('', [
         Validators.required,
         Validators.maxLength(30),
      ]),
      lastName: new FormControl('', [
         Validators.required,
         Validators.maxLength(20),
      ]),
      mail: new FormControl('', [
         Validators.required,
         Validators.maxLength(20),
      ]),
      phone: new FormControl('', [
         Validators.required,
         Validators.maxLength(20),
      ]),
      password: new FormControl('', [
         Validators.required,
         Validators.maxLength(20),
      ]),
   });

   handleFormSubmit($event: Event) {
      $event.preventDefault();
      const firstName = this.userForm.value.firstName;
      const lastName = this.userForm.value.lastName;
      const mail = this.userForm.value.mail;
      const phone = this.userForm.value.phone;
      const password = this.userForm.value.password;

      if (!this.userForm.valid) {
         return;
      }
      if (firstName && lastName && mail && phone && password) {
         const newUser = {
            firstName: firstName,
            lastName: lastName,
            mail: mail,
            phone: phone,
            password: password,
         };

         this.handleSubmit.emit(newUser);
      }
   }
}
