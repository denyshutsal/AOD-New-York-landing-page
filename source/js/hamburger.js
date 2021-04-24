(function ($) {
  const hamburgerBtn = $('#hamburger');
  const headerNav = $('#header-nav');
  const headerNavModifier = 'header-nav--open';

  hamburgerBtn.on('click', function () {
    headerNav.toggleClass(headerNavModifier);
  });
})(jQuery);
