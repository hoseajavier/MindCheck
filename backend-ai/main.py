from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

import joblib
import numpy as np
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load(
    "stress_detection_random_forest.pkl"
)

features = [
    "snoring_rate",
    "respiration_rate",
    "body_temperature",
    "limb_movement",
    "blood_oxygen",
    "eye_movement",
    "sleeping_hours",
    "heart_rate"
]

class StressInput(BaseModel):

    snoring_rate: float
    respiration_rate: float
    body_temperature: float
    limb_movement: float
    blood_oxygen: float
    eye_movement: float
    sleeping_hours: float
    heart_rate: float

label_map = {
    0: "Rendah",
    1: "Sedang",
    2: "Tinggi"
}

@app.get("/")
def root():

    return {
        "message": "Stress Detection API Running"
    }
    
@app.post("/predict")
def predict(data: StressInput):

    try:

        values_dict = data.dict()

        values = pd.DataFrame(
            [[values_dict[f] for f in features]],
            columns=features
        )

        prediction = model.predict(values)[0]

        probabilities = model.predict_proba(values)[0]

        return {

            "prediction": int(prediction),

            "label": label_map[int(prediction)],

            "probabilities": {
                "rendah": round(probabilities[0] * 100, 2),
                "sedang": round(probabilities[1] * 100, 2),
                "tinggi": round(probabilities[2] * 100, 2),
            }

        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
        
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)