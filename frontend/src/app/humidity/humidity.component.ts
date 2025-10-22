import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-humidity',
  imports: [MatIcon],
  templateUrl: './humidity.component.html',
  styleUrl: './humidity.component.css'
})
export class HumidityComponent implements OnInit , OnDestroy  {
  randomHumidity : number = Math.floor(Math.random() * 100);
  private humidityInterval :any ;

  ngOnInit() {
    this.humidityInterval = setInterval(() => {
        this.updateHumidity();
    },2000)
  }

  updateHumidity() {
    this.randomHumidity = Math.floor(Math.random() * 100);
    console.log('Humidity updated:', this.randomHumidity);
  }

  ngOnDestroy() {
    clearInterval(this.humidityInterval);
  }
}
