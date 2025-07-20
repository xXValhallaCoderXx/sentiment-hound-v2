# Frontend Routing

## Purpose of This Document

This document outlines the URL structure and routing system used in the Next.js web application, including page organization and navigation patterns.

## Routing Strategy

The application uses Next.js App Router with file-based routing and route groups for organization.

## Public Routes

### Marketing & Authentication

- `/`: Landing page with hero section and feature overview
- `/sign-in`: User login page with OAuth and credentials options
- `/sign-up`: User registration form
- `/pricing`: Subscription plans and pricing information
- `/features`: Feature showcase and product details
- `/changelog`: Product updates and version history

## Protected Routes (Dashboard)

### Main Dashboard

- `/dashboard`: Overview dashboard with key metrics and insights
  - Route group `(overview)` for the default dashboard view

### Content Management

- `/dashboard/posts`: Social media posts management and analysis
- `/dashboard/comments`: Comment analysis and sentiment tracking
- `/dashboard/analyse`: Content analysis tools and bulk operations

### Platform Integrations

- `/dashboard/integrations`: Social media platform connections
  - Reddit, YouTube, and other provider management
  - OAuth flow handling and token refresh

### Monitoring & Tracking

- `/dashboard/competitors`: Competitor sentiment tracking and comparison
- `/dashboard/jobs`: Background task monitoring and queue status

### User Management

- `/dashboard/profile`: User profile settings and account management

## Route Organization Patterns

### File Structure

- **Route Groups**: `(landing-page)`, `(overview)` for logical organization without URL segments
- **Dynamic Routes**: `[id]` patterns for resource-specific pages
- **Nested Layouts**: Shared layouts for dashboard sections with consistent navigation

### Layout Hierarchy

- **Root Layout**: Global styling, providers, and authentication context
- **Dashboard Layout**: Protected route wrapper with sidebar navigation
- **Page Layouts**: Specific layouts for landing pages vs. dashboard sections

## Navigation Patterns

- **Public Navigation**: Marketing-focused header with sign-in/sign-up CTAs
- **Dashboard Sidebar**: Feature-based navigation with active state indicators
- **Breadcrumbs**: Contextual navigation for nested dashboard sections

## Authentication Flow

- **Protected Routes**: Automatic redirect to sign-in for unauthenticated users
- **Post-Login Redirect**: Return users to intended destination after authentication
- **Role-Based Access**: Plan-based feature restrictions handled at the component level

## API Route Structure

- `/api/auth/[...nextauth]`: Authentication endpoints
- `/api/integrations/*`: Integration management endpoints
- `/api/providers/*`: Social media provider information
