var rowLength = 10;
var colLength = 10;
const rowVals = ['1','2','3','4','5','6','7','8','9','10'];
const colVals = ['A','B','C','D','E','F','G','H','I','J'];
var carrierLength = 5;
var battleshipLength = 4;
var submarineLength = 3;
var player1 = null;
var player2 = null;
var formStringHTML = '<label for="name">Player 2 Name:</label><br><input type="text" id="name" name="name"><br><label for="ships">Player 2 Ship Placements:</label><br><input type="text" id="shipPlacements" name="ships"><br><br><input type="submit" value="Submit" onclick="setup()"><br><br>'

var board = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			];

var blankArray = new Array(rowLength);

for (var i = 0; i < blankArray.length; i++) {
	blankArray[i] = []
}

function initializePlayers(playerNum) {
	if (playerNum === 1) {
		player1 = new PlayerObject(1);
		player1.shipLocations = parseShips(document.getElementById("shipPlacements").value);
		player1.currentView = true;
		//console.log(document.getElementById("shipPlacements").value);
		document.getElementById("myForm").innerHTML = formStringHTML;
		//console.log(document.getElementById("shipPlacements").value);
	}
	else {
		//console.log(document.getElementById("shipPlacements").value);
		player2 = new PlayerObject(2);
		player2.shipLocations = parseShips(document.getElementById("shipPlacements").value);
		//console.log(document.getElementById("shipPlacements").value);
		//console.log(player2.shipLocations);
		document.getElementById("myForm").innerHTML = "";
	}
}

function parseShips(input) {
	//var input = "A(A1-A5);B(B6-E6);S(H3-J3)";
	//CASE 1 : A(A1-A5);B(B6-E6);S(H3-J3);
	//CASE 2 : A(A1-A5);B(B6-B10);S(H3-J3);
	//console.log(input);

	var shipArray = ["", "", ""];
	var currentShip = 0;
	if (input != null || input != "") {
		var parsedInput = input.split(';');
		//console.log(parsedInput);
		shipArray[0] = parsedInput[0].substring(2).slice(0, -1);
		shipArray[1] = parsedInput[1].substring(2).slice(0, -1);
		shipArray[2] = parsedInput[2].substring(2).slice(0, -1);
	}
	//console.log(shipArray);
	return placeShips(shipArray);
}

function letterToInt(character) {
	switch (character) {
		case 'A':
			return rowVals[0];
			break;
		case 'B':
			return rowVals[1];
			break;
		case 'C':
			return rowVals[2];
			break;
		case 'D':
			return rowVals[3];
			break;
		case 'E':
			return rowVals[4];
			break;
		case 'F':
			return rowVals[5];
			break;
		case 'G':
			return rowVals[6];
			break;
		case 'H':
			return rowVals[7];
			break;
		case 'I':
			return rowVals[8];
			break;
		case 'J':
			return rowVals[9];
			break;
	}
}

function placeShips(shipArray) {
	var placements = [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		];

	//A(A1-A5);B(B6-E6);S(H3-J3);
	//A(A2-A6);B(B6-E6);S(H3-J3);
	// shipArray = ['A1-A5', 'B6-E6', 'H3-J3']
	// shipArray = ['A6-A10', 'B6-E6', 'H3-J3']
	var chars = ['A', 'B', 'S'];
	for (var i = 0; i < shipArray.length; i++) {
		if (shipArray[i].charAt(0) === shipArray[i].charAt(3)) {
			var letter = Number(letterToInt(shipArray[i].charAt(0)));
			var start = Number(shipArray[i].charAt(1));
			var end = Number(shipArray[i].charAt(4));
			if (end === 1) {
				end = 10;
			}
			//console.log(start);
			//console.log(end);
			for (var row = start; row <= end; row++) {
				//console.log(placements[row-1][letter-1]);
				placements[row-1][letter-1] = chars[i];
				//console.log(placements[row-1][letter-1]);
			}
		}

		else {
			var letter1 = shipArray[i].charAt(0);
			var letter2 = shipArray[i].charAt(3);

			var start = Number(letterToInt(letter1));
			var end = Number(letterToInt(letter2));
			var row = Number(shipArray[i].charAt(1));
			for (var col = start; col <= end; col++)
			{
				placements[row-1][col-1] = chars[i];
			}
		}
	}
	console.log(placements);
	return placements;
}

function attack(targetID) {
	//console.log(targetID);
	//"Target" + i + "/" + j OR Targeti/j i = 6 j = 8
	// examples: target10/10
	var row;
	var col;
	var currentPlayer;
	var otherPlayer;
	if (targetID.length == 9) {
		row = Number(targetID.charAt(6)) - 1;
		col = Number(targetID.charAt(8)) - 1;
	}

	else if (targetID.length == 10) {
		if (targetID.charAt(9) == '0') {
			row = Number(targetID.charAt(6)) - 1;
			col = Number(targetID.substring(8)) - 1;
		}

		else {
			row = Number(targetID.substring(6, 8)) - 1;
			col = Number(targetID.charAt(9)) - 1;
		}
	}

	else if (targetID.length == 11) {
		row = 9;
		col = 9;
	}
	if (player1.currentView) {
		//console.log("PLAYER 1 TURN");
		currentPlayer = player1;
		//console.log("CURRENT: " + player1.user);
		//console.log(player1.targetLocations);
		//console.log(player1.shipLocations);
		otherPlayer = player2;
		//console.log("OTHER: " + player2.user);
		//console.log(player2.targetLocations);
		//console.log(player2.shipLocations);
	}

	else {
		//console.log("PLAYER 2 TURN");
		currentPlayer = player2;
		//console.log("CURRENT: " + player2.user);
		//console.log(player2.targetLocations);
		//console.log(player2.shipLocations);
		otherPlayer = player1;
		//console.log("OTHER: " + player1.user);
		//console.log(player1.targetLocations);
		//console.log(player1.shipLocations);
	}

	var hitShip = false;
	//console.log(row);
	//console.log(col)
	var attackedSpot = otherPlayer.shipLocations[row][col];
	var isDuplicate = currentPlayer.targetLocations[row][col];

	if (isDuplicate === "H" || isDuplicate === "M") {
		//indicate that this spot has already been marked (reroute the user)
		var note = document.createElement("div");
		note.setAttribute("class", "red-box");
		note.innerHTML = "INVALID SELECTION. PLEASE TRY AGAIN.";
		document.getElementsByClassName("wrapper")[0].appendChild(note);
		setTimeout(removeNote, 2000);
		blankBoard();
		displayBoard(currentPlayer, otherPlayer);
		return;
	}

	if (attackedSpot === "A") {
		otherPlayer.carrier -= 1;
		otherPlayer.score -= 2;
		hitShip = true;
	}

	else if (attackedSpot === "B") {
		otherPlayer.battleship -= 1;
		otherPlayer.score -= 2;
		hitShip = true;
	}

	else if (attackedSpot === "S") {
		otherPlayer.submarine -= 1;
		otherPlayer.score -= 2;
		hitShip = true;
	}

	//else if (attackedSpot === "H" )
	// also handle case where user tries to hit the same spot twice
	// <!-- <div class="green-box">Green box</div> --> (CSS z-indexing)
	var hitTimeout;
	if (hitShip) {
		var note = document.createElement("div");
		note.setAttribute("class", "green-box");
		note.innerHTML = "HIT";
		document.getElementsByClassName("wrapper")[0].appendChild(note);
		currentPlayer.targetLocations[row][col] = "H";
		var hitTimeout = setTimeout(removeNote, 2000);
	}

	else {
		var note = document.createElement("div");
		note.setAttribute("class", "red-box");
		note.innerHTML = "MISS";
		document.getElementsByClassName("wrapper")[0].appendChild(note);
		currentPlayer.targetLocations[row][col] = "M";
		var hitTimeout = setTimeout(removeNote, 2000);
	}
	var sinkTimeout;
	if (otherPlayer.carrier == 0) {
		otherPlayer.carrier = -1;
		var note = document.createElement("div");
		note.setAttribute("class", "green-box");
		note.innerHTML = "SUNK CARRIER";
		document.getElementsByClassName("wrapper")[0].appendChild(note);
		var sinkTimeout = setTimeout(removeNote, 2000);
	}

	if (otherPlayer.battleship == 0) {
		otherPlayer.battleship = -1;
		var note = document.createElement("div");
		note.setAttribute("class", "green-box");
		note.innerHTML = "SUNK BATTLESHIP";
		document.getElementsByClassName("wrapper")[0].appendChild(note);
		var sinkTimeout = setTimeout(removeNote, 2000);
	}

	if (otherPlayer.submarine == 0) {
		otherPlayer.submarine = -1;
		var note = document.createElement("div");
		note.setAttribute("class", "green-box");
		note.innerHTML = "SUNK SUBMARINE";
		document.getElementsByClassName("wrapper")[0].appendChild(note);
		var sinkTimeout = setTimeout(removeNote, 2000);
	}

	if (otherPlayer.carrier == -1 && otherPlayer.battleship == -1 && otherPlayer.submarine == -1) {
		currentPlayer.winner = true;
		clearTimeout(hitTimeout);
		clearTimeout(sinkTimeout);
		terminate(currentPlayer.num, currentPlayer.score, otherPlayer.score);
		return;
	}

	currentPlayer.currentView = false;
	otherPlayer.currentView = true;

	var note = document.createElement("div");
	note.setAttribute("class", "green-box");
	note.innerHTML = "Starting " + otherPlayer.user + "'s Turn.";
	document.getElementsByClassName("wrapper")[0].appendChild(note);
	setTimeout(removeNote, 2000);

	blankBoard();
	displayBoard(otherPlayer, currentPlayer);
}

function terminate(winner, score1, score2) {
	var winner_msg = document.createElement("div");
	winner_msg.setAttribute("class", "green-box");
	if (winner === 1) {
		winner_msg.innerHTML = player1.user + " has won!";
	}
	else {
		winner_msg.innerHTML = player2.user + " has won!";
	}
	document.getElementsByClassName("wrapper")[0].appendChild(winner_msg);

	var winner_score = document.createElement("div");
	winner_score.setAttribute("class", "green-box");
	if (winner === 1) {
		winner_score.innerHTML = player1.user + "'s Score: " + score1;
	}
	else {
		winner_score.innerHTML = player2.user + "'s Score: " + score1;
	}

	document.getElementsByClassName("wrapper")[0].appendChild(winner_score);

	var loser_score = document.createElement("div");
	loser_score.setAttribute("class", "red-box");

	if (winner === 1) {
		loser_score.innerHTML = player2.user + "'s Score: 0";
	}

	else {
		loser_score.innerHTML = player1.user + "'s Score: 0";
	}

	document.getElementsByClassName("wrapper")[0].appendChild(loser_score);
}

function removeNote() {
	document.getElementsByClassName("wrapper")[0].innerHTML = "";
}

function blankBoard() {
	var target = document.getElementById("targets");

	for (var i = 1; i < rowLength + 1; i++) {
		for (var j = 1; j < colLength + 1; j++) {
			document.getElementById("Target" + i + "/" + j).style.backgroundColor = "lightBlue";
			document.getElementById("Target" + i + "/" + j).textContent = " ";
		}
	}

	var ships = document.getElementById("ships");

	for (var i = 1; i < rowLength + 1; i++) {
		for (var j = 1; j < colLength + 1; j++) {
			document.getElementById("Ship" + i + "/" + j).style.backgroundColor = "lightBlue";
			document.getElementById("Ship" + i + "/" + j).textContent = " ";
		}
	}
}

function createTargetBoard() {
	var header = document.createTextNode("Your Targets");
	document.body.appendChild(header);
	var grid = document.createElement("table");
	var matrix = document.createElement("tbody");

	grid.id = "targets";
	var value;
	for (var i = 0; i < rowLength+1; i++) {
		var square = document.createElement("tr");
		square.id = "Row " + i;
		for (var j = 0; j < colLength+1; j++) {
			var space = document.createElement("td");
			space.id = "Target" + i + "/" + j;

			if (i === 0) {
				if (j === 0) {
					value = document.createTextNode("");
				}

				else {
					value = document.createTextNode(colVals[j-1]);
				}
			}

			else if (j === 0) {
				value = document.createTextNode(rowVals[i-1]);
			}

			else {
				value = document.createTextNode(" ");
				//console.log(space.id);
				space.addEventListener("click", function() { attack(this.id); });
			}

			space.appendChild(value);
			square.appendChild(space);
			matrix.appendChild(square);
		}

	}
	grid.appendChild(matrix);
	document.body.appendChild(grid);
}

function createShipBoard() {
	var header = document.createTextNode("Your Ships");
	document.body.append(header);
	var grid = document.createElement("table");
	var matrix = document.createElement("tbody");

	grid.id = "ships";
	var value;
	//console.log(locations1);
	for (var i = 0; i < rowLength + 1; i++) {
		var square = document.createElement("tr");
		square.id = "Row " + i;
		for (var j = 0; j < colLength + 1; j++) {
			space = document.createElement("td");
			space.id = "Ship" + i + "/" + j;

			if (i === 0) {
				if (j === 0) {
					value = document.createTextNode("");
				}

				else {
					value = document.createTextNode(colVals[j-1]);
				}
			}

			else if (j === 0) {
				value = document.createTextNode(rowVals[i-1]);
			}

			else {
				if (i <= rowLength && j <= colLength && player1.shipLocations[i-1][j-1] != 0) {
					value = document.createTextNode(player1.shipLocations[i-1][j-1]);
				}
				else {
					value = document.createTextNode(" ");
				}
			}

			space.appendChild(value);
			square.appendChild(space);
			matrix.appendChild(square);
		}
	}
	grid.appendChild(matrix);
	document.body.appendChild(grid);
}


function displayBoard(currentPlayer, otherPlayer) {

	//console.log(currentPlayer.targetLocations);
	//console.log(currentPlayer.shipLocations);
	//console.log(otherPlayer.targetLocations);
	//console.log(otherPlayer.shipLocations);
	for (var i = 1; i < rowLength + 1; i++) {
		for (var j = 1; j < colLength + 1; j++) {

			var targetBlock = document.getElementById("Target" + i + "/" + j);
			
			if (currentPlayer.targetLocations[i-1][j-1] === 0) {
				targetBlock.style.backgroundColor = "lightBlue";
			} 

			else if (currentPlayer.targetLocations[i-1][j-1] === "H") {
				targetBlock.style.backgroundColor = "red";
			}

			else if (currentPlayer.targetLocations[i-1][j-1] === "M") {
				targetBlock.style.backgroundColor = "white";
			}

			else {
				targetBlock.style.backgroundColor = "lightBlue";
			}
		}
	}
	//console.log(otherPlayer.targetLocations);
	for (var i = 1; i < rowLength + 1; i++) {
		for (var j = 1; j < colLength + 1; j++) {
			var shipBlock = document.getElementById("Ship" + i + "/" + j);
			if (currentPlayer.shipLocations[i-1][j-1] != 0 && currentPlayer.shipLocations[i-1][j-1] != "H" && currentPlayer.shipLocations[i-1][j-1] != "M") {
				shipBlock.textContent = currentPlayer.shipLocations[i-1][j-1];
			}
			if (otherPlayer.targetLocations[i-1][j-1] === 0) {
				shipBlock.style.backgroundColor = "lightBlue";
			}

			else if (otherPlayer.targetLocations[i-1][j-1] === "H") {
				shipBlock.style.backgroundColor = "red";
			}

			else if (otherPlayer.targetLocations[i-1][j-1] === "M") {
				shipBlock.style.backgroundColor = "white";
			}

			else {
				shipBlock.style.backgroundColor = "lightBlue";
			}
		}
	}
}

function PlayerObject(playerNum) {
	this.user = document.getElementById("name").value;
	this.targetLocations = [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		];
	this.score = 24;
	this.carrier = carrierLength;
	this.battleship = battleshipLength;
	this.submarine = submarineLength;
	this.shipLocations = [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		];
	this.winner = false;
	this.currentView = false;
	this.num = playerNum
}

function setup() {
	if (player1 == null) {
		initializePlayers(1);
	}

	else if (player2 == null) {
		initializePlayers(2);
		//document.getElementById("myForm").onclick = true;
		createShipBoard();
		createTargetBoard();
		displayBoard(player1, player2);
	}
}
//window.addEventListener("load", setup);