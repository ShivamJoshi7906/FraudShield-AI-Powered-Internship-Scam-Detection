from flask import Flask, request, jsonify
import joblib
from datetime import datetime
from bson import ObjectId
import bcrypt
from flask_cors import CORS

from database import predictions_collection, users_collection, alerts_collection, blacklist_collection

app = Flask(__name__)
CORS(app)  # Allow React frontend (localhost:3000) to call this API

# Load model and vectorizer
model = joblib.load("model/fraud_detector.pkl")
vectorizer = joblib.load("model/tfidf_vectorizer.pkl")


@app.route("/")
def home():
    return "Model Loaded Successfully"


# -----------------------------------------
# REGISTER: Create a new user account
# -----------------------------------------
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    role = data.get("role", "user")  # 'user' or 'admin'

    if not name or not email or not password:
        return jsonify({"error": "All fields are required."}), 400

    # Check if email already exists
    existing = users_collection.find_one({"email": email})
    if existing:
        return jsonify({"error": "An account with this email already exists."}), 409

    # Hash the password before saving
    hashed_pw = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    user_doc = {
        "name": name,
        "email": email,
        "password": hashed_pw,
        "role": role,
        "joined_date": datetime.utcnow().isoformat().split("T")[0],
        "created_at": datetime.utcnow()
    }
    result = users_collection.insert_one(user_doc)

    return jsonify({
        "message": "Account created successfully!",
        "user": {
            "id": str(result.inserted_id),
            "name": name,
            "email": email,
            "role": role,
            "joinedDate": user_doc["joined_date"]
        }
    }), 201


# -----------------------------------------
# LOGIN: Authenticate an existing user
# -----------------------------------------
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    role = data.get("role", "user")

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    # Look up user in DB
    user_doc = users_collection.find_one({"email": email, "role": role})
    if not user_doc:
        return jsonify({"error": "Invalid credentials. Please check your email and role."}), 401

    # Compare password with stored hash
    if not bcrypt.checkpw(password.encode("utf-8"), user_doc["password"]):
        return jsonify({"error": "Invalid credentials. Wrong password."}), 401

    return jsonify({
        "message": "Login successful!",
        "user": {
            "id": str(user_doc["_id"]),
            "name": user_doc["name"],
            "email": user_doc["email"],
            "role": user_doc["role"],
            "joinedDate": user_doc.get("joined_date", "")
        }
    }), 200



# -----------------------------------------
# GET ADMINS: Return all admin accounts
# -----------------------------------------
@app.route("/admins", methods=["GET"])
def get_admins():
    admins = []
    for doc in users_collection.find({"role": "admin"}):
        admins.append({
            "id": str(doc["_id"]),
            "name": doc.get("name", ""),
            "email": doc.get("email", ""),
            "role": "Admin",
            "joined": doc.get("joined_date", "")
        })
    return jsonify(admins), 200


@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    text = data["text"]

    # Convert text to TF-IDF
    transformed_text = vectorizer.transform([text])

    # Predict
    prediction = model.predict(transformed_text)
    result = str(prediction[0])

    # Save this prediction to MongoDB
    record = {
        "text": text,
        "prediction": result,
        "created_at": datetime.utcnow()
    }
    predictions_collection.insert_one(record)

    return jsonify({"prediction": result})


# -----------------------------------------
# Get all past predictions
# -----------------------------------------
@app.route("/history", methods=["GET"])
def get_history():
    records = []
    for doc in predictions_collection.find().sort("created_at", -1):
        records.append({
            "id": str(doc["_id"]),
            "text": doc["text"],
            "prediction": doc["prediction"],
            "created_at": doc["created_at"].isoformat()
        })
    return jsonify(records)


# -----------------------------------------
# Get one prediction by its id
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
# Delete one prediction by its id
# -----------------------------------------
@app.route("/history/<record_id>", methods=["DELETE"])
def delete_one(record_id):
    result = predictions_collection.delete_one({"_id": ObjectId(record_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Record not found"}), 404

    return jsonify({"message": "Deleted successfully"})


# -----------------------------------------
# ALERTS: CRUD endpoints
# -----------------------------------------
@app.route("/alerts", methods=["GET"])
def get_alerts():
    results = []
    for doc in alerts_collection.find().sort("created_at", -1):
        results.append({
            "id": str(doc["_id"]),
            "title": doc.get("title", ""),
            "message": doc.get("message", ""),
            "severity": doc.get("severity", "medium"),
            "date": doc.get("date", ""),
            "author": doc.get("author", "Admin")
        })
    return jsonify(results), 200


@app.route("/alerts", methods=["POST"])
def create_alert():
    data = request.json
    title = data.get("title", "").strip()
    message = data.get("message", "").strip()
    severity = data.get("severity", "medium")

    if not title or not message:
        return jsonify({"error": "Title and message are required."}), 400

    alert_doc = {
        "title": title,
        "message": message,
        "severity": severity,
        "date": datetime.utcnow().isoformat().split("T")[0],
        "author": "Admin",
        "created_at": datetime.utcnow()
    }
    result = alerts_collection.insert_one(alert_doc)
    alert_doc["id"] = str(result.inserted_id)
    del alert_doc["_id"]
    del alert_doc["created_at"]
    return jsonify(alert_doc), 201


@app.route("/alerts/<alert_id>", methods=["DELETE"])
def delete_alert(alert_id):
    result = alerts_collection.delete_one({"_id": ObjectId(alert_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Alert not found"}), 404
    return jsonify({"message": "Alert deleted successfully"})


# -----------------------------------------
# BLACKLIST: CRUD endpoints
# -----------------------------------------
@app.route("/blacklist", methods=["GET"])
def get_blacklist():
    results = []
    for doc in blacklist_collection.find().sort("created_at", -1):
        results.append({
            "id": str(doc["_id"]),
            "name": doc.get("name", ""),
            "company": doc.get("company", ""),
            "risk": doc.get("risk", "HIGH"),
            "status": doc.get("status", "Blacklisted"),
            "reason": doc.get("reason", ""),
            "date": doc.get("date", "")
        })
    return jsonify(results), 200


@app.route("/blacklist", methods=["POST"])
def add_to_blacklist():
    data = request.json
    company = data.get("company", "").strip()
    reason = data.get("reason", "").strip()
    risk = data.get("risk", "HIGH")

    if not company or not reason:
        return jsonify({"error": "Company and reason are required."}), 400

    bl_doc = {
        "name": company,
        "company": company,
        "risk": risk,
        "status": "Blacklisted" if risk == "HIGH" else "Suspicious",
        "reason": reason,
        "date": datetime.utcnow().isoformat().split("T")[0],
        "created_at": datetime.utcnow()
    }
    result = blacklist_collection.insert_one(bl_doc)
    bl_doc["id"] = str(result.inserted_id)
    del bl_doc["_id"]
    del bl_doc["created_at"]
    return jsonify(bl_doc), 201


@app.route("/blacklist/<item_id>", methods=["DELETE"])
def delete_from_blacklist(item_id):
    result = blacklist_collection.delete_one({"_id": ObjectId(item_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Item not found"}), 404
    return jsonify({"message": "Removed from blacklist successfully"})


# -----------------------------------------
# Seed default data if collections are empty
# -----------------------------------------
def seed_defaults():
    if alerts_collection.count_documents({}) == 0:
        default_alerts = [
            {"title": "Fake Google Internship Scam Circulating", "message": "Multiple reports of fraudulent Google internship offers demanding registration fees of Rs 2,000. Do not pay.", "severity": "high", "date": "2025-06-18", "author": "Admin", "created_at": datetime.utcnow()},
            {"title": "Suspicious LinkedIn Messages - TCS Intern", "message": "Users receiving fake TCS internship letters via WhatsApp. Verify directly on tcs.com.", "severity": "medium", "date": "2025-06-17", "author": "Admin", "created_at": datetime.utcnow()},
            {"title": "New Phishing Pattern Detected", "message": "Scammers using professional-looking PDF offer letters with fake company seals.", "severity": "high", "date": "2025-06-15", "author": "Admin", "created_at": datetime.utcnow()},
            {"title": "Amazon SDE Intern Scam Alert", "message": "Fraudulent internship offers with Amazon branding asking for background check fees.", "severity": "medium", "date": "2025-06-12", "author": "Admin", "created_at": datetime.utcnow()},
        ]
        alerts_collection.insert_many(default_alerts)
        print("[SEED] Default alerts inserted.")

    if blacklist_collection.count_documents({}) == 0:
        default_blacklist = [
            {"name": "TechSoft Solutions", "company": "TechSoft Solutions", "risk": "HIGH", "status": "Blacklisted", "reason": "Registration fees demanded", "date": "2025-06-10", "created_at": datetime.utcnow()},
            {"name": "QuickJobs India", "company": "QuickJobs India", "risk": "HIGH", "status": "Blacklisted", "reason": "Mass phishing campaign", "date": "2025-05-28", "created_at": datetime.utcnow()},
            {"name": "FreeLance Hub", "company": "FreeLance Hub", "risk": "MEDIUM", "status": "Suspicious", "reason": "Unverified company", "date": "2025-05-15", "created_at": datetime.utcnow()},
        ]
        blacklist_collection.insert_many(default_blacklist)
        print("[SEED] Default blacklist inserted.")


seed_defaults()


if __name__ == "__main__":
    app.run(debug=True)
