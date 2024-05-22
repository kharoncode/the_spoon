import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import {
   FormControl,
   FormGroup,
   FormsModule,
   Validators,
   ReactiveFormsModule,
} from '@angular/forms';

@Component({
   selector: 'app-login-form',
   standalone: true,
   imports: [NgClass, FormsModule, ReactiveFormsModule],
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
      console.log(data);
      this.loginForm.reset();
   }

   onFocus(input: 'login' | 'password', status: boolean) {
      this.isFocus[input] = status;
   }
}
