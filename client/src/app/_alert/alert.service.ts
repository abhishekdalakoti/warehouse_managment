﻿import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Alert, AlertType } from './alert.model';

@Injectable({ providedIn: 'root' })
export class AlertService {
    private subject = new Subject<Alert>();
    private keepAfterRouteChange = false;

    constructor(private router: Router) {
        // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
        this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterRouteChange) {
                    // only keep for a single route change
                    this.keepAfterRouteChange = false;
                } else {
                    // clear alert messages
                    this.clear();
                }
            }
        });
    }

    // enable subscribing to alerts observable
    onAlert(alertId?: string): Observable<Alert> {
        return this.subject.asObservable().pipe(filter(x => x && x.alertId === alertId));
    }

    // convenience methods
    success(message: string, keepOnRouteChange: boolean,alertId?: string) {
        this.alert(new Alert({ message, type: AlertType.Success, alertId, keepAfterRouteChange : keepOnRouteChange }));
    }

    error(message: string, keepOnRouteChange: boolean,alertId?: string) {
        this.alert(new Alert({ message, type: AlertType.Error, alertId, keepAfterRouteChange : keepOnRouteChange }));
    }

    info(message: string,keepOnRouteChange: boolean, alertId?: string) {
        this.alert(new Alert({ message, type: AlertType.Info, alertId, keepAfterRouteChange : keepOnRouteChange }));
    }

    warn(message: string, keepOnRouteChange: boolean, alertId?: string) {
        this.alert(new Alert({ message, type: AlertType.Warning, alertId, keepAfterRouteChange : keepOnRouteChange }));
    }

    // main alert method    
    alert(alert: Alert) {
        this.keepAfterRouteChange = alert.keepAfterRouteChange;
        this.subject.next(alert);
    }

    // clear alerts
    clear(alertId?: string) {
        this.subject.next(new Alert({ alertId }));
    }
}