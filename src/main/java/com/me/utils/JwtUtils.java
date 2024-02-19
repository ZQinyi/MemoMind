package com.me.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.util.Date;
import java.util.Map;
import javax.crypto.SecretKey;

public class JwtUtils {
    private static SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    private static long expiration = 604800; // JWT的过期时间，这里示例为一周（单位：秒）

    // 生成JWT令牌
    public static String generateJwt(Map<String, Object> claims) {
        return Jwts.builder()
                .addClaims(claims)
                .setExpiration(new Date(System.currentTimeMillis() + expiration * 1000))
                .signWith(SignatureAlgorithm.HS256, key)
                .compact();
    }

    // 从令牌中获取Claims
    public static Claims parseJWT(String jwt) {
        return Jwts.parser()
                .setSigningKey(key)
                .parseClaimsJws(jwt)
                .getBody();
    }

    // 从令牌中获取用户名
    public String getUsernameFromToken(String token) {
        return parseJWT(token).getSubject();
    }

    // 验证JWT令牌
    public boolean validateToken(String token, String username) {
        final String tokenUsername = getUsernameFromToken(token);
        return (username.equals(tokenUsername) && !isTokenExpired(token));
    }

    // 检查令牌是否过期
    private boolean isTokenExpired(String token) {
        final Date expiration = parseJWT(token).getExpiration();
        return expiration.before(new Date());
    }

}
