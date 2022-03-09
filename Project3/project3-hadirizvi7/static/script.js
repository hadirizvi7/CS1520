// Implementation uses code from:
// 1) https://github.com/nfarnan/cs1520_examples/blob/main/javascript/js18_ajax_poll/static/script.js
let timeoutID;
let timeout = 1000;

function setup() {
	document.getElementById("button").addEventListener("click", makePost);
	timeoutID = window.setTimeout(poller, timeout);
}

function makePost() {
	console.log("Sending POST request");
	const user = document.getElementById("user").value;
	const chatTitle = document.getElementById("chatTitle").value;
	const content = document.getElementById("content").value;
	
	fetch("/addMsg", {
			method: "post",
			headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
			body: `user=${user}&chatTitle=${chatTitle}&content=${content}`
		})
		.then((response) => {
			return response.json();
		})
        .then((result) => {
			update(result);
			clearInput();
		})
		.catch(() => {
			console.log("Error posting new items!");
		});
}

function update(result) {
    console.log("Updating Results")
    var div = document.createElement('p');
    if (`${result.displayTime}: ${result.content} (${result.user})` != "undefined: undefined (undefined)") {
        div.innerHTML = `${result.displayTime}: ${result.content} (${result.user})`;
        document.getElementById('messageList').appendChild(div);
    }
	console.log("Value sent to server!");
	timeoutID = window.setTimeout(poller, timeout);
}

function poller() {
	console.log("Polling for new items");
	const chatTitle = document.getElementById("chatTitle").value;
	var currDate = new Date();
	var currTime = currDate.getTime();
	fetch("/getMsg", {
        method: "post",
        headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: `chatTitle=${chatTitle}&intTime=${currTime}`
    })
		.then((response) => {
			return response.json();
		})
		.then(update)
		.catch((error) => {
			console.log("Error fetching items!");
		});
}

function clearInput() {
	console.log("Clearing input");
	//const user = document.getElementById("user").value = "";
	//const chatTitle = document.getElementById("messageList").innerHTML = "";
	//const content = document.getElementById("content").value = "";
}

window.addEventListener("load", setup);