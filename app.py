from flask import Flask, request,render_template
from flask_cors import CORS
from waitress import serve

from routes.accounts import accounts
from routes.tweets import tweets

from utils.sentiment_analysis import train


app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    train()
    print('Finished training, now running the server')
    app.register_blueprint(accounts)
    app.register_blueprint(tweets)
    #app.run(host='0.0.0.0', port=8080)
    serve(app, host="0.0.0.0", port=8080)

