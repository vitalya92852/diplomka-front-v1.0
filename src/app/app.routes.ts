import { Routes, mapToCanActivate } from '@angular/router';
import { LoginComponent } from './platanus/auth/components/login/login.component';
import { provideEffects } from '@ngrx/effects';
import { LoginEffect } from './platanus/auth/store/effects/login.effect';
import { HttpClientModule } from '@angular/common/http';
import { GoalComponent } from './platanus/goal/components/goal.component';
import { TeacherComponent } from './platanus/teacher/components/teacher.component';
import { AimComponent } from './platanus/aim/components/aim.component';
import { CreateResumeComponent } from './platanus/studentResume/components/studentResume.component';
import { RegistrationComponent } from './platanus/auth/components/registration/registration.component';




export const routes: Routes = [
    {
        path:'registration',
        component:RegistrationComponent
    },
    {
        path:'login',
        component:LoginComponent,
        
    },
    {
        path:'goal',
        component:GoalComponent,
    },
    {
        path:'teacher',
        component:TeacherComponent
    },
    {
        path:'aim',
        component:AimComponent
    },
    {
        path:'createResume',
        component:CreateResumeComponent
    }
];
