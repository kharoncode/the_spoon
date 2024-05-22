import { Component, OnInit } from '@angular/core';
import { LoginFormComponent } from '../components/login-form/login-form.component';
import { RestaurantService } from '../services/restaurant.service';
import { NgFor, NgIf } from '@angular/common';
import { Opening } from '../services/restaurant';

@Component({
   selector: 'app-home',
   standalone: true,
   imports: [LoginFormComponent, NgFor, NgIf],
   templateUrl: './home.component.html',
   styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
   days_list = [
      'lundi',
      'mardi',
      'mercredi',
      'jeudi',
      'vendredi',
      'samedi',
      'dimanche',
   ];
   day_ot: Opening = {};

   constructor(private restaurantService: RestaurantService) {}
   ngOnInit(): void {
      this.restaurantService.getOpening().subscribe({
         next: (openingList) => {
            this.day_ot = { ...openingList };
         },
         error: (error) => {
            console.log('---ERROR---', error);
         },
      });
   }
}
