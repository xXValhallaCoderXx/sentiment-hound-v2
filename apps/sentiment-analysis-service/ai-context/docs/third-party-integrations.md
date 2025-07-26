# Third-Party Integrations

## Purpose of This Document

This document outlines the external libraries, models, and services integrated into the sentiment analysis microservice.

## Machine Learning Frameworks

### Transformers Library

- **Library**: Hugging Face Transformers
- **Version**: Latest stable release
- **Purpose**: Pre-trained model loading and inference
- **Models Used**: DistilBERT for general sentiment analysis
- **Framework**: PyTorch backend for consistent device acceleration

### PyABSA (Aspect-Based Sentiment Analysis)

- **Library**: PyABSA - Python library for ABSA tasks
- **Purpose**: Aspect term extraction and polarity classification
- **Model Checkpoint**: ATEPC English checkpoint for production use
- **Features**: Pre-trained models for aspect-based sentiment analysis

### PyTorch

- **Framework**: PyTorch deep learning framework
- **Device Support**: CUDA, MPS (Apple Silicon), and CPU backends
- **Purpose**: Model inference and tensor operations
- **Optimization**: Automatic mixed precision and device selection

## Model Dependencies

### Pre-trained Models

- **DistilBERT**: `distilbert-base-uncased-finetuned-sst-2-english` from Hugging Face
- **ATEPC Checkpoint**: English language aspect extraction model
- **Model Loading**: Automatic download and caching on first use
- **Storage**: Models cached locally for improved startup performance

### Model Repositories

- **Hugging Face Hub**: Primary source for transformer models
- **PyABSA Checkpoints**: Specialized ABSA model repository
- **Version Management**: Pinned model versions for reproducible results

## Hardware Acceleration

### CUDA Integration

- **Library**: PyTorch CUDA support
- **Purpose**: GPU acceleration for NVIDIA graphics cards
- **Detection**: Automatic CUDA availability checking
- **Memory Management**: GPU memory optimization for large models

### Apple Silicon Support

- **Framework**: Metal Performance Shaders (MPS)
- **Purpose**: GPU acceleration on M1/M2 Macs
- **Detection**: Automatic MPS backend availability checking
- **Optimization**: Native Apple Silicon acceleration

## API Framework

### FastAPI

- **Framework**: FastAPI for high-performance API development
- **Features**: Automatic API documentation, request validation, async support
- **Performance**: High-throughput HTTP request processing
- **Documentation**: Auto-generated OpenAPI/Swagger documentation

### Pydantic

- **Library**: Data validation and serialization
- **Purpose**: Request/response model validation
- **Type Safety**: Python type hints with runtime validation
- **JSON Handling**: Automatic JSON serialization/deserialization

## Development Dependencies

### Development Tools

- **Python Environment**: Python 3.8+ compatibility
- **Virtual Environment**: Isolated dependency management
- **Requirements Management**: pip-based dependency specification

### Text Processing

- **Regular Expressions**: Built-in Python regex for text cleaning
- **Unicode Support**: Native Python unicode handling
- **Text Normalization**: Preprocessing for optimal model performance

## External Service Integration

### Model Downloading

- **Automatic Downloads**: Models downloaded on first startup
- **Caching Strategy**: Local model caching to reduce startup time
- **Network Requirements**: Internet connection required for initial model download
- **Offline Operation**: Full offline operation after initial model download

### Error Handling

- **Network Failures**: Graceful handling of model download failures
- **Model Loading Errors**: Recovery strategies for corrupted models
- **Hardware Failures**: Fallback to CPU when GPU acceleration fails
