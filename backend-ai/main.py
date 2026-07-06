from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import joblib
import pandas as pd
import shutil

app = FastAPI()

MODEL_DIR = "models"
if not os.path.exists(MODEL_DIR):
    os.makedirs(MODEL_DIR)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

def get_latest_model():
    files = [os.path.join(MODEL_DIR, f) for f in os.listdir(MODEL_DIR) if f.endswith('.pkl')]
    if not files:
        return None
    latest_file = max(files, key=os.path.getctime)
    return joblib.load(latest_file)

@app.post("/upload-model")
async def upload_model(file: UploadFile = File(...)):
    file_path = os.path.join(MODEL_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"message": "Model berhasil dideploy", "filename": file.filename}

@app.post("/predict")
def predict(data: StressInput):
    model = get_latest_model()
    if not model:
        raise HTTPException(status_code=404, detail="Model tidak ditemukan")
    try:
        values_dict = data.dict()
        values = pd.DataFrame([values_dict])
        values = values[features]
     
        prediction_raw = model.predict(values)[0]
        prediction = int(prediction_raw)
        probabilities_raw = model.predict_proba(values)[0]

        prob_rendah = round(float(probabilities_raw[0]) * 100, 2)
        prob_sedang = round(float(probabilities_raw[1]) * 100, 2)
        prob_tinggi = round(float(probabilities_raw[2]) * 100, 2)

        return {
            "prediction": prediction,
            "label": label_map.get(prediction, "Sedang"),
            "probabilities": {
                "rendah": prob_rendah,
                "sedang": prob_sedang,
                "tinggi": prob_tinggi
            }
        }

    except Exception as e:
        print("Eror Runtime Python Terjadi:", str(e))
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
        
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port)