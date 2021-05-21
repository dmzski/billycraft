package com.coco.back.main.graphql;

import com.coco.back.main.models.User;
import com.coco.back.main.services.UserService;
import io.quarkus.security.Authenticated;
import org.eclipse.microprofile.graphql.Description;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Query;
import org.eclipse.microprofile.jwt.JsonWebToken;

import javax.inject.Inject;

@GraphQLApi
@Authenticated
public class UserGraphQL {

    @Inject
    UserService userService;

    @Inject
    JsonWebToken token;


    @Query
    @Description("Find my information")
    public User getMyInformation () {
        User user =  this.userService.findByEmail(token.getClaim("preferred_username"));
        if (user == null) {
            user = this.userService.createUserWithJWT(token);
        }
        return user;
    }
}
