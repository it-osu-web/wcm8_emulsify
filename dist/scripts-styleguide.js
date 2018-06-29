'use strict';

Drupal.behaviors.accordion = {
  attach: function attach(context, settings) {

    'use strict';

    Array.prototype.slice.call(document.querySelectorAll('.Accordion')).forEach(function (accordion) {

      // Allow for multiple accordion sections to be expanded at the same time
      var allowMultiple = accordion.hasAttribute('data-allow-multiple');
      // Allow for each toggle to both open and close individually
      var allowToggle = allowMultiple ? allowMultiple : accordion.hasAttribute('data-allow-toggle');

      // Create the array of toggle elements for the accordion group
      var triggers = Array.prototype.slice.call(accordion.querySelectorAll('.Accordion-trigger'));
      var panels = Array.prototype.slice.call(accordion.querySelectorAll('.Accordion-panel'));

      accordion.addEventListener('click', function (event) {
        var target = event.target;

        if (target.classList.contains('Accordion-trigger')) {
          // Check if the current toggle is expanded.
          var isExpanded = target.getAttribute('aria-expanded') == 'true';
          var active = accordion.querySelector('[aria-expanded="true"]');

          // without allowMultiple, close the open accordion
          if (!allowMultiple && active && active !== target) {
            // Set the expanded state on the triggering element
            active.setAttribute('aria-expanded', 'false');
            // Hide the accordion sections, using aria-controls to specify the desired section
            document.getElementById(active.getAttribute('aria-controls')).setAttribute('hidden', '');

            // When toggling is not allowed, clean up disabled state
            if (!allowToggle) {
              active.removeAttribute('aria-disabled');
            }
          }

          if (!isExpanded) {
            // Set the expanded state on the triggering element
            target.setAttribute('aria-expanded', 'true');
            // Hide the accordion sections, using aria-controls to specify the desired section
            document.getElementById(target.getAttribute('aria-controls')).removeAttribute('hidden');

            // If toggling is not allowed, set disabled state on trigger
            if (!allowToggle) {
              target.setAttribute('aria-disabled', 'true');
            }
          } else if (allowToggle && isExpanded) {
            // Set the expanded state on the triggering element
            target.setAttribute('aria-expanded', 'false');
            // Hide the accordion sections, using aria-controls to specify the desired section
            document.getElementById(target.getAttribute('aria-controls')).setAttribute('hidden', '');
          }

          event.preventDefault();
        }
      });

      // Bind keyboard behaviors on the main accordion container
      accordion.addEventListener('keydown', function (event) {
        var target = event.target;
        var key = event.which.toString();
        // 33 = Page Up, 34 = Page Down
        var ctrlModifier = event.ctrlKey && key.match(/33|34/);

        // Is this coming from an accordion header?
        if (target.classList.contains('Accordion-trigger')) {
          // Up/ Down arrow and Control + Page Up/ Page Down keyboard operations
          // 38 = Up, 40 = Down
          if (key.match(/38|40/) || ctrlModifier) {
            var index = triggers.indexOf(target);
            var direction = key.match(/34|40/) ? 1 : -1;
            var length = triggers.length;
            var newIndex = (index + length + direction) % length;

            triggers[newIndex].focus();

            event.preventDefault();
          } else if (key.match(/35|36/)) {
            // 35 = End, 36 = Home keyboard operations
            switch (key) {
              // Go to first accordion
              case '36':
                triggers[0].focus();
                break;
              // Go to last accordion
              case '35':
                triggers[triggers.length - 1].focus();
                break;
            }

            event.preventDefault();
          }
        } else if (ctrlModifier) {
          // Control + Page Up/ Page Down keyboard operations
          // Catches events that happen inside of panels
          panels.forEach(function (panel, index) {
            if (panel.contains(target)) {
              triggers[index].focus();

              event.preventDefault();
            }
          });
        }
      });

      // Minor setup: will set disabled state, via aria-disabled, to an
      // expanded/ active accordion which is not allowed to be toggled close
      if (!allowToggle) {
        // Get the first expanded/ active accordion
        var expanded = accordion.querySelector('[aria-expanded="true"]');

        // If an expanded/ active accordion is found, disable
        if (expanded) {
          expanded.setAttribute('aria-disabled', 'true');
        }
      }
    });
  }
};
'use strict';

Drupal.behaviors.tabs = {
  attach: function attach(context, settings) {

    'use strict';

    var el = document.querySelectorAll('.tabs');
    var tabNavigationLinks = document.querySelectorAll('.tabs__link');
    var tabContentContainers = document.querySelectorAll('.tabs__tab');
    var activeIndex = 0;

    /**
     * handleClick
     * @description Handles click event listeners on each of the links in the
     *   tab navigation. Returns nothing.
     * @param {HTMLElement} link The link to listen for events on
     * @param {Number} index The index of that link
     */
    var handleClick = function handleClick(link, index) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        goToTab(index);
      });
    };

    /**
     * goToTab
     * @description Goes to a specific tab based on index. Returns nothing.
     * @param {Number} index The index of the tab to go to
     */
    var goToTab = function goToTab(index) {
      if (index !== activeIndex && index >= 0 && index <= tabNavigationLinks.length) {
        tabNavigationLinks[activeIndex].classList.remove('is-active');
        tabNavigationLinks[index].classList.add('is-active');
        tabContentContainers[activeIndex].classList.remove('is-active');
        tabContentContainers[index].classList.add('is-active');
        activeIndex = index;
      }
    };

    /**
     * init
     * @description Initializes the component by removing the no-js class from
     *   the component, and attaching event listeners to each of the nav items.
     *   Returns nothing.
     */
    for (var e = 0; e < el.length; e++) {
      el[e].classList.remove('no-js');
    }

    for (var i = 0; i < tabNavigationLinks.length; i++) {
      var link = tabNavigationLinks[i];
      handleClick(link, i);
    }
  }
};
/**
 * @file
 * A JavaScript file containing the main menu functionality (small/large screen)
 *
 */

/*
// JavaScript should be made compatible with libraries other than jQuery by
// wrapping it with an "anonymous closure". See:
// - https://drupal.org/node/1446420
// - http://www.adequatelygood.com/2010/3/JavaScript-Module-Pattern-In-Depth


// (function (Drupal) { // UNCOMMENT IF DRUPAL.
//
//   Drupal.behaviors.mainMenu = {
//     attach: function (context) {

(function () { // REMOVE IF DRUPAL.

  'use strict';

  // Use context instead of document IF DRUPAL.
  var toggle_expand = document.getElementById('toggle-expand');
  var menu = document.getElementById('main-nav');
  var expand_menu = menu.getElementsByClassName('expand-sub');

  // Mobile Menu Show/Hide.
  toggle_expand.addEventListener('click', function (e) {
    toggle_expand.classList.toggle('toggle-expand--open');
    menu.classList.toggle('main-nav--open');
  });

  // Expose mobile sub menu on click.
  for (var i = 0; i < expand_menu.length; i++) {
    expand_menu[i].addEventListener('click', function (e) {
      var menu_item = e.currentTarget;
      var sub_menu = menu_item.nextElementSibling;

      menu_item.classList.toggle('expand-sub--open');
      sub_menu.classList.toggle('main-menu--sub-open');
    });
  }

})(); // REMOVE IF DRUPAL.

// })(Drupal); // UNCOMMENT IF DRUPAL.
*/
"use strict";
'use strict';

(function ($) {

  Drupal.behaviors.blockquote = {
    attach: function attach(context, settings) {

      $(context).find('blockquote').each(function () {

        var pq_icon = '<div class="pulled-quote__icon"><i class="fas fa-quote-left fa-3x"></i></div>';

        if ($(this).hasClass('pulled-quote')) {
          $('.pulled-quote p').wrap('<div class="pulled-quote__text"></div>');
          $('.pulled-quote__text').before(pq_icon);
        }
      });
    }
  };
})(jQuery);
//# sourceMappingURL=scripts-styleguide.js.map
