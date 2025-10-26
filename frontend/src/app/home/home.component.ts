import { Component , OnInit, OnDestroy , AfterViewInit } from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import {LogoutService} from '../services/logout.service';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {TemperatureComponent} from '../temperature/temperature.component';
import {AlarmComponent} from '../alarm/alarm.component';
import {DoorsComponent} from '../doors/doors.component';
import {EnergyComponent} from '../energy/energy.component';
import {HumidityComponent} from '../humidity/humidity.component';
import {LightsComponent} from '../lights/lights.component';
import {CO2SensorComponent} from '../co2-sensor/co2-sensor.component';
import {WeatherComponent} from '../weather/weather.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatIcon, MatToolbarModule, MatIconButton, TemperatureComponent, AlarmComponent, DoorsComponent, EnergyComponent, HumidityComponent, LightsComponent, CO2SensorComponent, WeatherComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy , AfterViewInit {

  public displayName: string = '';

  constructor(private logoutService:LogoutService,private router:Router ,private authService:AuthService) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token && !this.authService.isTokenExpired(token)) {
      console.log("User already logged in, redirecting...");
      this.router.navigate(['/home']);
    }

    const name = this.authService.getDisplayName();
    this.displayName = name || '';
  }

  ngAfterViewInit(): void {
    console.log('View of component has been rendered');
  }

  ngOnDestroy(): void {
    console.log('Component has been destroyed');
  }

  public onLogout(): void {
    const userId = this.authService.getUserId();
    if (!userId) {
      this.clearAndRedirect();
      return;
    }

    this.logoutService.removeHashSession(userId).subscribe({
      next: () => this.clearAndRedirect(),
      error: () => this.clearAndRedirect()
    });
  }

  private clearAndRedirect(): void {
    localStorage.removeItem('token');
    this.router.navigate(['']);
  }
}
