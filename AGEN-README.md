# AGEN-README

## Overview

This repository is a monorepo designed for collaborative agent-driven development. It contains multiple applications and packages, organized for modularity and scalability. The main focus is on sentiment analysis and web-based dashboard functionality.

---

## Repository Structure

- **apps/**
  - **web/**: Next.js web application for dashboards, user interaction, and visualization.
  - **sentiment-analysis-service/**: Python service for sentiment analysis tasks.
- **packages/**
  - **database/**: Database utilities and helpers.
  - **eslint-config/**: Shared ESLint configurations for code quality.
  - **services/**: Core backend logic, including business services, repositories, and integrations.
  - **typescript-config/**: Shared TypeScript configurations.
- **tasks/**: (Purpose not specified; typically used for automation scripts or agent tasks.)

---

## Key Components

### apps/web

- Built with Next.js and TypeScript.
- Contains dashboard pages, authentication, integrations, and profile management.
- Organized by feature: `dashboard`, `profile`, `integrations`, etc.
- Uses modular components: atoms, molecules, organisms, templates.

### apps/sentiment-analysis-service

- Python-based microservice.
- Handles sentiment analysis logic.
- Has its own dependencies and README.

### packages/services

- Contains business logic for aspects, integrations, jobs, mentions, plans, posts, queues, reddit, tasks, users, and youtube.
- Each feature has its own repository and service files.
- Promotes separation of concerns and reusability.

### packages/eslint-config

- Houses shared linting rules for JavaScript/TypeScript projects.
- Ensures code consistency across the monorepo.

---

## Development Workflow

- **Monorepo** managed with `pnpm` workspaces.
- Shared configurations and dependencies are centralized in `packages/`.
- Each app/package can be developed and tested independently.
- Use `docker-compose.yml` for orchestrating multi-service development environments.

---

## Conventions

- **TypeScript** is used for all Node.js/Next.js code.
- **Python** is used for the sentiment analysis service.
- **ESLint** and shared configs enforce code quality.
- **Component-driven development** in the web app (atoms, molecules, organisms, templates).
- **API routes** are organized under `apps/web/app/api/`.

---

## Getting Started

1. **Install dependencies**:
   ```sh
   pnpm install
   ```
2. **Run the web app**:
   ```sh
   pnpm --filter apps/web dev
   ```
3. **Run the sentiment analysis service**:
   ```sh
   cd apps/sentiment-analysis-service
   pip install -r requirements.txt
   python main.py
   ```
4. **Use Docker Compose** (optional):
   ```sh
   docker-compose up
   ```

---

## Contribution Guidelines for Agents

- Document all new features and changes.
- Follow existing code style and structure.
- Place shared logic in `packages/` when possible.
- Update this AGEN-README.md with any architectural or workflow changes.
- Use feature branches and submit pull requests for review.

---

## Additional Resources

- [`README.md`](README.md): General project overview.
- [`apps/web/README.md`](apps/web/README.md): Web app-specific details.
- [`apps/sentiment-analysis-service/README.md`](apps/sentiment-analysis-service/README.md): Sentiment service details.
- [`packages/eslint-config/README.md`](packages/eslint-config/README.md): Linting rules and usage.
