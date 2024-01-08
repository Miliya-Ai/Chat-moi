import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {environment} from "../../environments/environment";

export type WebSocketEvent = "notif"

@Injectable({
    providedIn: "root",
})
export class WebSocketService{
    private ws: WebSocket | null = null;

    constructor() {
    }
    /*public connect(): Observable<WebSocketEvent> {
        this.ws = new WebSocket(`${environment.wsUrl}/notifications`)
        const events = new Subject<WebSocketEvent>()

        this.ws.onmessage = () => events.next("notif");
        this.ws.onclose = () => {
            events.complete()
            setTimeout(() => {
                // this.connect().subscribe(events)
                this.connect()
            }, 2000)
        };
        this.ws.onerror = () => events.error("error");

        return events.asObservable();
    }*/

    public connect(): Observable<WebSocketEvent> {
        const events = new Subject<WebSocketEvent>();
        this.createWebSocket(events);
        return events.asObservable();
    }

    private createWebSocket(events: Subject<WebSocketEvent>): void {
        this.ws = new WebSocket(`${environment.wsUrl}/notifications`);

        this.ws.onmessage = () => events.next("notif");
        this.ws.onclose = () => {
            events.complete();
            setTimeout(() => {
                this.connect();
            }, 2000);
        };
        this.ws.onerror = () => events.error("error");
    }

    public disconnect() {
        this.ws?.close();
        this.ws = null;
    }
}