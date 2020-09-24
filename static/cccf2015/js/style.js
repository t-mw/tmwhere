var sideBar = $('#painted-bg');
var contentBlock = $('#content');
var windowEl = $(window);

function checkHorizontalOverflow(el) {
   return el.offsetWidth < el.scrollWidth;
}

// keep the side bar fixed vertically when the device can accomodate it
// otherwise the media queries takes priority and the side bar scrolls as normal
windowEl.scroll(function(){
  // don't apply for mobile
  if (windowEl.innerWidth() > 600) {
    if (checkHorizontalOverflow(document.body) && windowEl.innerWidth() < 1100 && windowEl.innerHeight() >= 530) {
      var elementPosition = sideBar.offset();
      if(windowEl.innerHeight() + windowEl.scrollTop() <= contentBlock.offset().top + contentBlock.height() + 1) {
          sideBar.css('position','absolute').css('top', windowEl.scrollTop());
      }
    } else if (windowEl.innerHeight() >= 530) {
      sideBar.css('position', 'fixed').css('top', 0);
    } else {
      sideBar.attr('style', '');
    }
  } else {
    sideBar.attr('style', '');
  }
});