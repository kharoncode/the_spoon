import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { LoginModalComponent } from '../../components/login-modal/login-modal.component';

@Component({
   selector: 'app-header',
   standalone: true,
   imports: [RouterLink, NgIf, LoginFormComponent, LoginModalComponent],
   templateUrl: './header.component.html',
   styleUrl: './header.component.scss',
})
export class HeaderComponent {
   isOpen = false;
   setIsOpen(bool: boolean) {
      this.isOpen = bool;
   }
}
