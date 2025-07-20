#!/usr/bin/env python3
"""
Test script to verify M1 MacBook Pro compatibility and performance
"""

import torch
import platform
from transformers import pipeline
from pyabsa import ATEPCCheckpointManager

def test_m1_compatibility():
    """Test M1 compatibility and performance"""
    print("=== M1 MacBook Pro Compatibility Test ===\n")
    
    # System info
    print(f"Platform: {platform.platform()}")
    print(f"Architecture: {platform.machine()}")
    print(f"Python version: {platform.python_version()}")
    print()
    
    # PyTorch info
    print("PyTorch Configuration:")
    print(f"PyTorch version: {torch.__version__}")
    print(f"CUDA available: {torch.cuda.is_available()}")
    
    # Check for M1 GPU support
    if hasattr(torch.backends, 'mps'):
        print(f"MPS (M1 GPU) available: {torch.backends.mps.is_available()}")
        if torch.backends.mps.is_available():
            print("✅ M1 GPU acceleration is available!")
        else:
            print("⚠️ MPS not available, will use CPU")
    else:
        print("⚠️ MPS backend not found (PyTorch version may be too old)")
    print()
    
    # Test optimal device selection
    def get_optimal_device():
        if torch.cuda.is_available():
            return 0
        elif hasattr(torch.backends, 'mps') and torch.backends.mps.is_available():
            return "mps"
        else:
            return -1
    
    device = get_optimal_device()
    print(f"Selected device: {device}")
    print()
    
    # Test DistilBERT pipeline
    print("Testing DistilBERT sentiment pipeline...")
    try:
        pipeline_start = torch.utils.benchmark.Timer(
            stmt='pipeline("This is a great product!")',
            setup='from transformers import pipeline; pipe = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english", device=device)',
            globals={'device': device, 'pipeline': None}
        )
        
        sentiment_pipeline = pipeline(
            "sentiment-analysis",
            model="distilbert-base-uncased-finetuned-sst-2-english",
            device=device
        )
        
        # Test inference
        result = sentiment_pipeline("This is a great product!")
        print(f"✅ DistilBERT test successful: {result}")
        print()
        
    except Exception as e:
        print(f"❌ DistilBERT test failed: {e}")
        print()
    
    # Test PyABSA
    print("Testing PyABSA ATEPC model...")
    try:
        aspect_extractor = ATEPCCheckpointManager.get_aspect_extractor(
            checkpoint='english',
            auto_device=True
        )
        
        # Test inference
        test_text = ["The food was delicious but the service was slow."]
        result = aspect_extractor.extract_aspect(
            inference_source=test_text,
            print_result=False
        )
        print(f"✅ PyABSA test successful")
        if result:
            print(f"Sample result: {result[0] if result else 'No results'}")
        print()
        
    except Exception as e:
        print(f"❌ PyABSA test failed: {e}")
        print()
    
    # Performance recommendations
    print("=== Performance Recommendations ===")
    if device == "mps":
        print("✅ Using M1 GPU - optimal performance expected")
        print("💡 Consider batch processing for better throughput")
    elif device == 0:
        print("✅ Using CUDA GPU - excellent performance expected")
    else:
        print("⚠️ Using CPU - consider upgrading PyTorch for M1 support")
        print("💡 Install PyTorch with MPS support: pip install torch>=2.0.0")
    
    print("\n=== Memory Recommendations ===")
    print("• 8GB+ RAM recommended for comfortable operation")
    print("• 16GB+ RAM recommended for batch processing")
    print("• Models will use ~2-3GB total memory")

if __name__ == "__main__":
    test_m1_compatibility()
