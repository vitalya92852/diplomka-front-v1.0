import {Injectable} from '@angular/core'
import {createEffect, Actions, ofType} from '@ngrx/effects'
import {map, catchError, switchMap, tap} from 'rxjs/operators'
import {of} from 'rxjs'


import { AuthService } from '../../services/auth.service'
import { PersistanceService } from '../../shared/services/persistance.service'
import { CurrentUserInterface } from '../../shared/types/currentUser.interface'
import { getCurrentUserAction, getCurrentUserFailureAction, getCurrentUserSuccessAction } from '../actions/getCurrentUser.action'


@Injectable()
export class getCurrentUserEffect {
  getCurrentUser$ = createEffect(() =>
  this.actions$.pipe(
    ofType(getCurrentUserAction),
    switchMap(() => {
        const token = this.persistenceService.get('accessToken')
        if(!token){
            return of(getCurrentUserFailureAction())
        }
      return this.authService.getCurrentUser().pipe(
        map((currentUser: CurrentUserInterface) => {

          return getCurrentUserSuccessAction({currentUser})
        }),
        catchError(()=> of(getCurrentUserFailureAction()))
      );
    })
  )
);


  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private persistenceService: PersistanceService

  ) {}
}

