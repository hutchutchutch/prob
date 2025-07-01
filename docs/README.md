# Documentation Index

Welcome to the project documentation. This directory contains comprehensive guides and references for understanding and working with the codebase.

## Architecture Documentation

### [Store Integration Architecture](./store-integration.md)
Complete guide to the multi-store architecture using Zustand, including:
- Store responsibilities and domains
- Communication patterns (Direct calls, Subscriptions, Notifications, Lazy loading)
- Integration points and data flow examples
- Best practices and testing considerations

## Quick Navigation

### For Developers
- **Understanding the stores**: Start with [Store Integration Architecture](./store-integration.md)
- **Adding new features**: Review the integration patterns and best practices sections
- **Debugging data flow**: Use the detailed data flow examples

### For New Team Members
1. Read the store responsibilities overview
2. Understand the four communication patterns
3. Study the detailed persona selection example
4. Review best practices before making changes

## Related Files

- `src/stores/` - Store implementation files
- `src/stores/index.ts` - Store exports and inline architecture documentation
- `src/types/database.types.ts` - Shared type definitions

---

*Documentation maintained by the development team* 