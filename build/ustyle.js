(function() {
  var addClass, deleteUndefined, hasClass, merge, removeClass, requestAnimationFrame, setOptions, transformKey,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty;

  if (this.Utils == null) {
    this.Utils = {
      modules: []
    };
  }

  addClass = function(element, name) {
    removeClass(element, name);
    return element.className += " " + name + " ";
  };

  removeClass = function(element, name) {
    return element.className = element.className.replace(new RegExp("(\\s|^)" + name + "(\\s|$)", "gi"), "");
  };

  hasClass = function(element, name) {
    return new RegExp("(^| )" + name + "( |$)", 'gi').test(element.className);
  };

  merge = function() {
    var extension, extensions, property, target, _i, _len;
    target = arguments[0], extensions = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = extensions.length; _i < _len; _i++) {
      extension = extensions[_i];
      for (property in extension) {
        if (!__hasProp.call(extension, property)) continue;
        target[property] = extension[property];
      }
    }
    return target;
  };

  setOptions = function(options, defaults) {
    return merge({}, defaults, options);
  };

  deleteUndefined = function(obj) {
    var key, value, _results;
    _results = [];
    for (key in obj) {
      value = obj[key];
      if (value === null || value === void 0) {
        _results.push(delete obj[key]);
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  transformKey = (function() {
    var el, key, _i, _len, _ref;
    el = document.createElement('div');
    _ref = ['transform', 'webkitTransform', 'OTransform', 'MozTransform', 'msTransform'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      if (el.style[key] !== void 0) {
        return key;
      }
    }
  })();

  requestAnimationFrame = ((function(window) {
    var vendor, _i, _len, _ref;
    _ref = ['ms', 'moz', 'webkit', 'o'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      vendor = _ref[_i];
      if (window.requestAnimationFrame) {
        break;
      }
      window.requestAnimationFrame = window["" + vendor + "RequestAnimationFrame"];
    }
    return window.requestAnimationFrame || (window.requestAnimationFrame = function(callback) {
      return setTimeout(callback, 1000 / 60);
    });
  })(window)).bind(window);

  this.Utils = {
    addClass: addClass,
    removeClass: removeClass,
    hasClass: hasClass,
    merge: merge,
    setOptions: setOptions,
    deleteUndefined: deleteUndefined,
    transformKey: transformKey,
    requestAnimationFrame: requestAnimationFrame
  };

}).call(this);

(function() {
  var addClass, createContext, hasClass, merge, removeClass, setOptions, transformKey, _ref,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = this.Utils, addClass = _ref.addClass, removeClass = _ref.removeClass, hasClass = _ref.hasClass, merge = _ref.merge, setOptions = _ref.setOptions, transformKey = _ref.transformKey;

  createContext = function(options) {
    var Anchor;
    return Anchor = (function() {
      var documentYBoundary, getXBounds, getYBounds;

      Anchor.prototype.defaults = {
        classPrefix: "us-anchor",
        openEvent: "click",
        showClose: true,
        isAjax: false
      };

      function Anchor(options) {
        var _ref1, _ref2;
        _ref1 = this.options = setOptions(options, this.defaults), this.target = _ref1.target, this.classPrefix = _ref1.classPrefix;
        if (this.target === null) {
          return;
        }
        this._boundEvents = [];
        this._closeTargets = [];
        _ref2 = this.create(), this.anchor = _ref2.anchor, this.arrow = _ref2.arrow, this.content = _ref2.content;
        this.setEvents(this.anchor);
        this.watchWindow();
      }

      Anchor.prototype.setEvents = function(anchor) {
        var hide, toggle;
        toggle = (function(_this) {
          return function(event) {
            event.preventDefault();
            event.stopPropagation();
            if (!_this.isOpen()) {
              return _this.show(anchor);
            } else {
              return _this.hide(anchor);
            }
          };
        })(this);
        hide = (function(_this) {
          return function(event) {
            var _ref1;
            if (!_this.isOpen()) {
              return;
            }
            if (_ref1 = event.target, __indexOf.call(_this._closeTargets, _ref1) >= 0) {
              event.preventDefault();
              event.stopPropagation();
              _this.hide(anchor);
            }
            if (event.target === anchor || anchor.contains(event.target)) {
              return;
            }
            if (event.target === _this.target || _this.target.contains(event.target)) {
              return;
            }
            return _this.hide(anchor);
          };
        })(this);
        this._on(this.target, this.options.openEvent, toggle);
        return this._on(document, this.options.openEvent, hide);
      };

      Anchor.prototype._on = function(element, event, handler) {
        this._boundEvents.push({
          element: element,
          event: event,
          handler: handler
        });
        return element.addEventListener(event, handler, false);
      };

      Anchor.prototype.show = function(anchor) {
        var fire, _ref1, _ref2;
        fire = (function(_this) {
          return function() {
            _this.content.appendChild(_this.options.content);
            if (!anchor.parentNode) {
              document.body.appendChild(anchor);
            }
            addClass(anchor, "" + _this.classPrefix + "--open");
            setTimeout(function() {
              return addClass(anchor, "" + _this.classPrefix + "--after-open");
            });
            return _this.setPosition();
          };
        })(this);
        if (this.options.isAjax) {
          return (_ref1 = this.options.onOpen) != null ? _ref1.call().done((function(_this) {
            return function() {
              return fire();
            };
          })(this)) : void 0;
        } else {
          fire();
          return (_ref2 = this.options.onOpen) != null ? _ref2.call() : void 0;
        }
      };

      Anchor.prototype.hide = function(anchor) {
        var _ref1;
        removeClass(anchor, "" + this.classPrefix + "--open");
        removeClass(anchor, "" + this.classPrefix + "--after-open");
        return (_ref1 = this.options.onClose) != null ? _ref1.call() : void 0;
      };

      Anchor.prototype.isOpen = function() {
        return hasClass(this.anchor, "" + this.classPrefix + "--open");
      };

      Anchor.prototype.create = function() {
        var anchor, anchorCss, arrow, arrowInner, closeButton, content;
        content = document.createElement("div");
        addClass(content, "" + this.classPrefix + "__content");
        arrow = document.createElement("div");
        arrowInner = document.createElement("div");
        arrow.appendChild(arrowInner);
        addClass(arrowInner, "" + this.classPrefix + "__arrow-inner");
        addClass(arrow, "" + this.classPrefix + "__arrow");
        content.appendChild(arrow);
        if (this.options.showClose) {
          closeButton = document.createElement("a");
          closeButton.href = "#";
          addClass(closeButton, "" + this.classPrefix + "__close-button");
          content.appendChild(closeButton);
          this._closeTargets.push(closeButton);
        }
        anchor = document.createElement("div");
        addClass(anchor, this.classPrefix);
        anchorCss = anchor.style;
        anchorCss.position = 'absolute';
        anchorCss.zIndex = '9999';
        anchorCss.top = '0px';
        anchorCss.left = '0px';
        anchor.appendChild(content);
        addClass(document.documentElement, "" + this.classPrefix + "--ready");
        return {
          anchor: anchor,
          arrow: arrow,
          content: content
        };
      };

      Anchor.prototype.setPosition = function() {
        var bottomOffset, leftOffset, style, targetBounds, transformXOrigin, transformYOrigin;
        leftOffset = getXBounds(this.target, this.anchor, this.arrow);
        targetBounds = this.target.getBoundingClientRect();
        if (documentYBoundary(targetBounds, this.anchor)) {
          addClass(this.anchor, "" + this.classPrefix + "--bottom");
          removeClass(this.anchor, "" + this.classPrefix + "--top");
          transformYOrigin = "calc(100% + 12px)";
          bottomOffset = getYBounds(this.target, this.anchor, this.arrow);
        } else {
          addClass(this.anchor, "" + this.classPrefix + "--top");
          removeClass(this.anchor, "" + this.classPrefix + "--bottom");
          transformYOrigin = "-12px";
          bottomOffset = getYBounds(this.target, this.anchor, this.arrow);
        }
        style = "translateX(" + (Math.round(leftOffset)) + "px) translateY(" + (Math.round(bottomOffset)) + "px)";
        if (transformKey !== 'msTransform') {
          style += " translateZ(0)";
        }
        this.anchor.style[transformKey] = style;
        transformXOrigin = (targetBounds.left - this.anchor.getBoundingClientRect().left) + (this.target.offsetWidth / 2);
        this.arrow.style.left = "" + transformXOrigin + "px";
        return this.content.style["" + transformKey + "Origin"] = "" + transformXOrigin + "px " + transformYOrigin;
      };

      getXBounds = function(target, anchor, arrow) {
        var targetBounds;
        targetBounds = target.getBoundingClientRect();
        if (document.body.offsetWidth < (targetBounds.left + (anchor.offsetWidth / 2) + (target.offsetWidth / 2))) {
          return document.body.offsetWidth - anchor.offsetWidth;
        } else if ((anchor.offsetWidth / 2 - arrow.offsetWidth) > targetBounds.left) {
          return 0;
        } else {
          return targetBounds.left - (anchor.offsetWidth / 2) + (target.offsetWidth / 2);
        }
      };

      getYBounds = function(target, anchor, arrow) {
        var targetBounds;
        targetBounds = target.getBoundingClientRect();
        if (documentYBoundary(targetBounds, anchor)) {
          return targetBounds.top - (anchor.offsetHeight - window.pageYOffset) + arrow.offsetHeight - target.offsetHeight;
        } else {
          return targetBounds.top + arrow.offsetHeight + target.offsetHeight + window.pageYOffset;
        }
      };

      documentYBoundary = function(target, anchor) {
        if (target.top < anchor.offsetHeight) {
          return;
        }
        return (window.innerHeight - target.top) < anchor.offsetHeight;
      };

      Anchor.prototype.watchWindow = function() {
        var event, _i, _len, _ref1, _results;
        _ref1 = ['resize', 'scroll', 'touchmove'];
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          event = _ref1[_i];
          _results.push(window.addEventListener(event, (function(_this) {
            return function(event) {
              var lastFired, maxWait, now, throttle, timer;
              if (!_this.isOpen()) {
                return;
              }
              now = +(new Date);
              throttle = 16;
              maxWait = throttle * 3;
              if (!timer) {
                if (now - lastFired > maxWait) {
                  _this.setPosition();
                  lastFired = now;
                }
                return timer = setTimeout(function(o) {
                  timer = null;
                  lastFired = +(new Date);
                  return _this.setPosition();
                }, throttle);
              }
            };
          })(this), false));
        }
        return _results;
      };

      Anchor;

      return Anchor;

    })();
  };

  window.Anchor = createContext();

}).call(this);

(function() {
  var Backdrop;

  Backdrop = (function() {
    var backdrop, holds;

    backdrop = null;

    holds = 0;

    function Backdrop() {
      backdrop = document.createElement('div');
      Utils.addClass(backdrop, 'us-backdrop');
      document.body.appendChild(backdrop);
    }

    Backdrop.prototype.element = backdrop;

    Backdrop.prototype.retain = function() {
      if (++holds === 1) {
        Utils.addClass(backdrop, 'us-backdrop--visible');
        return Utils.requestAnimationFrame(function() {
          return Utils.addClass(backdrop, 'us-backdrop--active');
        });
      }
    };

    Backdrop.prototype.release = function() {
      if (--holds === 0) {
        return Utils.requestAnimationFrame(function() {
          Utils.removeClass(backdrop, 'us-backdrop--active');
          return setTimeout(function() {
            return Utils.removeClass(backdrop, 'us-backdrop--visible');
          }, 300);
        });
      }
    };

    window.Backdrop = new Backdrop;

    return Backdrop;

  })();

}).call(this);

(function() {
  var setOptions;

  setOptions = this.Utils.setOptions;

  window.Overlay = (function() {
    var defaults;

    defaults = {
      bodyActiveClass: 'overlay--open',
      visibleClass: 'us-overlay-parent--visible',
      activeClass: 'us-overlay-parent--active',
      overlay: $('.us-overlay-parent'),
      openButton: '.js-open-overlay',
      closeButton: '.js-close-overlay',
      escapeKey: 27,
      historyStatus: '#seedeal',
      history: true,
      resetScroll: true,
      preventDefault: true
    };

    function Overlay(options) {
      this.overlay = (this.options = setOptions(options, defaults)).overlay;
      this.addEventListeners();
    }

    Overlay.prototype.addEventListeners = function() {
      $(this.options.openButton).on('click.open-overlay', (function(_this) {
        return function(e) {
          if (_this.options.preventDefault) {
            e.preventDefault();
          }
          return _this.show(e);
        };
      })(this));
      this.overlay.on('click.close-overlay', (function(_this) {
        return function(e) {
          var target, targets, _i, _len, _results;
          targets = [_this.overlay[0], _this.overlay.find(_this.options.closeButton)[0]];
          if (_this.options.preventDefault) {
            e.preventDefault();
          }
          _results = [];
          for (_i = 0, _len = targets.length; _i < _len; _i++) {
            target = targets[_i];
            if (e.target === target) {
              _this.hide(e);
              break;
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        };
      })(this));
      $(document).on('keyup.close-overlay', (function(_this) {
        return function(e) {
          if (e.keyCode === _this.options.escapeKey) {
            return _this.hide();
          }
        };
      })(this));
      if (this.hasHistory()) {
        return window.onpopstate = (function(_this) {
          return function(event) {
            return _this.hide();
          };
        })(this);
      }
    };

    Overlay.prototype.show = function(e) {
      var body, that, _base;
      body = $(document.body);
      that = this;
      body.addClass(this.options.bodyActiveClass);
      Backdrop.retain();
      Utils.addClass(this.overlay[0], this.options.visibleClass);
      Utils.requestAnimationFrame(function() {
        return Utils.addClass(that.overlay[0], that.options.activeClass);
      });
      if (typeof (_base = this.options).onOpen === "function") {
        _base.onOpen(e);
      }
      if (this.options.resetScroll) {
        this.overlay.find('.us-overlay__container').scrollTop(0);
      }
      if (this.hasHistory()) {
        return history.pushState('open', window.document.title, this.options.historyStatus);
      }
    };

    Overlay.prototype.hide = function(e) {
      var body, that, _base;
      body = $(document.body);
      that = this;
      body.removeClass(this.options.bodyActiveClass);
      Backdrop.release();
      Utils.requestAnimationFrame(function() {
        Utils.removeClass(that.overlay[0], that.options.activeClass);
        return setTimeout(function() {
          return Utils.removeClass(that.overlay[0], that.options.visibleClass);
        }, 300);
      });
      if (typeof (_base = this.options).onClose === "function") {
        _base.onClose(e);
      }
      if (this.hasHistory()) {
        if (history.state === 'open') {
          return history.back();
        }
      }
    };

    Overlay.prototype.hasHistory = function() {
      if (this.options.history && uSwitch.hasHistory) {
        return true;
      } else {
        return false;
      }
    };

    return Overlay;

  })();

}).call(this);

(function() {
  var createContext, setOptions;

  setOptions = this.Utils.setOptions;

  createContext = function(options) {
    var Tabs;
    return Tabs = (function() {
      var getSelector, scrollToTab;

      Tabs.prototype.defaults = {
        tabContainer: ".us-tabs",
        tabLinks: ".us-tabs-nav-mainlink",
        tabTitle: "us-tab-title",
        changeUrls: true,
        activeClass: "active"
      };

      function Tabs(options) {
        var _ref;
        _ref = this.options = setOptions(options, this.defaults), this.tabContainer = _ref.tabContainer, this.tabLinks = _ref.tabLinks;
        this.tabs = $(this.tabContainer);
        this.tab = this.tabs.find(this.tabLinks);
        this.filter = this.tab.data("target") ? "data-target" : "href";
        this.hash = window.location.hash;
        this.init();
        $(this.tabLinks).on("click.ustyle.tab", (function(_this) {
          return function(e) {
            var target;
            target = $(e.currentTarget);
            _this.navigateTo(target);
            _this.hashChange(target);
            return e.preventDefault();
          };
        })(this));
      }

      Tabs.prototype.init = function() {
        var $first, $initialHash;
        $first = this.tab.hasClass(this.options.activeClass) ? this.tab.filter("." + this.options.activeClass) : this.tab.first();
        $initialHash = this.tab.filter("[" + this.filter + "='" + (this.hash.replace("!", "")) + "']");
        if ($initialHash.length) {
          return this.navigateTo($initialHash);
        } else {
          return this.navigateTo($first);
        }
      };

      Tabs.prototype.hashChange = function(selector) {
        if (!this.options.changeUrls) {
          return;
        }
        return location.replace("#!" + (getSelector(selector).replace(/#/, "")));
      };

      Tabs.prototype.navigateTo = function(activeSelector) {
        var $selected, selector;
        selector = getSelector(activeSelector);
        $selected = $(selector);
        this.tab.removeClass(this.options.activeClass).end();
        this.tab.filter("[" + this.filter + "='" + selector + "']").addClass(this.options.activeClass);
        $selected.siblings("." + this.options.activeClass).removeClass(this.options.activeClass).end().addClass(this.options.activeClass);
        if (activeSelector.parent().hasClass(this.options.tabTitle)) {
          scrollToTab($selected);
        }
        return $selected.trigger("ustyle.tab.active");
      };

      getSelector = function(clicked) {
        return clicked.data("target") || clicked.attr("href");
      };

      scrollToTab = function(activeTab) {
        return $("html,body").scrollTop(activeTab.offset().top);
      };

      Tabs;

      return Tabs;

    })();
  };

  window.Tabs = createContext();

}).call(this);
