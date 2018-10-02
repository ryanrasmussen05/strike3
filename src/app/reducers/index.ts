import { ActionReducerMap } from '@ngrx/store';
import { GameDataState, reducer as gameDataReducer } from './game.data.reducer';
import { LoadingState, reducer as loadingStateReducer } from './loading.reducer';
import { UserState, reducer as userStateReducer } from './user.reducer';
import { ContextState, reducer as contextStateReducer } from './context.reducer';
import { PickState, reducer as pickStateReducer } from './pick.reducer';
import { TieBreakerState, reducer as tieBreakerStateReducer } from './tie.breaker.reducer';
import { EmailState, reducer as emailStateReducer } from './email.reducer';

export interface AppState {
    loadingState: LoadingState;
    userState: UserState;
    gameDataState: GameDataState;
    contextState: ContextState;
    pickState: PickState;
    tieBreakerState: TieBreakerState;
    emailState: EmailState;
}

export const reducers: ActionReducerMap<AppState> = {
    gameDataState: gameDataReducer,
    loadingState: loadingStateReducer,
    userState: userStateReducer,
    contextState: contextStateReducer,
    pickState: pickStateReducer,
    tieBreakerState: tieBreakerStateReducer,
    emailState: emailStateReducer
};
