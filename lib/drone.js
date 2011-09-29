/*!
 * Drone MVCI Framework for Javascript
 * https://github.com/andremendonca/dronejs
 *
 * Depends on jQuery
 *
 * Version 0.1.0-alpha
 */

var Drone = {
  methods: function (classInstance) {
    return {
      proxy: function (fn) {
        return function () {
          return fn.apply(classInstance, arguments);
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
              throw {
                name: "Attribute not found",
                message: "Required attribute '" + dependency + "' not found"
              };
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
      var hasCustomViews = function (handlers) {
        return !(handlers instanceof Array);
      };

      var callBindEventMethods = function (view, handler) {
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

Drone.Base = function (classObject) {
  classObject = $.extend(true, {}, classObject)
  return function (attributes) {
      var F = function () {
        $.extend(this, Drone.methods(this));
      };

      var requiredAttributes = Drone.helpers.base.getRequiredAttributes(classObject.dependencies, attributes);

      var newClassObject = $.extend({}, classObject, requiredAttributes);

      F.prototype = newClassObject;

      var instance = new F();

      if (instance.init) {
        instance.init();
      };

      return instance;
  };
};

Drone.View = function (classObject) {
  var events = classObject.events || [];
  var binds = Drone.helpers.views.createEventsBinds(events);

  $.extend(classObject, binds);

  delete classObject.events;
  return Drone.Base(classObject);
};

Drone.Controller = function (classObject) {
  var handlers = classObject.eventHandlers || [];

  var customInit = classObject.init;
  classObject.init = function () {
    Drone.helpers.controllers.bindEventHandlers.call(this, handlers);

    if (customInit) {
      customInit.call(this);
    }
  };

  delete classObject.eventHandlers;
  return Drone.Base(classObject);
}

Drone.Initializer = function (classObject, autoexec) {
  classObject.exec = function () {
    for (var key in classObject) {
      if (classObject.hasOwnProperty(key) && key != "exec") {
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
