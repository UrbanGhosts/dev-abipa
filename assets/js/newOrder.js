$("#createOrder").on("click", function () {
	var point = document.getElementById('point');

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
			'isButton': true,
		},
		contentType: 'application/json; charset=utf-8',
		beforeSend: function () {
			$("#createOrder").prop('disabled', true);
			point.style.display = 'block';
		},
		success: function (data) {
			$("#createOrder").prop('disabled', false);
			point.style.display = 'none';

			if (data) {
				window.location.href = data.url;
				return;
			} else {

            }
		},
		error: function (data) {
			window.console.log(data.status + ": " + data.statusText);
			point.style.display = 'none';
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

$("#yes").on("click", function () {
	let button = document.getElementById("no");
	button.checked = false;

});

$("#no").on("click", function () {
	let button = document.getElementById("yes");
	button.checked = false;

});

function load() {
	getDataCountry();
	getZipCode();
}
window.onload = load;

$("#counry-From").on("change", function () {

	let button = document.getElementById("counry-From");
	var opt = $('option[value="' + button.value + '"]');
	var id = opt.length ? opt.attr('id') : '';
	window.console.log("Id: " + id);
});
$("#counry-To").on("change", function () {

	let button = document.getElementById("counry-To");
	var opt = $('option[value="' + button.value + '"]');
	var id = opt.length ? opt.attr('id') : '';
	window.console.log("Id: " + id);
});

getDataCountry = function () {
	$.ajax({
		url: '/getDataCountry',
		type: 'GET',
		cache: false,
		contentType: 'application/json; charset=utf-8',
		success: function (data) {
			//получаем и зануляем таблицу
			let tableFrom = document.getElementById("counryFrom");
			tableFrom.innerHTML = '';
			let tableTo = document.getElementById("counryTo");
			tableTo.innerHTML = '';
			// creates a <table> element
			var tblFrom = document.createElement("datalist");
			var tblTo = document.createElement("datalist");

			for (var i = 0; i < data[0].data.length - 1; i++) {
				var obj = data[0].data[i + 1];

				let cellFrom = document.createElement("option");
				cellFrom.id = obj[0];
				cellFrom.value = obj[1];
				tblFrom.appendChild(cellFrom);

				let cellTo = document.createElement("option");
				cellTo.id = obj[0];
				cellTo.value = obj[1];
				tblTo.appendChild(cellTo);
			}

			tableFrom.appendChild(tblFrom);
			tableTo.appendChild(tblTo);
		},
		error: function (data) {
			window.console.log(data.status + ": " + data.statusText);
		},
	});
	return true;
}

getZipCode = function () {
	$.ajax({
		url: '/getDataZipCode',
		type: 'GET',
		cache: false,
		contentType: 'application/json; charset=utf-8',
		success: function (data) {
			//получаем и зануляем таблицу
			let table = document.getElementById("zipFrom");
			table.innerHTML = '';
			// creates a <table> element
			var tbl = document.createElement("datalist");
			window.console.log(data[0].data[2]);

			for (var i = 0; i < data[0].data.length; i++) {
				var obj = data[0].data[i];

				let cell = document.createElement("option");
				cell.value = obj[1] + '/' + obj[2];
				tbl.appendChild(cell);
			}

			table.appendChild(tbl);
		},
		error: function (data) {
			window.console.log(data.status + ": " + data.statusText);
		},
	});
	setTimeout(function () {
		preloader.style.display = 'none';
	}, 500);
	return true;
}