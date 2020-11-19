package com.coco.back.resources;

import com.coco.back.models.User;
import com.coco.back.services.UserService;
import org.eclipse.microprofile.jwt.JsonWebToken;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;

@Path("/register")
public class RegisterRessource {

    @Inject
    UserService userService;

    @Inject
    JsonWebToken token;

    @GET
    @Path("/init")
    public User initRegister() {
        User user = this.userService.createUserWithJWT(token);
        return user;
    }
}
