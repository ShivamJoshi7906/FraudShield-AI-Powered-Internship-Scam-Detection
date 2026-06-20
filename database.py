from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load variables from the .env file (keeps your password out of this code file)
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

# Connect to MongoDB
client = MongoClient(MONGO_URI)

# This creates (or connects to) a database called "fake_job_detector"
db = client["fake_job_detector"]

# This creates (or connects to) a collection called "predictions"
# (a "collection" in MongoDB is like a "table" in normal databases)
predictions_collection = db["predictions"]

print("Connected to MongoDB successfully!")
