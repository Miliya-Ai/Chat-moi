import {Component, Input} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MessagesService} from '../messages.service';
import {FileReaderService} from "../FileReaderService";

@Component({
    selector: 'app-new-message-form',
    templateUrl: './new-message-form.component.html',
    styleUrls: ['./new-message-form.component.css']
})
export class NewMessageFormComponent {
    @Input() username: string | null = null
    file: File | null = null;
    messageForm = this.fb.group({
        msg: "",
    });

    constructor(private fb: FormBuilder,
                private messagesService: MessagesService,
                private fileReaderService: FileReaderService) {
    }

    onPublishMessage() {
        /*if (this.username && this.messageForm.valid && this.messageForm.value.msg) {
            this.messagesService.postMessage({
                text: this.messageForm.value.msg,
                username: this.username,
                imageData: null,
            });
        }*/
        if (this.username && this.messageForm.valid && (this.messageForm.value.msg || this.file)) {
            if (this.file) {
                this.fileReaderService.readFile(this.file).then((chatImageData) => {
                    this.messagesService.postMessage({
                        text: this.messageForm.value.msg,
                        username: this.username,
                        imageData: chatImageData,
                    });

                    this.file = null;
                    this.messageForm.reset();
                });
            } else {
                this.messagesService.postMessage({
                    text: this.messageForm.value.msg,
                    username: this.username,
                    imageData: null,
                });

                this.messageForm.reset();
            }
        }

        this.messageForm.reset();
    }
    fileChanged(event: any) {
        this.file = event.target.files[0];
    }


}
