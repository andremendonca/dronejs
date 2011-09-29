describe("Drone.View", function () {

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
