import {Component, EventEmitter, OnInit, Output, ViewChild} from "@angular/core";
import {FormBuilder, FormGroupDirective, Validators} from "@angular/forms";
import { UserCredentials } from "../model/user-credentials";

@Component({
  selector: "app-login-form",
  templateUrl: "./login-form.component.html",
  styleUrls: ["./login-form.component.css"],
})
export class LoginFormComponent implements OnInit {
  @ViewChild(FormGroupDirective)
  formDirective: FormGroupDirective | null = null;

  hidePassword = false
  loginForm = this.fb.group({
    username: [null, [Validators.required]],
    password: [null, [Validators.required]],
  });

  @Output()
  login = new EventEmitter<UserCredentials>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  onLogin() {
    if (
        this.loginForm.valid &&
        this.loginForm.value.username &&
        this.loginForm.value.password
    ) {
      this.login.emit({
        username: this.loginForm.value.username,
        password: this.loginForm.value.password,
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
    showUsernameRequiredError(): boolean {
    return this.showError("username", "required");

  }
  showPasswordRequiredError(): boolean {
    return this.showError("password", "required");
  }
  private showError(field: "username"| "password", error: string): boolean {
    return (
        this.loginForm.controls[field].hasError(error) &&
        (this.loginForm.controls[field].dirty || this.loginForm.controls[field].touched)
    );
  }
}