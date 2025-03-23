from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
from typing import List, Dict, Any
from pyabsa import ATEPCCheckpointManager

app = FastAPI(title="Sentiment Analysis API")

# Load general sentiment pipeline using DistilBERT (fine-tuned on SST-2)
general_sentiment_pipeline = pipeline(
    "sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

# Load ABSA model
aspect_extractor = ATEPCCheckpointManager.get_aspect_extractor(
    checkpoint='english')


# Request format
class SentimentRequest(BaseModel):
    texts: List[str]

# Define the output model


# Endpoint
@app.post("/analyze")
def analyze(request: SentimentRequest) -> List[Dict[str, Any]]:
    texts = request.texts

    # General sentiment (DistilBERT)
    general_results = general_sentiment_pipeline(texts)

    # Aspect-based sentiment (PyABSA)
    absa_results = aspect_extractor.extract_aspect(
        inference_source=texts, print_result=False)

    # Combine results
    combined = []
    for text, general, aspect in zip(texts, general_results, absa_results):
        combined.append({
            "text": text,
            "general_sentiment": {
                "label": general["label"],
                "score": general["score"]
            },
            "aspect_sentiment": {
                "aspects": aspect["aspect"],
                "sentiments": aspect["sentiment"]
            }
        })

    return combined
