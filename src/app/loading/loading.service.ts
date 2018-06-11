import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LoadingService {
    loading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    loading() {
        this.loading$.next(true);
    }

    done() {
        this.loading$.next(false);
    }
}
