from flask import Flask, jsonify, render_template, request
import json
from src.parse import *
app = Flask(__name__)

file = open("data/dump.json")
pokemon = json.load(file)
pokemonList = []
for key in pokemon:
	pokemonList.append(pokemon[key])


@app.route('/_generate_string')
def generate_string():
	pok = request.args.getlist('pok[]')

	result = condense(pok)
	return jsonify(result=result)

@app.route('/_import_string')
def import_string():
	pok = request.args.getlist('pok', type=str)

	result = parse(pok[0])
	return jsonify(result=result)


@app.route('/')
def index():
	return render_template('index.html', pokemon = pokemonList)
