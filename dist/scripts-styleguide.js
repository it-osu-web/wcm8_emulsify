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

    var tablist = document.querySelectorAll('[role="tablist"]')[0];
    var tabs;
    var panels;
    var delay = determineDelay();

    generateArrays();

    function generateArrays() {
      tabs = document.querySelectorAll('[role="tab"]');
      panels = document.querySelectorAll('[role="tabpanel"]');
    };

    // For easy reference
    var keys = {
      end: 35,
      home: 36,
      left: 37,
      up: 38,
      right: 39,
      down: 40,
      delete: 46
    };

    // Add or substract depenign on key pressed
    var direction = {
      37: -1,
      38: -1,
      39: 1,
      40: 1
    };

    // Bind listeners
    var i;
    for (i = 0; i < tabs.length; ++i) {
      addListeners(i);
    };

    function addListeners(index) {
      tabs[index].addEventListener('click', clickEventListener);
      tabs[index].addEventListener('keydown', keydownEventListener);
      tabs[index].addEventListener('keyup', keyupEventListener);

      // Build an array with all tabs (<button>s) in it
      tabs[index].index = index;
    };

    // When a tab is clicked, activateTab is fired to activate it
    function clickEventListener(event) {
      var tab = event.target;
      activateTab(tab, false);
    };

    // Handle keydown on tabs
    function keydownEventListener(event) {
      var key = event.keyCode;

      switch (key) {
        case keys.end:
          event.preventDefault();
          // Activate last tab
          activateTab(tabs[tabs.length - 1]);
          break;
        case keys.home:
          event.preventDefault();
          // Activate first tab
          activateTab(tabs[0]);
          break;

        // Up and down are in keydown
        // because we need to prevent page scroll >:)
        case keys.up:
        case keys.down:
          determineOrientation(event);
          break;
      };
    };

    // Handle keyup on tabs
    function keyupEventListener(event) {
      var key = event.keyCode;

      switch (key) {
        case keys.left:
        case keys.right:
          determineOrientation(event);
          break;
        case keys.delete:
          determineDeletable(event);
          break;
      };
    };

    // When a tablistâ€™s aria-orientation is set to vertical,
    // only up and down arrow should function.
    // In all other cases only left and right arrow function.
    function determineOrientation(event) {
      var key = event.keyCode;
      var vertical = tablist.getAttribute('aria-orientation') == 'vertical';
      var proceed = false;

      if (vertical) {
        if (key === keys.up || key === keys.down) {
          event.preventDefault();
          proceed = true;
        };
      } else {
        if (key === keys.left || key === keys.right) {
          proceed = true;
        };
      };

      if (proceed) {
        switchTabOnArrowPress(event);
      };
    };

    // Either focus the next, previous, first, or last tab
    // depening on key pressed
    function switchTabOnArrowPress(event) {
      var pressed = event.keyCode;

      for (x = 0; x < tabs.length; x++) {
        tabs[x].addEventListener('focus', focusEventHandler);
      };

      if (direction[pressed]) {
        var target = event.target;
        if (target.index !== undefined) {
          if (tabs[target.index + direction[pressed]]) {
            tabs[target.index + direction[pressed]].focus();
          } else if (pressed === keys.left || pressed === keys.up) {
            focusLastTab();
          } else if (pressed === keys.right || pressed == keys.down) {
            focusFirstTab();
          };
        };
      };
    };

    // Activates any given tab panel
    function activateTab(tab, setFocus) {
      setFocus = setFocus || true;
      // Deactivate all other tabs
      deactivateTabs();

      // Remove tabindex attribute
      tab.removeAttribute('tabindex');

      // Set the tab as selected
      tab.setAttribute('aria-selected', 'true');

      // Get the value of aria-controls (which is an ID)
      var controls = tab.getAttribute('aria-controls');

      // Remove hidden attribute from tab panel to make it visible
      document.getElementById(controls).removeAttribute('hidden');

      // Set focus when required
      if (setFocus) {
        tab.focus();
      };
    };

    // Deactivate all tabs and tab panels
    var t;
    var p;
    function deactivateTabs() {
      for (t = 0; t < tabs.length; t++) {
        tabs[t].setAttribute('tabindex', '-1');
        tabs[t].setAttribute('aria-selected', 'false');
        tabs[t].removeEventListener('focus', focusEventHandler);
      };

      for (p = 0; p < panels.length; p++) {
        panels[p].setAttribute('hidden', 'hidden');
      };
    };

    // Make a guess
    function focusFirstTab() {
      tabs[0].focus();
    };

    // Make a guess
    function focusLastTab() {
      tabs[tabs.length - 1].focus();
    };

    // Detect if a tab is deletable
    function determineDeletable(event) {
      target = event.target;

      if (target.getAttribute('data-deletable') !== null) {
        // Delete target tab
        deleteTab(event, target);

        // Update arrays related to tabs widget
        generateArrays();

        // Activate the closest tab to the one that was just deleted
        if (target.index - 1 < 0) {
          activateTab(tabs[0]);
        } else {
          activateTab(tabs[target.index - 1]);
        };
      };
    };

    // Deletes a tab and its panel
    function deleteTab(event) {
      var target = event.target;
      var panel = document.getElementById(target.getAttribute('aria-controls'));

      target.parentElement.removeChild(target);
      panel.parentElement.removeChild(panel);
    };

    // Determine whether there should be a delay
    // when user navigates with the arrow keys
    function determineDelay() {
      var hasDelay = tablist.hasAttribute('data-delay');
      var delay = 0;

      if (hasDelay) {
        var delayValue = tablist.getAttribute('data-delay');
        if (delayValue) {
          delay = delayValue;
        } else {
          // If no value is specified, default to 300ms
          delay = 300;
        };
      };

      return delay;
    };

    //
    function focusEventHandler(event) {
      var target = event.target;

      setTimeout(checkTabFocus, delay, target);
    };

    // Only activate tab on focus if it still has focus after the delay
    function checkTabFocus(target) {
      focused = document.activeElement;

      if (target === focused) {
        activateTab(target, false);
      };
    };
  }
};
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
//# sourceMappingURL=scripts-styleguide.js.map
