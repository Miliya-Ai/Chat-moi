import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { LoginPageGuard } from './login-page.guard';
import { HttpClientModule } from "@angular/common/http";

describe('loginPageGuard', () => {
  //let guard: typeof LoginPageGuard;
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => LoginPageGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({
      //imports: [HttpClientModule],
    });
    //guard = TestBed.inject(LoginPageGuard);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
