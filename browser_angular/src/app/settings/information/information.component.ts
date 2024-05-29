import { Component, OnInit } from '@angular/core';
import { Restaurant } from '../../services/restaurant';
import { RestaurantService } from '../../services/restaurant.service';
import {
   FormControl,
   FormGroup,
   FormsModule,
   ReactiveFormsModule,
   Validators,
} from '@angular/forms';

@Component({
   selector: 'app-information',
   standalone: true,
   imports: [FormsModule, ReactiveFormsModule],
   templateUrl: './information.component.html',
   styleUrl: './information.component.scss',
})
export class InformationComponent implements OnInit {
   restaurant: Restaurant = {
      name: '',
      address: '',
      cuisine: '',
      phone: '',
      id: 0,
   };

   restaurantForm = new FormGroup({
      name: new FormControl(this.restaurant.name, [
         Validators.required,
         Validators.maxLength(20),
      ]),
      address: new FormControl(this.restaurant.address, [
         Validators.required,
         Validators.maxLength(250),
      ]),
      phone: new FormControl(this.restaurant.phone, [
         Validators.required,
         Validators.maxLength(14),
      ]),
      cuisine: new FormControl(this.restaurant.cuisine, [
         Validators.required,
         Validators.maxLength(30),
      ]),
   });

   constructor(private restaurant_service: RestaurantService) {}

   isEmpty(value: string | null | undefined, defaultValue: string) {
      if (value) {
         const result: string = value === '' ? defaultValue : value.trim();
         return result;
      }
      return defaultValue;
   }

   handleSubmit($event: Event) {
      $event.preventDefault();
      const data = {
         id: this.restaurant.id,
         name: this.isEmpty(
            this.restaurantForm.value.name,
            this.restaurant.name
         ),
         address: this.isEmpty(
            this.restaurantForm.value.address,
            this.restaurant.address
         ),
         phone: this.isEmpty(
            this.restaurantForm.value.phone,
            this.restaurant.phone
         ),
         cuisine: this.isEmpty(
            this.restaurantForm.value.cuisine,
            this.restaurant.cuisine
         ),
      };
      console.log(data);
      this.restaurant_service
         .putRestaurant(data)
         .subscribe((data) => console.log(data));
   }

   ngOnInit(): void {
      this.restaurant_service.getRestaurant().subscribe({
         next: (restaurantsList) => {
            this.restaurant = restaurantsList[0];
            this.restaurantForm.patchValue({
               name: this.restaurant.name,
               address: this.restaurant.address,
               phone: this.restaurant.phone,
               cuisine: this.restaurant.cuisine,
            });
         },
         error: (error) => {
            console.log('---ERROR---', error);
         },
      });
   }
}
