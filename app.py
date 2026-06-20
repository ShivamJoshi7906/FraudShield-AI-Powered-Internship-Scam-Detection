from fastapi import FastAPI
import joblib

app = FastAPI()

# Load trained model
model = joblib.load("model/fraud_detector.pkl")

# Load TF-IDF vectorizer
vectorizer = joblib.load("model/tfidf_vectorizer.pkl")


@app.get("/")
def home():
    return {
        "message": "AI Powered Internship Scam Detection API Running"
    }


@app.get("/predict")
def predict(job_text: str):

    # Convert text to TF-IDF features
    text_vector = vectorizer.transform([job_text])

    # Predict
    prediction = model.predict(text_vector)

    # Return readable result
    if prediction[0] == 1:
        return {
            "prediction": "Fraud",
            "status": "⚠️ Suspicious Job Posting"
        }

    return {
        "prediction": "Genuine",
        "status": "✅ Legitimate Job Posting"
    }