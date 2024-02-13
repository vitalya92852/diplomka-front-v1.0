import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { logOutAction, logOutActionSuccess } from "../actions/logOut.action";
import { of, switchMap, tap } from "rxjs";
import { PersistanceService } from "../../shared/services/persistance.service";
import { Router } from "@angular/router";

@Injectable()
export class LogOutEffect {

    login$ = createEffect(() =>
    this.actions$.pipe(
        ofType(logOutAction),
        switchMap(() => {
        this.persistanceService.delete();

        return of(logOutActionSuccess());
        })
    )
    );


    constructor(
        private actions$: Actions,
        private router: Router,
        private persistanceService: PersistanceService
      ) {}
}