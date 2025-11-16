import { Component, OnInit } from '@angular/core';
import { NgxGaugeType } from 'ngx-gauge/gauge/gauge';
import {NgClass} from '@angular/common';
import {NgxGaugeModule} from 'ngx-gauge';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-co2-sensor',
  templateUrl: './co2-sensor.component.html',
  imports: [
    NgClass,
    NgxGaugeModule,
    MatIcon
  ],
  styleUrls: ['./co2-sensor.component.css']
})
export class CO2SensorComponent implements OnInit {
  gaugeType: NgxGaugeType = 'semi';
  gaugeValue!: number;
  previousValue!: number;
  trend!: 'up' | 'down';
  status!: string;

  thresholdConfig = {
    '0': { color: 'green' },
    '50': { color: 'yellow' },
    '80': { color: 'red' }
  };

  ngOnInit(): void {
    this.previousValue = 0;
    this.updateValue();
    setInterval(() => this.updateValue(), 3000);
  }

  updateValue() {
    const newValue = Math.floor(Math.random() * 100);
    this.trend = newValue > (this.gaugeValue || 0) ? 'up' : 'down';
    this.previousValue = this.gaugeValue || 0;
    this.gaugeValue = newValue;
    this.status = this.getStatus(this.gaugeValue);
  }

  getStatus(value: number): string {
    if (value <= 50) return 'Good';
    if (value <= 80) return 'Moderate';
    return 'Unhealthy';
  }

  getArrowIcon(): string {
    return this.trend === 'up' ? 'keyboard_arrow_up' : 'keyboard_arrow_down';
  }

  getArrowColor(): string {
    switch(this.status) {
      case 'Good': return 'green';
      case 'Moderate': return 'yellow';
      case 'Unhealthy': return 'red';
      default: return 'white';
    }
  }
}
