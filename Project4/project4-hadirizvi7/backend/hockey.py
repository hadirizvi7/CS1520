from flask import Flask, render_template, request, abort, jsonify, g
import json
import random
from random import seed, randint
import os
import string

app = Flask(__name__)

@app.before_request
def preprocess():
    g.teamList = [
			'meerkats',
			'elephants',
			'antelopes',
			'seals',
			'seagulls',
			'starfish',
			'deer',
			'rabbits',
			'squirrels',
			'flamingos',
			'salamanders',
			'cranes'
		] 

@app.route("/")
def root_page():
	return render_template("base.html")

@app.route('/teams', methods = ["GET"])
def getTeamList():
	return jsonify({
		"teamList":g.teamList
	})

@app.route('/teams/<name>', methods = ["GET"])
def getTeamInfo(name):
	
	if name not in g.teamList:
		print("404")
		abort(404)
	
	seed = 0
	for char in name:
		seed += ord(char)

	playerList = []
	for i in range(15):
		player = Player('name', 'pos', 10, 10)
		random.seed(seed + i)
		nameSize = randint(4,8)
		random.seed(seed + i)
		player.name = ''.join(random.choice(string.ascii_letters) for i in range(nameSize))

		if i < 6:
			player.pos = 'D'
		
		elif i < 9:
			player.pos = 'LW'
		
		elif i < 12:
			player.pos = 'RW'
		
		elif i < 15:
			player.pos = 'C'
		
		random.seed(seed + i)
		player.goals = randint(1, 10)
		random.seed(seed + i)
		player.assists = randint(1,10)
		playerList.append(player.to_dict())
	
	return json.dumps({
		'teamName': name,
		'playerList': playerList
	})

class Player:
    def __init__(self, name, position, goals, assists):
        self.name = name
        self.pos = position
        self.goals = goals
        self.assists = assists
    
    def to_dict(self):
        return {
            'name': self.name,
            'pos': self.pos,
            'goals': self.goals,
            'assists': self.assists
        }

if __name__ == "__main__":
	app.run(debug=True)
