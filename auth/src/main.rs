mod config;
mod handler;
mod jwt_auth;
mod model;
mod response;
mod route;

use config::Config;
use std::sync::Arc;

use dotenv::dotenv;
use route::create_router;

use sqlx::{postgres::PgPoolOptions, Pool, Postgres};

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

    let app = create_router(Arc::new(AppState {
        db: pool.clone(),
        env: config.clone(),
    }));

    println!("🚀 Server started successfully");
    axum::Server::bind(&config.listen_addr.parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
