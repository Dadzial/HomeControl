import { Component, OnDestroy, OnInit } from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {Energy, EnergyService} from '../services/energy.service';
import {Subscription} from 'rxjs';
import {Humidity} from '../services/humidity.service';
import {DatePipe, NgIf} from '@angular/common';
@Component({
  selector: 'app-energy',
  imports: [MatIcon, DatePipe, NgIf],
  templateUrl: './energy.component.html',
  styleUrl: './energy.component.css'
})
export class EnergyComponent implements OnInit , OnDestroy {

  energy?: number;
  time?: Date;
  private sub?: Subscription;

  constructor(private energyService : EnergyService) { }

  ngOnInit() {
    this.sub = this.energyService.getEnergy().subscribe({
      next: (data: Energy) => {
        this.energy = data.energyData;
        this.time = new Date(data.timestamp);
      },
      error: err => console.error('Error fetching humidity:', err)
    });
  }


  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
