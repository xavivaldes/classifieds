var oldWidth = 0;

var MAX_WIDTH = 1200;
var MED_WIDTH = 992;
var MIN_WIDTH = 768;

function getContainerWidth() {
	var winWidth = getWindowWidth();
	if (winWidth >= MAX_WIDTH) return 1170;
	if (winWidth >= MED_WIDTH) return 970;
	if (winWidth >= MIN_WIDTH) return 750;
	return winWidth;
}

function getWindowWidth() {
	return $(window).width();
}


function calcGutter() {
	var width = getContainerWidth();
	console.log('gutter: ' + Math.round(width * 0.02));
	return Math.round(width * 0.02);
}

function executeMasonry() {
	var width = getWindowWidth();
	if (Math.abs(getWindowWidth() - oldWidth) > 10) {
		/* Small devices (tablets, 768px and up) */
		/* Medium devices (desktops, 992px and up) */
		/* Large devices (large desktops, 1200px and up) */
		if (width >= MAX_WIDTH) {
			setNumOfCols(5);
		} else if (width >= MED_WIDTH) {
			setNumOfCols(5);
		} else if (width >= MIN_WIDTH) {
			setNumOfCols(4);
		} else {
			setNumOfCols(3);
		}
		var container = document.querySelector('#masonry-container');
		imagesLoaded(container, function () {
			setTimeout(function() {
				new Masonry(container, {
					columnWidth: ".item",
					itemSelector: ".item",
					isFitWidth: true,
					gutter: calcGutter()
				});
			}, 200);
		});
		oldWidth = getWindowWidth();
	}
}

// initialize Masonry after all images have loaded
$(window).load(executeMasonry);

$(window).resize(executeMasonry);

function setNumOfCols(cols) {
	var width = getContainerWidth();
	//alert(cols + ',' + width);
	var imgWidth = Math.max(Math.round(width / cols - calcGutter() * 2), 120);
	console.log('cols: ' + cols + ' imgW: ' + imgWidth + ' contW: ' + width);
	$('.item').css('min-width', imgWidth + 'px');
	$('.item').css('max-width', imgWidth + 'px');
	$('.item > img').css('max-width', imgWidth + 'px');
	$('.item > img').css('min-width', imgWidth + 'px');
}
