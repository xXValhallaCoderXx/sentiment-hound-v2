from fastapi import FastAPI

app = FastAPI()


@app.get("/sentiment")
async def root():
    return {"message": "Hello Worsssld"}
