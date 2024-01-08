import { Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../authentication.service";
import { UserCredentials } from "../model/user-credentials";

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.css"],
})
export class LoginPageComponent implements OnInit {
  error = false;
  messageError = "";
  constructor(private authentificationService: AuthenticationService) {}

  ngOnInit(): void {}

  async onLogin(UserCredentials: UserCredentials) {

    const status = await this.authentificationService.login(UserCredentials)

    if (status === "success") {
      this.error = false;
    } else if (status === "error") {
      this.error = true;
      this.messageError = "Problème de connexion";
    } else if (status === 403) {
      this.error = true;
      this.messageError = "Mot de passe invalide";
    }

  }
}
