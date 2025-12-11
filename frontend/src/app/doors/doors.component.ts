import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { AnimationOptions } from 'ngx-lottie';
import type { AnimationItem } from 'lottie-web';
import { LottieComponent } from 'ngx-lottie';
import {GateService} from '../services/gate.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-doors',
  standalone: true,
  imports: [MatButton, LottieComponent, DatePipe],
  templateUrl: './doors.component.html',
  styleUrls: ['./doors.component.css']
})
export class DoorsComponent {
  isOpen = false;
  animation!: AnimationItem;
  lastActionTime: Date = new Date();

  constructor(private gateService:GateService) {
  }

  options: AnimationOptions = {
    path: '/assets/gate_open.json',
    autoplay: false,
    loop: false,
  };

  animationCreated(anim: AnimationItem) {
    this.animation = anim;
    this.animation.goToAndStop(90, true);
  }

  openGate() {
    this.gateService.openGate().subscribe({
      next: (response) => {
        this.lastActionTime = new Date(response.timestamp)
        console.log(response);
        if (this.animation) {
          this.isOpen = true;
          this.animation.playSegments([90, 20], true);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  closeGate() {
    this.gateService.closeGate().subscribe({
      next: (response) => {
        this.lastActionTime = new Date(response.timestamp)
        console.log(response);
        if (this.animation) {
          this.isOpen = false;
          this.animation.playSegments([20, 90], true);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }



}
