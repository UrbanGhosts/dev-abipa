$("#enter").on("click", function () {
	
	var name = $("#username").val();
	var password = $("#password").val();
	
	$.ajax({
		url: '/login',
		type: 'GET',
		cache: false,
		data: { 'name': name, 'password': password },
		//headers: {'Token_value': 123},
		dataType: 'text',
		beforeSend: function () {
			$("#enter").prop('disabled', true);
        },
		success: function (data) {
			
			var href = window.location.href;
			window.location.href = href + "account";
			$("#enter").prop('disabled', false);
			/*
			if (data.status == '401'){
				window.alert(data.success);
				return;
			}
			
			if (data.status == '200'){
				var href = window.location.href;
				window.alert(href);
				//href = href.split("index")[0];
				//href = href.replace("#", '');
				window.location.href = href + "test";
			}
			*/
		},
		error: function (data) {
			window.console.log(data.status + ": " + data.statusText);
			$("#enter").prop('disabled', false);
		},
	});
});