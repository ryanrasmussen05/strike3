import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Strike3Game, Strike3Pick, Strike3Player } from '../../models/strike3.game';
import { AppState } from '../../reducers';
import { select, Store } from '@ngrx/store';
import { GameData } from '../../models/game.data';
import { GameDataSelector } from '../../reducers/game.data.reducer';
import { AdminViewModelSelector, PlayerViewModelSelector } from '../../reducers/view.model.reducer';
import { PickStatus } from '../../models/pick';
import { Email } from '../../models/email';
import { SendEmail } from '../../actions/email.actions';
import { EmailState, EmailStateSelector } from '../../reducers/email.reducer';
import { AngularFireStorage } from 'angularfire2/storage';
import { UploadTaskSnapshot } from 'angularfire2/storage/interfaces';
import { LoadingBegin, LoadingEnd } from '../../actions/loading.actions';

declare const html2canvas: any;

@Component({
    selector: 'app-send-email',
    templateUrl: './email.component.html',
    styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit, OnDestroy {
    remainingPlayers: string = 'remaining';
    playersMissingPick: string = 'missing';
    allPlayers: string = 'all';

    currentWeek: number;
    strike3Game: Strike3Game;
    screenshotStrike3Game: Strike3Game;

    selectedEmailGroup: string = this.allPlayers;
    recipients: Strike3Player[] = [];
    subject: string = '';
    emailBody: string = '';
    attachment: File;

    sending: boolean = false;
    success: boolean = false;
    error: boolean = false;

    adminViewSubscription: Subscription;
    playerViewSubscription: Subscription;
    gameDataSubscription: Subscription;
    emailStateSubscription: Subscription;

    constructor(private store: Store<AppState>, private storage: AngularFireStorage) {
    }

    ngOnInit() {
        this.gameDataSubscription = this.store.pipe(select(GameDataSelector)).subscribe((gameData: GameData) => {
            this.currentWeek = gameData.week.weekNumber;

            if (this.strike3Game) {
                this.updateRecipientList();
            }
        });

        this.adminViewSubscription = this.store.pipe(select(AdminViewModelSelector)).subscribe((game: Strike3Game) => {
            this.strike3Game = game;
            this.updateRecipientList();
        });

        this.playerViewSubscription = this.store.pipe(select(PlayerViewModelSelector)).subscribe((game: Strike3Game) => {
            this.screenshotStrike3Game = game;
        });

        this.emailStateSubscription = this.store.pipe(select(EmailStateSelector)).subscribe((emailState: EmailState) => {
            this.error = !!emailState.error;
            this.success = this.sending && !emailState.sending;
            this.sending = emailState.sending;
            this.subject = '';
            this.emailBody = '';

            this.selectedEmailGroup = this.allPlayers;
            this.updateRecipientList();
        });
    }

    ngOnDestroy() {
        this.adminViewSubscription.unsubscribe();
        this.playerViewSubscription.unsubscribe();
        this.gameDataSubscription.unsubscribe();
    }

    updateRecipientList() {
        switch (this.selectedEmailGroup) {
            case this.allPlayers:
                this.recipients = this._getAllPlayerEmails();
                break;
            case this.remainingPlayers:
                this.recipients = this._getRemainingPlayerEmails();
                break;
            case this.playersMissingPick:
                this.recipients = this._getMissingPickPlayerEmails();
        }

        this.recipients.sort((a, b): number => {
            if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
            if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
            return 0;
        });
    }

    removePlayer(player: Strike3Player): void {
        this.recipients = this.recipients.filter((currentPlayer: Strike3Player) => {
            return player !== currentPlayer;
        });
    }

    sendEmail() {
        const email: Email = {
            subject: this.subject,
            body: this.emailBody,
            recipients: this._getEmailsForSending()
        };

        this._uploadScreenshot().then((downloadUrl: string) => {
            email.attachment = {filename: 'strike3.png', url: downloadUrl};
            this.store.dispatch(new SendEmail(email));
        }).catch(() => {
            console.log('screenshot failed to attach');
            this.store.dispatch(new SendEmail(email));
        });
    }

    private _getAllPlayerEmails(): Strike3Player[] {
        return [...this.strike3Game.players];
    }

    private _getRemainingPlayerEmails(): Strike3Player[] {
        const players: Strike3Player[] = [];

        this.strike3Game.players.forEach((player: Strike3Player) => {
            if (!this._isPlayerEliminated(player)) {
                players.push(player);
            }
        });

        return players;
    }

    private _getMissingPickPlayerEmails(): Strike3Player[] {
        const players: Strike3Player[] = [];

        const tieBreaker = this.strike3Game.tieBreakers.get(this.currentWeek);

        this.strike3Game.players.forEach((player: Strike3Player) => {
            if (player.strikes < 3) {
                const thisWeeksPick = player.picks.find((pick: Strike3Pick) => {
                    return pick.week === this.currentWeek;
                });

                if (!thisWeeksPick || !thisWeeksPick.team || (tieBreaker && !thisWeeksPick.tieBreakerTeam)) {
                    players.push(player);
                }
            }
        });

        return players;
    }

    private _isPlayerEliminated(player: Strike3Player): boolean {
        if (player.strikes < 3) {
            return false;
        }

        let strikes: number = 0;
        let eliminationWeek: number = 100;

        for (const pick of player.picks) {
            if (pick.status === PickStatus.Loss) {
                strikes = strikes + 1;
            } else if (pick.status === PickStatus.Tie) {
                strikes = strikes + 0.5;
            }

            if (strikes >= 3) {
                eliminationWeek = pick.week;
                break;
            }
        }

        return (eliminationWeek < this.currentWeek - 1);
    }

    private _getEmailsForSending(): string[] {
        const emails: string[] = this.recipients.map(player => player.email);

        const adminPlayer = this.strike3Game.players.find((player: Strike3Player) => {
            return player.admin;
        });

        if (adminPlayer) {
            const index = this.recipients.indexOf(adminPlayer);

            if (index < 0) {
                emails.push(adminPlayer.email);
            }
        }

        return emails;
    }

    // for simplicity, triggering loading function rather than creating actions/effects
    private _uploadScreenshot(): Promise<string> {
        this.store.dispatch(new LoadingBegin());

        return new Promise((resolve, reject) => {
            this._screenshot().then((downloadUrl: string) => {
                this.store.dispatch(new LoadingEnd());
                resolve(downloadUrl);
            }).catch((error) => {
                this.store.dispatch(new LoadingEnd());
                reject(error);
                console.error('screenshot failed', error);
            });
        });
    }

    private _screenshot(): Promise<string> {
        const config = {
            backgroundColor: '#ffffff',
            width: 1100,
            onclone: (document) => {
                // makes local clone, in that clone make sure the table is visible
                document.getElementById('email-screenshot').style.display = 'block';
                document.getElementById('email-screenshot').style.backgroundColor = 'white';
            }
        };

        return html2canvas(document.getElementById('email-screenshot'), config).then((canvas) => {
            return this._canvasToBlob(canvas).then((blob) => {
                return this._uploadBlob(blob);
            });
        });
    }

    private _canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
        return new Promise((resolve, reject) => {
            try {
                canvas.toBlob((blob) => {
                    resolve(blob);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    private _uploadBlob(blob: Blob): Promise<string> {
        return this.storage.upload('screenshot.png', blob).then((snapshot: UploadTaskSnapshot) => {
            return snapshot.ref.getDownloadURL();
        });
    }
}
