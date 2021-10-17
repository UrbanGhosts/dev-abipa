$("#enter").on("click", function () {
	
	var name = $("#username").val();
	var password = $("#password").val();
	var message = $("#error").html();
	if (message) {
		document.getElementById('error').innerHTML = '';
	}

	$.ajax({
		url: '/login',
		type: 'GET',
		cache: false,
		data: { 'name': name, 'password': password },
		dataType: 'text',
		beforeSend: function () {
			$("#enter").prop('disabled', true);
        },
		success: function (data) {
			var status = data;
			$("#enter").prop('disabled', false);

			if (!name || !password) {
				document.getElementById('error').innerHTML = 'Login or password is not complete';
				return;
			}

			if (status == '401') {
				document.getElementById('error').innerHTML = 'Wrong login or password';
				return;
            }
			if (status == '200') {
				var href = window.location.href;
				window.location.href = href + "account";
				return;
			}
			
			if (status == 'UpdatePassword') {
				let table = document.getElementById("loginForm");
				table.style.display = 'none';
				let newPassword = document.getElementById("passwordForm");
				newPassword.style.display = 'block';
			}
		},
		error: function (data) {
			window.console.log(data.status + ": " + data.statusText);
			$("#enter").prop('disabled', false);
		},
	});
});

$("#updatepassword").on("click", function () {

	var newVal = $("#newpassword").val();
	var repeateVal = $("#repeatpassword").val();
	var message = $("#errorPass").html();
	if (message) {
		document.getElementById('errorPass').innerHTML = '';
	}

	$.ajax({
		url: '/updatePassword',
		type: 'GET',
		cache: false,
		data: { 'newVal': newVal, 'repeateVal': repeateVal },
		dataType: 'text',
		beforeSend: function () {
			$("#updatepassword").prop('disabled', true);
		},
		success: function (data) {
			var status = data;
			$("#updatepassword").prop('disabled', false);

			if (!newVal || !repeateVal) {
				document.getElementById('errorPass').innerHTML = 'Please fill in both fields';
				return;
			}

			if (newVal && repeateVal && newVal != repeateVal) {
				document.getElementById('errorPass').innerHTML = 'Password mismatch';
				return;
			}

			if (status == '200') {
				//TODO: затестить - удалить
				let table = document.getElementById("loginForm");
				table.style.display = 'block';
				let newPassword = document.getElementById("passwordForm");
				newPassword.style.display = 'none';

				var href = window.location.href;
				window.location.href = href + "account";
				return;
			}
		},
		error: function (data) {
			window.console.log(data.status + ": " + data.statusText);
			$("#updatepassword").prop('disabled', false);
		},
	});
});