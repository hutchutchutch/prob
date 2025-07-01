// src-tauri/src/db/mod.rs
pub mod models;
pub mod queries;

// ---------- new imports ----------
use r2d2::Pool;                                  // the generic pool type
use r2d2_sqlite::SqliteConnectionManager;        // manager for rusqlite

pub use models::{Workspace, CanvasState};
pub use queries::Queries;

// ---------- pool alias ----------
pub type DbPool = Pool<SqliteConnectionManager>;

// ---------- pool init ----------
pub async fn init_db() -> anyhow::Result<DbPool> {
    // create (or open) prob.sqlite in your app directory
    let manager = SqliteConnectionManager::file("prob.sqlite");
    let pool = Pool::builder().max_size(8).build(manager)?;
    Ok(pool)
}
