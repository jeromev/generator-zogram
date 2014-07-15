'use strict';
$(document).ready(function() {
//   var $window = $(window);
//   var $document = $(document);
  var html = $('html');
//   var lang = html.attr('lang');
//   var body = $('body');
  var main = $('main');
  var userAgent = navigator.userAgent;
  
  // Add useragent attr (src: http://css-tricks.com/ie-10-specific-styles)
  html.attr('data-useragent', userAgent);
  
  // Smooth scroll for internal links
  $.localScroll();
  
  // remove no-js class
  html.removeClass('no-js');
  
  // Lettering.js
  $('> h1', main).lettering();
  
});
