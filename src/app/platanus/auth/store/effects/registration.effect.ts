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
import { registrationAction, registrationActionFailure, registrationActionSuccess } from '../actions/registration.action'


@Injectable()
export class RegistrationEffect {
  registration$ = createEffect(() =>
  this.actions$.pipe(
    ofType(registrationAction),
    switchMap(({request}) => {
      return this.authService.registration(request).pipe(
        map((currentUser: CurrentUserInterface) => {
          this.persistanceService.set('accessToken', currentUser.token);
           
          return registrationActionSuccess({ currentUser});
        }),
        catchError(error => of(registrationActionFailure({ error })))
      );
    })
  )
);

  redirectAfterSubmit$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(registrationActionSuccess),
        tap(() => {
          this.router.navigateByUrl('')

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

