# Data Drift Analysis

**Date:** 2025-01-27  
**Sources Compared:**
1. Entity Relationship Diagram (`docs/entity_relationship_diagram.md`)
2. Supabase Production Database (PostgreSQL)
3. SQLite Local Database (`src-tauri/src/db/schema.sql`)

## Executive Summary

There are significant schema differences between the three sources of truth, primarily in:
- **Data type handling** (PostgreSQL vs SQLite type systems)
- **Default value generation** (UUID strategies)
- **Boolean representation** (native BOOLEAN vs INTEGER)
- **JSON storage** (JSONB vs TEXT serialization)
- **Missing tables and fields** from real implementations vs documentation

## Detailed Comparison

### 1. Core Data Type Differences

#### Primary Keys & UUIDs
| Field | ERD | Supabase | SQLite |
|-------|-----|----------|--------|
| All `id` fields | `UUID DEFAULT gen_random_uuid()` | `UUID DEFAULT uuid_generate_v4()` | `TEXT PRIMARY KEY` |

**Issues:**
- ERD uses newer PostgreSQL 13+ `gen_random_uuid()` function
- Supabase uses older `uuid_generate_v4()` from uuid-ossp extension
- SQLite stores UUIDs as TEXT without generation (app-level generation required)

#### Boolean Fields
| Field | ERD | Supabase | SQLite |
|-------|-----|----------|--------|
| `is_active`, `is_locked`, `is_valid`, etc. | `BOOLEAN DEFAULT false` | `BOOLEAN DEFAULT FALSE` | `INTEGER DEFAULT 0` |

**Issues:**
- SQLite uses INTEGER (0/1) while PostgreSQL uses native BOOLEAN
- Case sensitivity in default values (`false` vs `FALSE`)

#### Timestamp Fields
| Field | ERD | Supabase | SQLite |
|-------|-----|----------|--------|
| `created_at`, `updated_at` | `TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP` | `TIMESTAMPTZ DEFAULT NOW()` | `TEXT DEFAULT (datetime('now'))` |

**Issues:**
- Different timestamp functions across platforms
- SQLite stores timestamps as TEXT strings
- ERD uses `CURRENT_TIMESTAMP`, Supabase uses `NOW()`

### 2. JSON Storage Differences

#### Structured Data Fields
| Field | ERD | Supabase | SQLite |
|-------|-----|----------|--------|
| `acceptance_criteria` | `TEXT[]` | `JSONB` | `TEXT` |
| `constraints` | `TEXT[]` | `JSONB` | `TEXT` |
| `composed_of` | `TEXT[]` | `JSONB` | `TEXT` |
| `langgraph_state` | `JSONB` | `JSONB` | `TEXT` |
| `props` | `JSONB` | `JSONB` | `TEXT` |

**Issues:**
- ERD shows arrays (`TEXT[]`) while Supabase uses `JSONB`
- SQLite serializes all JSON as TEXT strings
- Different query capabilities between implementations

### 3. Field-Level Discrepancies

#### String Length Constraints
| Field | ERD | Supabase | SQLite |
|-------|-----|----------|--------|
| `users.email` | `VARCHAR(255) UNIQUE NOT NULL` | `TEXT NOT NULL UNIQUE` | `TEXT NOT NULL` |
| All varchar fields | `VARCHAR(255)` | `TEXT` | `TEXT` |

**Issues:**
- ERD specifies varchar length limits not enforced in implementations
- Supabase uses unlimited TEXT fields

#### Generation Batch Fields
| Field | ERD | Supabase | SQLite |
|-------|-----|----------|--------|
| `generation_batch` | `UUID` | `TEXT` | `TEXT` |

**Issues:**
- ERD specifies UUID type but implementations use TEXT
- Potential for inconsistent batch ID formats

#### Decimal Precision
| Field | ERD | Supabase | SQLite |
|-------|-----|----------|--------|
| `relevance_score` | `DECIMAL(3,2)` | `NUMERIC` | `REAL` |

**Issues:**
- ERD specifies precision but Supabase uses generic NUMERIC
- SQLite uses REAL (floating point) which may have precision issues

### 4. Missing Tables/Fields

#### Tables Present in Supabase but Missing from ERD
1. **`langgraph_state_events`** - Complete table missing from ERD
   - Purpose: Event sourcing for version control
   - Fields: `event_type`, `event_data`, `event_metadata`, `sequence_number`, `created_by`

2. **`canvas_states`** - Complete table missing from ERD
   - Purpose: React Flow canvas state storage
   - Fields: `nodes`, `edges`, `viewport`, `updated_at`

#### Fields Present in Implementations but Missing from ERD
- `users.id` in ERD shows `gen_random_uuid()` but should reference user management
- Missing `updated_at` fields in several ERD table definitions
- Missing trigger definitions for timestamp updates

### 5. Constraint Differences

#### Unique Constraints
| Constraint | ERD | Supabase | SQLite |
|------------|-----|----------|--------|
| `users.email` | `UNIQUE` | `UNIQUE` | Missing |
| `workspaces(user_id, name)` | `UNIQUE(user_id, name)` | `UNIQUE(user_id, name)` | `UNIQUE(user_id, name)` |
| `core_problems(project_id, version)` | `UNIQUE(project_id, version)` | Missing | `UNIQUE(project_id, version)` |
| `solution_pain_point_mappings(solution_id, pain_point_id)` | `UNIQUE(solution_id, pain_point_id)` | `UNIQUE(solution_id, pain_point_id)` | `UNIQUE(solution_id, pain_point_id)` |

**Issues:**
- Inconsistent constraint enforcement across platforms
- Some constraints missing from actual implementations

#### Check Constraints
| Constraint | ERD | Supabase | SQLite |
|------------|-----|----------|--------|
| `personas.pain_degree` | `CHECK (pain_degree >= 1 AND pain_degree <= 5)` | `CHECK (pain_degree >= 1 AND pain_degree <= 5)` | `CHECK (pain_degree >= 1 AND pain_degree <= 5)` |

**Status:** ✅ Consistent across all sources

### 6. Index Differences

#### Missing Indexes in ERD
ERD documents indexes but several are missing or different:

**Supabase & SQLite have additional indexes not in ERD:**
- `idx_core_problems_version` (Supabase only)
- `idx_pain_points_locked` 
- `idx_pain_points_batch`
- `idx_solutions_batch`
- `idx_state_events_project_seq`
- `idx_state_events_type`

### 7. Row Level Security (RLS)

#### RLS Policy Status
| Table | ERD | Supabase | SQLite |
|-------|-----|----------|--------|
| All tables | Not specified | Enabled with policies | Not applicable |

**Issues:**
- ERD doesn't document RLS requirements
- Supabase implements comprehensive RLS policies
- SQLite relies on application-level security

### 8. Trigger Differences

#### Timestamp Update Triggers
| Implementation | ERD | Supabase | SQLite |
|----------------|-----|----------|--------|
| Update triggers | Not specified | PostgreSQL function-based | SQLite trigger-based |
| Auto-increment | Not specified | Not applicable | Custom sequence trigger |

## Recommendations

### Immediate Actions Required

1. **Standardize UUID Generation**
   - Update ERD to use `uuid_generate_v4()` to match Supabase
   - Implement consistent UUID generation in SQLite layer

2. **Fix Missing Constraints**
   - Add missing `UNIQUE` constraint on `users.email` in SQLite
   - Add missing `UNIQUE(project_id, version)` constraint in Supabase

3. **Update ERD Documentation**
   - Add `langgraph_state_events` table definition
   - Add `canvas_states` table definition
   - Document all `updated_at` fields and trigger requirements
   - Specify RLS policy requirements

4. **Standardize Data Types**
   - Document JSON vs array preferences for each field
   - Specify precision requirements for numeric fields
   - Clarify varchar length constraints

### Long-term Schema Evolution

1. **Create Migration Strategy**
   - Implement versioned schema migrations for both Supabase and SQLite
   - Establish ERD as single source of truth with regular updates

2. **Add Schema Validation**
   - Implement automated schema drift detection
   - Add CI/CD checks to prevent drift

3. **Improve Type Safety**
   - Consider using generated TypeScript types from ERD
   - Implement runtime validation for JSON fields

### Monitoring & Maintenance

1. **Regular Drift Audits**
   - Schedule monthly schema comparisons
   - Automate drift detection in CI/CD pipeline

2. **Documentation Updates**
   - Keep ERD updated with each schema change
   - Document migration procedures for each platform

## Risk Assessment

### High Risk Issues
- **Data Integrity**: Missing constraints could allow invalid data
- **Type Safety**: JSON vs Array inconsistencies could cause runtime errors
- **Security**: Missing RLS documentation could lead to access control gaps

### Medium Risk Issues
- **Performance**: Missing indexes could impact query performance
- **Maintainability**: Trigger differences complicate cross-platform development

### Low Risk Issues
- **Cosmetic**: Case sensitivity in default values
- **Documentation**: Missing field documentation

---

**Next Steps:**
1. Review and approve recommendations
2. Create migration tickets for high-priority fixes
3. Establish regular schema governance process
4. Update development workflow to prevent future drift 