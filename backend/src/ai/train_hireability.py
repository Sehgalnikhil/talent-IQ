import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

print("🚀 Generating synthetic dataset of 100,000 candidates...")

np.random.seed(42)
n_samples = 100000

# Feature 1: Years of Experience (0 to 12)
exp = np.random.randint(0, 13, n_samples)

# Feature 2: Core Skills Score% (0 to 100)
skills = np.random.randint(20, 101, n_samples)

# Feature 3: Aptitude Score% (0 to 100)
aptitude = np.random.randint(30, 101, n_samples)

# Feature 4: Code Solving Speed (in seconds to solve, 120s to 3600s)
speed = np.random.randint(120, 3601, n_samples)

# Feature 5: Communication / System Design (0 to 10)
sys_design = np.random.randint(1, 11, n_samples)

# Target Logic: Hireability (1 or 0)
score = (exp * 4) + (skills * 0.4) + (aptitude * 0.3) + ((3600 - speed) / 3600 * 20) + (sys_design * 3)

# Add some noise to simulate realistic data
noise = np.random.normal(0, 5, n_samples)
adjusted_score = score + noise

# Threshold for "Hire" (Target)
hire = (adjusted_score > 65).astype(int)

# Create DataFrame
df = pd.DataFrame({
    'experience': exp,
    'skills_score': skills,
    'aptitude_score': aptitude,
    'coding_speed_sec': speed,
    'sys_design_score': sys_design,
    'hire': hire
})

X = df[['experience', 'skills_score', 'aptitude_score', 'coding_speed_sec', 'sys_design_score']]
y = df['hire']

# Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("🧠 Training Random Forest Classifier Setup...")
model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
model.fit(X_train, y_train)

# Evaluate Accuracy
acc = model.score(X_test, y_test)
print(f"✅ Training Complete. Model Accuracy on Test dataset: {acc * 100:.2f}%")

# Save model and dataset
output_path = os.path.dirname(os.path.abspath(__file__))
df.to_csv(os.path.join(output_path, "hireability_dataset.csv"), index=False)
print(f"💾 Dataset exported to hireability_dataset.csv")

joblib.dump(model, os.path.join(output_path, "hire_model.joblib"))
print(f"💾 Model exported to hire_model.joblib")
