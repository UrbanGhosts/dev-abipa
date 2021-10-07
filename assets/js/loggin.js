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
	var json = JSON.stringify({ "query": '��� ��������', "count": 10 });
    xhr.open("POST", "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address", true);
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
    xhr.setRequestHeader("Authorization", "Token 76881cfeacca12c34967d5af4cad2a9b8e31dd62"); //�������� ����� �� ������
    xhr.send(json);
});