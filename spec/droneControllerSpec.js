describe("Drone.Controller", function () {
  context("if classObject is a function", function () {
    it("should use the return as classObject", function () {
      var contInstance = Drone.Controller(function () {
            return {
              attr: "myattr"
            };
          })();

      expect(contInstance.attr).toBeDefined();
    });

    it("should have unique private attr/methods for each instance of a class", function () {
      var cont = Drone.Controller(function () {
            var attr = "initial";
            return {
              setAttr: function (value) { attr = value; },
              getAttr: function () { return attr; }
            };
          }),
          contInstance1 = cont(),
          contInstance2 = cont();

      contInstance1.setAttr("modified");

      expect(contInstance1.getAttr()).toEqual("modified");
      expect(contInstance2.getAttr()).toEqual("initial");
    });

    it("should clone deep objects in my class", function () {
      var MyObject = {attr: "view"},
          MyView = Drone.View(function () { return {myObj: MyObject}}),
          viewInstance = MyView();

      MyObject.attr = "new view";

      expect(viewInstance.myObj.attr).toEqual("view");

      var viewInstance2 = MyView();
      viewInstance2.myObj.attr = "new view";
      expect(viewInstance.myObj.attr).toEqual("view");
    });
  });

  it("should call custom init passing the attributes when instanciate a controller", function () {
    var teste = mock('init'),
        spyTeste = spyOn(teste, 'init'),
        contInstance = Drone.Controller({
          init: teste.init
        })({foo: "bar"});

    expect(spyTeste).toHaveBeenCalledWith({foo: "bar"});
  });

  context("dynamic bind event handlers", function () {
    context("if it doesn't have custom views", function () {
      it("should dynamicaly bind event handlers to the view on init", function () {
        var hadRecievedHandler = false,
            view = {
              bind: function (handler) {
                hadRecievedHandler = (handler) ? true : false;
              }
            };

        var contInstance = Drone.Controller({
          dependencies: ["view"],
          eventHandlers: ["bind"],

          bindHandler: function () {}
        })({view: view});

        expect(hadRecievedHandler).toBeTruthy();
      });

      it("should maintaing the 'this' value from the handler as my controller instance", function () {
        var view = {
          bind: function (handler) {
            $(view).bind('test_event', handler);
          }
        };

        var handlerInstance;
        var contInstance = Drone.Controller({
          dependencies: ["view"],
          eventHandlers: ["bind"],

          bindHandler: function () { handlerInstance = this; }
        })({view: view});

        $(view).trigger('test_event');
        expect(handlerInstance).toEqual(contInstance);
      });
    });

    context("if it has one or more custom views", function () {
      it("should dynamicaly bind event handlers to the views on init", function () {
        var hadRecievedHandler1 = false,
            view1 = {
              bind1: function (handler) {
                hadRecievedHandler1 = (handler) ? true : false;
              }
            };

        var hadRecievedHandler2 = false,
            view2 = {
              bind2: function (handler) {
                hadRecievedHandler2 = (handler) ? true : false;
              }
            };

        var contInstance = Drone.Controller({
          dependencies: ["view1", "view2"],
          eventHandlers: {
            view1: ['bind1'],
            view2: ['bind2']
          },

          bind1Handler: function () {},
          bind2Handler: function () {}
        })({view1: view1, view2: view2});

        expect(hadRecievedHandler1).toBeTruthy();
        expect(hadRecievedHandler2).toBeTruthy();
      });

      it("should maintaing the 'this' value from the handler as my controller instance", function () {
        var view1 = {
          bind1: function (handler) {
            $(view1).bind('test_event', handler);
          }
        };

        var view2 = {
          bind2: function (handler) {
            $(view2).bind('test_event', handler);
          }
        };

        var handlerInstance1, handlerInstance2;
        var contInstance = Drone.Controller({
          dependencies: ["view1", "view2"],
          eventHandlers: {
            view1: ['bind1'],
            view2: ['bind2']
          },

          bind1Handler: function () { handlerInstance1 = this; },
          bind2Handler: function () { handlerInstance2 = this; }
        })({view1: view1, view2: view2});

        $(view1).trigger('test_event');
        $(view2).trigger('test_event');
        expect(handlerInstance1).toEqual(contInstance);
        expect(handlerInstance2).toEqual(contInstance);
      });
    });
  });
});
