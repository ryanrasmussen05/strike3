import { Component, HostBinding, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../reducers';
import { LoadingSelector } from '../../reducers/loading.reducer';

@Component({
    selector: 'app-loading',
    template: `<i class="fa fa-spinner fa-spin size-36"></i>`,
    styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {
    @HostBinding('class.hidden') hidden: boolean = true;

    constructor(private store: Store<AppState>) {
    }

    ngOnInit() {
        this.store.pipe(select(LoadingSelector)).subscribe((loading: boolean) => {
            this.hidden = !loading;
        });
    }
}
