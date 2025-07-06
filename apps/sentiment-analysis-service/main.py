from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
from typing import List, Dict, Any
from pyabsa import ATEPCCheckpointManager
import re
import torch

app = FastAPI(title="Sentiment Analysis API")

# Load general sentiment pipeline using DistilBERT (fine-tuned on SST-2)
# Explicitly specify PyTorch as the framework to avoid TensorFlow conflicts
general_sentiment_pipeline = pipeline(
    "sentiment-analysis",
    model="distilbert-base-uncased-finetuned-sst-2-english",
    framework="pt",  # Explicitly use PyTorch
    device=0 if torch.cuda.is_available() else -1  # Use GPU if available
)

# Load ABSA model
aspect_extractor = ATEPCCheckpointManager.get_aspect_extractor(
    checkpoint='english')

# Maximum sequence length for the model
MAX_SEQUENCE_LENGTH = 512

# Function to split text into chunks


def split_text(text, max_length=MAX_SEQUENCE_LENGTH):
    # Simple sentence-based splitting
    sentences = re.split(r'(?<=[.!?])\s+', text)
    chunks = []
    current_chunk = ""

    for sentence in sentences:
        # If adding this sentence would exceed the limit, start a new chunk
        if len(current_chunk.split()) + len(sentence.split()) > max_length:
            if current_chunk:  # Don't add empty chunks
                chunks.append(current_chunk.strip())
            current_chunk = sentence
        else:
            if current_chunk:
                current_chunk += " " + sentence
            else:
                current_chunk = sentence

    # Add the last chunk if it's not empty
    if current_chunk:
        chunks.append(current_chunk.strip())

    # If no chunks were created (e.g., for very short text), return the original text
    if not chunks:
        return [text]

    return chunks


class TextItem(BaseModel):
    id: str
    value: str

# Request format
class SentimentRequest(BaseModel):
    data: List[TextItem]

# Response model - could be explicitly defined here


# Endpoint
@app.post("/analyze")
def analyze(request: SentimentRequest) -> List[Dict[str, Any]]:
    input_data = request.data
    results = []

    for item in input_data:
        # Split text into manageable chunks
        text_chunks = split_text(item.value)

        # Process each chunk for general sentiment
        general_sentiments = []
        for chunk in text_chunks:
            chunk_sentiment = general_sentiment_pipeline(chunk)[0] # type: ignore
            general_sentiments.append(chunk_sentiment)

        # Combine general sentiments - take the one with highest confidence
        if general_sentiments:
            general_result = max(general_sentiments, key=lambda x: x["score"])
        else:
            general_result = {"label": "NEUTRAL", "score": 0.5}

        # Process each chunk for aspect-based sentiment
        all_aspect_sentiments = []
        for chunk in text_chunks:
            aspect_result = aspect_extractor.extract_aspect(
                inference_source=[chunk], print_result=False)

            if aspect_result and len(aspect_result) > 0:
                # Extract aspects and sentiments
                for aspect in aspect_result:
                    aspects = aspect.get("aspect", [])
                    sentiments = aspect.get("sentiment", [])

                    for asp, sent in zip(aspects, sentiments):
                        all_aspect_sentiments.append(
                            {"aspect": asp, "sentiment": sent})

        # Combine the results
        results.append({
            "id": item.id,
            "text": item.value,
            "general_sentiment": {
                "label": general_result["label"],
                "score": general_result["score"]
            },
            "aspect_sentiment": all_aspect_sentiments
        })

    return results
