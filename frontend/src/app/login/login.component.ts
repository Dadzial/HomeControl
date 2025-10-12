import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {NgOptimizedImage} from '@angular/common';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [MatIconModule, NgOptimizedImage, MatButton],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

}
