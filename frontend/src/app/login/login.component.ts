import { Component , OnInit , OnDestroy} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {NgOptimizedImage} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {AuthService} from '../services/auth.service';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [MatIconModule, NgOptimizedImage, MatButton, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit ,OnDestroy {
  username :string = '';
  password :string = '';

  constructor(private authService: AuthService,private router: Router) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token && !this.authService.isTokenExpired(token)) {
      console.log("User already logged in , redirecting ...")
      this.router.navigate(['/home']);
    }
  }

  ngOnDestroy(): void {
    console.log("Component destroyed");
  }

  onSubmit(event: Event) {
    event.preventDefault();
    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        console.log('Token:', res.token);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error:', err);
      }
    });
  }
}
