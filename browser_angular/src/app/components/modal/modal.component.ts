import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
   selector: 'app-modal',
   standalone: true,
   imports: [NgIf],
   templateUrl: './modal.component.html',
   styleUrl: './modal.component.scss',
})
export class ModalComponent {
   @Input() isOpen: boolean;
   @Output() setIsOpen = new EventEmitter<boolean>();
   constructor() {}

   toggleModal() {
      this.setIsOpen.emit(!this.isOpen);
   }
}
