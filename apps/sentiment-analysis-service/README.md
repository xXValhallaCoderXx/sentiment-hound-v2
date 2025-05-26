# Sentiment Analysis Service

This service is a Python application built with [FastAPI](https://fastapi.tiangolo.com/) and [Uvicorn](https://www.uvicorn.org/) to provide sentiment analysis capabilities. It utilizes transformer models for text analysis.

## Functionality

The service exposes API endpoints to analyze the sentiment of a given text. (Further details about specific endpoints should be added here if known, e.g., `/sentiment`, expected request/response formats).

## Setup and Installation

### Prerequisites

*   Python (e.g., 3.9+). It's recommended to use a virtual environment.
*   `pip` for installing dependencies.

### Dependencies

The service requires the following Python packages:

*   fastapi
*   uvicorn
*   transformers
*   torch
*   pyabsa

### Installation

1.  **Navigate to the service directory:**
    ```bash
    cd apps/sentiment-analysis-service
    ```

2.  **(Optional but Recommended) Create and activate a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

## Running the Service

To run the sentiment analysis service locally:

1.  Ensure you are in the `apps/sentiment-analysis-service` directory.
2.  If using a virtual environment, make sure it's activated.
3.  Start the Uvicorn server:
    ```bash
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
    ```
    *   `main:app`: Assumes your FastAPI application instance is named `app` in a file named `main.py`.
    *   `--reload`: Enables auto-reloading when code changes (for development).
    *   `--host 0.0.0.0`: Makes the server accessible from outside the container/machine if needed.
    *   `--port 8000`: Runs the service on port 8000. You can change this if needed.

The API should then be accessible at `http://localhost:8000`.

## Environment Variables

If the service requires any environment variables (e.g., for model paths, configurations), list them here with descriptions. For example:
*   `MODEL_PATH`: Path to the pre-trained sentiment analysis model.
*   `API_KEY_OTHER_SERVICE`: If it needs to communicate with other services.

(Currently, no specific environment variables are known; this section is a placeholder).

## Integration with Monorepo (Turborepo)

It's also possible this service is intended to be run via the root `pnpm run dev` command. If so, there should be a `dev` script in this service's `package.json` (if one exists for Python projects in this monorepo structure) or configuration in the root `turbo.json` that handles starting this service.

If this service *is not* automatically started by `pnpm run dev` from the root, you will need to run it manually using the `uvicorn` command above in a separate terminal.
