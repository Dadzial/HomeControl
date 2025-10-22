import { Component, OnDestroy, OnInit } from '@angular/core';
import {MatIcon} from '@angular/material/icon';
@Component({
  selector: 'app-energy',
  imports: [MatIcon],
  templateUrl: './energy.component.html',
  styleUrl: './energy.component.css'
})
export class EnergyComponent implements OnInit , OnDestroy {
    randomEnergy : number = Math.floor(Math.random() * 100);
    private energyInterval :any ;

    ngOnInit() {
        this.energyInterval = setInterval(() => {
            this.updateEnergy();
        },2000)
    }

    updateEnergy() {
        this.randomEnergy = Math.floor(Math.random() * 100);
        console.log('Energy updated:', this.randomEnergy);
    }

    ngOnDestroy() {
        clearInterval(this.energyInterval);
    }
}
