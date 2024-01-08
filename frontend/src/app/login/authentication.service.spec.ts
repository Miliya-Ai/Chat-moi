import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import {ComponentFixture, fakeAsync, TestBed, tick, waitForAsync} from "@angular/core/testing";

import { AuthenticationService } from "./authentication.service";
import { environment } from "src/environments/environment";
import {LoginFormComponent} from "./login-form/login-form.component";

describe("AuthenticationService", () => {
  let service: AuthenticationService;
  let httpTestingController: HttpTestingController;

  const loginData = {
    username: "username",
    password: "pwd",
  };

  afterEach(() => {
    localStorage.clear();
  });

  describe("on login", () => {
    beforeEach(() => {
      localStorage.clear();
      TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
      httpTestingController = TestBed.inject(HttpTestingController);
      service = TestBed.inject(AuthenticationService);
    });

    it("should call POST with login data to auth/login", async () => {
      const loginPromise = service.login(loginData);

      const req = httpTestingController.expectOne(
          `${environment.backendUrl}/auth/login`
      );
      expect(req.request.method).toBe("POST");
      expect(req.request.body).toEqual(loginData);
      req.flush({ username: loginData.username });

      // wait for the login to complete
      await loginPromise;
    });

    it("should store and emit the username",  fakeAsync(() => {
      service.login(loginData)
      tick()
      const observable = service.getUsername()
        observable.subscribe((username) => {
          expect(username).toBe(username);
        });
    }))

  });

  describe("on logout", () => {
    beforeEach(() => {
      localStorage.setItem("username", loginData.username);

      TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
      httpTestingController = TestBed.inject(HttpTestingController);
      service = TestBed.inject(AuthenticationService);
    });

    it("should call POST with login data to auth/logout", () => {
      // À compléter
      const logoutPromise = service.logout();

      const req = httpTestingController.expectOne(
          `${environment.backendUrl}/auth/logout`
      );
      expect(req.request.method).toBe("POST");
      req.flush({});

    });

    it("should remove the username from the service and local storage",  fakeAsync(() => {
      service.logout()

      const req = httpTestingController.expectOne(
          `${environment.backendUrl}/auth/logout`
      );
      expect(req.request.method).toBe("POST");
      req.flush({});

      tick()
      service.getUsername().subscribe((value) => {
        expect(value).toBeNull()
      });
      expect(service.isConnected()).toEqual(false);
    }))


  });
});