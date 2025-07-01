#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;

    #[test]
    fn test_database_creation() {
        let dir = tempdir().unwrap();
        let db_path = dir.path().join("test.sqlite");
        
        let manager = SqliteConnectionManager::file(db_path);
        let pool = Pool::builder().max_size(1).build(manager).unwrap();
        assert!(pool.get().is_ok());
    }

    #[test]
    fn test_workspace_crud() {
        let dir = tempdir().unwrap();
        let db_path = dir.path().join("test.sqlite");
        let manager = SqliteConnectionManager::file(db_path);
        let pool = Pool::builder().max_size(1).build(manager).unwrap();
        
        // Initialize schema
        let conn = pool.get().unwrap();
        let schema = include_str!("schema.sql");
        conn.execute_batch(schema).unwrap();
        
        let queries = Queries::new(pool);
        
        let workspace = Workspace {
            id: "test-id".to_string(),
            user_id: "user-1".to_string(),
            name: "Test Workspace".to_string(),
            ..Default::default()
        };
        
        queries.create_workspace(&workspace).unwrap();
        let fetched = queries.get_workspace("test-id").unwrap();
        assert!(fetched.is_some());
        assert_eq!(fetched.unwrap().name, "Test Workspace");
    }
}