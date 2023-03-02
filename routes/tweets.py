from flask import Blueprint, request
from utils.db import (
    create_tweet, 
    get_tweets,
    get_user_id, 
    get_user_username,
    user_owns_tweet, 
    update_tweet, 
    delete_tweet, 
    check_user_liked_tweet, 
    unlike_tweet, 
    like_tweet,
    count_likes,
    get_user_likes,
)
from utils.auth import check_token
from utils.format_data import error
from utils.sentiment_analysis import is_positive_tweet

import json

tweets = Blueprint('tweets', __name__)


@tweets.route('/tweets/post', methods=['POST'])
def post_tweet():
    try:
        data = json.loads(request.data, strict=False) 
    except:
        return error('Invalid data passed to the API')        
    if type(data['tweet']) is not str:
        return error('Invalid data type passed to the API')
    elif type(data['token']) is not str: 
        return error('Invalid data type passed to the API')
    elif len(data['tweet']) < 1 or len(data['tweet']) > 600:
        return error('Your tweet must be between 1-600 characters')
    elif not data['token']:
        return error('You must provide a token')
    user = check_token(data['token'])
    if not user:
        return error('Please refresh the page and relogin as your token as expired')
    create_tweet(get_user_id(user['username']), data['tweet'])
    return {'success': True}


@tweets.route('/tweets/fetch', methods=['POST'])
def fetch_tweets():
    try:
        data = json.loads(request.data, strict=False) 
    except:
        return error('Invalid data passed to the API')        
    if type(data['token']) is not str: 
        return error('Invalid data type passed to the API')
    user = check_token(data['token'])
    all_tweets = get_tweets()
    managed_tweets = manage_tweets(user, all_tweets)
    return {'success': True, 'tweets': filter_tweets(managed_tweets, data)}


@tweets.route('/tweets/update', methods=['POST'])
def update_user_tweet():
    try:
        data = json.loads(request.data, strict=False) 
    except:
        return error('Invalid data passed to the API')        
    if type(data['tweet_id']) is not int:
        return error('Invalid data type passed to the API')
    if type(data['tweet_edit']) is not str:
        return error('Invalid data type passed to the API')
    elif type(data['token']) is not str: 
        return error('Invalid data type passed to the API')
    elif len(data['tweet_edit']) < 1 or len(data['tweet_edit']) > 600:
        return error('Your tweet must be between 1-600 characters')
    elif not data['token']:
        return error('You must provide a token')
    user = check_token(data['token'])
    if not user:
        return error('Please refresh the page and relogin as your token as expired')
    elif not user_owns_tweet(get_user_id(user['username']), data['tweet_id']):
        return error('You are not authenticated to delete this tweet')
    update_tweet(data['tweet_id'], data['tweet_edit'])
    return {'success': True}


@tweets.route('/tweets/delete', methods=['POST'])
def delete_user_tweet():
    try:
        data = json.loads(request.data, strict=False) 
    except:
        return error('Invalid data passed to the API')        
    if type(data['tweet_id']) is not int:
        return error('Invalid data type passed to the API')
    elif type(data['token']) is not str: 
        return error('Invalid data type passed to the API')
    elif not data['token']:
        return error('You must provide a token')
    user = check_token(data['token'])
    if not user:
        return error('Please refresh the page and relogin as your token as expired')
    elif not user_owns_tweet(get_user_id(user['username']), data['tweet_id']):
        return error('You are not authenticated to delete this tweet')
    delete_tweet(data['tweet_id'])
    return {'success': True}


@tweets.route('/tweets/like', methods=['POST'])
def like_user_tweet():
    try:
        data = json.loads(request.data, strict=False) 
    except:
        return error('Invalid data passed to the API')        
    if type(data['tweet_id']) is not int:
        return error('Invalid data type passed to the API')
    elif type(data['token']) is not str: 
        return error('Invalid data type passed to the API')
    elif not data['token']:
        return error('You must provide a token')
    user = check_token(data['token'])
    if not user:
        return error('Please refresh the page and relogin as your token as expired')
    user_id = get_user_id(user['username'])
    if check_user_liked_tweet(data['tweet_id'], user_id):
        unlike_tweet(data['tweet_id'], user_id)
    else:
        like_tweet(data['tweet_id'], user_id)
    return {'success': True}


def manage_tweets(user, all_tweets):
    if user: 
        user_id = get_user_id(user['username'])
        my_likes = [int(tweetId[0]) for tweetId in get_user_likes(user_id)]
        return [{
                    'tweet_id': tweet[0],
                    'likes': count_likes(tweet[0]),
                    'has_liked': int(tweet[0]) in my_likes,
                    'author': get_user_username(int(tweet[1])),
                    'content': tweet[2], 
                    'is_self': int(tweet[1]) == int(user_id)
                } for tweet in all_tweets
            ]
    return [{
            'tweet_id': tweet[0],
            'likes': count_likes(tweet[0]),
            'has_liked': False,
            'author': get_user_username(int(tweet[1])), 
            'content': tweet[2]
        } for tweet in all_tweets
    ]

def filter_tweets(managed_tweets, data):
    if data['sentimentFilter']:
        managed_tweets = [tweet for tweet in managed_tweets if is_positive_tweet(tweet['content']) ]
    if data['searchValue']:
        managed_tweets = [tweet for tweet in managed_tweets if data['searchValue'] in tweet['content']]
    return managed_tweets
