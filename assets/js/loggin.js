$("#enter").on("click", function () {
	var point = document.getElementById('point');

	var name = $("#username").val();
	var password = $("#password").val();
	var message = $("#error").html();
	if (message) {
		document.getElementById('error').innerHTML = '';
		document.getElementById('error').style.color = "red";
	}

	$.ajax({
		url: '/login',
		type: 'GET',
		cache: false,
		data: { 'name': name, 'password': password },
		dataType: 'text',
		beforeSend: function () {
			$("#enter").prop('disabled', true);
			point.style.display = 'block';
        },
		success: function (obj) {
			$("#enter").prop('disabled', false);
			point.style.display = 'none';

			if (!name || !password) {
				document.getElementById('error').innerHTML = 'Login or password is not complete';
				return;
			}

			obj = JSON.parse(obj);

			if (obj.status == '401') {
				document.getElementById('error').innerHTML = 'Wrong login or password';
				let reset = document.getElementById("resetPasswordMessage");
				reset.style.display = 'block';
				return;
            }
			if (obj.status == '200') {
				window.location.href = obj.url;
				return;
			}
			
			if (obj.status == 'UpdatePassword') {
				let table = document.getElementById("loginForm");
				table.style.display = 'none';
				let newPassword = document.getElementById("passwordForm");
				newPassword.style.display = 'block';
			}
		},
		error: function (data) {
			window.console.log(data.status + ": " + data.statusText);
			$("#enter").prop('disabled', false);
			point.style.display = 'none';
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
		data: { 'newVal': newVal, 'repeateVal': repeateVal, 'isButton': true },
		dataType: 'text',
		beforeSend: function () {
			$("#updatepassword").prop('disabled', true);
		},
		success: function (obj) {
			$("#updatepassword").prop('disabled', false);
			obj = JSON.parse(obj);
			window.console.log(obj);
			if (obj.status == '400') {
				document.getElementById('errorPass').innerHTML = 'Please fill in both fields';
				return;
			}

			if (obj.status == '401') {
				document.getElementById('errorPass').innerHTML = 'Password mismatch';
				return;
			}
			
			if (obj.status == '200') {
				//TODO: затестить - удалить
				let table = document.getElementById("loginForm");
				table.style.display = 'block';
				let newPassword = document.getElementById("passwordForm");
				newPassword.style.display = 'none';

				window.location.href = obj.url;
				return;
			}
		},
		error: function (data) {
			window.console.log(data.status + ": " + data.statusText);
			$("#updatepassword").prop('disabled', false);
		},
	});
});

resetPasswordMessage = function () {
	let table = document.getElementById("loginForm");
	table.style.display = 'none';
	let newPassword = document.getElementById("forgotForm");
	newPassword.style.display = 'block';
}
document.getElementById("resetPassword").addEventListener('click', function (e) {
	var point = document.getElementById('resetPoint');
	var login = $("#forgotFormLogin").val();
	var message = $("#resetPasswordMessage").html();
	if (message) {
		document.getElementById('resetErrorMessage').innerHTML = '';
	}
	//ToDo: затестить показать окно без ajax запроса
	$.ajax({
		url: '/resetPassword',
		type: 'GET',
		cache: false,
		data: { 'login': login, 'isButton': true },
		dataType: 'text',
		beforeSend: function () {
			point.style.display = 'block';
			$("#resetPassword").prop('disabled', true);
		},
		success: function (obj) {
			$("#resetPassword").prop('disabled', false);
			point.style.display = 'none';

			obj = JSON.parse(obj);

			if (!login) {
				document.getElementById('resetErrorMessage').innerHTML = 'Login is not complete';
				return;
			}

			if (obj.status == '404') {
				document.getElementById('resetErrorMessage').innerHTML = 'Wrong login';
				return;
			}

			if (obj.status == '200') {
				let table = document.getElementById("loginForm");
				table.style.display = 'block';
				let newPassword = document.getElementById("forgotForm");
				newPassword.style.display = 'none';

				var doc = document.getElementById('error');
				doc.innerHTML = 'Password reset';
				doc.style.color = "green";

				return;
			}
		},
		error: function (data) {
			window.console.log(data.status + ": " + data.statusText);
			$("#resetPassword").prop('disabled', false);
			point.style.display = 'none';
		},
	});
});
document.body.onload = function () {
	let reset = document.getElementById("resetPasswordMessage");
	reset.style.display = 'none';

	var preloader = document.getElementById('preloader');
	setTimeout(function () {
		preloader.style.display = 'none';
	}, 500);
	
}