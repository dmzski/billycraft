use std::sync::Arc;

use axum::{
    middleware,
    routing::{get, patch, post},
    Router,
};

use crate::{
    handler::{
        check_session, health_check_handler, login_user_handler, logout_handler, refresh_session,
        register_user_handler, update_user_handler,
    },
    jwt_auth::auth,
    AppState,
};

pub fn create_router(app_state: Arc<AppState>) -> Router {
    Router::new()
        .route("/api/healthcheck", get(health_check_handler))
        .route("/api/auth/register", post(register_user_handler))
        .route("/api/auth/login", post(login_user_handler))
        .route(
            "/api/auth/logout",
            get(logout_handler)
                .route_layer(middleware::from_fn_with_state(app_state.clone(), auth)),
        )
        .route(
            "/api/auth/check",
            get(check_session).route_layer(middleware::from_fn_with_state(app_state.clone(), auth)),
        )
        .route(
            "/api/auth/refresh",
            get(refresh_session)
                .route_layer(middleware::from_fn_with_state(app_state.clone(), auth)),
        )
        .route("/api/auth/update",
            patch(update_user_handler).route_layer(middleware::from_fn_with_state(app_state.clone(), auth)),
        )
        .with_state(app_state)
}
