$(function() {
  $('h1').click(function(event) {
    event.preventDefault();
    var h1 = $(this);
    if (h1.hasClass('alt')) {
      h1.html('Hadi. What a dick.').removeClass('alt');
    } else {
      h1.html("Nah, I'm just playin.").addClass('alt');
    }
  });
});