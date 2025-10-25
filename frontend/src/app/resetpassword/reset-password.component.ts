import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { NgOptimizedImage } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { ResetPasswordService } from '../services/resetpassword.service';

@Component({
  selector: 'app-resetPassword',
  imports: [
    FormsModule,
    MatButton,
    MatIcon,
    NgOptimizedImage
  ],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  email: string = '';
  newPassword: string = '';

  constructor(
    private router: Router,
    private resetPasswordService: ResetPasswordService
  ) {}

  resetPassword() {
    const newPassword = {
      email: this.email,
      newPassword: this.newPassword
    };

    this.resetPasswordService.resetPassword(newPassword).subscribe({
      next: (res) => {
        console.log("Password reset successfully", res);
        this.goLogin();
      },
      error: (err) => {
        console.log("Password reset failed", err);
      }
    });
  }

  goLogin() {
    this.router.navigate(['']);
  }
}
