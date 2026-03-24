import sys
import json
import joblib
import pandas as pd
import os

# usage: python3 predict_hire_ability.py '{"experience": 5, "skills": 80, ...}'

try:
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing input JSON payload"}))
        sys.exit(1)

    input_data = json.loads(sys.argv[1])

    # Extract single observation features
    X = pd.DataFrame([{
        'experience': input_data.get('experience', 2),
        'skills_score': input_data.get('skills_score', 50),
        'aptitude_score': input_data.get('aptitude_score', 50),
        'coding_speed_sec': input_data.get('coding_speed_sec', 1800),
        'sys_design_score': input_data.get('sys_design_score', 5)
    }])

    # Load Model
    model_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "hire_model.joblib")
    if not os.path.exists(model_path):
        print(json.dumps({"error": "Model file not found. Please train first."}))
        sys.exit(1)

    model = joblib.load(model_path)

    # Predict Probability of Hire (Class 1)
    probs = model.predict_proba(X)
    hireability_score = float(probs[0][1] * 100) # Percentage
    
    # Categorize
    category = "Tier 3 (Sub-Optimal)"
    if hireability_score > 80:
        category = "Tier 1 (Elite)"
    elif hireability_score > 50:
        category = "Tier 2 (Competitive)"

    print(json.dumps({
        "hireability_score": round(hireability_score, 2),
        "status_tier": category,
        "features_read": X.to_dict(orient='records')[0]
    }))

except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)
