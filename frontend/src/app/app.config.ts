import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations';
import { provideLottieOptions } from 'ngx-lottie';
import { routes } from './app.routes';
import {providePrimeNG} from 'primeng/config';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';




export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideLottieOptions({
      player:() => import('lottie-web'),
    }),
    provideAnimationsAsync(),
    providePrimeNG()
  ],
};
