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


	var username = "Supervisor";
	var password2 = "ghj5";

	$.ajax({
		url: 'https://abipa.terrasoft.ru/ServiceModel/AuthService.svc/Login',
		type: 'POST',
		cache: true,
		data: { 'UserName': username, 'UserPassword': password2 },
		headers: {
			'Content-type': "application/json",
			"Accept": "application/json"
		},
		dataType: 'application/json',
		success: function (data) {
			window.console.log(data.status + ": " + data.statusText);
			window.alert(data);
		},
		error: function (data) {
			window.console.log(data.status + ": " + data.statusText);
			$("#enter").prop('disabled', false);
		},
	});


	var xhr = new XMLHttpRequest();
	var authData = {
		"UserName":  + username,
		"UserPassword":  + password2
	};
	xhr.open("POST", "https://abipa.terrasoft.ru/ServiceModel/AuthService.svc/Login", true);
    xhr.onreadystatechange = function () {

        if (xhr.readyState !== 4) {
            return;
        }

        if (xhr.status !== 200) {
            window.alert(xhr.status + ": " + xhr.statusText);
        } else {
			window.alert(xhr.status + ": " + xhr.statusText);
			window.alert(xhr.responseText);
        }
    };
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.setRequestHeader("Accept", "application/json");
	xhr.send(authData);
});