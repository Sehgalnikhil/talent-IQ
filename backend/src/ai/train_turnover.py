import ssl
import pandas as pd
import numpy as np
import joblib
import os
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

# Workaround for Mac SSL Cert Verify failure
ssl._create_default_https_context = ssl._create_unverified_context

DATA_URL = "https://raw.githubusercontent.com/sid26ranjan/hr-analytics-dataset/master/HR_comma_sep.csv"

print(f"📥 Loading live dataset online from {DATA_URL}...")

try:
    df = pd.read_csv(DATA_URL)
    print(f"📊 Dataset Loaded into memory safely. Shape: {df.shape}")

    # --- PREPROCESSING ----------------------------------------
    # Handle Categorical Columns: Department ('sales') & Salary
    df['department_encoded'] = pd.factorize(df['sales'])[0]
    
    # Map Salary: Low, Medium, High into 1, 2, 3
    salary_mapping = {'low': 1, 'medium': 2, 'high': 3}
    df['salary_encoded'] = df['salary'].map(salary_mapping)

    # Features Selection
    X = df[[
        'satisfaction_level', 'last_evaluation', 'number_project', 
        'average_montly_hours', 'time_spend_company', 'Work_accident', 
        'promotion_last_5years', 'department_encoded', 'salary_encoded'
    ]]
    
    # Target: 'left' (1 = Left, 0 = Remained)
    y = df['left']

    # --- TRAINING ---------------------------------------------
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("🧠 Fits Random Forest Model stream over 15,000 data rows...")
    model = RandomForestClassifier(n_estimators=100, max_depth=12, random_state=42)
    model.fit(X_train, y_train)

    # Evaluate
    acc = model.score(X_test, y_test)
    print(f"✅ Training Complete. Model Accuracy on Test dataset: {acc * 100:.2f}%")

    # Save
    output_path = os.path.dirname(os.path.abspath(__file__))
    joblib.dump(model, os.path.join(output_path, "turnover_model.joblib"))
    print(f"💾 Model exported to turnover_model.joblib")

except Exception as e:
    print(f"❌ Error training from online dataset: {str(e)}")
