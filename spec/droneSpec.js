describe("Drone", function () {
  describe("Creating the Controller's/View's constructor", function () {
    it("should return the constructor", function () {
      expect(typeof Drone.Base({})).toEqual("function");
    });

    context("executing the constructor", function () {
      it("should create an instance of my class constroller/view", function () {
        var MyBase = Drone.Base({myAttribute: "base"}),
            baseInstance = MyBase();

        expect(baseInstance.myAttribute).toEqual("base");
      });

      it("should create diffenrent instances of my class", function () {
        var MyBase = Drone.Base({myAttribute: "base"}),
            baseInstance = MyBase(),
            baseInstance2 = MyBase();

        baseInstance2.myAttribute = "base2";

        expect(baseInstance.myAttribute).toEqual("base");
        expect(baseInstance2.myAttribute).toEqual("base2");
      });

      it("should execute the init method of my class", function () {
        var MyClass = mock('init'),
            initSpy = spyOn(MyClass, 'init'),
            MyBase = Drone.Base(MyClass);

        MyBase();

        expect(initSpy).toHaveBeenCalled();
      });

      it("should add attributes to my class when passed as params", function () {
        var MyClass = mock(),
            MyBase = Drone.Base(MyClass);
            baseInstance = MyBase({myAttr: "myAttr"}),
            baseInstance2 = MyBase({myAttr: "myAttr2"});

        expect(baseInstance.myAttr).toEqual("myAttr");
        expect(baseInstance2.myAttr).toEqual("myAttr2");
      });

      context("Include Drone methods", function () {
        context("proxy method", function () {
          it("should include as an instance method", function () {
            var baseInstance = Drone.Base({})();
            expect(baseInstance.proxy).toBeDefined();
          });

          it("should change the 'this' attribure value to instance", function () {
            var myEventHandler = function () { return this; },
                baseInstance = Drone.Base({})();

            expect(baseInstance.proxy(myEventHandler)()).toEqual(baseInstance);
          });
        });
      });

      context("View", function () {
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
          });
        });
      });

      context("Controllers", function () {
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
              var view = mock("bind"),
                  spyView = spyOn(view, "bind");

              var contInstance = Drone.Controller({
                eventHandlers: ["bind"],

                bindHandler: function () {}
              })({view: view});

              expect(spyView).toHaveBeenCalledWith(contInstance.bindHandler);
            });
          });

          context("if it has one or more custom views", function () {
            it("should dynamicaly bind event handlers to the views on init", function () {
              var view1 = mock("bind1"),
                  spyView1 = spyOn(view1, "bind1"),
                  view2 = mock("bind2"),
                  spyView2 = spyOn(view2, "bind2");

              var contInstance = Drone.Controller({
                eventHandlers: {
                  view1: ['bind1'],
                  view2: ['bind2']
                },

                bind1Handler: function () {},
                bind2Handler: function () {}
              })({view1: view1, view2: view2});

              expect(spyView1).toHaveBeenCalledWith(contInstance.bind1Handler);
              expect(spyView2).toHaveBeenCalledWith(contInstance.bind2Handler);
            });
          });
          
        });
      });
    });
  });

  describe("When creating initializers", function () {
    it("should return the passed object", function () {
      var myInitializer = Drone.Initializer({test: function () { return "awesome" }});
      expect(myInitializer.test()).toEqual("awesome");
    });

    context("when receive autoexec param as true", function () {
      it("should call all the own methods on document ready", function () {
        var myClass = mock('myMethod', 'moreMethod'),
            spyMyMethod = spyOn(myClass, "myMethod"),
            spyMoreMethod = spyOn(myClass, "moreMethod"),
            myInitializer = Drone.Initializer(myClass, true);

        expect(spyMyMethod).toHaveBeenCalled();
        expect(spyMoreMethod).toHaveBeenCalled();
      });
    });

    context("when autoexec param is not received", function () {
      it("should not call all the own methods on document ready", function () {
        var myClass = mock('myMethod', 'moreMethod'),
            spyMyMethod = spyOn(myClass, "myMethod"),
            spyMoreMethod = spyOn(myClass, "moreMethod"),
            myInitializer = Drone.Initializer(myClass);

        expect(spyMyMethod).not.toHaveBeenCalled();
        expect(spyMoreMethod).not.toHaveBeenCalled();
      });
    });

    it("should insert the exec method of given classes", function () {
      var myClass = mock(),
          myInitializer = Drone.Initializer(myClass);

      expect(myInitializer.exec).toBeDefined();
    });

    context("exec method", function () {
      it("should execute the received classes without calling itself", function () {
        var myClass = mock("myMethod"),
            spyMyMethod = spyOn(myClass, "myMethod"),
            myInitializer = Drone.Initializer(myClass);

        myInitializer.exec();
        expect(spyMyMethod).toHaveBeenCalled();
      });
    });
  });
});
