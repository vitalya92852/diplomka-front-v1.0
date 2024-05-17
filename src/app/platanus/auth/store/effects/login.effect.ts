import {Injectable} from '@angular/core'
import {createEffect, Actions, ofType} from '@ngrx/effects'
import {map, catchError, switchMap, tap} from 'rxjs/operators'
import {HttpErrorResponse} from '@angular/common/http'
import {Router} from '@angular/router'
import {of} from 'rxjs'
import { loginAction, loginFailureAction, loginSuccessAction } from '../actions/login.action'

import { AuthService } from '../../services/auth.service'
import { PersistanceService } from '../../shared/services/persistance.service'
import { CurrentUserInterface } from '../../shared/types/currentUser.interface'


@Injectable()
export class LoginEffect {
  login$ = createEffect(() =>
  this.actions$.pipe(
    ofType(loginAction),
    switchMap(({request}) => {
      return this.authService.login(request).pipe(
        map((currentUser: CurrentUserInterface) => {
          this.persistanceService.set('accessToken', currentUser.token);
           
          return loginSuccessAction({ currentUser});
        }),
        catchError(error => of(loginFailureAction({ error })))
      );
    })
  )
);

  redirectAfterSubmit$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccessAction),
        tap(() => {
          this.authService.getCurrentUser().subscribe((user:CurrentUserInterface)=>{
            if(user.role.includes('ROLE_USER')){
              this.router.navigateByUrl('/goal')
            } 
            if(user.role.includes('ROLE_TEACHER')){
              this.router.navigateByUrl('/teacher')
            }
          })
          
        })
      ),
    {dispatch: false}
  )

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private persistanceService: PersistanceService,
    private router: Router,
  ) {}
}

