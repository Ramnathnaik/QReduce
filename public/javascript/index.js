$("#btn-book-appointment").click(function() {
  $('html,body').animate({
      scrollTop: $("#book-appointment").offset().top
    },
    'slow');
});

$("#btn-appointment-time").click(function() {
  $('html,body').animate({
      scrollTop: $("#appointment-time").offset().top
    },
    'slow');
});

$("#btn-complete-details").click(function() {
  $('html,body').animate({
      scrollTop: $("#detailed-report").offset().top
    },
    'slow');
});

$("#create-account").click(function() {
  window.location = "/register";
});

$("#create-doctor-account").click(function() {
  window.location = "/doctor-register";
});

$("#search").click(function() {
  $("#search-container").show();

});
