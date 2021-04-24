(function ($) {
  const galleryImgs = $('.gallery__img img');
  const galleryBtn = $('#gallery-btn');

  galleryBtn.hover(
    function () {
      galleryImgs.each(function () {
        $(this).css('filter', 'none');
      });
    },
    function () {
      galleryImgs.each(function () {
        $(this).css('filter', '');
      });
    }
  );
})(jQuery);
