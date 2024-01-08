package com.inf5190.chat.auth.session;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Repository;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Classe qui gère les sessions utilisateur.
 * 
 * Pour le moment, on gère en mémoire.
 */
@Repository
public class SessionManager {

    private final Map<String, SessionData> sessions = new HashMap<String, SessionData>();
    private static SecretKey key = Jwts.SIG.HS256.key().build();
    private static String secretString = Encoders.BASE64.encode(key.getEncoded());
    private static final String SECRET_KEY_BASE64 = secretString;
    private final SecretKey secretKey;
    private final JwtParser jwtParser;
    public SessionManager() {
        this.secretKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET_KEY_BASE64));
        this.jwtParser = Jwts.parser().verifyWith(this.secretKey).build();
    }
    public String addSession(SessionData authData) {
        Date expirationDate = new Date(System.currentTimeMillis() + 2 * 60 * 60 * 1000); // 2 hours from now
        return Jwts.builder().subject(authData.username()).claim("aud", "@moi").expiration(expirationDate).issuedAt(new Date()).signWith(this.secretKey).compact();
    }

    public void removeSession(String sessionId) {
        this.sessions.remove(sessionId);
    }

    public SessionData getSession(String sessionId) {
        Jws<Claims> jws;
        try {
            jws = jwtParser
                    .parseSignedClaims(sessionId);
        } catch (JwtException ex) {
            return null;
        }
        return new SessionData(jws.getBody().getSubject());

    }

}
