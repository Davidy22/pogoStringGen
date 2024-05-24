from src.rand import *
import config
import sqlite3


def db_create_user(uid, username, selected, text, image):
    conn = sqlite3.connect(config.DB_PATH)
    cur = conn.cursor()
    try:
        res = cur.execute(
            "insert into users(uid, username, selected, text, image) values(?, ?, ?, ?, ?)",
            [uid, username, selected, text, image],
        )
        conn.commit()
        return True
    except:
        import traceback

        traceback.print_exc()

        return False


def db_get_info(uid):
    conn = sqlite3.connect(config.DB_PATH)
    cur = conn.cursor()
    res = cur.execute("""select * from users where uid = ?""", [uid]).fetchone()
    headers = [i[0] for i in cur.description][1:]
    if res is None or len(res) == 0:
        return None

    return {i: j for i, j in zip(headers, res[1:])}


def db_get_info_from_username(username):
    conn = sqlite3.connect(config.DB_PATH)
    cur = conn.cursor()
    res = cur.execute(
        """select * from users where username = ?""", [username]
    ).fetchone()
    headers = [i[0] for i in cur.description][1:]
    if res is None or len(res) == 0:
        return None

    return {i: j for i, j in zip(headers, res[1:])}


def db_change_info(uid, data):
    conn = sqlite3.connect(config.DB_PATH)
    cur = conn.cursor()
    fields = [f"{i} = ?" for i in data.keys()]
    values = [data[i] for i in data.keys()]
    values.append(uid)
    try:
        res = cur.execute(
            f"update users set {','.join(fields)} where uid = ?",
            values,
        )
        conn.commit()
    except:
        import traceback
        traceback.print_exc()
        return False

    return True


def db_add_session(uid):
    conn = sqlite3.connect(config.DB_PATH)
    cur = conn.cursor()
    try:
        sid = gen_rand()
        res = cur.execute("insert into sessions(uid, sid) values(?, ?)", [uid, sid])
        conn.commit()
        return sid
    except:
        return False


def db_get_sessions(uid):
    conn = sqlite3.connect(config.DB_PATH)
    cur = conn.cursor()
    res = cur.execute("""select sid from sessions where uid = ?""", [uid]).fetchall()
    if res is None:
        return None

    return [i[0] for i in res]


def db_get_uid_of_session(sid):
    conn = sqlite3.connect(config.DB_PATH)
    cur = conn.cursor()
    res = cur.execute("""select uid from sessions where sid = ?""", [sid]).fetchone()
    if res is None:
        return None

    return res[0]
