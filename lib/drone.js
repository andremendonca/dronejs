/*!
 * Drone MVCI Framework for Javascript
 * https://github.com/andremendonca/dronejs
 *
 * Depends on jQuery
 *
 * Version 0.3.0.alpha
 */

var Drone = {
  methods: function (classInstance) {
    return {
      proxy: function (fn, forceValue) {
        return function () {
          return fn.apply(forceValue || classInstance, arguments);
        };
      }
    };
  },

  helpers: {
    base: {
      hasAttribute: function (attributes, key) {
        return (
          attributes === undefined ||
          attributes[key] === undefined
        );
      },
      getRequiredAttributes: function (dependencies, attributes) {
        var self = this,
            requiredAttributes = {};

        if (dependencies) {
          $.each(dependencies, function (i, dependency) {
            if (self.hasAttribute(attributes, dependency)) {
              throw new Error("Drone Error: Required attribute '" + dependency + "' not found");
            }

            requiredAttributes[dependency] = attributes[dependency];
          });
        }

        return requiredAttributes;
      }
    },
    views: {
      createEventsBinds: function (events) {
        var binds = {};

        $.each(events, function (i, b) {
          $.each(events[i], function(j) {
            binds[events[i][j]] = function (handler) {
              $(i)[j](handler);
            };
          });
        });

        return binds;
      }
    },
    controllers: (function () {
      var hasCustomViews, callBindEventMethods;
      hasCustomViews = function (handlers) {
        return !(handlers instanceof Array);
      };

      callBindEventMethods = function (view, handler) {
        this[view][handler](this.proxy(this[handler + "Handler"]));
      };

      return {
        bindEventHandlers: function(items){
          var self = this;
          $.each(items, function (key, item) {
            if (!hasCustomViews(items)) {
              callBindEventMethods.apply(self, ['view', item]);
            } else {
              $.each(item, function (i, handler) {
                callBindEventMethods.apply(self, [key, handler]);
              });
            }
          });
        }
      };
    }())
  }
};

(function (D, $) {
  var base = function (classObject, attributes) {
      var F, requiredAttributes, classObjectClone, instance;
      F = function () {
        $.extend(this, D.methods(this));
      };

      requiredAttributes = D.helpers.base.getRequiredAttributes(classObject.dependencies, attributes);

      classObjectClone = $.extend(true, {}, classObject);

      F.prototype = $.extend({}, classObjectClone, requiredAttributes);

      instance = new F();

      if (instance.init) instance.init(attributes);

      return instance;
  };

  D.Base = D.Model = function (classObject) {
    return function (attributes) {
      return base(classObject, attributes);
    };
  };

  D.View = function (classObject) {
    return function (attributes) {
      var events = classObject.events || [],
          binds = D.helpers.views.createEventsBinds(events);

      $.extend(classObject, binds);

      delete classObject.events;
      return base(classObject, attributes);
    };
  };

  D.Controller = function (classObject) {
    return function (attributes) {
      var handlers = classObject.eventHandlers || [],
          customInit = classObject.init;

      classObject.init = function (attributes) {
        D.helpers.controllers.bindEventHandlers.call(this, handlers);

        if (customInit) customInit.call(this, attributes);
      };

      delete classObject.eventHandlers;
      return base(classObject, attributes);
    };
  };

  D.Initializer = function (classObject, autoexec) {
    classObject.exec = function () {
      for (var key in classObject) {
        if (classObject.hasOwnProperty(key) && key != "exec" && $.isFunction( classObject[key] )) {
          classObject[key]();
        }
      }
    };

    if (autoexec === true) {
      $().ready(function () {
        classObject.exec();
      });
    }

    return classObject;
  };
}(Drone, jQuery));
