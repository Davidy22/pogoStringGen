from src.rand import *
from src.db import *
import sqlite3


def create_user(uid, username, selected, text, image):
    return db_create_user(uid, username, selected, text, image)


def change_info(uid, data):
    return db_change_info(uid, data)


def get_info(uid):
    return db_get_info(uid)


def add_session(uid):
    return db_add_session(uid)


def check_logged_in(uid, sid):
    return sid in db_get_sessions(uid)


def get_uid_of_session(sid):
    return db_get_uid_of_session(sid)
