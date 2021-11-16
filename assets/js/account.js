document.body.onload = function () {
	var preloader = document.getElementById('preloader');
	setTimeout(function () {
		preloader.style.display = 'none';
	}, 500);

}

$("#uploadPhoto").change(function () {

	file = this.files[0];
	console.log(file.name);
	var reader = new FileReader();

	reader.onload = function (e) {
		var rawData = e.target.result;
		let view = new Uint8Array(rawData);

		$.ajax({
			url: '/updatePhoto',
			type: 'POST',
			cache: false,
			data: view,
			contentType: 'application/octet-stream',
			success: function (data) {
				if (!data) {
					return;
				}
			},
			error: function (data) {
				window.console.log(data.status + ": " + data.statusText);
			},
		});

		//var preloader = document.getElementById('defaultPhoto');
		//preloader.src = rawData;
	}
	reader.readAsArrayBuffer(file);
});