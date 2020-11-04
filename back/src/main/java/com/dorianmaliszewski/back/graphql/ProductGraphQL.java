package com.dorianmaliszewski.back.graphql;

import io.quarkus.security.Authenticated;
import org.eclipse.microprofile.graphql.GraphQLApi;

@GraphQLApi
@Authenticated
public class ProductGraphQL {

}
