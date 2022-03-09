import { process_all_teams, js_avg_goals } from './js_frontend.js';
import init, { wasm_avg_goals } from './wasm_frontend.js';

function gen_timing_wrapper(label, func) {
	return (results) => {
		console.time(label);
		func(results);
		console.timeEnd(label);
	};
}

async function main() {
	await init();

	// JS Average Goals
	process_all_teams(gen_timing_wrapper("js_avg_goals", js_avg_goals));

	// WASM Average Goals
	process_all_teams(gen_timing_wrapper("wasm_avg_goals", wasm_avg_goals));
}

window.addEventListener("load", main);
