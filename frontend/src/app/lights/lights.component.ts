import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebSocketLightsService } from '../services/websocketlights.service';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatIcon} from '@angular/material/icon';

import {NgForOf, NgStyle} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-lights',
  templateUrl: './lights.component.html',
  imports: [
    MatIcon,
    MatSlideToggle,
    NgStyle,
    FormsModule,
    NgForOf
  ],
  styleUrls: ['./lights.component.css']
})
export class LightsComponent implements OnInit, OnDestroy {
  lights = [
    { name: 'Kitchen', icon: 'kitchen', on: false },
    { name: 'Garage', icon: 'garage', on: false },
    { name: 'Bath', icon: 'bathtub', on: false },
    { name: 'Room', icon: 'bed', on: false }
  ];

  private sub?: Subscription;

  constructor(private wsService: WebSocketLightsService) {}

  ngOnInit() {
    this.wsService.connect('http://localhost:3000');

    this.sub = this.wsService.on<{ status: any, usage: any }>('light:status')
      .subscribe(msg => {
        for (const light of this.lights) {
          light.on = msg.status[light.name.toLowerCase()];
        }
        console.log('Usage:', msg.usage);
      });

    this.wsService.emit('light:status:get');
  }

  toggleLight(light: any, state: boolean) {
    light.on = state;
    this.wsService.emit('light:toggle', { room: light.name.toLowerCase(), state: state });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.wsService.close();
  }
}
