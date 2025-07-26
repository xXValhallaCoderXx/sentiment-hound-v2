# Core Services

## Purpose of This Document

This document provides an overview of the machine learning services and sentiment analysis capabilities provided by the Python FastAPI microservice.

## Service Architecture

The sentiment analysis service is a standalone Python FastAPI application that provides machine learning-powered sentiment analysis and aspect extraction capabilities.

## Machine Learning Models

### General Sentiment Analysis

- **Model**: DistilBERT fine-tuned on Stanford Sentiment Treebank (SST-2)
- **Framework**: Transformers library with PyTorch backend
- **Output**: Binary sentiment classification (POSITIVE/NEGATIVE) with confidence scores
- **Use Case**: Overall sentiment classification for posts and comments

### Aspect-Based Sentiment Analysis (ABSA)

- **Model**: PyABSA ATEPC (Aspect Term Extraction and Polarity Classification)
- **Checkpoint**: ATEPC_ENGLISH_CHECKPOINT for English text analysis
- **Output**: Aspect terms with associated sentiment polarities and confidence scores
- **Use Case**: Detailed sentiment analysis identifying specific aspects and their sentiments

## Device Optimization

### Hardware Acceleration

- **CUDA Support**: Automatic GPU acceleration when NVIDIA GPUs are available
- **Apple Silicon**: MPS (Metal Performance Shaders) support for M1/M2 Macs
- **CPU Fallback**: Automatic fallback to CPU processing when GPU unavailable
- **Dynamic Selection**: Optimal device selection based on system capabilities

### Performance Optimization

- Model loading and caching for reduced inference latency
- Batch processing support for multiple text inputs
- Memory management for large-scale text processing

## API Endpoints

### Sentiment Analysis

- **Endpoint**: `/analyze-sentiment`
- **Method**: POST
- **Input**: Text content for sentiment analysis
- **Output**: Sentiment classification with confidence scores

### Aspect Analysis

- **Endpoint**: `/analyze-aspects`
- **Method**: POST
- **Input**: Text content for aspect-based analysis
- **Output**: Extracted aspects with sentiment polarities

### Health Check

- **Endpoint**: `/health`
- **Method**: GET
- **Output**: Service health status and model loading state

## Integration Patterns

### Communication Protocol

- **HTTP REST API**: Standard HTTP endpoints for analysis requests
- **JSON Payloads**: Structured JSON input/output for easy integration
- **Async Processing**: Support for asynchronous analysis workflows

### Error Handling

- Model loading failure recovery
- Input validation and sanitization
- Graceful degradation for unsupported text inputs

## Text Processing Pipeline

### Preprocessing

- Text cleaning and normalization
- HTML/markup removal for social media content
- Unicode handling for international text

### Analysis Workflow

1. Input text validation and preprocessing
2. Model inference with appropriate device acceleration
3. Result formatting and confidence scoring
4. Response serialization and delivery

## Deployment Considerations

- **Containerization**: Docker support for consistent deployment
- **Resource Requirements**: GPU memory considerations for model loading
- **Scaling**: Horizontal scaling support for increased throughput
- **Model Versioning**: Checkpoint management for model updates
