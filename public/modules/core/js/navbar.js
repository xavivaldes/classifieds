window.onscroll = function () {
  var dynbar = $("#dynbar");
  var arrow = $(".arrow");
  var st = $(window).scrollTop();
  var max = $('.parallax').height();

  if (st > max - 100) {
    dynbar.addClass("navbar-solid");
  } else {
    dynbar.removeClass("navbar-solid");
  }
  if (st > 20) {
    arrow.css({'opacity' : 0});
  } else {
    arrow.css({'opacity' : 1});
  }
}
