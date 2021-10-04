<?php
	if ($method === 'POST'){
		$login = $_POST['name'];
		$password = $_POST['password'];
	
		echo "Hello world";
	}
	if ($method === 'GET'){
		echo "GET";
	}
	echo "hi";
?>
