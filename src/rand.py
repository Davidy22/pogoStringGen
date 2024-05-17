from hashlib import pbkdf2_hmac
from base64 import b64encode
from os import urandom
import secrets


def salted_hash(secret, salt):
    return pbkdf2_hmac("sha512", bytes(secret, encoding="utf-8"), salt * 4, 939421)


def gen_rand():
    return secrets.token_urlsafe(128)
