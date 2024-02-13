import {createReducer, on, Action, createFeature} from '@ngrx/store'
import { AuthStateInterface } from '../types/authState.interface'

import { loginAction, loginFailureAction, loginSuccessAction } from './actions/login.action'
import { getCurrentUserAction, getCurrentUserFailureAction, getCurrentUserSuccessAction } from './actions/getCurrentUser.action';
import { logOutAction, logOutActionSuccess } from './actions/logOut.action';



const initialState: AuthStateInterface = {
  isSubmitting: false,
  isLoading:false,
  currentUser: null,
  isLoggedIn: null
}

export const AUTH_FEATURE_KEY = 'auth';

export const authReducer = createReducer(
  initialState,
  on(
    loginAction,
    (state): AuthStateInterface => ({
      ...state,
      isSubmitting: true,
    })
  ),
  on(
    loginSuccessAction,
    (state, action): AuthStateInterface => ({
      ...state,
      isSubmitting: false,
      isLoggedIn: true,
      currentUser: action.currentUser
    })
  ),
  on(
    loginFailureAction,
    (state): AuthStateInterface => ({
      ...state,
      isSubmitting: false,
    })
  ),
  on(
    getCurrentUserAction,
    (state): AuthStateInterface =>({
      ...state,
      isLoading:true
    })
  ),
  on(
    getCurrentUserSuccessAction,
    (state,action): AuthStateInterface =>({
      ...state,
      isLoading:false,
      isLoggedIn:true,
      currentUser:action.currentUser
    })
  ),
  on(
    getCurrentUserFailureAction,
    (state): AuthStateInterface =>({
      ...state,
      isLoading:false,
      isLoggedIn:false,
      currentUser:null,
    })
  ),
  on(
    logOutActionSuccess,
    (state): AuthStateInterface =>({
      ...state,
      isLoading:false,
      isLoggedIn:false,
      currentUser:null,
    })
  ),
)


