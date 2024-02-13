import { Routes, mapToCanActivate } from '@angular/router';
import { LoginComponent } from './platanus/auth/components/login/login.component';
import { provideEffects } from '@ngrx/effects';
import { LoginEffect } from './platanus/auth/store/effects/login.effect';
import { HttpClientModule } from '@angular/common/http';
import { GoalComponent } from './platanus/goal/components/goal.component';




export const routes: Routes = [
    {
        path:'login',
        component:LoginComponent,
        
    },
    {
        path:'goal',
        component:GoalComponent,
    }
];
