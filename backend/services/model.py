import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import MultiLabelBinarizer

# -----------------------------
# LOAD DATASET
# -----------------------------
df = pd.read_csv("data/aromaai_dataset_500.csv")

# Handle missing values
df.fillna("", inplace=True)

# -----------------------------
# CLEAN DATA
# -----------------------------
def safe_split(x):
    if isinstance(x, str) and x.strip():
        return [i.strip() for i in x.split(",")]
    return []

df["symptoms"] = df["symptoms"].apply(safe_split)
df["preferences"] = df["preferences"].apply(safe_split)

# -----------------------------
# ENCODERS
# -----------------------------
symptom_encoder = MultiLabelBinarizer()
pref_encoder = MultiLabelBinarizer()

symptoms_encoded = symptom_encoder.fit_transform(df["symptoms"])
prefs_encoded = pref_encoder.fit_transform(df["preferences"])

# -----------------------------
# FEATURE MATRIX
# -----------------------------
X = np.hstack([symptoms_encoded, prefs_encoded])

# -----------------------------
# TARGET (COMPOUNDS)
# -----------------------------
compound_cols = [
    "ethanol","iso_e_super","hedione","galaxolide",
    "ambroxan","linalool","limonene","geraniol","vanillin"
]

y = df[compound_cols]

# -----------------------------
# MODEL TRAINING
# -----------------------------
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X, y)

print("✅ Model trained successfully")

# -----------------------------
# PREDICTION FUNCTION
# -----------------------------
def predict_compounds(profile):

    symptoms = profile.get("symptoms", [])
    preferences = profile.get("preferences", [])

    # Ensure lists
    if not isinstance(symptoms, list):
        symptoms = []
    if not isinstance(preferences, list):
        preferences = []

    # Encode
    s_enc = symptom_encoder.transform([symptoms])
    p_enc = pref_encoder.transform([preferences])

    features = np.hstack([s_enc, p_enc])

    prediction = model.predict(features)[0]

    # Convert to dict + round values + safety check
    result = {}
    for compound, v in zip(compound_cols, prediction):
        safe_v = round(float(v), 4)
        if np.isnan(safe_v) or np.isinf(safe_v):
            safe_v = 0.0
        result[compound] = safe_v

    return result