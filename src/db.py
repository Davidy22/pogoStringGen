from src.rand import *
import config
import os
import mysql.connector

def db_connect():
    conn = mysql.connector.connect(host=config.DB_PATH, user=config.DB_USER, password=config.DB_PASS, database="db")
    return conn, conn.cursor()
    

def db_create_user(uid, username, selected, text, image):
    conn, cur = db_connect()
    try:
        res = cur.execute(
            "insert into users(uid, username, selected, paste, image) values(%s, %s, %s, %s, %s)",
            [uid, username, selected, text, image],
        )
        conn.commit()
        return True
    except:
        import traceback

        traceback.print_exc()

        return False


def db_get_info(uid):
    conn, cur = db_connect()
    cur.execute("""select * from users where uid = %s""", [uid])
    res = cur.fetchone()
    res = [i.decode() if type(i) == bytes else i for i in res]
    headers = [i[0] for i in cur.description][1:]
    if res is None or len(res) == 0:
        return None

    return {i: j for i, j in zip(headers, res[1:])}


def db_get_info_from_username(username):
    conn, cur = db_connect()
    cur.execute("""select * from users where username = %s""", [username])
    res = cur.fetchone()
    res = [i.decode() if type(i) == bytes else i for i in res]
    headers = [i[0] for i in cur.description][1:]
    if res is None or len(res) == 0:
        return None

    return {i: j for i, j in zip(headers, res[1:])}


def db_change_info(uid, data):
    conn, cur = db_connect()
    fields = [f"{i} = %s" for i in data.keys()]
    values = [data[i] for i in data.keys()]
    values.append(uid)
    try:
        res = cur.execute(
            f"update users set {','.join(fields)} where uid = %s",
            values,
        )
        conn.commit()
    except:
        import traceback
        traceback.print_exc()
        return False

    return True


def db_add_session(uid):
    conn, cur = db_connect()
    try:
        sid = gen_rand()
        cur.execute("insert into sessions(uid, sid) values(%s, %s)", [uid, sid])
        conn.commit()
        
        cur.execute("select sesscount from sessions where uid = %s", [uid])
        res = cur.fetchall()
        if len(res) > 3:
            cur.execute("delete from sessions where sesscount = %s", [min(res)])
        return sid
    except:
        import traceback
        traceback.print_exc()
        return False


def db_get_sessions(uid):
    conn, cur = db_connect()
    cur.execute("""select sid from sessions where uid = %s""", [uid])
    res = cur.fetchall()
    if res is None:
        return None

    return [i[0] for i in res]


def db_get_uid_of_session(sid):
    conn, cur = db_connect()
    cur.execute("""select uid from sessions where sid = %s""", [sid])
    res = cur.fetchone()
    if res is None:
        return None

    return res[0]
