Drone JS
========

JavaScript framework for a kind of MVC, for now we call it VCI
--------------------------------------------------------------

### Why VCI?

Whe have Views, Controllers and Initializers (for now)

### How it works?

We still working on it :)

### When it will be good for general use?

We hope soon

### Why drone?

It is the Zerg worker in Starcraft world.

![Drone from Starcraft](http://images.wikia.com/starcraft/images/b/b4/Drone_SC2_Rend1.jpg)

Documentation
-------------

### Views

#### Dynamically create method to bind html events

    var MyView = Drone.View({
      events: {
        "input.button": {"click": "bindCheckbox"}
      }
    });

would generate in the instance something as shown below:

    bindCheckbox: function (handler) {
      $("input.button").bind("click", handler);
    }

### Controllers

#### Dynamically bind handlers to views when instanciate a controller

    var MyController = Drone.Controller({
      eventHandlers: ["bind"],

      bindHandler: function () {}
    });

It the example above, when inicialize, the Drone will call a `bind` method in the default view passing `bindHandler` as the handler of the event. Below you can see an example with custom views.

    var MyController = Drone.Controller({
      eventHandlers: {
        view: ["bind"],
        otherView: ["otherBind"]
      },

      bindHandler: function () {},
      otherBindHandler: function () {}
    });
