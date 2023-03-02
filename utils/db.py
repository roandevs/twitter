from dotenv import load_dotenv
import mysql.connector as mysql
import os 

load_dotenv()  
dbUser = os.environ.get("DB_USER")
dbPass = os.environ.get("DB_PASSWORD")
dbName = os.environ.get("DB_NAME")

def create_db_conn():
    conn = mysql.connect( host="localhost", database=dbName, user=dbUser, password=dbPass)
    cursor = conn.cursor(prepared=True)
    return conn, cursor

def close_db_conn(conn, cursor):
    cursor.close()
    conn.close()

def create_user(username, password):
    conn, cursor = create_db_conn()
    cursor.execute("INSERT INTO users VALUES (NULL, %s, %s)",  (username, password))
    conn.commit()
    close_db_conn(conn, cursor)

def check_user_exists(username):
    conn, cursor = create_db_conn()
    cursor.execute("SELECT * FROM users WHERE Username = %s", (username, ))
    row = cursor.fetchone()
    close_db_conn(conn, cursor)
    return row

def get_hashed_pw(username):
    conn, cursor = create_db_conn()
    cursor.execute("SELECT Password FROM users WHERE Username = %s", (username, ))
    row = cursor.fetchone()
    close_db_conn(conn, cursor)
    return row[0]

def get_user_id(username):
    conn, cursor = create_db_conn()
    cursor.execute("SELECT ID FROM users WHERE Username = %s", (username, ))
    row = cursor.fetchone()
    close_db_conn(conn, cursor)
    return row[0]

def get_user_username(id):
    conn, cursor = create_db_conn()
    cursor.execute("SELECT Username FROM users WHERE ID = %s", (id, ))
    row = cursor.fetchone()
    close_db_conn(conn, cursor)
    return row[0]

def create_tweet(id, tweet):
    conn, cursor = create_db_conn()
    cursor.execute("INSERT INTO tweets VALUES (NULL, %s, %s)", (id, tweet))
    conn.commit()
    close_db_conn(conn, cursor)

def get_tweets():
    conn, cursor = create_db_conn()
    cursor.execute("SELECT * FROM tweets")
    all_tweets = cursor.fetchall()
    close_db_conn(conn, cursor)
    return all_tweets

def update_tweet(tweet_id, tweet_content):
    conn, cursor = create_db_conn()
    cursor.execute("UPDATE tweets SET Content = %s WHERE ID = %s", (tweet_content, tweet_id))
    conn.commit()
    close_db_conn(conn, cursor)

def delete_tweet(tweet_id):
    conn, cursor = create_db_conn()
    cursor.execute("DELETE FROM tweets WHERE ID = %s", (tweet_id, ))
    conn.commit()
    close_db_conn(conn, cursor)

def user_owns_tweet(user_id, tweet_id):
    conn, cursor = create_db_conn()
    cursor.execute("SELECT UserID FROM tweets WHERE ID = %s", (tweet_id, ))
    row = cursor.fetchone()
    close_db_conn(conn, cursor)
    return int(row[0]) == int(user_id)

def check_user_liked_tweet(tweet_id, user_id):
    conn, cursor = create_db_conn()
    cursor.execute("SELECT * FROM likes WHERE UserID = %s AND TweetID = %s", (user_id, tweet_id))
    row = cursor.fetchone()
    close_db_conn(conn, cursor)
    return row

def get_user_likes(user_id):
    conn, cursor = create_db_conn()
    cursor.execute("SELECT TweetID FROM likes WHERE UserID = %s", (user_id, ))
    all_likes = cursor.fetchall()
    close_db_conn(conn, cursor)
    return all_likes

def like_tweet(tweet_id, user_id):
    conn, cursor = create_db_conn()
    cursor.execute("INSERT INTO likes VALUES (NULL, %s, %s)", (tweet_id, user_id))
    conn.commit()
    close_db_conn(conn, cursor)

def unlike_tweet(tweet_id, user_id):
    conn, cursor = create_db_conn()
    cursor.execute("DELETE FROM likes WHERE TweetID = %s AND UserID = %s", (tweet_id, user_id))
    conn.commit()
    close_db_conn(conn, cursor)

def count_likes(tweet_id):
    conn, cursor = create_db_conn()
    cursor.execute("SELECT COUNT(*) FROM likes WHERE TweetID = %s", (tweet_id, ))
    row = cursor.fetchone()
    close_db_conn(conn, cursor)
    return int(row[0])