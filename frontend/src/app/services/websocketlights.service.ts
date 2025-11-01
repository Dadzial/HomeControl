import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketLightsService {
  private socket?: Socket;

  connect(url:string) :void {
    if(!this.socket){
      this.socket = io(url);
    }
  }

  on<T>(event: string): Observable<T> {
    return new Observable(observer => {
      this.socket?.on(event, (data: T) => observer.next(data));
      return () => this.socket?.off(event);
    });
  }

  emit(event: string, data?: any): void {
    this.socket?.emit(event, data);
  }

  close(): void {
    this.socket?.disconnect();
    this.socket = undefined;
  }
}
