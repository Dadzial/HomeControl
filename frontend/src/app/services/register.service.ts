import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface IUser {
  _id?: string;
  email: string;
  name: string;
  password?: string;
  role?: 'admin' | 'user';
  active?: boolean;
  isAdmin?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private apiUrl = 'http://localhost:3100/api/user'

  constructor(private http: HttpClient) { }

  register(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(`${this.apiUrl}/create`, user);
  }
}
