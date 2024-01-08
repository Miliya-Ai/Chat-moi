import {computed, inject, Injectable} from "@angular/core";
import {BehaviorSubject, firstValueFrom, Observable, timestamp} from "rxjs";
import {ChatImageData, Message, NewMessageRequest} from "./message.model";
import {environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {AuthenticationService} from "../login/authentication.service";

@Injectable({
    providedIn: "root",
})
export class MessagesService {
    messages = new BehaviorSubject<Message[]>([]);

    constructor(private http: HttpClient,private authentificationService: AuthenticationService ) {
    }

    getMessages(): Observable<Message[]> {
        return this.messages.asObservable();
    }

    async fetchMessages() {
        const lenght = this.messages.value.length
        const fromId = this.messages.value.length ? this.messages.value[lenght - 1].id : " ";
        const paramsFromId = {fromId: fromId}
        const data = async() => {
            let data;
            try {
                data = await firstValueFrom(this.http.get<Message[]>(
                    `${environment.backendUrl}/messages`,
                    {
                        params: paramsFromId,
                        withCredentials: true
                    }
                ))
            } catch (e){
                if (e instanceof HttpErrorResponse){
                    if (e.status === 403){
                        this.authentificationService.logout()
                    }
                }
            }
            return data
        }

        const newMessages = await data()
        if (fromId === " ") {
            let allMessages = this.messages.value;
            if (newMessages === undefined){
                return
            }
            for (const messages of newMessages) {
                // @ts-ignore
                messages.timestamp = new Date(messages.timestamp * 1000)
                allMessages.push(messages)
            }
            this.messages.next(allMessages)
        } else {
            if (newMessages === undefined){
                return
            }
            for (const messages of newMessages) {
                // @ts-ignore
                messages.timestamp = new Date(messages.timestamp * 1000)
            }
            this.messages.next(newMessages)
        }
        // const lenght = this.messages.value.length
        // const fromId = this.messages.value.length ? this.messages.value[lenght - 1].id : " ";
        // const paramsFromId = {fromId: fromId}
        // const newMessages = await firstValueFrom(this.http.get<Message[]>(
        //     `${environment.backendUrl}/messages`,
        //     {
        //         params: paramsFromId,
        //         withCredentials: true
        //     } //envoie les cookies
        // ))
        //
        // if (fromId === " ") {
        //     let allMessages = this.messages.value;
        //     for (const messages of newMessages) {
        //         // @ts-ignore
        //         messages.timestamp = new Date(messages.timestamp * 1000)
        //         allMessages.push(messages)
        //     }
        //     this.messages.next(allMessages)
        // } else {
        //     for (const messages of newMessages) {
        //         // @ts-ignore
        //         messages.timestamp = new Date(messages.timestamp * 1000)
        //     }
        //     this.messages.next(newMessages)
        // }


    }

    async postMessage(message: { imageData: ChatImageData | null; text: string | null | undefined; username: string | null })  {
        const currentMessages = this.messages.value;
            // @ts-ignore
            currentMessages.push(message);
            try {
                await firstValueFrom(
                    this.http.post(`${environment.backendUrl}/messages`, message, { withCredentials: true })
                )
                console.log("Message posté");
            } catch (e) {
                console.log("Oups, message non posté", e);
                if (e instanceof HttpErrorResponse){
                    if (e.status === 403){
                        this.authentificationService.logout()
                    }
                }

            }
        }

}
