import { Component , OnInit , OnDestroy } from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {DatePipe, NgClass, NgForOf, TitleCasePipe} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {AlarmsService} from '../services/alarms.service';
import {MatButton} from '@angular/material/button';
import {interval, Subscription} from 'rxjs';
@Component({
  selector: 'app-alarm',
  imports: [MatIcon, NgClass, FormsModule, MatSlideToggle, DatePipe, NgForOf, TitleCasePipe, MatButton],
  templateUrl: './alarm.component.html',
  styleUrl: './alarm.component.css'
})
export class AlarmComponent implements OnInit {
  temperatureAlarm: boolean = true;
  motionAlarm: boolean = true;
  gasAlarm: boolean = true;
  allAlarmsOn: boolean = true;

  alarms :any[]=[];
  private refreshSub!: Subscription;


  constructor(private alarmsService:AlarmsService) {}

  ngOnInit() {
    this.loadAlarms()
    this.refreshSub = interval(2000).subscribe(() => this.loadAlarms());
  }

  loadAlarms() {
    this.alarmsService.getAlarms().subscribe({
      next: (response) => {
        this.alarms = response;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  deleteAlarms() {
    this.alarmsService.deleteAlarms().subscribe({
      next: () => {
        this.loadAlarms();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  toggleAllAlarms(event: boolean) {
    this.temperatureAlarm = event;
    this.motionAlarm = event;
    this.gasAlarm = event;

    this.alarmsService.toggleAlarms({
      temperature: this.temperatureAlarm,
      motion: this.motionAlarm,
      gas: this.gasAlarm
    }).subscribe({
      next: () => console.log('All alarms toggled'),
      error: (err) => console.error(err)
    });
  }

  toggleAlarm(alarm: string) {
    if (alarm === 'temperature') {
      this.temperatureAlarm = !this.temperatureAlarm;
    } else if (alarm === 'motion') {
      this.motionAlarm = !this.motionAlarm;
    } else if (alarm === 'gas') {
      this.gasAlarm = !this.gasAlarm;
    }

    this.alarmsService.toggleAlarms({
      temperature: this.temperatureAlarm,
      motion: this.motionAlarm,
      gas: this.gasAlarm
    }).subscribe({
      next: () => console.log(`${alarm} alarm toggled`),
      error: (err) => console.error(err)
    });
  }
}
