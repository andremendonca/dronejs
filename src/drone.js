var Drone = {};

Drone.View = Drone.Controller = function (classObject) {
  return function (attributes) {
      var F = function () {};

      for (var key in attributes) {
        if (attributes.hasOwnProperty(key)) {
          classObject[key] = attributes[key];
        }
      }

      F.prototype = classObject;

      var instance = new F();
      if (instance.init) {
        instance.init();
      };

      return instance;
  };
};

Drone.Initializer = function (classObject) {
  $().ready(function () {
    for (var key in classObject) {
      if (classObject.hasOwnProperty(key)) {
        classObject[key]();
      }
    }
  });

  return classObject;
};
