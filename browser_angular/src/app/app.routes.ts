import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { InformationComponent } from './settings/information/information.component';
import { OpeningComponent } from './settings/opening/opening.component';
import { OptionComponent } from './settings/option/option.component';
import { BookingComponent } from './settings/booking/booking.component';

export const routes: Routes = [
   { path: '', title: 'The Spoon', component: HomeComponent },
   {
      path: 'settings',
      title: 'The Spoon - Settings',
      component: SettingsComponent,
      children: [
         { path: 'information', component: InformationComponent },
         { path: 'opening', component: OpeningComponent },
         { path: 'option', component: OptionComponent },
         { path: 'booking', component: BookingComponent },
      ],
   },
];
