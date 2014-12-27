<?php
	require_once '../common/includes/image-dir.php';
?>
<!DOCTYPE html>
<html> 
<head>
	<meta charset="UTF-8">
	<link rel="stylesheet" href="css/style.css" type="text/css">
	<script src="js/jquery-1.11.1.min.js"></script>
	<script src="js/imagesloaded.js"></script>
	<script src="js/underscore.js"></script>
	<script src="js/slideshow.js"></script>
	<link rel="stylesheet" href="css/bootstrap.min.css" type="text/css">
	<script src="js/bootstrap.min.js"></script>
	<link href='http://fonts.googleapis.com/css?family=PT+Sans' rel='stylesheet' type='text/css'>
</head>

<body>
	<div class="loading">
		<img src="assets/loading.gif">
	</div>

	<div class="slidebox">
		
		<div class="ontop">
			<img id="logo" src="assets/photography_logo.svg"/>
			<a <? if ($activePage == "portraits") {?>class="active"<? } ?> href="portraits.php">Portraits</a>
			<a <? if ($activePage == "couples") {?>class="active"<? } ?> href="couples.php">Couples</a>
			<a <? if ($activePage == "nature") {?>class="active"<? } ?>href="nature.php">Life</a>
		</div>
		
		<div id="social-media-icons" class="wait-to-load">
			<span>reka.szepesvari<img id="email-at" src="assets/at.png">gmail.com</span>
			<a target="_blank" href="https://www.facebook.com/rekasphotography"><img id="facebook" src="assets/facebook.png"/></a>
			<!--<a href="?"><img id="instagram" src="assets/instagram.png"/></a>-->
		</div>
	
		<div id="arrows" class="wait-to-load">
			<div class="glyphicon glyphicon-chevron-left clickable left-arrow"></div>
			<div class="glyphicon glyphicon-chevron-right clickable right-arrow"></div>
		</div>
		
		<?php $images = ImageDir::ListAll('images/' . $activePage); ?>
		
		<div id="bigpictures" class="big-width wait-to-load">
		<?php foreach ($images as $image) { ?>
			<img class="fade-out" src="images/<?= $activePage .'/'. $image ?>" />
		<?php } ?>
		</div>
		
		<div id="thumbnails" class="big-width wait-to-load">
		<?php foreach ($images as $image) { ?>
			<div class="thumbnail-image clickable fade-out-thumb"><img src="images/<?=$activePage .'/'. $image ?>"/></div>
		<?php } ?>
		</div>
		
	</div>
</body>
</html>