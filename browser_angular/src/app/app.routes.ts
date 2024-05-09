import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [
   { path: '', title: 'The Spoon', component: HomeComponent },
   {
      path: 'settings',
      title: 'The Spoon - Settings',
      component: SettingsComponent,
   },
];
