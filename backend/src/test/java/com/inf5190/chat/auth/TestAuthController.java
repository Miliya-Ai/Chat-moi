package com.inf5190.chat.auth;

import com.inf5190.chat.auth.model.LoginRequest;
import com.inf5190.chat.auth.model.LoginResponse;
import com.inf5190.chat.auth.repository.FirestoreUserAccount;
import com.inf5190.chat.auth.repository.UserAccountRepository;
import com.inf5190.chat.auth.session.SessionData;
import com.inf5190.chat.auth.session.SessionManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.concurrent.ExecutionException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

public class TestAuthController {
    private final String username = "username";
    private final String password = "pwd";
    private final String hashedPassword = "hash";
    private final FirestoreUserAccount userAccount = new FirestoreUserAccount(this.username, this.hashedPassword);
    private final LoginRequest loginRequest = new LoginRequest(this.username, this.password);

    private final String incorrectPassword = "incorrect_pwd";
    private final LoginRequest incorrectLoginRequest = new LoginRequest(this.username, this.incorrectPassword);

    private final String newUsername = "new_username";
    private final String newPassword = "new_pwd";
    private final String newHashedPassword = "new_hash";
    private final LoginRequest newLoginRequest = new LoginRequest(this.newUsername, this.newPassword);

    @Mock
    private SessionManager mockSessionManager;

    @Mock
    private UserAccountRepository mockAccountRepository;

    @Mock
    private PasswordEncoder mockPasswordEncoder;

    private AuthController authController;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        this.authController = new AuthController(mockSessionManager, mockAccountRepository, mockPasswordEncoder);
    }

    @Test
    public void loginExistingUserAccountWithCorrectPassword() throws InterruptedException, ExecutionException {
        final SessionData expectedSessionData = new SessionData(this.username);
        final String expectedUsername = this.username;

        when(this.mockAccountRepository.getUserAccount(loginRequest.username())).thenReturn(userAccount);
        when(this.mockPasswordEncoder.matches(loginRequest.password(), this.hashedPassword)).thenReturn(true);
        when(this.mockSessionManager.addSession(expectedSessionData)).thenReturn(expectedUsername);

        ResponseEntity<LoginResponse> response = this.authController.login(loginRequest);
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody().username()).isEqualTo(expectedUsername);

        verify(this.mockAccountRepository, times(1)).getUserAccount(this.username);
        verify(this.mockPasswordEncoder, times(1)).matches(this.password, this.hashedPassword);
        verify(this.mockSessionManager, times(1)).addSession(expectedSessionData);
    }

    @Test
    public void loginExistingUserAccountWithIncorrectPassword() throws InterruptedException, ExecutionException {
        final HttpStatus expectedStatus = HttpStatus.FORBIDDEN;

        when(this.mockAccountRepository.getUserAccount(incorrectLoginRequest.username())).thenReturn(userAccount);
        when(this.mockPasswordEncoder.matches(incorrectLoginRequest.password(), this.hashedPassword)).thenReturn(false);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            this.authController.login(incorrectLoginRequest);
        });

        assertThat(exception.getStatus()).isEqualTo(expectedStatus);

        verify(this.mockAccountRepository, times(1)).getUserAccount(this.username);
        verify(this.mockPasswordEncoder, times(1)).matches(this.incorrectPassword, this.hashedPassword);
    }

    @Test
    public void loginNewUserAccount() throws InterruptedException, ExecutionException {
        final HttpStatus expectedStatus = HttpStatus.OK;

        when(this.mockAccountRepository.getUserAccount(newLoginRequest.username())).thenReturn(null);
        when(this.mockPasswordEncoder.encode(newLoginRequest.password())).thenReturn(newHashedPassword);
        when(this.mockSessionManager.addSession(new SessionData(newLoginRequest.username()))).thenReturn(newUsername);

        ResponseEntity<LoginResponse> response = this.authController.login(newLoginRequest);
        assertThat(response.getStatusCodeValue()).isEqualTo(200);
        assertThat(response.getBody().username()).isEqualTo(newUsername);

        verify(this.mockAccountRepository, times(1)).getUserAccount(this.newUsername);
        verify(this.mockPasswordEncoder, times(1)).encode(this.newPassword);
        verify(this.mockSessionManager, times(1)).addSession(new SessionData(this.newUsername));
    }

    @Test
    public void loginWithRepositoryException() throws InterruptedException, ExecutionException {
        final HttpStatus expectedStatus = HttpStatus.INTERNAL_SERVER_ERROR;

        when(this.mockAccountRepository.getUserAccount(loginRequest.username())).thenThrow(new RuntimeException());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> {
            this.authController.login(loginRequest);
        });

        assertThat(exception.getStatus()).isEqualTo(expectedStatus);

        verify(this.mockAccountRepository, times(1)).getUserAccount(this.username);
        verify(this.mockPasswordEncoder, times(0)).matches(this.password, this.hashedPassword);
    }


}