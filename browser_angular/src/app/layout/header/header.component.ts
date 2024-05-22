import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
   selector: 'app-header',
   standalone: true,
   imports: [RouterLink, NgIf],
   templateUrl: './header.component.html',
   styleUrl: './header.component.scss',
})
export class HeaderComponent {
   isOpen = false;
   toggleLog() {
      this.isOpen = !this.isOpen;
   }
}
