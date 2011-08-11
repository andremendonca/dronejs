/*!
 * Drone MVCI Framework for Javascript
 * https://github.com/andremendonca/dronejs
 *
 * Depends on jQuery
 *
 * Version 0.0.2-alpha
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
    controllers: {
      bindEventHandlers: function(handlers){
        $.each(handlers, this.proxy(function (i, handler) {
          this.view[handler](this[handler + "Handler"]);
        }));
      }, 
    }
  }
};

Drone.Base = function (classObject) {
  return function (attributes) {
      var F = function () {
        $.extend(this, Drone.methods(this));
      };

      var newClassObject = $.extend(true, {}, classObject, attributes);

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

  classObject.init = function () {
    Drone.helpers.controllers.bindEventHandlers.call(this, handlers);
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
