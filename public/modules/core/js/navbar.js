function renderNavbar() {
	var dynbar = $("#dynbar");
	var arrow = $(".arrow");
	var st = $(window).scrollTop();
	var max = $('.parallax').height();

	if (st > max - 100) {
		showNavbar(true);
	} else {
		showNavbar(false);
	}
	if (st > 20) {
		arrow.css({'opacity': 0});
	} else {
		arrow.css({'opacity': 1});
	}
}

function showNavbar(show) {
	if (show) {
		$("#dynbar").addClass("navbar-solid");
	} else {
		$("#dynbar").removeClass("navbar-solid");
	}
}

window.onscroll = renderNavbar;
