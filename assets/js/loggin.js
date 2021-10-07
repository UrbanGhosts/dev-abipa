$("#enter").on("click", function () {
	
	var name = $("#username").val();
	var password = $("#password").val();
	
	$.ajax({
		url: '/loggin',
		//url: '/assets/js/test.js',
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
			href = href.split("index")[0];
			href = href.replace("#", '');
			window.location.href = href + "workpage.html";
			
		},
		error: function (data) {
			window.console.log(data.status + ": " + data.statusText);
			$("#enter").prop('disabled', false);
		},
	});
});