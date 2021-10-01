$("#enter").on("click", function () {
	
	var name = $("#username").val();
	var password = $("#password").val();
	
	$.ajax({
		//url: 'assets/js/test.php',
		url: '/searching',
		type: 'GET',
		cache: false,
		data: { 'name': name, 'password': password },
		dataType: 'text',
		beforeSend: function () {
			$("#enter").prop('disabled', true);
        },
		success: function (data) {
			window.console.log("success: " + data);
			$("#enter").prop('disabled', false);
			return;

			var href = window.location.href;
			href = href.split("index")[0];
			href = href.replace('#', '');
			window.location.href = href + "workpage.html";
		},
		error: function (data) {
			window.console.log(data.status + ": " + data.statusText);
			$("#enter").prop('disabled', false);
		},
	});
});