import {createAction, props} from '@ngrx/store'
import { LoginRequestInterface } from '../../types/loginRequest.interface'
import { ActionTypesAuth } from '../actionTypesAuth'
import { CurrentUserInterface } from '../../shared/types/currentUser.interface'




export const loginAction = createAction(
  ActionTypesAuth.LOGIN,
  props<{request: LoginRequestInterface}>()
)

export const loginSuccessAction = createAction(
  ActionTypesAuth.LOGIN_SUCCESS,
  props<{currentUser: CurrentUserInterface}>()
)

export const loginFailureAction = createAction(
  ActionTypesAuth.LOGIN_FAILURE,
  props<{error:string}>()
)

