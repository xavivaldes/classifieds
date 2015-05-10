var oldWidth = getWindowWidth();

function getContainerWidth() {
	return $('#masonry-container').width();
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
	setTimeout(function () {
		var width = getContainerWidth();
		if (Math.abs(getWindowWidth() - oldWidth) > 10) {
			/* Small devices (tablets, 768px and up) */
			/* Medium devices (desktops, 992px and up) */
			/* Large devices (large desktops, 1200px and up) */
			if (width < 768) {
				setNumOfCols(3);
			} else if (width < 992) {
				setNumOfCols(4);
			} else if (width < 1200) {
				setNumOfCols(5);
			} else {
				setNumOfCols(5);
			}
			$('#masonry-container').masonry({
				columnWidth: ".item",
				itemSelector: ".item",
				isFitWidth: true,
				gutter: calcGutter()
			});
			oldWidth = getWindowWidth();
		}
	}, 200);
}

// initialize Masonry after all images have loaded
$(window).load(executeMasonry);

$(window).resize(executeMasonry);

function setNumOfCols(cols) {
	var width = getContainerWidth();
	//alert(cols + ',' + width);
	var imgWidth = Math.max(Math.round(width / cols - calcGutter()), 120);
	console.log(imgWidth);
	$('.item').css('max-width', imgWidth + 'px');
	$('.item > img').css('max-width', imgWidth + 'px');
}
