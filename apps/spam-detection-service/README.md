# Spam Detection Service

A simple microservice for detecting spam/bot mentions. This is currently a placeholder implementation that will be replaced with a machine learning model in the future.

## Features

- Rule-based spam detection (placeholder)
- REST API endpoints for spam analysis
- Designed to be easily replaceable with ML models

## API Endpoints

- `POST /detect` - Analyze content for spam
- `GET /health` - Health check

## Usage

```bash
npm install
npm start
```

The service will run on port 3003 by default.

## Future Implementation

This service is designed to be easily replaced with a proper machine learning model without affecting the main application.