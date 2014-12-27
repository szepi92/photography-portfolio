<?php
	$loc = "localhost/reka";
	if ($_SERVER['HTTP_HOST'] != 'localhost') {
		$loc = $_SERVER['HTTP_HOST'];
	}
	
	header("Location: http://".$loc."/photography/portraits.php");
	die();
?>