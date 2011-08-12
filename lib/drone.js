(function() {
  var Drone;
  Drone = {
    methods: function(classInstance) {
      return {
        proxy: function(fn) {
          return function() {
            return fn.apply(classInstance, arguments);
          };
        }
      };
    },
    helpers: {
      views: {
        createEventsBinds: function(events) {
          var binds;
          binds = {};
          $.each(events, function(i, b) {
            return $.each(events[i], function(j) {
              return binds[events[i][j]] = function(handler) {
                return $(i)[j](handler);
              };
            });
          });
          return binds;
        }
      },
      controllers: {
        bindEventHandlers: function(handlers) {
          return $.each(handlers, this.proxy(function(i, handler) {
            return this.view[handler](this[handler + "Handler"]);
          }));
        }
      }
    }
  };
  Drone.Base = function(classObject) {
    return function(attributes) {
      var F, instance, newClassObject;
      F = function() {
        return $.extend(this, Drone.methods(this));
      };
      newClassObject = $.extend(true, {}, classObject, attributes);
      F.prototype = newClassObject;
      instance = new F();
      if (instance.init) {
        instance.init();
      }
      return instance;
    };
  };
  Drone.View = function(classObject) {
    var binds, events;
    events = classObject.events || [];
    binds = Drone.helpers.views.createEventsBinds(events);
    $.extend(classObject, binds);
    delete classObject.events;
    return Drone.Base(classObject);
  };
  Drone.Controller = function(classObject) {
    var customInit, handlers;
    handlers = classObject.eventHandlers || [];
    customInit = classObject.init;
    classObject.init = function() {
      Drone.helpers.controllers.bindEventHandlers.call(this, handlers);
      if (customInit) {
        return customInit.call(this);
      }
    };
    delete classObject.eventHandlers;
    return Drone.Base(classObject);
  };
  Drone.Initializer = function(classObject, autoexec) {
    classObject.exec = function() {
      var key, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = classObject.length; _i < _len; _i++) {
        key = classObject[_i];
        _results.push(key != null ? key() : void 0);
      }
      return _results;
    };
    if (autoexec === true) {
      $(function() {
        return classObject.exec();
      });
    }
    return classObject;
  };
  window.Drone = Drone;
}).call(this);
