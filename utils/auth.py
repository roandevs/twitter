from dotenv import load_dotenv
import jwt, os

load_dotenv()  
jwtSecret = os.environ.get("JWT_SECRET")

def generate_token(username):
    return jwt.encode({"username": username}, jwtSecret, algorithm="HS256")

def check_token(token):
    try:
        return jwt.decode(token, jwtSecret, algorithms=["HS256"])
    except Exception as e:
        return False