import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmailService } from '../../../email/email.service';
import { LoadingService } from '../../../loading/loading.service';
import { GameDataModel } from '../../../gameData/game.data.model';
import { Subscription } from 'rxjs';
import { AdminViewModel } from '../../../viewModel/admin.view.model';
import { Strike3Game, Strike3Pick, Strike3Player } from '../../../viewModel/strike3.game';
import { Email } from '../../../email/email';

import * as firebase from 'firebase/app';

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

    selectedEmailGroup: string = this.allPlayers;
    recipients: string[] = [];
    subject: string = '';
    emailBody: string = '';
    attachment: File;

    success: boolean = false;
    error: boolean = false;
    errorMessage: string;

    adminViewSubscription: Subscription;

    constructor(public emailService: EmailService, public loadingService: LoadingService, public gameDataModel: GameDataModel,
                public adminViewModel: AdminViewModel) {
    }

    ngOnInit() {
        this.currentWeek = this.gameDataModel.gameData$.getValue().week.weekNumber;

        this.adminViewSubscription = this.adminViewModel.strike3Game$.subscribe((game) => {
            this.strike3Game = game;
            this.updateRecipientList();
        });
    }

    ngOnDestroy() {
        this.adminViewSubscription.unsubscribe();
    }

    getFiles(fileInputEvent: Event) {
        this.attachment = (<HTMLInputElement>fileInputEvent.target).files[0];
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

        this._addAdminEmail();
        console.log(this.recipients);
    }

    sendEmail() {
        this.loadingService.loading();
        this.success = false;
        this.error = false;

        const email: Email = {
            subject: this.subject,
            body: this.emailBody,
            recipients: this.recipients,
            file: this.attachment
        };

        this.emailService.sendEmail(email).then((result: firebase.functions.HttpsCallableResult) => {
            this.loadingService.done();
            this.success = true;
            this.subject = '';
            this.emailBody = '';
            this.attachment = null;
            console.log('send email completed', result);
        }).catch((error) => {
            this.loadingService.done();
            this.error = true;
            this.errorMessage = error;
            console.error('Send Email Error: ', error);
        });
    }

    private _getAllPlayerEmails(): string[] {
        return this.strike3Game.players.map(player => player.email);
    }

    private _getRemainingPlayerEmails(): string[] {
        const emails: string[] = [];

        this.strike3Game.players.forEach((player: Strike3Player) => {
            if (player.strikes < 3) {
                emails.push(player.email);
            }
        });

        return emails;
    }

    private _getMissingPickPlayerEmails(): string[] {
        const emails: string[] = [];

        this.strike3Game.players.forEach((player: Strike3Player) => {
            if (player.strikes < 3) {
                const thisWeeksPick = player.picks.find((pick: Strike3Pick) => {
                    return pick.week === this.currentWeek;
                });

                if (!thisWeeksPick || !thisWeeksPick.team) {
                    emails.push(player.email);
                }
            }
        });

        return emails;
    }

    private _addAdminEmail(): void {
        const adminPlayer = this.strike3Game.players.find((player: Strike3Player) => {
            return player.admin;
        });

        if (adminPlayer) {
            const index = this.recipients.indexOf(adminPlayer.email);

            if (index < 0) {
                this.recipients.push(adminPlayer.email);
            }
        }
    }
}
