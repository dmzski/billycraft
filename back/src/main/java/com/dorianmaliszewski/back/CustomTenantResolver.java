package com.dorianmaliszewski.back;

import io.quarkus.oidc.OidcTenantConfig;
import io.quarkus.oidc.TenantConfigResolver;
import io.vertx.ext.web.RoutingContext;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.jboss.logging.Logger;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;


public class CustomTenantResolver implements TenantConfigResolver {

    @ConfigProperty(name = "tenant.properties.path")
    String tenantPropertiesPath;

    private static final Properties properties = new Properties();
    private static final Logger LOG = Logger.getLogger(CustomTenantResolver.class.getName());

    @PostConstruct
    private void initializeProperties () {
        try (InputStream inputStream = new FileInputStream(tenantPropertiesPath)){
                properties.load(inputStream);
        } catch (IOException e) {
            LOG.error("Can't load tenant properties");
        }
    }

    @Override
    public OidcTenantConfig resolve(RoutingContext context) {
        String path = context.request().path();
        String[] parts = path.split("/");

        if (parts.length == 0 || parts[1].equals("health")) {
            // resolve to default tenant configuration
            return null;
        }

        if (parts[1] != null && !"".equals(parts[1]) && properties.containsKey(parts[1] + ".auth-server-url")) {
            OidcTenantConfig config = new OidcTenantConfig();
            config.setTenantId(parts[1]);
            config.setAuthServerUrl(properties.getProperty(parts[1] + ".auth-server-url"));
            config.setClientId(properties.getProperty(parts[1] + ".client-id"));
            OidcTenantConfig.Credentials credentials = new OidcTenantConfig.Credentials();
            credentials.setSecret(properties.getProperty(parts[1] + ".credentials.secret"));
            return config;
        } else {
            LOG.warn("Unknown tenant : " + parts[1]);
            return  null;
        }
    }
}
