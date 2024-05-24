import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoginFormComponent } from '../login-form/login-form.component';
import { NgIf } from '@angular/common';

@Component({
   selector: 'app-login-modal',
   standalone: true,
   imports: [LoginFormComponent, NgIf],
   templateUrl: './login-modal.component.html',
   styleUrl: './login-modal.component.scss',
})
export class LoginModalComponent {
   @Input() isOpen: boolean;
   @Output() setIsOpen = new EventEmitter<boolean>();

   constructor() {}

   toggleLog(bool: boolean) {
      this.setIsOpen.emit(bool);
   }
}
