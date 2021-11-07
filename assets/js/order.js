function load() {
	getDataTable();
}
window.onload = load;


getDataTable = function () {
	$.ajax({
		url: '/getData',
		type: 'GET',
		cache: false,
		data: { 'isButton': true },
		contentType: 'application/json; charset=utf-8',
		success: function (data) {
			if (!data) {
				return;
            }
			var obj = JSON.parse(data);
			if (obj.status == "401") {
				window.location.href = obj.url;
				return;
			}
			obj = JSON.parse(obj.GenerateTableDataResult);

			//Название компаний
			let table = document.getElementById("t-comp4");
			table.innerHTML = obj.companyName;

			//Формируем таблицу
			tableForm(obj);

		},
		error: function (data) {
			window.console.log(data.status + ": " + data.statusText);
		},
	});
	return true;
}

//Формирование таблицы Заявок
tableForm = function (obj) {
	var preloader = document.getElementById('preloader');
	var data = obj.data.replace(/'/g, '"');
	data = JSON.parse(data);
	if (data == null) {
		setTimeout(function () {
			preloader.style.display = 'none';
		}, 500);
		return;
	}
	//получаем и зануляем таблицу
	let table = document.getElementById("table");
	table.innerHTML = '';
	// creates a <table> element
	var tbl = document.createElement("table");


	var nameList = ["Number", "Status", "Create on", "Closing date"];

	//Кол-во Заявок + Строка Заголовка
	for (var i = 0; i < data.length + 1; i++) {
		// creates a table row
		var row = document.createElement("tr");

		//Заполнение ячеек таблицы
		for (var j = 0; j < 4; j++) {
			//Если нулевая строка, то формируем заголовок таблицы
			if (i == 0) {
				let cell = document.createElement("th");
				let cellText = document.createTextNode(nameList[j]);
				cell.appendChild(cellText);
				row.appendChild(cell);
			} else {
				let cell = document.createElement("td");
				if (j == 0) {
					var text = data[i - 1].orderName;
				} else if (j == 1) {
					var text = data[i - 1].orderStatus;
				} else if (j == 2) {
					var text = data[i - 1].orderCreateDate;
				} else if (j == 3) {
					var text = data[i - 1].orderCloseDate;
				}
				let cellText = document.createTextNode(text);
				cell.appendChild(cellText);
				row.appendChild(cell);
			}

		}

		// add the row to the end of the table body
		tbl.appendChild(row);
	}

	//Добавляем таблицу к div = table
	table.appendChild(tbl);


	setTimeout(function () {
		preloader.style.display = 'none';
	}, 500);
	return true;
}