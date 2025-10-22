import {Component, OnInit, OnDestroy} from '@angular/core';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-temperature',
  imports: [
    MatIcon,

  ],
  templateUrl: './temperature.component.html',
  styleUrl: './temperature.component.css'
})
export class TemperatureComponent implements OnInit , OnDestroy {

  randomTemperature : number = Math.floor(Math.random() * 25);
  private temperatureInterval :any ;

  ngOnInit() {
    this.temperatureInterval = setInterval(() => {
      this.updateTemperature();
    },3000)
  }

  updateTemperature() {
    this.randomTemperature = Math.floor(Math.random() * 100);
    console.log('Temperature updated:', this.randomTemperature);
  }


  ngOnDestroy() {
    if(this.temperatureInterval) {
      clearInterval(this.temperatureInterval);
    }
  }
}
