import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthenticationService } from "src/app/login/authentication.service";
import { Message } from "../message.model";
import { MessagesService } from "../messages.service";
import { Router } from "@angular/router";
import {WebSocketService} from "../webSocketService";

@Component({
  selector: "app-chat-page",
  templateUrl: "./chat-page.component.html",
  styleUrls: ["./chat-page.component.css"],
})
export class ChatPageComponent implements OnInit, OnDestroy {
  username$ = this.authenticationService.getUsername();
  username: string | null = null;
  usernameSubscription: Subscription;
  // Ajouter un attribut pour l'abonnement aux messages
  messagesSubscription: Subscription;

  messages$ = this.messagesService.getMessages();
  messages: Message[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private messagesService: MessagesService,
    private webSocketService: WebSocketService
  ) {
    this.usernameSubscription = this.username$.subscribe((u) => {
      this.username = u;
    });
    // // Abonnement aux messages
    this.messagesSubscription = this.messages$.subscribe((messages: any) => {
      this.messages = messages;
    });
  }
  ngOnInit(): void {
    this.messagesService.fetchMessages(); //pour avoir les messages des le debut
    this.webSocketService.connect().subscribe((m)=> {
          if (m === "notif"){
            this.messagesService.fetchMessages();
          }
    })
  }

  ngOnDestroy(): void {
    if (this.usernameSubscription) {
      this.usernameSubscription.unsubscribe();
    }
    // // Désabonnement aux messages
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
    this.webSocketService.disconnect()
  }

  onLogout() {
    this.authenticationService.logout();
    // this.router.navigate(["/login"]);
  }
}
