// src-tauri/src/db/mod.rs
pub mod models;
pub mod queries;
pub mod migrations;

// ---------- new imports ----------
use r2d2::Pool;                                  // the generic pool type
use r2d2_sqlite::SqliteConnectionManager;        // manager for rusqlite
use anyhow::{Context, Result};

pub use models::Workspace;
pub use queries::Queries;
pub use migrations::{run_migrations, needs_migration, get_migration_status};

// ---------- pool alias ----------
pub type DbPool = Pool<SqliteConnectionManager>;

// ---------- pool init with migrations ----------
pub async fn init_db() -> Result<DbPool> {
    // create (or open) prob.sqlite in your app directory
    let manager = SqliteConnectionManager::file("prob.sqlite");
    let pool = Pool::builder().max_size(8).build(manager)
        .context("Failed to create database connection pool")?;
    
    // Run migrations automatically
    println!("Checking for database migrations...");
    if needs_migration(&pool)? {
        println!("Running database migrations...");
        run_migrations(&pool)
            .context("Failed to run database migrations")?;
    } else {
        println!("Database is up to date");
    }
    
    // Optional: Print migration status for debugging
    if std::env::var("DEBUG_MIGRATIONS").is_ok() {
        get_migration_status(&pool)?;
    }
    
    Ok(pool)
}
