import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, firstValueFrom } from "rxjs";
import { UserCredentials } from "./model/user-credentials";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import { environment } from "src/environments/environment";
import {LoginResponse} from "./model/login-response";
import {Router} from "@angular/router";

@Injectable({
    providedIn: "root",
})
export class AuthenticationService {
    static KEY = "username";

    private username = new BehaviorSubject<string | null>(null);

    constructor(private httpClient: HttpClient, private router: Router) {
        this.username.next(localStorage.getItem(AuthenticationService.KEY));
    }

    async login(userCredentials: UserCredentials) {
        try {
        const response = await firstValueFrom(
            this.httpClient.post<LoginResponse>(
                `${environment.backendUrl}/auth/login`,
                userCredentials,
                { withCredentials: true }
            )
        );
        localStorage.setItem(AuthenticationService.KEY, response.username);
        this.username.next(response.username);
            await this.router.navigate(["/chat"])
            return "success"
        } catch (error) {
            if (error instanceof HttpErrorResponse){
                if (error.status === 403){
                    return 403
                }
                return "error"
            }

            return "error"
        }
    }

    async logout() {
        try {
        await firstValueFrom(
            this.httpClient.post(`${environment.backendUrl}/auth/logout`, null, {
                withCredentials: true,
            })
        );
        localStorage.removeItem(AuthenticationService.KEY);
        localStorage.removeItem(this.username.value!);
        this.username.next(null);
        await this.router.navigate(["/login"])
        } catch (error) {
            console.log("Oups, logout failed", error)
        }
    }

    getUsername(): Observable<string | null> {
        return this.username.asObservable();
    }
    isConnected() {
        return localStorage.getItem(AuthenticationService.KEY) != null;

    }
}


// import {Injectable} from "@angular/core";
// import {BehaviorSubject, firstValueFrom, Observable} from "rxjs";
// import {UserCredentials} from "./model/user-credentials";
// import {Router} from "@angular/router";
// import {HttpClient, HttpErrorResponse} from "@angular/common/http";
// import {environment} from "../../environments/environment";
//
// export interface LoginResponse {
//     username: string;
// }
//
// @Injectable({
//     providedIn: "root",
// })
// export class AuthenticationService {
//     static KEY = "username";
//
//     private username = new BehaviorSubject<string | null>(null);
//
//     constructor(private router: Router, private http: HttpClient) {
//         this.username.next(localStorage.getItem(AuthenticationService.KEY));
//     }
//
//     async login(userCredentials: UserCredentials) {
//         try {
//             await firstValueFrom(
//                 this.http.post<LoginResponse>(
//                     `${environment.backendUrl}/auth/login`,
//                     userCredentials,
//                     {withCredentials: true}
//                 )
//             );
//             this.username.next(userCredentials.username)
//             // Stoker le nom d'utilisateur dans le stockage local
//             localStorage.setItem(AuthenticationService.KEY, userCredentials.username)
//             await this.router.navigate(["/chat"])
//             return "success"
//         } catch (error) {
//             if (error instanceof HttpErrorResponse){
//                 if (error.status === 403){
//                     return 403
//                 }
//                 return "error"
//             }
//
//             return "error"
//         }
//     }
//
//     async logout() {
//         try {
//             await firstValueFrom(
//                 this.http.post(`${environment.backendUrl}/auth/logout`,
//                     {},
//                     {withCredentials: true})
//             );
//             // Effacer le nom d'utilisateur du stockage local
//             localStorage.removeItem(AuthenticationService.KEY)
//             this.username.next(null)
//             await this.router.navigate(["/login"])
//         } catch (error) {
//             console.log("Oups, logout failed", error)
//         }
//     }
//
//     getUsername(): Observable<string | null> {
//         return this.username.asObservable();
//     }
//
//     isConnected() {
//         return localStorage.getItem(AuthenticationService.KEY) != null;
//
//     }
//
// }
