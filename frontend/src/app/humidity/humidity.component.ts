import {Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import {MatIcon} from '@angular/material/icon';
import {NgIf} from '@angular/common';
import {Humidity, HumidityService} from '../services/humidity.service';
@Component({
  selector: 'app-humidity',
  imports: [MatIcon,NgIf],
  templateUrl: './humidity.component.html',
  styleUrl: './humidity.component.css'
})
export class HumidityComponent implements OnInit , OnDestroy  {

  humidity?: number;
  time?: Date;
  private sub?: Subscription;

  constructor(private humidityService : HumidityService) {}

  ngOnInit() {
    this.sub = this.humidityService.getHumidity().subscribe({
      next: (data: Humidity) => {
        this.humidity = data.humidity;
        this.time = new Date(data.time);
      },
      error: err => console.error('Error fetching humidity:', err)
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
