import { createAction, props } from "@ngrx/store";
import { ActionTypesAuth } from "../actionTypesAuth";

export const logOutAction = createAction(
    ActionTypesAuth.USER_LOG_OUT
  )

export const logOutActionSuccess = createAction(
    ActionTypesAuth.USER_LOG_OUT_SUCCESS
)

// export const logOutActionFailure = createAction(
// ActionTypes.USER_LOG_OUT_FAILURE
// )