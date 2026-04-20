import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import numpy as np

# Generate fictional event data
# Since the app has events with descriptions, we'll simulate some events
events_data = [
    {"id": 1, "title": "Tech Talk on AI", "description": "Learn about artificial intelligence and its applications in modern technology."},
    {"id": 2, "title": "Music Concert", "description": "Enjoy live music from local bands and artists."},
    {"id": 3, "title": "Sports Tournament", "description": "Compete in various sports events and games."},
    {"id": 4, "title": "Art Exhibition", "description": "Explore contemporary art pieces from talented artists."},
    {"id": 5, "title": "Coding Workshop", "description": "Hands-on session on programming and software development."},
    {"id": 6, "title": "Debate Competition", "description": "Engage in intellectual discussions on current topics."},
    {"id": 7, "title": "Dance Performance", "description": "Watch mesmerizing dance routines from dance clubs."},
    {"id": 8, "title": "Science Fair", "description": "Discover scientific experiments and innovations."},
    {"id": 9, "title": "Film Screening", "description": "Screening of independent films and documentaries."},
    {"id": 10, "title": "Book Club Meeting", "description": "Discuss literature and share book recommendations."},
    {"id": 11, "title": "Photography Workshop", "description": "Learn photography techniques and editing."},
    {"id": 12, "title": "Environmental Seminar", "description": "Talk on sustainability and environmental issues."},
    {"id": 13, "title": "Cooking Class", "description": "Learn to cook delicious meals from different cuisines."},
    {"id": 14, "title": "Yoga Session", "description": "Relax and improve flexibility with yoga."},
    {"id": 15, "title": "Business Pitch", "description": "Entrepreneurs pitch their startup ideas."},
]

df = pd.DataFrame(events_data)

# Features: TF-IDF on description
vectorizer = TfidfVectorizer(stop_words='english')
X = vectorizer.fit_transform(df['description'])

# Model: K-means clustering
# Choose k=4 for themes: Tech, Arts, Sports, Academic
k = 4
kmeans = KMeans(n_clusters=k, random_state=42)
df['cluster'] = kmeans.fit_predict(X)

# Evaluation: Silhouette score
sil_score = silhouette_score(X, df['cluster'])
print(f"Silhouette Score: {sil_score}")

# Show clusters
for cluster in range(k):
    print(f"\nCluster {cluster}:")
    cluster_events = df[df['cluster'] == cluster]['title'].tolist()
    print(cluster_events)

# Save cluster assignments
df[['id', 'title', 'cluster']].to_csv('event_clusters.csv', index=False)

print("Clusters saved to event_clusters.csv")