/*!
 * Drone MVCI Framework for Javascript
 * https://github.com/andremendonca/dronejs
 *
 * Depends on jQuery
 *
 * Version 0.0.1-alpha
 */

var Drone = {};

Drone.View = Drone.Controller = function (classObject) {
  return function (attributes) {
      var F = function () {};

      var newClassObject = $.extend(true, {
        proxy: function (fn) {
          return function () {
            return fn.apply(instance, arguments);
          };
        }
      }, classObject, attributes);

      F.prototype = newClassObject;

      var instance = new F();

      if (instance.init) {
        instance.init();
      };

      return instance;
  };
};

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
