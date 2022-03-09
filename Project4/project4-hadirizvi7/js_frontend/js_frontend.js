export async function process_all_teams(func) {
	const response = await fetch("/teams", {
		method: "get",
		headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }
	})
	.catch(() => {
		console.log("Error in process_all_teams (fetch 1)");
	});
	const teams = await response.json();
	const output = [];

	for (let i  = 0; i < teams['teamList'].length; i++)
	{
		var currTeam = teams['teamList'][i];
		//console.log(currTeam);

		const response = await fetch(`/teams/${currTeam}`, {
			method: "get",
			headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }
		})
		.catch(() => {
			console.log("Error in process_all_teams (fetch 2)");
		});
		const element = await response.json();
		output.push(element);

	}
	/*
	return (output) => {
		func(output);
	};*/
	func(output);
}

export function js_avg_goals(results) {
	var maxName = "";
	var maxAvg = 0;
	for (let i  = 0; i < results.length; i++) {
		var currTeam = results[i];
		var name = currTeam['teamName'];
		var players = currTeam['playerList'];
		var total = 0;
		for (let j = 0; j < players.length; j++) {
			total += players[j].goals;
		}
		if (total/15 > maxAvg) {
			maxName = name;
			maxAvg = total/15;
		}
	}
	console.log("Highest Average Goals Scored (JS): ")
	console.log(maxName);
	console.log(maxAvg);
}
