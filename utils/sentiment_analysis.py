from sklearn.feature_extraction.text import TfidfVectorizer  
from sklearn.ensemble import RandomForestClassifier
from nltk.corpus import stopwords

import pandas as pd 
import re, nltk

nltk.download('stopwords')
text_classifier = RandomForestClassifier(n_estimators=100, random_state=0)
tfidfconverter = TfidfVectorizer(max_features=2000, min_df=5, max_df=0.7, stop_words=stopwords.words('english'))

def is_positive_tweet(content):
    # Remove all the special characters
    processed_tweet = re.sub(r'\W', ' ', content)
    # remove all single characters
    processed_tweet = re.sub(r'\s+[a-zA-Z]\s+', ' ', processed_tweet)
    # Remove single characters from the start
    processed_tweet = re.sub(r'\^[a-zA-Z]\s+', ' ', processed_tweet) 
    # Substituting multiple spaces with single space
    processed_tweet= re.sub(r'\s+', ' ', processed_tweet, flags=re.I)
    # Removing prefixed 'b'
    processed_tweet = re.sub(r'^b\s+', '', processed_tweet)
    # Converting to Lowercase
    processed_tweet = processed_tweet.lower()
    sentiment = text_classifier.predict(tfidfconverter.transform([ processed_tweet]).toarray())
    return True if sentiment[0] == 'positive' else False

def train():
    global text_classifier, tfidfconverter
    tweets = pd.read_csv("./Tweets.csv")
    X = tweets.iloc[:, 10].values
    y = tweets.iloc[:, 1].values
    processed_tweets = []
    for tweet in range(0, len(X)):
        # Remove all the special characters
        processed_tweet = re.sub(r'\W', ' ', str(X[tweet]))
        # remove all single characters
        processed_tweet = re.sub(r'\s+[a-zA-Z]\s+', ' ', processed_tweet)
        # Remove single characters from the start
        processed_tweet = re.sub(r'\^[a-zA-Z]\s+', ' ', processed_tweet) 
        # Substituting multiple spaces with single space
        processed_tweet= re.sub(r'\s+', ' ', processed_tweet, flags=re.I)
        # Removing prefixed 'b'
        processed_tweet = re.sub(r'^b\s+', '', processed_tweet)
        # Converting to Lowercase
        processed_tweet = processed_tweet.lower()
        processed_tweets.append(processed_tweet)
    X = tfidfconverter.fit_transform(processed_tweets).toarray()
    text_classifier.fit(X, y)
