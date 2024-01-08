import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthenticationService} from "../login/authentication.service";

export const ChatPageGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (!authService.isConnected()) {
    router.navigate(["/login"]);
    return false;
  }

  return true;
};
