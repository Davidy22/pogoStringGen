from flask import Flask, jsonify, render_template, request, redirect
import json
from src.parse import *
from src.auth import *
from src.db import *
from config import *
from requests_oauthlib import OAuth2Session

validUsernameChars = set("!$'()*+,-.0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz")
app = Flask(__name__)
app.config.from_pyfile("config.py", silent=True)
# app.secret_key = app.config["secret_key"]


file = open("data/dump.json")
pokemon = json.load(file)
pokemonList = list(pokemon.values())


@app.route("/_generate_string", methods=["POST"])
def generate_string():
    pok = request.form.getlist("pok[]")
    result = condense(pok)
    return jsonify(result=result)


@app.route("/_import_string", methods=["POST"])
def import_string():
    pok = request.form["pok"]
    result = parse(pok)
    return jsonify(result=result)  # TODO: Add error handling site side


@app.route("/", methods=["GET"])
def index():
    return render_template("index.html", pokemon=pokemonList)


@app.route("/privacy", methods=["GET"])
def privacy():
    return render_template("policy.html")


@app.route("/login", methods=["GET"])
def login():
    if request.args.get("error") is not None:
        return render_template("index.html", pokemon=pokemonList)
    
    state = request.args.get("state")
    
    google = OAuth2Session(CLIENT_ID, redirect_uri=REDIRECT_URI)
    google.fetch_token("https://www.googleapis.com/oauth2/v4/token", client_secret=CLIENT_SECRET, authorization_response=request.url.replace("http:","https:"))
    user = google.get('https://www.googleapis.com/oauth2/v3/userinfo').json()
    uid = user["sub"]

    data = get_info(uid)
    if data is None:
        if user["email_verified"]:
            email = user["email"]
            picture = user["picture"]
            return render_template(
                "new_account.html",
                uid=uid,
                username=email[: email.find("@")],
                state=state,
                picture=picture,
            )
        else:
            # Static page telling people they need to verify their email to make an account
            return render_template("verify_email.html")
    else:
        file = open(f"pastes/{data['textloc']}.json", "r")
        f = json.load(file)
        sid = add_session(uid)

        return render_template(
            "index.html",
            pokemon=pokemonList,
            username=data["username"],
            text=f["text"],
            select=f["select"],
            image=data["image"],
            sid=sid,
        )


@app.route("/_save", methods=["POST"])
def save():
    # Save user data
    sid = request.form["sid"]
    text = request.form["text"]
    select = request.form["select"]

    try:
        uid = db_get_uid_of_session(sid)
        data = db_get_info(uid)
        if data is None:
            raise Exception("Session not found")
    except:
        return jsonify(result="Could not get session information")

    try:
        with open(f"pastes/{data['textloc']}.json", "w") as f:
            f.write(json.dumps({"text": text, "select": select}))
        return jsonify(result="Saved!")
    except:
        return jsonify(result="Could not save info")


@app.route("/_check_login", methods=["POST"])
def check_login():
    # Check if session token is valid and return profile pic, username, text if logged in.
    sid = request.form["sid"]
    if sid == -1:
        return jsonify(result=False)
    uid = get_uid_of_session(sid)
    if uid is None:
        return jsonify(result=False)
    else:
        data = get_info(uid)
        file = open(f"pastes/{data['textloc']}.json", "r")
        f = json.load(file)
        return jsonify(
            result=True,
            username=data["username"],
            text=f["text"],
            select=f["select"],
            image=data["image"],
        )


@app.route("/_create_account", methods=["POST"])
def create_account():
    uid = request.form["uid"]
    username = request.form["username"]
    text = request.form["text"]
    picture = request.form["picture"]
    textloc = gen_rand()
    
    if not set(username).issubset(validUsernameChars):
        return jsonify(result=False, message="Username can only contain letters, numbers and the special characters !$'()*,-._")
    
    with open(f"pastes/{textloc}.json", "w") as f:
        f.write(json.dumps({"select": text, "text": ""}))

    if db_create_user(uid, username, textloc, picture):
        sid = add_session(uid)
        return jsonify(result=True, sid=sid)
    else:
        return jsonify(result=False, message="That username is already taken")


@app.route("/u/<username>", methods=["GET"])
def view(username):
    data = db_get_info_from_username(username)
    file = open(f"pastes/{data['textloc']}.json")
    f = json.load(file)

    return render_template(
        "view.html",
        pokemon=[pokemon[str(i)] for i in parse(f["select"])],
        username=username,
        text=f["text"],
    )
