import {Injectable} from '@angular/core';
import {Subject, Subscription} from "rxjs";
import {filter, map} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class EventService {

    private subject$ = new Subject<any>();

    on(event: Events, action: any): Subscription {
        return this.subject$
            .pipe(
                filter((e: EmitEvent) => {
                    return e.name === event;
                }),
                map((e: EmitEvent) => {
                    return e.value;
                })
            )
            .subscribe(action);
    }

    emit(event: EmitEvent) {
        this.subject$.next(event);
    }
}

export class EmitEvent {

    constructor(public name: any, public value?: any) {
    }

}

export enum Events {
    USER_LOGIN_LOGUT,
    USER_STATUS_CHANGE,
    CHAT_EVENTS,
    CANCEL_REQUEST,
    CHAT_REQUEST_UPDATED,
    CHAT_MSG,
    SEND_MSG
}
