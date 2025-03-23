from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
from typing import List

app = FastAPI(title="Sentiment Analysis API")

# Load the sentiment pipeline using DistilBERT (fine-tuned on SST-2)
sentiment_pipeline = pipeline(
    "sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

# Define the input model


class SentimentRequest(BaseModel):
    texts: List[str]

# Define the output model


class SentimentResult(BaseModel):
    label: str
    score: float


@app.post("/analyze", response_model=List[SentimentResult])
def analyze_sentiment(request: SentimentRequest):
    results = sentiment_pipeline(request.texts)
    return results
