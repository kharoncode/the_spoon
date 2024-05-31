import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
   FormControl,
   FormGroup,
   FormsModule,
   Validators,
   ReactiveFormsModule,
} from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ErrorMessageComponent } from '../error-message/error-message.component';

@Component({
   selector: 'app-login-form',
   standalone: true,
   imports: [
      NgClass,
      NgIf,
      FormsModule,
      ReactiveFormsModule,
      ErrorMessageComponent,
   ],
   templateUrl: './login-form.component.html',
   styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
   loginForm = new FormGroup({
      login: new FormControl('', [
         Validators.required,
         Validators.minLength(3),
      ]),
      password: new FormControl('', [
         Validators.required,
         Validators.minLength(8),
      ]),
      rememberMe: new FormControl(false),
   });

   isFocus = {
      login: false,
      password: false,
   };

   constructor(private userService: UserService) {}

   handleSubmit($event: Event) {
      $event.preventDefault;
      const data = {
         login: this.loginForm.value.login,
         password: this.loginForm.value.password,
         rememberMe: this.loginForm.value.rememberMe,
      };
      if (!this.loginForm.valid) {
         return;
      }
      this.userService
         .postUser({
            firstName: 'FirstName',
            lastName: 'LastName',
            mail: 'firstname@lastname.com',
            phone: '0033612345678',
            password: '1234',
         })
         .subscribe({
            next: (user) => {
               console.log(user);
            },
         });
      console.log(data);
      this.loginForm.reset();
   }

   onFocus(input: 'login' | 'password', status: boolean) {
      this.isFocus[input] = status;
   }
}
