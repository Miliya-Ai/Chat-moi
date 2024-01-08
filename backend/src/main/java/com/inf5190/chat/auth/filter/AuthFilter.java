package com.inf5190.chat.auth.filter;

import com.inf5190.chat.auth.AuthController;
import com.inf5190.chat.auth.session.SessionData;
import com.inf5190.chat.auth.session.SessionManager;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;

import javax.servlet.*;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

/**
 * Filtre qui intercepte les requêtes HTTP et valide si elle est autorisée.
 */
//erreur de 403 provient de cette classe
    /*
    vérifie dans l'onglet network,
    une fois qu'on set le  setcookie
    dans requete: doit avoir un cookie avec le session id
     */
public class AuthFilter implements Filter {
    private final SessionManager sessionManager;
    private final List<String> allowedOrigins;

    public AuthFilter(SessionManager sessionManager, List<String> allowedOrigins) {
        this.sessionManager = sessionManager;
        this.allowedOrigins = allowedOrigins;
    }

    @Override
    public void doFilter(
            ServletRequest request,
            ServletResponse response,
            FilterChain chain) throws IOException, ServletException {
        final HttpServletRequest httpRequest = (HttpServletRequest) request;
        final HttpServletResponse httpResponse = (HttpServletResponse) response;

        // Si c'est la méthode OPTIONS on laisse passer. C'est une requête
        // pre-flight pour les CORS.
        if (httpRequest.getMethod().equalsIgnoreCase(HttpMethod.OPTIONS.name())) {
            chain.doFilter(request, response);
            return;
        }

        // On vérifie si le session cookie est présent sinon on n'accepte pas la
        // requête.
        final Cookie[] cookies = httpRequest.getCookies();
        System.out.println(cookies);
        if (cookies == null) {
            System.out.println("cookies null");
            this.sendAuthErrorResponse(httpRequest, httpResponse);
            return;
        }

        final Optional<Cookie> sessionCookie = Arrays.stream(cookies)
                .filter(c -> c.getName() != null && c.getName().equals(AuthController.SESSION_ID_COOKIE_NAME))
                .findFirst();
        if (sessionCookie.isEmpty()) {
            System.out.println("sessionCookie empty");
            this.sendAuthErrorResponse(httpRequest, httpResponse);
            return;
        }

        SessionData sessionData = this.sessionManager.getSession(sessionCookie.get().getValue());

        // On vérifie si la session existe sinon on n'accepte pas la requête.
        if (sessionData == null) {
            this.sendAuthErrorResponse(httpRequest, httpResponse);
            return;
        }

        chain.doFilter(request, response);
    }
    protected void sendAuthErrorResponse(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Cookie sessionIdCookie = new Cookie(AuthController.SESSION_ID_COOKIE_NAME, null);
        sessionIdCookie.setPath("/");
        sessionIdCookie.setSecure(true);
        sessionIdCookie.setHttpOnly(true);
        sessionIdCookie.setMaxAge(0);

        response.addCookie(sessionIdCookie);

        String origin = request.getHeader(HttpHeaders.ORIGIN);
        System.out.println("Origin from request: " + origin);

        if (this.allowedOrigins.contains(origin)) {
            System.out.println("Origin is allowed. Setting CORS headers.");
            response.setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, origin);
            response.setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_CREDENTIALS, "true");
        }else {
            System.out.println("Origin is not allowed. Not setting CORS headers.");
        }

        if (request.getRequestURI().contains(AuthController.AUTH_LOGOUT_PATH)) {
            // Si c'est pour le logout, on retourne simplement 200 OK.
            response.setStatus(HttpServletResponse.SC_OK);
        } else {
            response.sendError(HttpServletResponse.SC_FORBIDDEN);
        }
    }

}
