'use strict';(function(a){Drupal.behaviors.blockquote={attach:function attach(b){a(b).find('blockquote').each(function(){a(this).hasClass('pulled-quote')&&(a('.pulled-quote p').wrap('<div class="pulled-quote__text"></div>'),a('.pulled-quote__text').before('<div class="pulled-quote__icon"><i class="fas fa-quote-left fa-3x"></i></div>'))})}}})(jQuery);
//# sourceMappingURL=blockquote.js.map
