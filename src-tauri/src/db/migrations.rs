use r2d2_sqlite::rusqlite::{Connection, Result as SqliteResult};
use crate::db::DbPool;
use anyhow::{Context, Result};

/// Migration structure to track applied migrations
pub struct Migration {
    pub version: i32,
    pub name: String,
    pub sql: String,
}

/// Initialize the migrations table to track applied migrations
pub fn init_migrations_table(conn: &Connection) -> SqliteResult<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS __migrations (
            id INTEGER PRIMARY KEY,
            version INTEGER UNIQUE NOT NULL,
            name TEXT NOT NULL,
            applied_at TEXT DEFAULT (datetime('now'))
        )",
        [],
    )?;
    Ok(())
}

/// Get list of applied migrations
pub fn get_applied_migrations(conn: &Connection) -> SqliteResult<Vec<i32>> {
    init_migrations_table(conn)?;
    
    let mut stmt = conn.prepare("SELECT version FROM __migrations ORDER BY version")?;
    let rows = stmt.query_map([], |row| {
        Ok(row.get::<_, i32>(0)?)
    })?;
    
    let mut versions = Vec::new();
    for row in rows {
        versions.push(row?);
    }
    Ok(versions)
}

/// Record a migration as applied
pub fn record_migration(conn: &Connection, version: i32, name: &str) -> SqliteResult<()> {
    conn.execute(
        "INSERT INTO __migrations (version, name) VALUES (?1, ?2)",
        [&version.to_string(), name],
    )?;
    Ok(())
}

/// Load migration files from the migrations directory
pub fn load_migrations() -> Result<Vec<Migration>> {
    let mut migrations = Vec::new();
    
    // Define migrations with their content
    migrations.push(Migration {
        version: 1,
        name: "initial_schema".to_string(),
        sql: include_str!("schema.sql").to_string(),
    });
    
    migrations.push(Migration {
        version: 2,
        name: "sync_with_supabase".to_string(),
        sql: include_str!("migrations/002_sync_with_supabase.sql").to_string(),
    });
    
    // Sort by version to ensure proper order
    migrations.sort_by_key(|m| m.version);
    
    Ok(migrations)
}

/// Apply a single migration
pub fn apply_migration(conn: &Connection, migration: &Migration) -> Result<()> {
    println!("Applying migration {}: {}", migration.version, migration.name);
    
    // Begin transaction
    let tx = conn.unchecked_transaction()?;
    
    // Execute the migration SQL
    tx.execute_batch(&migration.sql)
        .with_context(|| format!("Failed to execute migration {}", migration.version))?;
    
    // Record the migration as applied
    record_migration(&tx, migration.version, &migration.name)
        .with_context(|| format!("Failed to record migration {}", migration.version))?;
    
    // Commit transaction
    tx.commit()
        .with_context(|| format!("Failed to commit migration {}", migration.version))?;
    
    println!("Successfully applied migration {}: {}", migration.version, migration.name);
    Ok(())
}

/// Run all pending migrations
pub fn run_migrations(pool: &DbPool) -> Result<()> {
    let conn = pool.get()
        .context("Failed to get database connection from pool")?;
    
    // Load all available migrations
    let available_migrations = load_migrations()
        .context("Failed to load migrations")?;
    
    // Get applied migrations
    let applied_versions = get_applied_migrations(&conn)
        .context("Failed to get applied migrations")?;
    
    // Find pending migrations
    let pending_migrations: Vec<&Migration> = available_migrations
        .iter()
        .filter(|m| !applied_versions.contains(&m.version))
        .collect();
    
    if pending_migrations.is_empty() {
        println!("No pending migrations to run");
        return Ok(());
    }
    
    println!("Found {} pending migrations", pending_migrations.len());
    
    // Apply each pending migration
    for migration in pending_migrations {
        apply_migration(&conn, migration)
            .with_context(|| format!("Failed to apply migration {}", migration.version))?;
    }
    
    println!("All migrations completed successfully");
    Ok(())
}

/// Check if database needs migration (useful for initialization)
pub fn needs_migration(pool: &DbPool) -> Result<bool> {
    let conn = pool.get()
        .context("Failed to get database connection from pool")?;
    
    let available_migrations = load_migrations()
        .context("Failed to load migrations")?;
    
    let applied_versions = get_applied_migrations(&conn)
        .context("Failed to get applied migrations")?;
    
    let pending_count = available_migrations
        .iter()
        .filter(|m| !applied_versions.contains(&m.version))
        .count();
    
    Ok(pending_count > 0)
}

/// Get migration status for debugging
pub fn get_migration_status(pool: &DbPool) -> Result<()> {
    let conn = pool.get()
        .context("Failed to get database connection from pool")?;
    
    let available_migrations = load_migrations()
        .context("Failed to load migrations")?;
    
    let applied_versions = get_applied_migrations(&conn)
        .context("Failed to get applied migrations")?;
    
    println!("Migration Status:");
    println!("================");
    
    for migration in &available_migrations {
        let status = if applied_versions.contains(&migration.version) {
            "✓ Applied"
        } else {
            "✗ Pending"
        };
        println!("{} - Migration {}: {}", status, migration.version, migration.name);
    }
    
    let pending_count = available_migrations
        .iter()
        .filter(|m| !applied_versions.contains(&m.version))
        .count();
    
    println!("\nTotal migrations: {}", available_migrations.len());
    println!("Applied: {}", applied_versions.len());
    println!("Pending: {}", pending_count);
    
    Ok(())
}

/// Force apply all migrations (useful for fresh databases)
pub fn force_apply_all_migrations(pool: &DbPool) -> Result<()> {
    let conn = pool.get()
        .context("Failed to get database connection from pool")?;
    
    // Drop the migrations table to start fresh
    conn.execute("DROP TABLE IF EXISTS __migrations", [])?;
    
    // Run all migrations
    run_migrations(pool)
} 