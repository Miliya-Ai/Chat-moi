package com.inf5190.chat.auth;

import com.inf5190.chat.auth.model.LoginRequest;
import com.inf5190.chat.auth.model.LoginResponse;
import com.inf5190.chat.auth.repository.FirestoreUserAccount;
import com.inf5190.chat.auth.repository.UserAccountRepository;
import com.inf5190.chat.auth.session.SessionData;
import com.inf5190.chat.auth.session.SessionManager;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.Cookie;
import java.time.Duration;


/**
 * Contrôleur qui gère l'API de login et logout.
 */
@RestController()
public class AuthController {
    public static final String AUTH_LOGIN_PATH = "/auth/login";
    public static final String AUTH_LOGOUT_PATH = "/auth/logout";
    public static final String SESSION_ID_COOKIE_NAME = "sid";

    private final SessionManager sessionManager;
    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(SessionManager sessionManager, UserAccountRepository userAccountRepository, PasswordEncoder passwordEncoder) {
        this.sessionManager = sessionManager;
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping(AUTH_LOGIN_PATH)
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        try {
            FirestoreUserAccount userAccount = userAccountRepository.getUserAccount(loginRequest.username());

            if (userAccount == null) {
                userAccount = new FirestoreUserAccount(loginRequest.username(), passwordEncoder.encode(loginRequest.password()));
                userAccountRepository.setUserAccount(userAccount);
            } else {
                if (!passwordEncoder.matches(loginRequest.password(), userAccount.getEncodedPassword())) {
                    throw new ResponseStatusException(HttpStatus.FORBIDDEN);
                }
            }
            SessionData sessionData = new SessionData(userAccount.getUsername());

            String sessionId = sessionManager.addSession(sessionData);

            ResponseCookie cookie = ResponseCookie.from(SESSION_ID_COOKIE_NAME, sessionId)
                    .secure(true)
                    .httpOnly(true)
                    .path("/")
                    .maxAge(Duration.ofHours(24))
                    .sameSite("None")
                    .build();

            LoginResponse response = new LoginResponse(sessionData.username());


            return ResponseEntity.ok()
                    .header("Set-Cookie", cookie.toString())
                    .body(response);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unexpected error on login.");
        }

    }

    @PostMapping(AUTH_LOGOUT_PATH)
    public ResponseEntity<Void> logout(@CookieValue("sid") Cookie sessionCookie) {
        try {
            sessionManager.removeSession(sessionCookie.getValue());

            ResponseCookie cookie = ResponseCookie.from(SESSION_ID_COOKIE_NAME, "")
                    .secure(true)
                    .httpOnly(true)
                    .path("/")
                    .maxAge(0)
                    .sameSite("None")
                    .build();

            return ResponseEntity.ok()
                    .header("Set-Cookie", cookie.toString())
                    .build();
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Unexpected error on logout.");
        }
    }

}
