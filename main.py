from flask import Flask, jsonify, render_template, request
import json
app = Flask(__name__)

file = open("data/dump.json")
pokemon = json.load(file)
pokemonList = []
for key in pokemon:
	pokemonList.append(pokemon[key])


@app.route('/_add_numbers')
def add_numbers():
	pok = request.args.getlist('pok[]')
	total = 0
	for i in pok:
		total += i
	return jsonify(result=total)

@app.route('/')
def index():
	return render_template('index.html')
