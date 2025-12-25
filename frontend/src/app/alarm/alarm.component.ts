import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { DatePipe, NgClass, NgForOf, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { AlarmsService, AlarmSettings } from '../services/alarms.service';
import { MatButton, MatIconButton } from '@angular/material/button';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-alarm',
  imports: [MatIcon, NgClass, FormsModule, MatSlideToggle, DatePipe, NgForOf, TitleCasePipe, MatIconButton],
  templateUrl: './alarm.component.html',
  styleUrl: './alarm.component.css'
})
export class AlarmComponent implements OnInit, OnDestroy {
  temperatureAlarm: boolean = true;
  motionAlarm: boolean = true;
  gasAlarm: boolean = true;


  allAlarmsOn: boolean = true;

  alarms: any[] = [];
  private refreshSub!: Subscription;

  constructor(private alarmsService: AlarmsService) {}

  ngOnInit() {
    this.loadSettings();
    this.loadAlarms();
    this.refreshSub = interval(2000).subscribe(() => this.loadAlarms());
  }

  ngOnDestroy() {
    if (this.refreshSub) {
      this.refreshSub.unsubscribe();
    }
  }

  loadSettings() {
    this.alarmsService.getSettings().subscribe({
      next: (settings: AlarmSettings) => {
        this.temperatureAlarm = settings.temperature;
        this.motionAlarm = settings.motion;
        this.gasAlarm = settings.gas;


        this.checkMasterToggleState();

        console.log('Załadowano ustawienia alarmów:', settings);
      },
      error: (err) => console.error('Błąd pobierania ustawień:', err)
    });
  }

  loadAlarms() {
    this.alarmsService.getAlarms().subscribe({
      next: (response) => {
        this.alarms = response;
      },
      error: (err) => console.error(err)
    });
  }

  deleteAlarms() {
    this.alarmsService.deleteAlarms().subscribe({
      next: () => this.loadAlarms(),
      error: (err) => console.error(err)
    });
  }

  toggleAllAlarms(event: boolean) {
    this.allAlarmsOn = event;
    this.temperatureAlarm = event;
    this.motionAlarm = event;
    this.gasAlarm = event;

    ['temperature', 'motion', 'gas'].forEach(type => {
      this.alarmsService.toggleAlarms(type, event).subscribe({
        next: () => console.log(`${type} alarm set to ${event}`),
        error: (err) => console.error(err)
      });
    });
  }


  toggleAlarm(alarm: string) {
    let type: string = alarm;
    let enabled: boolean = false;

    if (alarm === 'temperature') {
      this.temperatureAlarm = !this.temperatureAlarm;
      enabled = this.temperatureAlarm;
    } else if (alarm === 'motion') {
      this.motionAlarm = !this.motionAlarm;
      enabled = this.motionAlarm;
    } else if (alarm === 'gas') {
      this.gasAlarm = !this.gasAlarm;
      enabled = this.gasAlarm;
    } else return;


    this.checkMasterToggleState();

    this.alarmsService.toggleAlarms(type, enabled).subscribe({
      next: () => console.log(`${type} alarm is now ${enabled ? 'enabled' : 'disabled'}`),
      error: (err) => {
        console.error(err);
        if (alarm === 'temperature') this.temperatureAlarm = !enabled;
        if (alarm === 'motion') this.motionAlarm = !enabled;
        if (alarm === 'gas') this.gasAlarm = !enabled;
        this.checkMasterToggleState();
      }
    });
  }


  private checkMasterToggleState() {
    this.allAlarmsOn = this.temperatureAlarm && this.motionAlarm && this.gasAlarm;
  }
}
