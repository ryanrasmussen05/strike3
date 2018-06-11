import { Component, HostBinding, OnInit } from '@angular/core';
import { LoadingService } from '../../loading/loading.service';

@Component({
    selector: 'app-loading',
    template: `<i class="fa fa-spinner fa-spin size-36"></i>`,
    styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
    @HostBinding('class.hidden') hidden: boolean = true;

    constructor(public loadingService: LoadingService) {
    }

    ngOnInit() {
        this.loadingService.loading$.subscribe((loading: boolean) => {
            console.log('loading: ' + loading);
            this.hidden = !loading;
        });
    }
}
