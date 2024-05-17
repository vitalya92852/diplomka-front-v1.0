import { createAction, props } from "@ngrx/store";
import { ActionTypesAuth } from "../actionTypesAuth";
import { RegistrationRequestInterface } from "../../types/registrationRequestInterface";
import { CurrentUserInterface } from "../../shared/types/currentUser.interface";

    export const registrationAction = createAction(
        ActionTypesAuth.REGISTRATION,
        props<{request: RegistrationRequestInterface}>()
    )

    export const registrationActionSuccess = createAction(
        ActionTypesAuth.REGISTRATION_SUCCESS,
        props<{currentUser:CurrentUserInterface}>()
    )

    export const registrationActionFailure = createAction(
        ActionTypesAuth.REGISTRATION_FAILURE,
        props<{error:string}>()
    )