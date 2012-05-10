/*!
 * Drone MVCI Framework for Javascript
 * https://github.com/andremendonca/dronejs
 *
 * Depends on jQuery
 *
 * Version 1.1.0
 */

var Drone = {};
(function (D, $) {
  "use strict";
  var internal = {
    base: function (classObject, attributes) {
      var Drone, requiredAttributes, instance;
      Drone = function () {
        $.extend(this, internal.methods(this));
      };

      requiredAttributes = internal.helpers.base.getRequiredAttributes(classObject.dependencies, attributes);

      Drone.prototype = $.extend(classObject, requiredAttributes);

      instance = new Drone();
      if (instance.init) instance.init(attributes);
      return instance;
    },
    retrieveClassObject: function (classObject) {
      classObject = (typeof classObject === "function") ? classObject() : classObject;
      return $.extend(true, {}, classObject);
    },

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
          bindEventHandlers: function(items) {
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

  D.Base = D.Model = function (classObject) {
    return function (attributes) {
      var instanceObject = internal.retrieveClassObject(classObject);
      return internal.base(instanceObject, attributes);
    };
  };

  D.View = function (classObject) {
    return function (attributes) {
      var instanceObject = internal.retrieveClassObject(classObject),
          events = instanceObject.events || [],
          binds = internal.helpers.views.createEventsBinds(events);

      $.extend(instanceObject, binds);

      delete instanceObject.events;
      return internal.base(instanceObject, attributes);
    };
  };

  D.Controller = function (classObject) {
    return function (attributes) {
      var instanceObject = internal.retrieveClassObject(classObject);

      var handlers = instanceObject.eventHandlers || [],
          customInit = instanceObject.init;

      instanceObject.init = function (attributes) {
        internal.helpers.controllers.bindEventHandlers.call(this, handlers);

        if (customInit) customInit.call(this, attributes);
      };

      delete instanceObject.eventHandlers;
      return internal.base(instanceObject, attributes);
    };
  };

  D.Initializer = function (classObject, autoexec) {
    classObject.exec = function () {
      for (var key in classObject) {
        if (classObject.hasOwnProperty(key) && key !== "exec" && $.isFunction( classObject[key] )) {
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
