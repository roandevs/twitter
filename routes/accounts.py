from flask import Blueprint, request
from utils.db import check_user_exists, create_user, get_hashed_pw
from utils.crypto import hash_pw, check_pw
from utils.auth import generate_token, check_token
from utils.format_data import error

import json

accounts = Blueprint('accounts', __name__)

@accounts.route('/accounts/register', methods=['POST'])
def register():
    try:
        data = json.loads(request.data, strict=False) 
    except:
        return error('Invalid data passed to the API')
    if type(data['username']) is not str:
        return error('Invalid data type passed to the API')
    elif type(data['password']) is not str: 
        return error('Invalid data type passed to the API')
    elif len(data['username']) < 1 or len(data['username']) > 60:
        return error('Your username must be between 1-60 characters')
    elif len(data['password']) < 8:
        return error('Your password must be over 8 characters at least')
    elif check_user_exists(data['username']):
        return error('Username is already registered')
    create_user(data['username'], hash_pw(data['password']))
    token = generate_token(data['username'])
    return {'success': True, 'token': token}

@accounts.route('/accounts/login', methods=['POST'])
def login():
    try:
        data = json.loads(request.data, strict=False) 
    except:
        return error('Invalid data passed to the API')        
    if type(data['username']) is not str:
        return error('Invalid data type passed to the API')
    elif type(data['password']) is not str: 
        return error('Invalid data type passed to the API')
    elif len(data['username']) < 1 or len(data['username']) > 60:
        return error('Your username must be between 1-60 characters')
    elif len(data['password']) < 8:
        return error('Your password must be over 8 characters at least')
    elif not check_user_exists(data['username']):
        return error('Username does not exist')
    elif not check_pw(data['password'], get_hashed_pw(data['username'])):
        return error('Your password is incorrect')
    token = generate_token(data['username'])
    return {'success': True, 'token': token}


@accounts.route('/accounts/check-login', methods=['POST'])
def check_login():
    try:
        data = json.loads(request.data, strict=False) 
    except:
        return error('Invalid data passed to the API')        
    if type(data['token']) is not str: 
        return error('Invalid data type passed to the API')
    elif not data['token']:
        return error('You must provide a token')
    logged_in = True if check_token(data['token']) else False
    return {'success': logged_in}

