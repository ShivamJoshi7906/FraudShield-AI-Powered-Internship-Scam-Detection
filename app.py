from flask import Flask, request, jsonify
import joblib
from datetime import datetime
from bson import ObjectId

from database import predictions_collection

app = Flask(__name__)

# Load model and vectorizer
model = joblib.load("model/fraud_detector.pkl")
vectorizer = joblib.load("model/tfidf_vectorizer.pkl")


@app.route("/")
def home():
    return "Model Loaded Successfully"


@app.route("/predict", methods=["POST"])
def predict():

    data = request.json
    text = data["text"]

    # Convert text to TF-IDF
    transformed_text = vectorizer.transform([text])

    # Predict
    prediction = model.predict(transformed_text)
    result = str(prediction[0])

    # -----------------------------------------
    # NEW: Save this prediction to MongoDB
    # -----------------------------------------
    record = {
        "text": text,
        "prediction": result,
        "created_at": datetime.utcnow()
    }
    predictions_collection.insert_one(record)

    return jsonify({
        "prediction": result
    })


# -----------------------------------------
# NEW: Get all past predictions
# -----------------------------------------
@app.route("/history", methods=["GET"])
def get_history():
    records = []
    # find() with no filter = get everything
    # sort by created_at, newest first
    for doc in predictions_collection.find().sort("created_at", -1):
        records.append({
            "id": str(doc["_id"]),
            "text": doc["text"],
            "prediction": doc["prediction"],
            "created_at": doc["created_at"].isoformat()
        })
    return jsonify(records)


# -----------------------------------------
# NEW: Get one prediction by its id
# -----------------------------------------
@app.route("/history/<record_id>", methods=["GET"])
def get_one(record_id):
    doc = predictions_collection.find_one({"_id": ObjectId(record_id)})
    if doc is None:
        return jsonify({"error": "Record not found"}), 404

    return jsonify({
        "id": str(doc["_id"]),
        "text": doc["text"],
        "prediction": doc["prediction"],
        "created_at": doc["created_at"].isoformat()
    })


# -----------------------------------------
# NEW: Delete one prediction by its id
# -----------------------------------------
@app.route("/history/<record_id>", methods=["DELETE"])
def delete_one(record_id):
    result = predictions_collection.delete_one({"_id": ObjectId(record_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Record not found"}), 404

    return jsonify({"message": "Deleted successfully"})


if __name__ == "__main__":
    app.run(debug=True)
