use std::sync::Arc;

use argon2::{password_hash::SaltString, Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use axum::{
    extract::State,
    http::{header, Response, StatusCode},
    response::IntoResponse,
    Extension, Json,
};
use axum_extra::extract::cookie::{Cookie, SameSite};
use jsonwebtoken::{encode, EncodingKey, Header};
use rand_core::OsRng;
use serde_json::json;

use crate::{
    model::{AppError, LoginUserSchema, RegisterUserSchema, TokenClaims, UpdateUserSchema, User},
    response::UserResponse,
    AppState,
};

pub async fn health_check_handler() -> impl IntoResponse {
    let json_response = serde_json::json!({
        "state": "READY",
    });

    Json(json_response)
}

pub async fn register_user_handler(
    State(data): State<Arc<AppState>>,
    Json(body): Json<RegisterUserSchema>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let user_exists: Option<bool> =
        sqlx::query_scalar("SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)")
            .bind(body.email.to_owned().to_ascii_lowercase())
            .fetch_one(&data.db)
            .await
            .map_err(|e| {
                let error_response = AppError {
                    message: format!("Error: {}", e),
                };
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(json!(error_response)),
                )
            })?;

    if let Some(exists) = user_exists {
        if exists {
            let error_response = AppError {
                message: "Already exists".to_string(),
            };
            return Err((StatusCode::CONFLICT, Json(json!(error_response))));
        }
    }

    let salt = SaltString::generate(&mut OsRng);
    let hashed_password = Argon2::default()
        .hash_password(body.password.as_bytes(), &salt)
        .map_err(|e| {
            let error_response = AppError {
                message: format!("Error while hashing password: {}", e),
            };
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!(error_response)),
            )
        })
        .map(|hash| hash.to_string())?;

    let user = sqlx::query_as!(
        User,
        "INSERT INTO users (name,email,password) VALUES ($1, $2, $3) RETURNING *",
        body.name.to_string(),
        body.email.to_string().to_ascii_lowercase(),
        hashed_password
    )
    .fetch_one(&data.db)
    .await
    .map_err(|e| {
        let error_response = AppError {
            message: format!("Error: {}", e),
        };
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!(error_response)),
        )
    })?;

    let user_response = filter_user_record(&user);

    Ok(Json(json!(user_response)))
}

pub async fn login_user_handler(
    State(data): State<Arc<AppState>>,
    Json(body): Json<LoginUserSchema>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let user = sqlx::query_as!(
        User,
        "SELECT * FROM users WHERE email = $1",
        body.email.to_ascii_lowercase()
    )
    .fetch_optional(&data.db)
    .await
    .map_err(|e| {
        let error_response = AppError {
            message: format!("Database error: {}", e),
        };
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!(error_response)),
        )
    })?
    .ok_or_else(|| {
        let error_response = AppError {
            message: "Invalid email or password".to_string(),
        };
        (StatusCode::NOT_FOUND, Json(json!(error_response)))
    })?;

    let is_valid = match PasswordHash::new(&user.password) {
        Ok(parsed_hash) => Argon2::default()
            .verify_password(body.password.as_bytes(), &parsed_hash)
            .map_or(false, |_| true),
        Err(_) => false,
    };

    if !is_valid {
        let error_response = AppError {
            message: "Invalid email or password".to_string(),
        };
        return Err((StatusCode::NOT_FOUND, Json(json!(error_response))));
    }

    let now = chrono::Utc::now();
    let iat = now.timestamp() as usize;
    let exp = (now + chrono::Duration::hours(2)).timestamp() as usize;
    let claims: TokenClaims = TokenClaims {
        sub: user.id.to_string(),
        exp,
        iat,
        email: user.email.to_string(),
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(data.env.jwt_secret.as_ref()),
    )
    .unwrap();

    let cookie = build_cookie(data, token.to_owned(), time::Duration::hours(2));

    let mut response = Response::new(json!({"token": token}).to_string());
    response
        .headers_mut()
        .insert(header::SET_COOKIE, cookie.to_string().parse().unwrap());
    Ok(response)
}

pub async fn logout_handler(
    State(data): State<Arc<AppState>>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let cookie = build_cookie(data, "".to_string(), time::Duration::hours(-1));

    let mut response = Response::new("success".to_string());
    response
        .headers_mut()
        .insert(header::SET_COOKIE, cookie.to_string().parse().unwrap());
    Ok(response)
}

pub async fn check_session(
    Extension(user): Extension<User>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let mut response = Response::new(user.email.to_string());
    response
        .headers_mut()
        .insert("X-Auth-User", user.email.parse().unwrap());
    Ok(response)
}
pub async fn refresh_session(
    Extension(user): Extension<User>,
    State(data): State<Arc<AppState>>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let now = chrono::Utc::now();
    let iat = now.timestamp() as usize;
    let exp = (now + chrono::Duration::hours(2)).timestamp() as usize;
    let claims: TokenClaims = TokenClaims {
        sub: user.id.to_string(),
        exp,
        iat,
        email: user.email.to_string(),
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(data.env.jwt_secret.as_ref()),
    )
    .unwrap();

    let cookie = build_cookie(data, token.to_owned(), time::Duration::hours(2));

    let mut response = Response::new(json!({"status": "success", "token": token}).to_string());
    response
        .headers_mut()
        .insert(header::SET_COOKIE, cookie.to_string().parse().unwrap());
    Ok(response)
}

fn filter_user_record(user: &User) -> UserResponse {
    UserResponse {
        id: user.id.to_string(),
        email: user.email.to_owned(),
        name: user.name.to_owned(),
        verified: user.verified,
        created_at: user.created_at.unwrap(),
        updated_at: user.updated_at.unwrap(),
    }
}

fn build_cookie<'a>(data: Arc<AppState>, token: String, duration: time::Duration) -> Cookie<'a> {
    // This is the test domain when developping locally
    if data.env.domain.contains("localhost") {
        return Cookie::build("billycraft_at", token)
            .domain(data.env.domain.to_string())
            .http_only(true)
            .max_age(duration)
            .path("/")
            .secure(false)
            .same_site(SameSite::None)
            .finish();
    }

    return Cookie::build("billycraft_at", token)
        .path("/")
        .secure(true)
        .domain(data.env.domain.to_string())
        .same_site(SameSite::Strict)
        .max_age(duration)
        .http_only(true)
        .finish();
}

pub async fn update_user_handler(
    State(data): State<Arc<AppState>>,
    Extension(user): Extension<User>,
    Json(body): Json<UpdateUserSchema>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    // Préparez les champs de mise à jour
    let mut name = user.name.clone();
    let mut hashed_password = user.password.clone();

    if let Some(new_name) = &body.name {
        name = new_name.clone();
    }
    if let Some(new_password) = &body.password {
        if let Some(old_password) = &body.old_password {
            let is_valid = match PasswordHash::new(&user.password) {
                Ok(parsed_hash) => Argon2::default()
                    .verify_password(old_password.as_bytes(), &parsed_hash)
                    .map_or(false, |_| true),
                Err(_) => false,
            };

            if !is_valid {
                let error_response = AppError {
                    message: "Old password doesnt match existing one".to_string(),
                };
                return Err((StatusCode::BAD_REQUEST, Json(json!(error_response))));
            }

            // Hachage du nouveau mot de passe
            let salt = SaltString::generate(&mut OsRng);
            hashed_password = Argon2::default()
                .hash_password(new_password.as_bytes(), &salt)
                .map_err(|e| {
                    let error_response = AppError {
                        message: format!("Error while hashing password: {}", e),
                    };
                    (
                        StatusCode::INTERNAL_SERVER_ERROR,
                        Json(json!(error_response)),
                    )
                })?
                .to_string();
        } else {
            let error_response = AppError {
                message: "Old password must be provided".to_string(),
            };
            return Err((StatusCode::BAD_REQUEST, Json(json!(error_response))));
        }
    }

    // Mise à jour dans la base de données
    let updated_user = sqlx::query_as!(
        User,
        "UPDATE users SET name = $1, password = $2 WHERE id = $3 RETURNING *",
        name,
        hashed_password,
        user.id
    )
    .fetch_one(&data.db)
    .await
    .map_err(|e| {
        let error_response = AppError {
            message: format!("Database error: {}", e),
        };
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(json!(error_response)),
        )
    })?;

    // Filtrer les informations utilisateur pour la réponse
    let user_response = filter_user_record(&updated_user);
    Ok(Json(json!(user_response)))
}
