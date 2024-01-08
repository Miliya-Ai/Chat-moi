import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";

import { ChatPageComponent } from "./chat-page.component";
import { MessagesComponent } from '../messages/messages.component';
import { NewMessageFormComponent} from "../new-message-form/new-message-form.component";
import {HttpClientModule} from "@angular/common/http";
import {MatIconModule} from "@angular/material/icon";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";

describe("ChatPageComponent", () => {
  let component: ChatPageComponent;
  let fixture: ComponentFixture<ChatPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChatPageComponent, MessagesComponent, NewMessageFormComponent],
      imports: [ReactiveFormsModule, HttpClientModule,MatFormFieldModule, MatInputModule, MatIconModule, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
