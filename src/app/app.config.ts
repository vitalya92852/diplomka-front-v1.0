import { APP_INITIALIZER, ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideEffects } from '@ngrx/effects';
import { AUTH_FEATURE_KEY, authReducer } from './platanus/auth/store/auth.reducers';
import { LoginEffect } from './platanus/auth/store/effects/login.effect';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';

import { getCurrentUserEffect } from './platanus/auth/store/effects/getCurrentUser.effect';

import { loadinterceptor } from './platanus/auth/shared/services/authintercepter.service';
import { LogOutEffect } from './platanus/auth/store/effects/logOut.effect';



export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),



    provideHttpClient(
      withInterceptors([
        loadinterceptor
      ])
    ),

    provideStore({
      [AUTH_FEATURE_KEY]: authReducer,
    }),

    provideEffects(
      LoginEffect,
      getCurrentUserEffect,
      LogOutEffect,
      // GetGoalDataEffect
    ),

    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
      connectInZone: true // If set to true, the connection is established within the Angular zone
    })
  ],
    
};
