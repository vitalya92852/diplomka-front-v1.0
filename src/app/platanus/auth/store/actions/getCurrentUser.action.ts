import { createAction, props } from "@ngrx/store";
import { ActionTypesAuth } from "../actionTypesAuth";
import { CurrentUserInterface } from "../../shared/types/currentUser.interface";



export const getCurrentUserAction = createAction(
    ActionTypesAuth.GET_CURRENT_USER
)

export const getCurrentUserSuccessAction = createAction(
    ActionTypesAuth.GET_CURRENT_USER_SUCCESS,
    props<{currentUser: CurrentUserInterface}>()
)

export const getCurrentUserFailureAction = createAction(
    ActionTypesAuth.GET_CURRENT_USER_FAILURE
)
  