from flask import Flask, request,render_template
from flask_cors import CORS
from routes.accounts import accounts
from routes.tweets import tweets
from utils.sentiment_analysis import train
import logging

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return render_template('index.html')

def start_logging():
    if app.config['LOG_WITH_GUNICORN']:
        gunicorn_error_logger = logging.getLogger('gunicorn.error')
        app.logger.handlers.extend(gunicorn_error_logger.handlers)
        app.logger.setLevel(logging.DEBUG)

if __name__ == '__main__':
    start_logging()
    train()
    print('Finished training, now running the server')
    app.register_blueprint(accounts)
    app.register_blueprint(tweets)
    


