$("#enter").on("click", function () {
	
	var name = $("#username").val();
	var password = $("#password").val();
	
	$.ajax({
		url: 'assets/js/test.js',
		type: 'GET',
		cache: false,
		//data: { 'name': name, 'password': password },
		//headers: {'Token_value': 123},
		dataType: 'text',
		beforeSend: function () {
			$("#enter").prop('disabled', true);
        },
		success: function (data) {
			/*
			var href = window.location.href;
			href = href.split("index")[0];
			href = href.replace("#", '');
			window.location.href = href + "workpage.html";
			*/
		},
		error: function (data) {
			window.console.log(data.status + ": " + data.statusText);
			$("#enter").prop('disabled', false);
		},
	});

	var xhr = new XMLHttpRequest();
	var query = "11/-89";
	//var json = JSON.stringify({ "query": 'мск сухонска', "count": 10 });
	xhr.open("POST", "https://cleaner.dadata.ru/api/v1/clean/address", true);
    xhr.onreadystatechange = function () {

        if (xhr.readyState !== 4) {
            return;
        }

        if (xhr.status !== 200) {
            window.alert(xhr.status + ": " + xhr.statusText);
        } else {
			window.alert(xhr.status + ": " + xhr.statusText);
			window.alert(xhr.responseText);
			$("#enter").prop('disabled', false);
        }
    };
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Accept", "application/json");
	xhr.setRequestHeader("Authorization", "Token 76881cfeacca12c34967d5af4cad2a9b8e31dd62"); //Изменить токен на нужный
	xhr.setRequestHeader("X-Secret", "b3dd79c039f5b59b5880077034dd3f4e3222599e"); //Изменить токен на нужный
	xhr.send(JSON.stringify([query]));
});