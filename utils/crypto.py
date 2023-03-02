import bcrypt, hashlib, base64


def hash_pw(password):
    hashed = bcrypt.hashpw(
        base64.b64encode(hashlib.sha256(bytes(password, 'utf-8')).digest()),
        bcrypt.gensalt()
    )
    return hashed.decode('utf-8')

def check_pw(password, hash):
    return bcrypt.checkpw(base64.b64encode(hashlib.sha256(bytes(password, 'utf-8')).digest()), bytes(hash, 'utf-8'))
