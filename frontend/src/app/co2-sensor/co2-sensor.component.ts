import { Component, OnInit } from '@angular/core';
import { NgxGaugeType } from 'ngx-gauge/gauge/gauge';
import { NgClass } from '@angular/common';
import { NgxGaugeModule } from 'ngx-gauge';
import { MatIcon } from '@angular/material/icon';
import { Co2ServiceService, Co2 } from '../services/co2-service.service';

@Component({
  selector: 'app-co2-sensor',
  standalone: true,
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

  constructor(private co2Service: Co2ServiceService) {}

  ngOnInit(): void {
    this.previousValue = 0;

    this.co2Service.getCo2Data().subscribe(data => {
      this.updateGauge(data);
    });
  }

  updateGauge(sensorData: Co2) {
    const { lpg, co, methane } = sensorData;

    const newValue = Math.floor((lpg + co + methane) / 3);

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
    switch (this.status) {
      case 'Good': return 'green';
      case 'Moderate': return 'yellow';
      case 'Unhealthy': return 'red';
      default: return 'white';
    }
  }
}
