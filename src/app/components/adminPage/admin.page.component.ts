import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { UserModel } from '../../user/user.model';
import { GameDataModel } from '../../gameData/game.data.model';
import { merge, Subscription } from 'rxjs';
import { AdminViewModel } from '../../viewModel/admin.view.model';
import { Strike3Game } from '../../viewModel/strike3.game';
import { GameDataService } from '../../gameData/game.data.service';
import { LoadingService } from '../../loading/loading.service';
import { EmailService } from '../../email/email.service';

declare const html2canvas: any;
declare const download: any;

@Component({
    templateUrl: './admin.page.component.html',
    styleUrls: ['./admin.page.component.scss']
})
export class AdminPageComponent implements OnInit, OnDestroy, AfterViewInit {
    admin: boolean = false;
    superuser: boolean = false;
    strike3Game: Strike3Game;

    attachment: File;

    playerSubscription: Subscription;
    adminViewSubscription: Subscription;

    constructor(public userModel: UserModel, public gameDataModel: GameDataModel, public gameDataService: GameDataService,
                public adminViewModel: AdminViewModel, public loadingService: LoadingService, public emailService: EmailService) {
    }

    ngAfterViewInit() {
        $('#admin-view').foundation();
    }

    ngOnInit() {
        this.adminViewSubscription = this.adminViewModel.strike3Game$.subscribe((game) => {
            this.strike3Game = game;
        });

        this.playerSubscription = merge(this.userModel.currentUser$, this.gameDataModel.gameData$).subscribe(() => {
            const currentUser = this.userModel.currentUser$.getValue();
            this.admin = this.gameDataModel.canAccessAdmin(currentUser ? currentUser.uid : null);
            this.superuser = this.gameDataModel.canAccessSuperuser(currentUser ? currentUser.uid : null);
        });
    }

    ngOnDestroy() {
        this.playerSubscription.unsubscribe();
        this.adminViewSubscription.unsubscribe();
    }

    updateResults() {
        this.loadingService.loading();

        this.gameDataService.updateResults().then(() => {
            this.loadingService.done();
        }).catch((error) => {
            console.error(error);
            this.loadingService.done();
        });
    }

    screenshot() {
        const tabContainer = $('.tabs-content');
        tabContainer.removeClass('overflow-auto');

        html2canvas($('#game-table-results'), {
            background: '#ffffff',
            width: 1050,
            onrendered: function (canvas) {
                tabContainer.addClass('overflow-auto');
                download(canvas.toDataURL('image/png'), 'strike3.png', 'image/png');
            }
        });
    }

    getFiles(fileInputEvent: Event) {
        this.attachment = (<HTMLInputElement>fileInputEvent.target).files[0];
    }

    sendEmail() {
        let promise: Promise<void>;

        if (this.attachment) {
            promise = this.emailService.uploadAttachmentAndSend(this.attachment);
        } else {
            promise = this.emailService.sendEmail();
        }

        promise.then(() => {
            console.log('send email call completed');
        }).catch((error) => {
            console.error('Send Email Error: ', error);
        });
    }
}
