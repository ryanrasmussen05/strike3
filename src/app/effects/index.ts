import { GameDataEffects } from './game.data.effects';
import { UserEffects } from './user.effects';
import { NavigationEffects } from './navigation.effects';
import { PickEffects } from './pick.effects';
import { TieBreakerEffects } from './tie.breaker.effects';
import { EmailEffects } from './email.effects';

export const effects: any[] = [
    GameDataEffects,
    UserEffects,
    NavigationEffects,
    PickEffects,
    TieBreakerEffects,
    EmailEffects
];
