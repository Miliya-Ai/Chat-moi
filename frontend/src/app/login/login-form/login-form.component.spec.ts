import {ComponentFixture, fakeAsync, TestBed, tick} from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";

import { LoginFormComponent } from "./login-form.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {NoopAnimationsModule} from "@angular/platform-browser/animations";
import {TestHelper} from "../../test/TestHelper";
import {bufferToggle} from "rxjs";

describe("LoginFormComponent", () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let testHelper: TestHelper<LoginFormComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginFormComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    testHelper = new TestHelper(fixture)
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it('should emit username and password', () => {
    let username: string;
    let password: string;

    // On s'abonne à l'EventEmitter pour recevoir les valeurs émises.
    component.login.subscribe((event) => {
      username = event.username;
      password = event.password;
    });

    const inputUsernameElem = testHelper.getInput("InputUsername")
    testHelper.writeInInput(inputUsernameElem, "username")


    const inputPasswordElem = testHelper.getInput("InputPassword")
    testHelper.writeInInput(inputPasswordElem, "pwd")

    const button = testHelper.getButton("btnConnexion")
    button.click()

    expect(username!).toBe('username');
    expect(password!).toBe('pwd');
    expect(component.loginForm.valid).toBe(true);

  });
  it("without username", () => {
    let username1: string ;
    let password1: string ;

    // On s'abonne à l'EventEmitter pour recevoir les valeurs émises.
    component.login.subscribe((event) => {
      username1 = event.username;
      password1 = event.password;
    });

    const inputPasswordElem = testHelper.getInput("InputPassword")
    testHelper.writeInInput(inputPasswordElem, "pwd")


    const button = testHelper.getButton("btnConnexion")
    button.click()


    // console.log(component.loginForm.value)
    expect(username1!).toBeUndefined();
    expect(password1!).toBeUndefined();
    expect(component.loginForm.valid).toBe(false)

  })
  it("without password", () => {
    let username: string;
    let password: string;

    // On s'abonne à l'EventEmitter pour recevoir les valeurs émises.
    component.login.subscribe((event) => {
      username = event.username;
      password = event.password;
    });

    const inputUsernameElem = testHelper.getInput("InputUsername")
    testHelper.writeInInput(inputUsernameElem, "username")

    const button = testHelper.getButton("btnConnexion")
    button.click()

    expect(username!).toBeUndefined();
    expect(password!).toBeUndefined();
    expect(component.loginForm.valid).toBe(false)
  })
  it("without username and password", () => {
    let username: string;
    let password: string;

    // On s'abonne à l'EventEmitter pour recevoir les valeurs émises.
    component.login.subscribe((event) => {
      username = event.username;
      password = event.password;
    });

    const button = testHelper.getButton("btnConnexion")
    button.click()

    expect(username!).toBeUndefined();
    expect(password!).toBeUndefined();
    expect(component.loginForm.valid).toBe(false)
  })
});
