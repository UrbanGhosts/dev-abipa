$("#addOrder").on("click", function () {
	let button = document.getElementById("addOrder");
	let table = document.getElementById("table");

	button.style.display = 'none';
	table.style.display = 'none';

	let input1 = document.getElementById("form-class");
	input1.style.display = "block";

	let createButton = document.getElementById("createOrder");
	createButton.style.display = 'block';
});


$("#createOrder").on("click", function () {
	let addButton = document.getElementById("addOrder");
	let createButton = document.getElementById("createOrder");
	let table = document.getElementById("table");

	createButton.style.display = 'none';
	let input1 = document.getElementById("form-class");
	input1.style.display = "none";

	//TODO
	table.style.display = 'block';
	addButton.style.display = 'block';
	addButton.style.top = "10px";
	addButton.style.left = "10px";
	addButton.style.position = "relative";
});

//������� "��������� ���� unit"
$("#unit").on("click", function () {
	calculated();
});
unit.onblur = function () {
	calculated();
};

//������� "��������� ���� weight"
$("#weight").on("click", function () {
	calculated();
});
weight.onblur = function () {
	calculated();
};

calculated = function(){
	let unit = document.getElementById("unit").value;
	let width = document.getElementById("weight").value;
	if (!width || width == 0) {
		width = 1;
	}
	let price = document.getElementById("price");

	price.value = (unit * 100) * width;
	return true;
}

