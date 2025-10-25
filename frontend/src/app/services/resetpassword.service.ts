import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ChangePassword {
  email : string;
  newPassword : string;
}

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  private apiUrl = 'http://localhost:3100/api/user';

  constructor(private http : HttpClient) { }

  resetPassword(newPassword:ChangePassword):Observable<ChangePassword> {
    return this.http.post<ChangePassword>(`${this.apiUrl}/reset-password`, newPassword);
  }
}
