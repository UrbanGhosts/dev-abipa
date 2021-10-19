$("#addOrder").on("click", function () {
	//TODO: Delete
	//tableForm();
	//return;
	
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

	
	var unit = $("#unit").val();
	var len = $("#length").val();
	var width = $("#width").val();
	var height = $("#height").val();
	var weight = $("#weight").val();
	
	var price = $("#price").val();
	
	$.ajax({
		url: '/sendOrder',
		type: 'GET',
		cache: false,
		data: { 
			'unit': unit, 
			'len': len,
			'width': width,
			'height': height,
			'weight': weight,
			'price': price,
		},
		contentType: 'application/json; charset=utf-8',
		beforeSend: function () {
			$("#createOrder").prop('disabled', true);
		},
		success: function (data) {
			window.console.log(data);
			$("#createOrder").prop('disabled', false);
		},
		error: function (data) {
			window.console.log(data.status + ": " + data.statusText);
			$("#createOrder").prop('disabled', false);
		},
	});
});

//Событие "Изменения поля unit"
$("#unit").on("click", function () {
	calculated();
});
unit.onblur = function () {
	calculated();
};

//Событие "Изменения поля weight"
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


//Формирование таблицы Заявок
tableForm = function(data){
	let table = document.getElementById("table");
	//Зануляем таблицу
	table.innerHTML = '';
	// creates a <table> element
	var tbl = document.createElement("table");
	
	
	let unit = document.getElementById("unit").value;
	let width = document.getElementById("weight").value;
	var nameList = ["Number", "Status", "Create on", "Closing date"];
	
	//Кол-во Заявок + Строка Заголовка
	for (var i = 0; i < 3; i++) {
		// creates a table row
		var row = document.createElement("tr");
		
		//Заполнение ячеек таблицы
		for (var j = 0; j < 4; j++) {
			//Если нулевая строка, то формируем заголовок таблицы
			if (i == 0){
				let cell = document.createElement("th");
				let cellText = document.createTextNode(nameList[j]);
				cell.appendChild(cellText);
				row.appendChild(cell);
			} else {
				let cell = document.createElement("td");
				let cellText = document.createTextNode(nameList[j]);
				cell.appendChild(cellText);
				row.appendChild(cell);
			}
			
		}

		// add the row to the end of the table body
		tbl.appendChild(row);
	}	
	
	//Добавляем таблицу к div = table
	table.appendChild(tbl);
	return true;
}

