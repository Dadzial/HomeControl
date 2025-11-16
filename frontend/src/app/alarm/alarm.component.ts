import { Component , OnInit , OnDestroy } from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {NgClass} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatSlideToggle} from '@angular/material/slide-toggle';

@Component({
  selector: 'app-alarm',
  imports: [
    MatIcon,
    NgClass,
    FormsModule,
    MatSlideToggle
  ],
  templateUrl: './alarm.component.html',
  styleUrl: './alarm.component.css'
})
export class AlarmComponent {
    temperatureAlarm: boolean = true;
    motionAlarm: boolean = true;
    gasAlarm: boolean = true;
    allAlarmsOn: boolean = true;

    toggleAllAlarms(event: boolean) {
        this.temperatureAlarm = event;
        this.motionAlarm = event;
        this.gasAlarm = event;
    }

    toggleAlarm(alarm: string) {
        if (alarm === 'temperature') {
            this.temperatureAlarm = !this.temperatureAlarm;
        } else if (alarm === 'motion') {
            this.motionAlarm = !this.motionAlarm;
        } else if (alarm === 'gas') {
            this.gasAlarm = !this.gasAlarm;
        }
    }
}
