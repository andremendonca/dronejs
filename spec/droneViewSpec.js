describe("Drone.View", function () {
  context("if classObject is a function", function () {
    it("should use the return as classObject", function () {
      var viewInstance = Drone.View(function () {
            return {
              attr: "myattr"
            };
          })();

      expect(viewInstance.attr).toBeDefined();
    });

    it("should have unique private attr/methods for each instance of a class", function () {
      var view = Drone.View(function () {
            var attr = "initial";
            return {
              setAttr: function (value) { attr = value; },
              getAttr: function () { return attr; }
            };
          }),
          viewInstance1 = view(),
          viewInstance2 = view();

      viewInstance1.setAttr("modified");

      expect(viewInstance1.getAttr()).toEqual("modified");
      expect(viewInstance2.getAttr()).toEqual("initial");
    });
  });

  context("dynamic events bind methods", function () {
    it("should create", function () {
      var viewInstance = Drone.View({
        events: {
          "input": {"click": "bindCheckbox"}
        }
      })();

      expect(viewInstance.bindCheckbox).toBeDefined();
    });

    it("should bind my handler to the selector", function () {
      var myElement = $('<div id="el">');
      $('body').append(myElement);

      var viewInstance = Drone.View({
        events: {
          "#el": {"click": "bindClick"}
        }
      })();

      var handlerMock = mock("handler"),
          handlerSpy = spyOn(handlerMock, 'handler');
      viewInstance.bindClick(handlerMock.handler);

      myElement.trigger('click');

      expect(handlerSpy).toHaveBeenCalled();
      myElement.remove();
    });
  });
});
