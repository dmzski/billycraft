package com.coco.back.services;

import com.coco.back.models.User;
import org.eclipse.microprofile.jwt.Claims;
import org.eclipse.microprofile.jwt.JsonWebToken;

import javax.enterprise.context.ApplicationScoped;
import javax.transaction.Transactional;

@ApplicationScoped
public class UserService {

    public User findByEmail(String email) {
        return User.find("email = ?1", email).firstResult();
    }

    @Transactional
    public User createUser(User user) {
        user.persist();
        return user;
    }

    @Transactional
    public User createUserWithJWT(JsonWebToken jsonWebToken) {
        User user = new User();
        user.email = jsonWebToken.getClaim("preferred_username");
        user.firstName = jsonWebToken.getClaim(Claims.given_name.name());
        user.lastName = jsonWebToken.getClaim(Claims.family_name.name());
        user.persist();
        return user;
    }
}
