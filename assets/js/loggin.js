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
			$("#enter").css('background-color', 'gray');
			$("#enter").css('color', '#6a6a68');
        },
		success: function (obj) {
			$("#enter").prop('disabled', false);
			$("#enter").css('background-color', 'green');
			$("#enter").css('color', '#fff');
			if (!name || !password) {
				document.getElementById('error').innerHTML = 'Login or password is not complete';
				return;
			}

			obj = JSON.parse(obj);

			if (obj.status == '401') {
				document.getElementById('error').innerHTML = 'Wrong login or password';
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
			$("#enter").css('background-color', 'green');
			$("#enter").css('color', '#fff');
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

document.body.onload = function () {
	var preloader = document.getElementById('preloader');
	setTimeout(function () {
		preloader.style.display = 'none';
	}, 500);
	
}