import { Component } from '@angular/core';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatIcon} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgStyle} from '@angular/common';
@Component({
  selector: 'app-lights',
  imports: [
    MatIcon,
    MatSlideToggle,
    FormsModule,
    NgStyle,
    NgForOf
  ],
  templateUrl: './lights.component.html',
  styleUrl: './lights.component.css'
})
export class LightsComponent {
  lights = [
    { name: 'Kitchen', icon: 'kitchen', on: false },
    { name: 'Garage', icon: 'garage', on: false },
    { name: 'Bathroom', icon: 'bathtub', on: false },
    { name: 'Room', icon: 'bed', on: false }
  ];
}
