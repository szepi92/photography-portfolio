$(document).ready (main);
$(window).resize (resizeEverything);

$(document).keyup(function(e){
	if (e.keyCode == 37) {
		goToPreviousPicture();
	} else if (e.keyCode == 39) {
		goToNextPicture();
	}
});

// do something with the real dimensions of the image
function realDimensions(elem, callback) {
	var image = new Image(); // or document.createElement('img')
	var width, height;
	image.onload = function() {
	  width = this.width;
	  height = this.height;
	  callback(width,height);
	};
	image.src = $(elem).attr('src');
}

function main() {
	initialize();
	//centerActivePicture();
	//resizeEverything();
	
	firstImage = $("#bigpictures img").first().get(0);
	firstImage.onload = centerActivePicture;
	
	$(".left-arrow").click(goToPreviousPicture);
	$(".right-arrow").click(goToNextPicture);
	$(".thumbnail-image").click(goToPicture);
	
	rightThumbnail = Math.floor($(".slidebox").width() / $(".thumbnail-image").outerWidth() - 1);
	
	// Mouse hover over the thumbnail hotspots
	$("#thumbnails").hover(doHotspotHover,stopHotspotHover);
	$("#thumbnails").mousemove(changeMousePosition);
	
	imagesLoaded('#bigpictures',resizeEverything);
}

function resizeEverything() {
	// Resize the thumbails
	var h=$("#thumbnails").height();
	var containerHeight=h;
	var containerWidth=h;
	$(".thumbnail-image").height(h).width(h);
	$(".thumbnail-image img").each (function (index, element) {
		realDimensions(element, function(pictureWidth, pictureHeight){
			if (pictureHeight > pictureWidth) {
				$(element).width(containerWidth);
			} else {
				$(element).height(containerHeight);
			}
		});
	});
	
	// vertical align the arrows
	var bigPictureHeight = $("#bigpictures").height();
	var arrowHeight = $("#arrows").height();
	$("#arrows").offset({top: (bigPictureHeight-arrowHeight)/2 });
	
	// vertical align thumbnail arrows
	var thumbnailHeight = $("#thumbnails").height();
	var thumbArrowHeight = $("#thumb-arrows").height();
	$("#thumb-arrows").offset({top: bigPictureHeight+2+(thumbnailHeight-thumbArrowHeight)/2 });
	
	// Fix up infinite scroll -- this causes some random white space between images
	slideshowWidth = 0;
	for (var i = leftPic, t = 0; t < pictureArray.length; i = (i+1)%pictureArray.length, t++) {
		var pictureWidth = Math.floor($(pictureArray[i]).width());
		$(pictureArray[i]).offset({left: slideshowWidth });
		slideshowWidth = slideshowWidth + pictureWidth;
	}
	
	centerActivePicture();
	
	// hide loading screen
	$(".loading").hide();
	$('.wait-to-load').fadeTo(3000, 1.0);
	//$
	//$(".wait-to-load").delay(5500, "load").css({opacity: 1}, "load");
}

var activePicture = 0;
var pictureArray = [];
var thumbnailArray = [];

// creates picture array and initialize other data structures
function initialize() {
	$("#bigpictures img").each (function (index, element) {
		pictureArray[index] = element;
	});
	
	$(".thumbnail-image").each (function (index, element) {
		thumbnailArray[index] = element;
	});
	
	initializeInfiniteScroll();
}

function centerActivePicture() {
	displaceAll();	// shimmy the pictures around the end to ensure infinite scroll
	
	var sumPrevious = 0;
	for (var i = leftPic; i != activePicture; i = (i+1)%pictureArray.length) {
		var pictureWidth = $(pictureArray[i]).width();
		sumPrevious = sumPrevious + pictureWidth;
	}
	
	var screenWidth = $(".slidebox").width();
	var activeWidth = $(pictureArray[activePicture]).width();
	
	var leftPicPos = $(pictureArray[leftPic]).position().left;
	var shift = leftPicPos + sumPrevious - (screenWidth - activeWidth)/2.0;
	
	// scrolling to the next image
	$("#bigpictures").stop(false,true).animate({left: -shift}, 700);
	
	$(".fade-out").stop().animate({opacity: 0.3},700);
	$(".fade-out-thumb").stop().animate({opacity: 0.6},700);
	$(pictureArray[activePicture]).stop().animate({opacity: 1},700);
	$(thumbnailArray[activePicture]).stop().animate({opacity: 1},700);
	
	// centering thumbnails when active picture is outside the current range
	var thumbnailWidth = $(".thumbnail-image").outerWidth();
	var numThumbnails = thumbnailArray.length;
	var totalWidth = numThumbnails * thumbnailWidth;
	var numThumbnailsOnScreen = Math.floor (screenWidth / thumbnailWidth);
	var desiredPos = Math.floor (numThumbnailsOnScreen / 2);
	var desiredLeft = -(activePicture - desiredPos) * thumbnailWidth;
	var leftVisible = Math.floor( -$("#thumbnails").offset().left / thumbnailWidth);
	var rightVisible = leftVisible + numThumbnailsOnScreen - 1;
	if (activePicture > rightVisible || activePicture < leftVisible) {
		desiredLeft = Math.min(desiredLeft, 0);
		desiredLeft = Math.max(desiredLeft, -(totalWidth + 2 - screenWidth));
		$("#thumbnails").stop(true).animate({left: desiredLeft}, 700);
	}
}

var goToPreviousPicture = _.throttle(function () {
	activePicture = (activePicture - 1 + pictureArray.length) % pictureArray.length;
	centerActivePicture();
}, 700);

var goToNextPicture = _.throttle(function() {
	activePicture = (activePicture + 1) % pictureArray.length;
	centerActivePicture();
}, 700);

function goToPicture() {
	var index = $(this).index();
	activePicture = index;
	centerActivePicture();
}

//hotspot scrolling on thumbnails
var hoverInterval = 0;
var mousePosition = {pageX: 0, pageY: 0};

function changeMousePosition(event) {
	mousePosition = event;
}

function doHotspotHover(event) {
	if (hoverInterval != 0) {
		clearInterval(hoverInterval);
		hoverInterval = 0;
	}
	
	changeMousePosition(event);
	
	var INTERVAL_TIME = 100;
	hoverInterval = setInterval(function(){
		var curLeft = $("#thumbnails").offset().left;
		var mouseX = mousePosition.pageX;
		
		var screenWidth = $(".slidebox").width();
		var thumbnailWidth = $(".thumbnail-image").outerWidth();
		
		var increment = 3*thumbnailWidth * INTERVAL_TIME / 1000;	// number of pixels to shift per interval
		
		var newLeft;
		if (mouseX >= screenWidth - thumbnailWidth) { // shift right
			newLeft = curLeft - increment;
		} else if (mouseX <= thumbnailWidth) {  // shift left
			newLeft = curLeft + increment;
		}
		
		var numThumbnails = thumbnailArray.length;
		var totalWidth = numThumbnails * thumbnailWidth;
		
		newLeft = Math.min(newLeft, 0);
		newLeft = Math.max(newLeft, -(totalWidth + 2 - screenWidth));
		
		$("#thumbnails").css({left: newLeft});
	}, INTERVAL_TIME);
}

function stopHotspotHover() {
	if (hoverInterval) {
		clearInterval(hoverInterval);
		hoverInterval = 0;
	}
}

// infinite scroll for slideshow
var leftPic = 0;
var rightPic = 0;
var slideshowWidth = 0;

function initializeInfiniteScroll() {
	rightPic = pictureArray.length - 1;
	
	slideshowWidth = 0;
	for (var i = 0; i < pictureArray.length; i++) {
		var pictureWidth = $(pictureArray[i]).width();
		slideshowWidth = slideshowWidth + pictureWidth;
	}
	
	displaceRight();
	displaceRight();
	displaceRight();
}

function modDist(a, b, m) {
	return (b-a+m)%m;
}

function displaceAll() {
	var numPics = pictureArray.length;
	while(true) {
		var rightDist = (rightPic - activePicture + numPics) % numPics;
		var leftDist = (activePicture - leftPic + numPics) % numPics;
		
		if (rightDist > leftDist + 1) {
			displaceRight();
		} else if (leftDist > rightDist + 1) {
			displaceLeft();
		} else {
			break;
		}
	}
}

//displace right image and move to the left
function displaceRight() {
	var currentRight = $(pictureArray[rightPic]).offset().left;
	$(pictureArray[rightPic]).offset({left: currentRight - slideshowWidth});
	
	leftPic = (leftPic + pictureArray.length - 1) % pictureArray.length;
	
	rightPic = (rightPic + pictureArray.length - 1) % pictureArray.length;
}

//displace left image and move it to the right
function displaceLeft() {
	var currentLeft = $(pictureArray[leftPic]).offset().left;
	$(pictureArray[leftPic]).offset({left: currentLeft + slideshowWidth});
	
	leftPic = (leftPic + 1) % pictureArray.length;
	
	rightPic = (rightPic + 1) % pictureArray.length;
}