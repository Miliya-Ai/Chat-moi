import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMessageFormComponent } from './new-message-form.component';
import {HttpClientModule} from "@angular/common/http";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {ReactiveFormsModule} from "@angular/forms";

describe('NewMessageFormComponent', () => {
  let component: NewMessageFormComponent;
  let fixture: ComponentFixture<NewMessageFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewMessageFormComponent],
      imports: [ReactiveFormsModule,HttpClientModule, MatFormFieldModule, MatInputModule, MatIconModule, NoopAnimationsModule]
    });
    fixture = TestBed.createComponent(NewMessageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
