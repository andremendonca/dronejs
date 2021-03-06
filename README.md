Drone JS
========

Lightweight JavaScript framework for a kind of MVC, but we call it MVCI
--------------------------------------------------------------

### Why MVCI?

Whe have Models, Views, Controllers and Initializers.

### How it works?

We still working on it :)

### When it will be good for general use?

We hope soon

### Why drone?

It is the Zerg worker in Starcraft world.

![Drone from Starcraft](http://images.wikia.com/starcraft/images/b/b4/Drone_SC2_Rend1.jpg)

Documentation
-------------
### Getting started
Before start using this framework, we recommend to read the concepts presented in the article below. It talks about an archtecture pattern to use with MVC or MVP (Model/View/Presenter).

[Article -> Passive view](http://martinfowler.com/eaaDev/PassiveScreen.html)

In other words, a good usage of this archtecture is to make the View methods as small as you can, with little or no logic. Put that logic in the Controller and leave the DOM interaction JUST to the View.

#### Models
Creating a Model

```javascript
var MyModelClass = Drone.Model({
  bar: function () {
    return 'foo';
  }
});
```

Instanciating the Model

```javascript
var myModelInstance = MyModelClass();
myModelInstance.bar(); //will return 'foo'
```

#### Views
Creating a View

```javascript
var MyViewClass = Drone.View({
  foo: function () {
    return 'bar';
  }
});
```

Instanciating the View

```javascript
var myViewInstance = MyViewClass();
myViewInstance.foo(); //will return 'bar'
```

#### Controllers
Creating a Controller

```javascript
var MyControllerClass = Drone.Controller({
  foo: function () {
    return 'bar';
  }
});
```

Instanciating the Controller

```javascript
var myControllerInstance = MyControllerClass();
myControllerInstance.foo(); //will return 'bar'
```

Automatically pass a View and a Model to the Controller

```javascript
var MyControllerClass = Drone.Controller({
  dependencies: ["view", "model"]
});

var controller = MyControllerClass({view: myViewInstance, model: myModelInstance});
controller.view.foo(); //will execute some view method
controller.model.bar(); //will execute some model method
```

* * *

### Base Class
This is a generic class that all Drone `views` and `controllers` (for now) inherit, so, every feature here will be present in both. Though, we recommend to use just View and Controller classes, it's also possible to use this class alone.

#### Constructor
Well, all Base class can have a `init` method as a constructor. When you instanciate your class it will be called.

```javascript
var MyBase = Drone.Base({
  init: function () {
    alert('this is my constructor');
  }
});

MyBase(); //alert 'this is my constructor'
```

It's possible to pass attributtes to the constructor, but it need to be a literal object.

```javascript
var MyBase = Drone.Base({
  init: function (attributes) {
    alert(attributes.message);
  }
});

MyBase({message: "this is my attribute"}); //alert 'this is my attribute'
```

#### proxy
Proxy is a method to support the work with closures or things like jquery events. These cases are normaly when, in javascript, the `this` value is lost, so it's possible to use the proxy method to force the value of `this` to be the current instance of a function.

```javascript
var MyBase = Drone.Base({
  foo: "bar"
  useProxy: function () {
    var closure = this.proxy(function () {
      return this.foo;
    });

    return closure();
  }
});

var instance = MyBase();
instance.useProxy(); //will return 'bar'
```

#### dependencies
Dependencies is an array of attribute names. The specified attributes MUST be passed through the constructor, and will automatically became an attribute of the instance.

```javascript
var MyBase = Drone.Base({
  dependencies: ["foo"]
  getDependency: function () {
    return this.foo;
  }
});

var instance = MyBase({foo: "bar"});
instance.getDependency(); //will return 'bar'
```

* * *

### Models
Whereas that we finally have a Model, we still are working on it indeed. Although it's just an alias for the `Base class`.

* * *

### Views

#### Dynamically create method to bind html events

```javascript
var MyView = Drone.View({
  events: {
    "input.button": {"click": "bindCheckbox"}
  }
});
```

would generate in the instance something as shown below:

```javascript
bindCheckbox: function (handler) {
  $("input.button").bind("click", handler);
}
```

* * *

### Controllers

#### Dynamically bind handlers to views when instanciate a controller

```javascript
var MyController = Drone.Controller({
  eventHandlers: ["bind"],

  bindHandler: function () {}
});
```

It the example above, when inicialize, the Drone will call a `bind` method in the default view passing `bindHandler` as the handler of the event. Below you can see an example with custom views.

```javascript
    var MyController = Drone.Controller({
      eventHandlers: {
        view: ["bind"],
        otherView: ["otherBind"]
      },

      bindHandler: function () {},
      otherBindHandler: function () {}
    });
```

* * *

### Initializers

I need to put some documentation here.
