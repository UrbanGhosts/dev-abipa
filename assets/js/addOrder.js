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
			load();
		},
		error: function (data) {
			window.console.log(data.status + ": " + data.statusText);
			$("#createOrder").prop('disabled', false);
		},
	});
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


//������������ ������� ������
tableForm = function (obj) {
	var data = obj.data.replace(/'/g, '"');
	data = JSON.parse(data);
	if (data == null) {
		return;
    }
	//�������� � �������� �������
	let table = document.getElementById("table");
	table.innerHTML = '';
	// creates a <table> element
	var tbl = document.createElement("table");
	

	var nameList = ["Number", "Status", "Create on", "Closing date"];
	
	//���-�� ������ + ������ ���������
	for (var i = 0; i < data.length + 1; i++) {
		// creates a table row
		var row = document.createElement("tr");
		
		//���������� ����� �������
		for (var j = 0; j < 4; j++) {
			//���� ������� ������, �� ��������� ��������� �������
			if (i == 0) {
				let cell = document.createElement("th");
				let cellText = document.createTextNode(nameList[j]);
				cell.appendChild(cellText);
				row.appendChild(cell);
			} else {
				let cell = document.createElement("td");
				if (j == 0) {
					var text = data[i-1].orderName;
				} else if (j == 1) {
					var text = data[i-1].orderStatus;
				} else if (j == 2) {
					var text = data[i-1].orderCreateDate;
				} else if (j == 3) {
					var text = data[i-1].orderCloseDate;
				}
				let cellText = document.createTextNode(text);
				cell.appendChild(cellText);
				row.appendChild(cell);
			}
			
		}

		// add the row to the end of the table body
		tbl.appendChild(row);
	}	
	
	//��������� ������� � div = table
	table.appendChild(tbl);
	return true;
}


function load() {
	$.ajax({
		url: '/getData',
		type: 'GET',
		cache: false,
		contentType: 'application/json; charset=utf-8',
		success: function (data) {
			var obj = JSON.parse(data);
			obj = JSON.parse(obj.GenerateTableDataResult);

			//�������� ��������
			let table = document.getElementById("t-comp4");
			table.innerHTML = obj.companyName;

			window.console.log(obj);
			window.console.log(obj.data);
			//��������� �������
			tableForm(obj);
			
		},
		error: function (data) {
			window.console.log(data.status + ": " + data.statusText);
		},
	});
}
window.onload = load;

