describe("Drone.Controller", function () {
        it("should call custom init when instanciate a controller", function () {
          var teste = mock('init');
              spyTeste = spyOn(teste, 'init'),
              contInstance = Drone.Controller({
                init: teste.init
              })();

          expect(spyTeste).toHaveBeenCalled();
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
                eventHandlers: ["bind"],

                bindHandler: function () {}
              })({view: view});

              expect(hadRecievedHandler).toBeTruthy();
            });

            it("should maintaing the this value from the handler as my controller instance", function () {
              var view = {
                bind: function (handler) {
                  $(view).bind('test_event', handler);
                }
              };

              var handlerInstance;
              var contInstance = Drone.Controller({
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

            it("should maintaing the this value from the handler as my controller instance", function () {
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
