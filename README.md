# TechTrack

**A real-world automotive technician productivity and repair management platform.**

TechTrack is a full-stack web application designed to help automotive technicians manage repair orders, track flagged labor hours, verify payroll, and organize daily work.

The project was created to solve practical challenges encountered in professional automotive repair environments and continues to evolve through real-world use and feedback.

## Key Features

### Repair Order Management
- Record and organize repair orders and labor operations.
- Search and filter repair history.
- Track repair status and verification progress.
- Organize repair records by date.

### Labor Tracking and Payroll Verification
- Track flagged labor hours and technician productivity.
- Compare calculated earnings against reported compensation.
- Identify discrepancies requiring verification.
- Monitor weekly performance and earnings.

### Document Scanning and Data Extraction
- Repair-order and technician work-summary scanning workflows.
- OCR-based document processing and parsing.
- Document normalization and structured data extraction.
- Automated checks for supported work-summary formats.

### Application Infrastructure
- Firebase Authentication and protected routes.
- Cloud Firestore data persistence.
- Firebase Storage integration.
- Firebase Hosting deployment.
- Modular application architecture and service-layer separation.

## Technology Stack

| Area | Technologies |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Routing | React Router |
| Backend | Firebase Cloud Functions |
| Database | Cloud Firestore |
| Authentication | Firebase Authentication |
| Storage | Firebase Storage |
| Hosting | Firebase Hosting |
| Document Processing | OCR, PDF.js |
| Development | Git, GitHub, ESLint, TypeScript |

## Architecture

TechTrack follows a modular architecture emphasizing separation of concerns, maintainability, and incremental development.

The application separates presentation components, business logic, service integrations, and data persistence.

The project includes frontend application code, backend functions, document-processing utilities, and automated checks.

Additional architecture and development standards are documented in [PROJECT.md](PROJECT.md).

## Getting Started

Clone the repository:

```bash
git clone https://github.com/Marlin-Reams/TechTrack.git
cd TechTrack
```

Install dependencies:

```bash
npm install
```

Configure the required Firebase environment variables for your development environment.

Start the application:

```bash
npm run dev
```

Run available checks:

```bash
npm run lint
npm run build
```

The repository also includes document-processing checks and test resources.

## Development Status

**Active development — evolving personal software project.**

TechTrack is an ongoing project with implemented application functionality and additional features under development.

Current development priorities include improving document scanning reliability, expanding payroll verification workflows, strengthening automated testing, and refining the technician experience.

The project is developed with AI-assisted coding tools alongside manual review, debugging, testing, and architectural decision-making.

## Project Motivation

As an automotive technician with software engineering training, I wanted a system that addressed challenges I encounter in my daily work.

TechTrack combines practical automotive industry knowledge with modern software development to create tools that support technicians rather than requiring them to adapt to generic software.

## Ownership

TechTrack is an independently developed personal project.

Copyright © 2026 TechTrack. All rights reserved.
