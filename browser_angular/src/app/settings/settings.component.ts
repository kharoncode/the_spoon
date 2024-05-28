import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

@Component({
   selector: 'app-settings',
   standalone: true,
   imports: [RouterModule, RouterLink, RouterLinkActive],
   templateUrl: './settings.component.html',
   styleUrl: './settings.component.scss',
})
export class SettingsComponent {}
