import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { NgOptimizedImage } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { RegisterService } from '../services/register.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatIcon,
    NgOptimizedImage
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  username: string = '';
  password: string = '';

  constructor(private router: Router, private registerService: RegisterService) {}

  goLogin() {
    this.router.navigate(['']);
  }

  registerUser() {
    const user = {
      email: this.email,
      name: this.username,
      password: this.password
    };

    this.registerService.register(user).subscribe({
      next: (res) => {
        console.log('Register is successfull:', res);
        this.goLogin();
      },
      error: (err) => {
        console.error('Register failed:', err);
      }
    });
  }
}
