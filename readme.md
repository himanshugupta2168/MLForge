# MLForge

**MLForge** is a full-stack machine learning platform that enables users to upload datasets, perform automated exploratory data analysis (EDA), receive intelligent preprocessing recommendations, train machine learning models, and run predictions through a clean web interface.

The project demonstrates an **end-to-end ML workflow platform**, combining modern frontend, backend, and machine learning tooling.

---

# Overview

MLForge provides a structured pipeline for building machine learning models:

1. Upload datasets (CSV)
2. Automatically analyze data (EDA)
3. Generate AI-driven preprocessing recommendations
4. Apply preprocessing and create dataset versions
5. Train ML models
6. Run predictions using trained models

The goal is to simulate a **mini AutoML / ML operations platform** similar to tools used in modern ML teams.

---

# Architecture

```
User
 |
Next.js Frontend
 |
REST API
 |
FastAPI Backend
 |
+---------------------+
|  PostgreSQL DB      |
|  Dataset Metadata   |
+---------------------+
 |
Object Storage
(datasets / models)
 |
ML Processing
(Pandas + Scikit-learn)
```

Frontend communicates with the backend through REST APIs.
Datasets and trained models are stored in blob storage, while metadata is stored in a relational database.

---

# Tech Stack

## Frontend

* Next.js (App Router)
* TypeScript
* TailwindCSS
* Axios
* Recharts
* NextAuth (authentication)

## Backend

* FastAPI
* Poetry (dependency management)
* SQLAlchemy
* PostgreSQL

## Machine Learning

* Pandas
* Scikit-learn
* NumPy

## Storage

* Local storage (development)
* Object storage (S3 / Azure Blob in production)

---

# Project Structure

```
mlforge
│
├── backend
│   ├── app
│   │   ├── api
│   │   │   ├── auth.py
│   │   │   ├── datasets.py
│   │   │   ├── eda.py
│   │   │   ├── preprocess.py
│   │   │   ├── models.py
│   │   │   └── predict.py
│   │   │
│   │   ├── services
│   │   │   ├── eda_service.py
│   │   │   ├── preprocess_service.py
│   │   │   ├── training_service.py
│   │   │   └── prediction_service.py
│   │   │
│   │   ├── db
│   │   │   ├── database.py
│   │   │   └── models.py
│   │   │
│   │   ├── schemas
│   │   ├── auth
│   │   ├── utils
│   │   └── main.py
│   │
│   ├── pyproject.toml
│   └── poetry.lock
│
├── frontend
│   ├── app
│   │   ├── dashboard
│   │   ├── datasets
│   │   ├── preprocessing
│   │   ├── training
│   │   └── prediction
│   │
│   ├── components
│   ├── services
│   ├── hooks
│   └── utils
│
├── storage
│   ├── datasets
│   ├── cleaned
│   ├── models
│   └── predictions
│
├── docs
└── README.md
```

---

# Features

## Dataset Management

* Upload CSV datasets
* Automatic metadata extraction
* Dataset versioning

## Exploratory Data Analysis

* Summary statistics
* Missing value analysis
* Correlation analysis
* Skew detection
* Outlier detection

## AI Recommendations

* Missing value handling suggestions
* Feature transformation recommendations
* Categorical encoding suggestions

## Data Preprocessing

* Missing value imputation
* Feature scaling
* Outlier handling
* Encoding categorical features

## Model Training

* Classification models
* Regression models
* Model metrics tracking
* Model versioning

## Prediction API

* Single prediction requests
* Batch prediction support
* Feature schema validation

---

# Running the Project

## Clone the Repository

```
git clone https://github.com/<username>/mlforge.git
cd mlforge
```

---

# Backend Setup

Navigate to the backend:

```
cd backend
```

Install dependencies using Poetry:

```
poetry install
```

Run the FastAPI server:

```
poetry run uvicorn app.main:app --reload
```

Backend will run at:

```
http://localhost:8000
```

Swagger documentation:

```
http://localhost:8000/docs
```

---

# Frontend Setup

Navigate to frontend:

```
cd frontend
```

Install dependencies:

```
npm install
```

Run development server:

```
npm run dev
```

Frontend runs at:

```
http://localhost:3000
```

---

# Development Workflow

1. Upload dataset
2. Run automated EDA
3. Review preprocessing recommendations
4. Apply transformations
5. Train machine learning model
6. Run predictions

---

# Future Improvements

* AutoML model selection
* SHAP explainability dashboard
* Async training jobs with task queues
* Batch prediction pipelines
* Multi-user project management
* Cloud deployment

---

# Deployment (Planned)

Frontend:

* Vercel

Backend:

* Docker
* AWS / Render / Azure

Storage:

* S3 or Azure Blob Storage

---

# License

MIT License

---

# Author

MLForge is built as a **portfolio project demonstrating full-stack machine learning system design**, combining backend APIs, frontend interfaces, and machine learning pipelines in a unified platform.
