﻿document.body.onload = function () {
	var profilePhoto = document.getElementById('profilePhoto');
	profilePhoto.style.display = "none";

	var preloader = document.getElementById('preloader');
	setTimeout(function () {
		preloader.style.display = 'none';
	}, 500);

}

$("#uploadPhoto").change(function () {

	file = this.files[0];
	updatePhotoProfile(file);
	
	var reader = new FileReader();

	reader.onload = function (e) {
		var rawData = e.target.result;
		let view = new Uint8Array(rawData);

		$.ajax({
			url: '/updatePhoto',
			type: 'POST',
			cache: false,
			//data: view,
			data: {
				"file": view.toString(),
				"isButton": true,
				"filename": file.name,
			},
			contentType: 'application/octet-stream',
			success: function (data) {
				if (!data) {
					return;
				}
				data = JSON.parse(JSON.stringify(data));

				if (data && data.status == '200') {
					//updatePhotoName(file.name, data.id);
				} else {
					window.location.href = data.url;
                }

			},
			error: function (data) {
				window.console.log(data.status + ": " + data.statusText);
			},
		});
	}
	reader.readAsArrayBuffer(file);
});

updatePhotoProfile = function (file) {
	var reader = new FileReader();
	reader.onload = function (e) {
		var rawData = e.target.result;

		var defaultPhoto = document.getElementById('defaultPhoto');
		defaultPhoto.style.display = "none";

		var profilePhoto = document.getElementById('profilePhoto');
		profilePhoto.src = rawData;
		profilePhoto.style.display = "block";
	}
	reader.readAsDataURL(file);
}

uploadForm.onmouseout = function (event) {
	$("#uploadForm").css('color', 'black');
};
uploadForm.onmouseover = function (event) {
	$("#uploadForm").css('color', 'red');
};

addForm.onmouseout = function (event) {
	$("#addForm").css('background-color', 'lightgray');
	$("#addForm").css('color', 'black');
};
addForm.onmouseover = function (event) {
	$("#addForm").css('background-color', 'gray');
	$("#addForm").css('color', 'white');
};

$("#addFile").change(function () {

	file = this.files[0];

	var reader = new FileReader();

	reader.onload = function (e) {
		var rawData = e.target.result;
		let view = new Uint8Array(rawData);
		$.ajax({
			url: '/addFile',
			type: 'POST',
			cache: false,
			
			data: {
				"file": view.toString(),
				"isButton": true,
				"filename": file.name,
			},
			
			//data: view.toString(),
			contentType: 'application/octet-stream',
			contentLength: rawData.length,
			success: function (data) {
				if (!data) {
					return;
				}
				data = JSON.parse(JSON.stringify(data));
				window.console.log(data);

			},
			error: function (data) {
				window.console.log(data.status + ": " + data.statusText);
			},
		});
	}
	reader.readAsArrayBuffer(file);
});