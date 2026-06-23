# 🛡️ FraudShield — AI-Powered Internship Scam Detection

> An intelligent full-stack web application that uses **Machine Learning** to detect fraudulent job and internship postings, helping students stay safe from online recruitment scams.

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Application](#running-the-application)
- [API Endpoints](#-api-endpoints)
- [Machine Learning Model](#-machine-learning-model)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 About the Project

Job and internship scams are a growing threat targeting students and early-career professionals. Scammers create convincing fake job postings that demand registration fees, steal personal information, or lure victims into phishing traps.

**FraudShield** tackles this problem by combining a **TF-IDF + Random Forest** machine learning pipeline with a modern web interface. Users can paste any job description and get an instant fraud prediction, while administrators can manage community alerts and maintain a blacklist of known scam companies.

---

## ✨ Features

### 🎓 Student Dashboard
- **AI-Powered Scan** — Paste any job/internship description and get an instant fraud prediction
- **Prediction History** — View and manage all past scan results
- **Community Alerts** — Stay updated on the latest scam warnings published by admins
- **Company Blacklist** — Check if a company has been flagged as fraudulent

### 🔐 Admin Dashboard
- **Prediction Analytics** — Monitor all scans and predictions made across the platform
- **Alert Management** — Create, publish, and delete community scam alerts with severity levels
- **Blacklist Management** — Add or remove companies from the fraud blacklist with risk ratings
- **Admin Accounts** — View all admin accounts on the platform

### 🔑 Authentication
- **Secure Registration & Login** — Role-based authentication (User / Admin)
- **Password Hashing** — All passwords are hashed using **bcrypt** before storage
- **Protected Routes** — Role-gated access to dashboards via client-side route guards

---

## 🛠️ Tech Stack

| Layer         | Technology                                                  |
| ------------- | ----------------------------------------------------------- |
| **Frontend**  | React 18, Vite, Tailwind CSS, Recharts, Lucide React Icons  |
| **Backend**   | Python, Flask, Flask-CORS                                   |
| **Database**  | MongoDB Atlas (via PyMongo)                                 |
| **ML Model**  | Scikit-learn (TF-IDF Vectorizer + Random Forest Classifier) |
| **Auth**      | bcrypt (password hashing)                                   |

---

## 🏗️ Project Architecture

```
┌─────────────────────┐         ┌─────────────────────┐
│                     │  HTTP   │                      │
│   React Frontend    │◄───────►│   Flask Backend      │
│   (Vite + Tailwind) │  REST   │   (app.py)           │
│   Port: 5173        │         │   Port: 5000         │
│                     │         │                      │
└─────────────────────┘         └──────────┬───────────┘
                                           │
                                ┌──────────▼───────────┐
                                │                      │
                                │   MongoDB Atlas      │
                                │   (Cloud Database)   │
                                │                      │
                                │  Collections:        │
                                │  • users             │
                                │  • predictions       │
                                │  • alerts            │
                                │  • blacklist         │
                                └──────────────────────┘
```

---

## 📁 Project Structure

```
AI-POWERED-INTERNSHIP-SCAM-DETECTION/
│
├── app.py                      # Flask API server (all REST endpoints)
├── database.py                 # MongoDB connection & collection setup
├── seed_admin.py               # Script to create default admin account
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables (MongoDB URI)
│
├── model/
│   ├── fraud_detector.pkl      # Trained Random Forest classifier
│   └── tfidf_vectorizer.pkl    # Fitted TF-IDF vectorizer
│
├── frontend/
│   ├── package.json            # Node.js dependencies
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   ├── index.html              # HTML entry point
│   └── src/
│       ├── App.jsx             # Root component with routing
│       ├── main.jsx            # React entry point
│       ├── index.css           # Global styles
│       ├── components/
│       │   ├── AlertCard.jsx   # Alert display component
│       │   ├── ResultCard.jsx  # Prediction result component
│       │   ├── ScanCard.jsx    # Job description scan form
│       │   └── Sidebar.jsx     # Dashboard sidebar navigation
│       └── pages/
│           ├── Landing.jsx     # Landing / home page
│           ├── Login.jsx       # Login page (User & Admin)
│           ├── Register.jsx    # Registration page
│           ├── UserDashboard.jsx   # Student dashboard
│           └── AdminDashboard.jsx  # Admin dashboard
│
├── EDA_and_Preprocessing.ipynb # Exploratory Data Analysis notebook
├── Model.ipynb                 # Model training notebook
├── fake_job_postings.csv       # Raw dataset
└── cleaned_jobs.csv            # Preprocessed dataset
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Python 3.9+** — [Download](https://www.python.org/downloads/)
- **Node.js 18+** — [Download](https://nodejs.org/)
- **MongoDB Atlas Account** — [Sign up free](https://www.mongodb.com/cloud/atlas)
- **Git** — [Download](https://git-scm.com/)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ShivamJoshi7906/AI-POWERED-INTERNSHIP-SCAM-DETECTION-.git
   cd AI-POWERED-INTERNSHIP-SCAM-DETECTION-
   ```

2. **Set up the Python backend**

   ```bash
   # Create a virtual environment (recommended)
   python -m venv venv

   # Activate the virtual environment
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate

   # Install Python dependencies
   pip install -r requirements.txt
   ```

3. **Set up the React frontend**

   ```bash
   cd frontend
   npm install
   cd ..
   ```

### Environment Variables

Create a `.env` file in the project root with the following:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=<appName>
```

> **Note:** Replace `<username>`, `<password>`, `<cluster>`, and `<appName>` with your MongoDB Atlas credentials.

### Running the Application

You need **two terminals** — one for the backend and one for the frontend.

**Terminal 1 — Start the Flask Backend:**

```bash
# From the project root
python seed_admin.py     # Run once to create the default admin account
python app.py            # Starts the API on http://localhost:5000
```

**Terminal 2 — Start the React Frontend:**

```bash
cd frontend
npm run dev              # Starts the dev server on http://localhost:5173
```

Open your browser and navigate to **http://localhost:5173** 🎉

### Default Admin Credentials

| Field    | Value                      |
| -------- | -------------------------- |
| Email    | `admin@fraudshield.com`    |
| Password | `Admin@1234`               |

> ⚠️ **Change the default admin password after first login.**

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint     | Description                  |
| ------ | ------------ | ---------------------------- |
| POST   | `/register`  | Register a new user account  |
| POST   | `/login`     | Authenticate and log in      |
| GET    | `/admins`    | Get all admin accounts       |

### Fraud Prediction

| Method | Endpoint              | Description                     |
| ------ | --------------------- | ------------------------------- |
| POST   | `/predict`            | Predict if a job post is fraud  |
| GET    | `/history`            | Get all past predictions        |
| GET    | `/history/<id>`       | Get a specific prediction       |
| DELETE | `/history/<id>`       | Delete a specific prediction    |

### Community Alerts

| Method | Endpoint           | Description             |
| ------ | ------------------ | ----------------------- |
| GET    | `/alerts`          | Get all alerts          |
| POST   | `/alerts`          | Create a new alert      |
| DELETE | `/alerts/<id>`     | Delete an alert         |

### Company Blacklist

| Method | Endpoint             | Description                    |
| ------ | -------------------- | ------------------------------ |
| GET    | `/blacklist`         | Get all blacklisted companies  |
| POST   | `/blacklist`         | Add a company to blacklist     |
| DELETE | `/blacklist/<id>`    | Remove from blacklist          |

---

## 🤖 Machine Learning Model

### Dataset

- **Source:** [Kaggle — Real / Fake Job Posting Prediction](https://www.kaggle.com/datasets/shivamb/real-or-fake-fake-jobposting-prediction)
- **Records:** ~17,880 job postings
- **Target Variable:** `fraudulent` (0 = Real, 1 = Fake)
- **Class Imbalance:** ~95% real vs ~5% fraudulent

### Pipeline

1. **Exploratory Data Analysis** — Data cleaning, missing value handling, class distribution analysis (`EDA_and_Preprocessing.ipynb`)
2. **Feature Engineering** — Text columns combined and vectorized using **TF-IDF** (Term Frequency–Inverse Document Frequency)
3. **Model Training** — **Random Forest Classifier** trained on the TF-IDF features (`Model.ipynb`)
4. **Serialization** — Trained model and vectorizer saved as `.pkl` files using `joblib`

### Model Files

| File                    | Description                        |
| ----------------------- | ---------------------------------- |
| `fraud_detector.pkl`    | Trained Random Forest classifier   |
| `tfidf_vectorizer.pkl`  | Fitted TF-IDF vectorizer           |

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Authors

**Shivam Joshi**
- GitHub: [@ShivamJoshi7906](https://github.com/ShivamJoshi7906)

**Dhruvi Kundariya**
- GitHub: [@dhruvikundariya](https://github.com/dhruvikundariya)

**Shreya Adroja**
- GitHub: [@Shreyaadroja](https://github.com/Shreyaadroja)

---

<p align="center">
  Made with ❤️ to protect students from internship scams
</p>
