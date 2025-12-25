import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription, timer, switchMap } from 'rxjs';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { DatePipe, NgIf } from '@angular/common';
import { Temperature, TemperatureService } from '../services/temperature.service';
import { UIChart } from 'primeng/chart';

@Component({
  selector: 'app-temperature',
  imports: [
    MatIcon,
    NgIf,
    DatePipe,
    UIChart,
    MatIconButton
  ],
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.css']
})
export class TemperatureComponent implements OnInit, OnDestroy {

  @ViewChild(UIChart) chart!: UIChart;

  temperature?: number;
  time?: Date;

  private sub?: Subscription;
  private saveSub?: Subscription;

  basicData: any;
  basicOptions: any;

  constructor(private temperatureService: TemperatureService) {}

  ngOnInit() {


    this.basicData = {
      labels: [],
      datasets: [
        {
          label: 'Temperature °C',
          backgroundColor: '#42A5F5',
          borderColor: '#1E88E5',
          fill: false,
          data: []
        }
      ]
    };

    this.basicOptions = {
      responsive: true,
      maintainAspectRatio: false,
      animation: {
        duration: 500,
        easing: 'easeOutQuart'
      },
      plugins: {
        legend: { labels: { color: '#FFFFFF' } }
      },
      elements: {
        line: { tension: 0.4 },
        point: { radius: 4, hoverRadius: 6 }
      },
      scales: {
        x: {
          ticks: { color: '#FFFFFF' },
          grid: { color: '#FFFFFF' }
        },
        y: {
          ticks: { color: '#FFFFFF' },
          grid: { color: '#FFFFFF' }
        }
      }
    };


    this.sub = this.temperatureService.getTemperature().subscribe({
      next: (data: Temperature) => {
        this.temperature = data.temperature;
        this.time = new Date(data.timestamp);

        const label = new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        this.basicData.labels.push(label);
        this.basicData.datasets[0].data.push(data.temperature);

        if (this.basicData.labels.length > 10) {
          this.basicData.labels.shift();
          this.basicData.datasets[0].data.shift();
        }

        this.chart?.refresh();
      },
      error: err => console.error('Error fetching temperature:', err)
    });

    this.startAutoSave();
  }

  private startAutoSave() {
    this.saveSub = timer(0, 3000).pipe(
      switchMap(() => this.temperatureService.getTemperature()),
      switchMap(temp => this.temperatureService.saveTemperature(temp.temperature))
    ).subscribe({
      error: err => console.error(err)
    });
  }

  clearChart() {
    this.temperatureService.clearChart().subscribe({
      next: () => {
        this.basicData.labels = [];
        this.basicData.datasets[0].data = [];
        this.chart?.refresh();
      },
      error: err => console.error(err)
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.saveSub?.unsubscribe();
  }
}
