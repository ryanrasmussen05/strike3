import { AppState } from './index';
import { createSelector } from '@ngrx/store';
import { GameDataAction, GameDataActionTypes } from '../actions/game.data.actions';
import { GameData } from '../models/game.data';
import { NFLSchedule } from '../models/nfl.schedule';

export interface GameDataState {
    loading: boolean;
    error: string;
    gameData: GameData;
    schedule: NFLSchedule;
}

const initialState: GameDataState = {
    loading: false,
    error: null,
    gameData: null,
    schedule: null
};

export function reducer(state: GameDataState = initialState, action: GameDataAction): GameDataState {
    switch (action.type) {
        case GameDataActionTypes.GetGameData:
            return {
                ...state,
                loading: true,
                error: null
            };
        case GameDataActionTypes.GetGameDataSuccess:
            return {
                ...state,
                loading: false,
                error: null,
                gameData: action.payload
            };
        case GameDataActionTypes.GetGameDataFailure:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case GameDataActionTypes.UpdateResults:
            return {
                ...state,
                loading: true,
                error: null
            };
        case GameDataActionTypes.UpdateResultsSuccess:
            return {
                ...state,
                loading: false,
                gameData: action.payload,
                error: null
            };
        case GameDataActionTypes.UpdateResultsFailure:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case GameDataActionTypes.UpdateWeek:
            return {
                ...state,
                loading: true,
                error: null
            };
        case GameDataActionTypes.UpdateWeekSuccess:
            return {
                ...state,
                loading: false,
                gameData: action.payload,
                error: null
            };
        case GameDataActionTypes.UpdateWeekFailure:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case GameDataActionTypes.GetSchedule:
            return {
                ...state,
                loading: true,
                error: null,
                schedule: null
            };
        case GameDataActionTypes.GetScheduleSuccess:
            return {
                ...state,
                loading: false,
                error: null,
                schedule: action.payload
            };
        case GameDataActionTypes.GetScheduleFailure:
            return {
                ...state,
                loading: false,
                error: action.payload,
                schedule: null
            };
        case GameDataActionTypes.PostSchedule:
            return {
                ...state,
                loading: true,
                error: null
            };
        case GameDataActionTypes.PostScheduleSuccess:
            return {
                ...state,
                loading: false,
                error: null,
                schedule: null
            };
        case GameDataActionTypes.PostScheduleFailure:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
}

export const GameDataStateSelector = (state: AppState): GameDataState => {
    return state.gameDataState;
};

export const GameDataSelector = createSelector(
    GameDataStateSelector,
    (state: GameDataState) => state.gameData
);
