# SQLite Patterns for Prob

When working with SQLite in this project:
1. Use rusqlite for direct queries, diesel for complex operations
2. All timestamps should use TEXT format with ISO 8601
3. Use INTEGER for booleans (0/1)
4. UUID fields should be TEXT
5. JSON data should be stored as TEXT
6. Always use transactions for multi-table operations
7. Implement connection pooling with r2d2