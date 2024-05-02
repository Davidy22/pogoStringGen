from flask import Flask, jsonify, render_template, request, redirect
import json
from src.parse import *
app = Flask(__name__)
app.config.from_pyfile('config.py', silent=True)
app.secret_key = app.config["secret_key"]


file = open("data/dump.json")
pokemon = json.load(file)
pokemonList = list(pokemon.values())

@app.route('/_generate_string', methods = ["POST"])
def generate_string():
	pok = request.form.getlist("pok[]")
	result = condense(pok)
	return jsonify(result=result)

@app.route('/_import_string', methods = ["POST"])
def import_string():
	pok = request.form["pok"]
	result = parse(pok)
	return jsonify(result=result) #TODO: Add error handling site side

@app.route('/')
def index():
	return render_template('index.html', pokemon = pokemonList)

@app.route('/privacy')
def privacy():
	return render_template('policy.html')
