$("#addOrder").on("click", function () {
	let button = document.getElementById("addOrder");
	let table = document.getElementById("table");

	button.style.display = 'none';
	table.style.display = 'none';

	let input1 = document.getElementById("input1");
	input1.style.display = "block";

	let input2 = document.getElementById("input2");
	input2.style.display = "block";

	let input3 = document.getElementById("input3");
	input3.style.display = "block";

	let input4 = document.getElementById("input4");
	input4.style.display = "block";

	let input5 = document.getElementById("input5");
	input5.style.display = "block";

	let createButton = document.getElementById("createOrder");
	createButton.style.display = 'block';
});


$("#createOrder").on("click", function () {
	let addButton = document.getElementById("addOrder");
	let createButton = document.getElementById("createOrder");
	let table = document.getElementById("table");

	createButton.style.display = 'none';
	let input1 = document.getElementById("input1");
	input1.style.display = "none";
	let input2 = document.getElementById("input2");
	input2.style.display = "none";
	let input3 = document.getElementById("input3");
	input3.style.display = "none";
	let input4 = document.getElementById("input4");
	input4.style.display = "none";
	let input5 = document.getElementById("input5");
	input5.style.display = "none";

	table.style.display = 'block';
	addButton.style.display = 'block';
	addButton.style.top = "10px";
	addButton.style.left = "10px";
	addButton.style.position = "relative";
});