import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NavigateEnd, NavigateTo, NavigationAction, NavigationActionTypes } from '../actions/navigation.actions';

@Injectable()
export class NavigationEffects {

    constructor(private actions$: Actions, private router: Router) {
    }

    @Effect()
    navigate$: Observable<Action> =
        this.actions$.pipe(
            ofType(NavigationActionTypes.Navigate),
            switchMap((action: NavigationAction) => {
                this.router.navigate([(<NavigateTo>action).payload]);
                return of(new NavigateEnd());
            })
        );
}
