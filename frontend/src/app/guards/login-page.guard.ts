import {CanActivateFn, Router} from '@angular/router';
import { AuthenticationService} from "../login/authentication.service";
import {inject} from "@angular/core";

export const LoginPageGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (authService.isConnected()) {
    router.navigate(["/chat"]);
    return false;
  }
  return true;
};


