# Changelog

All notable changes to TechTrack will be documented in this file.

This project follows a milestone-based changelog. Git history contains detailed implementation changes, while this document summarizes significant project milestones.

The format is inspired by Keep a Changelog.

---

## [Unreleased]

### Planned
- Dashboard feature
- Repair Orders
- Vehicle Management
- Customer Management
- Digital Inspections

---

## [0.1.0] - 2026-07-17

### Added
- Initial React 19 + Vite + TypeScript application.
- Production-grade project architecture.
- React Router configuration.
- Firebase Authentication integration.
- Cloud Firestore integration.
- Firebase Storage integration.
- Firebase Hosting deployment.
- Authentication provider and session persistence.
- Public and protected routing.
- Shared application layout.
- Global loading component.
- Error Boundary.
- 404 page.
- Service layer abstraction.
- Environment variable configuration.
- Production deployment pipeline.
- Live production deployment.

### Changed
- Replaced the default Vite starter template with a production application shell.
- Established long-term architectural guidelines for feature development.

### Security
- Firebase configuration moved to environment variables.
- Protected authenticated application routes.

### Notes
This release establishes the permanent application foundation. Future releases will focus on business features while preserving the completed infrastructure.

---

## Versioning

TechTrack follows Semantic Versioning.

MAJOR version:
Breaking architectural or API changes.

MINOR version:
New features.

PATCH version:
Bug fixes and maintenance.

Examples:

0.1.0 Foundation

0.2.0 Dashboard

0.3.0 Repair Orders

0.4.0 Vehicles

0.5.0 Customers

0.6.0 Inspections

1.0.0 Initial Production Release