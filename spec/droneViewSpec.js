describe("Drone.View", function () {
  describedClass("Drone.View")
    .shouldBehavesLike("base");

  context("dynamic events bind methods", function () {
    it("should create", function () {
      var viewInstance = Drone.View({
        events: {
          "input": {"click": "bindCheckbox"}
        }
      })();

      expect(viewInstance.bindCheckbox).toBeDefined();
    });

    describe("when el attribute is present", function () {
      it("should bind my handler to the selector based on el", function () {
        var myElement = $('<ol><li class="first"><a src="javascript:void(0)">Link</a></li><li><a src="javascript:void(0)">Link</a></li></ol>');
        $('body').append(myElement);

        a = myElement
        var li1 = myElement.find("li:first");
        var li2 = myElement.find("li:last");

        ViewClass = Drone.View({
          events: {
            "a": {"click": "bindClick"}
          }
        });

        var viewInstance1 = ViewClass({el: li1});
        var viewInstance2 = ViewClass({el: li2, oi: ""});

        var handlerMock1 = mock("handler"),
            handlerMock2 = mock("handler"),
            handlerSpy1 = spyOn(handlerMock1, 'handler'),
            handlerSpy2 = spyOn(handlerMock2, 'handler');

        viewInstance1.bindClick(handlerMock1.handler);
        viewInstance2.bindClick(handlerMock2.handler);

        li1.find("a").trigger('click');

        expect(handlerSpy1).toHaveBeenCalled();
        expect(handlerSpy2).not.toHaveBeenCalled();
        myElement.remove();
      });
    });

    describe("when el attribute isn't present", function () {
      it("should bind my handler to the selector based on el", function () {
        var myElement = $('<a id="add_product" src="javascript:void(0)">Add Product</a>');
        $('body').append(myElement);

        var viewInstance = Drone.View({
          events: {
            "#add_product": {"click": "bindClick"}
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
});
