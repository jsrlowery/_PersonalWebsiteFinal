let mdSize = 768; // Med-size screen.
let linkClass = "contact-link";

$(document).ready(() => {

  let contactChecker = () => {
    if($(this).width() < mdSize && !$("." + linkClass).length) {
      $(".wrap-f-navbar").append("<a href=\"mailto:jared.s.r.lowery@gmail.com\" class=\"" + linkClass + " nav-link\">")
      $("." + linkClass).append("<i class=\"fa-solid fa-envelope\"></i> Contact");
    }

    // Remove the contact button if the screen size hits medium.
    if($(this).width() >= mdSize) {
      $("." + linkClass).remove();
    }
  }

  contactChecker();

  // When the window falls below mdSize, add the contact button to the navbar.
  $(window).resize(contactChecker);

}); //document.ready
