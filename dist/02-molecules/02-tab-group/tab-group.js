'use strict';Drupal.behaviors.tabs={attach:function attach(){'use strict';function a(){r=document.querySelectorAll('[role="tab"]'),s=document.querySelectorAll('[role="tabpanel"]')}function b(a){r[a].addEventListener('click',c),r[a].addEventListener('keydown',d),r[a].addEventListener('keyup',e),r[a].index=a}function c(a){var b=a.target;h(b,!1)}function d(a){var b=a.keyCode;b===i.end?(a.preventDefault(),h(r[r.length-1])):b===i.home?(a.preventDefault(),h(r[0])):b===i.up||b===i.down?f(a):void 0}function e(a){var b=a.keyCode;b===i.left||b===i.right?f(a):b===i.delete?m(a):void 0}function f(a){var b=a.keyCode,c='vertical'==u.getAttribute('aria-orientation'),d=!1;c?(b===i.up||b===i.down)&&(a.preventDefault(),d=!0):(b===i.left||b===i.right)&&(d=!0);d&&g(a)}function g(a){var b=a.keyCode;for(x=0;x<r.length;x++)r[x].addEventListener('focus',o);if(y[b]){var c=a.target;void 0!==c.index&&(r[c.index+y[b]]?r[c.index+y[b]].focus():b===i.left||b===i.up?l():(b===i.right||b==i.down)&&k())}}function h(a,b){b=b||!0,j(),a.removeAttribute('tabindex'),a.setAttribute('aria-selected','true');var c=a.getAttribute('aria-controls');document.getElementById(c).removeAttribute('hidden'),b&&a.focus()}function j(){for(z=0;z<r.length;z++)r[z].setAttribute('tabindex','-1'),r[z].setAttribute('aria-selected','false'),r[z].removeEventListener('focus',o);for(t=0;t<s.length;t++)s[t].setAttribute('hidden','hidden')}function k(){r[0].focus()}function l(){r[r.length-1].focus()}function m(b){target=b.target;null!==target.getAttribute('data-deletable')&&(n(b,target),a(),0>target.index-1?h(r[0]):h(r[target.index-1]))}function n(a){var b=a.target,c=document.getElementById(b.getAttribute('aria-controls'));b.parentElement.removeChild(b),c.parentElement.removeChild(c)}function o(a){var b=a.target;setTimeout(q,v,b)}function q(a){focused=document.activeElement,a===focused&&h(a,!1)}var r,s,u=document.querySelectorAll('[role="tablist"]')[0],v=function(){var a=u.hasAttribute('data-delay'),b=0;if(a){var c=u.getAttribute('data-delay');b=c?c:300}return b}();a();var w,i={end:35,home:36,left:37,up:38,right:39,down:40,delete:46},y={37:-1,38:-1,39:1,40:1};for(w=0;w<r.length;++w)b(w);var z,t}};
//# sourceMappingURL=tab-group.js.map
