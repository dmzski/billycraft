mod config;
mod handler;
mod jwt_auth;
mod model;
mod response;
mod route;

use config::Config;
use std::sync::Arc;

use axum::http::{HeaderValue, Method};
use dotenv::dotenv;
use route::create_router;
use sqlx::{postgres::PgPoolOptions, Pool, Postgres};
use tower_http::cors::{Any, CorsLayer};

pub struct AppState {
    db: Pool<Postgres>,
    env: Config,
}

#[tokio::main]
async fn main() {
    dotenv().ok();

    let config = Config::init();

    let pool = match PgPoolOptions::new()
        .max_connections(10)
        .connect(&config.database_url)
        .await
    {
        Ok(pool) => {
            println!("✅Connected to database !");
            pool
        }
        Err(err) => {
            println!("🔥 Failed to connect to the database: {:?}", err);
            std::process::exit(1);
        }
    };

    let mut cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST, Method::PATCH, Method::OPTIONS])
        .allow_headers(Any)
        .allow_credentials(false);

    if config.domain.contains("localhost") {
        cors = cors.allow_origin(Any);
    } else {
        cors = cors
            .allow_origin(config.domain.parse::<HeaderValue>().unwrap())
            .allow_credentials(true);
    }
    let app = create_router(Arc::new(AppState {
        db: pool.clone(),
        env: config.clone(),
    }))
    .layer(cors);

    println!("🚀 Server started successfully on {:?}", config.listen_addr);
    axum::Server::bind(&config.listen_addr.parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
