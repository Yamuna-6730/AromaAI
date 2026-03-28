import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

# load dataset
df = pd.read_csv("data/aromaai_dataset_500.csv")

# combine columns into text
df["combined"] = (
    df["symptoms"].fillna("") + " " +
    df["preferences"].fillna("")
)

# vectorizer
vectorizer = TfidfVectorizer()
vectors = vectorizer.fit_transform(df["combined"])


def retrieve_similar(profile, top_k=5):
    query_parts = []
    for key in ["symptoms", "preferences", "notes"]:
        query_parts.extend(profile.get(key, []))
    
    query = " ".join(query_parts)
    if not query.strip():
        return [], 0.0

    query_vec = vectorizer.transform([query])
    similarity = cosine_similarity(query_vec, vectors)[0]
    
    top_indices = similarity.argsort()[-top_k:][::-1]
    results = df.iloc[top_indices].copy()
    
    # Add similarity scores
    scores = similarity[top_indices]
    results["similarity_score"] = scores
    
    # Calculate an overall confidence score (avg of top matches)
    confidence_score = float(scores.mean()) if len(scores) > 0 else 0.0
    
    return results.to_dict(orient="records"), round(confidence_score, 2)