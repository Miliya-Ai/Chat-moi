import { AfterViewInit, Component, Input, ElementRef, ViewChild} from '@angular/core';
import { Message } from '../message.model';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent {
  @Input() username: string | null = null
  @Input() messages: Message[] = []
  @ViewChild("chatContainer") chatContainer: ElementRef | undefined

  /** Afficher la date seulement si la date du message précédent est différente du message courant. */
  showDateHeader(messages: Message[] | null, i: number) {
    if (messages != null) {
      if (i === 0) {
        return true;
      } else {
        const prev = new Date(messages[i - 1].timestamp).setHours(0, 0, 0, 0);
        const curr = new Date(messages[i].timestamp).setHours(0, 0, 0, 0);
        return prev != curr;
      }
    }
    return false;
  }

  ngAfterViewChecked() {
    this.scroll();
  }

  scroll() {
  if (this.chatContainer) {
    this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight
  }
}

}
