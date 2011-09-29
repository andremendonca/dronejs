describe("Drone", function () {
  describe("Creating the base constructor", function () {
    it("should return the constructor", function () {
      expect(typeof Drone.Base({})).toEqual("function");
    });

    context("executing the constructor", function () {
      it("should create an instance of my base class", function () {
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

      it("should clone deep objects in my class", function () {
        var MyObject = {attr: "base"},
            MyBase = Drone.Base({myObj: MyObject}),
            baseInstance = MyBase();

        MyObject.attr = "new base";

        expect(baseInstance.myObj.attr).toEqual("base");
      });

      it("should execute the init method of my class passing the attributtes", function () {
        var MyClass = mock('init'),
            initSpy = spyOn(MyClass, 'init'),
            MyBase = Drone.Base(MyClass);

        MyBase({foo: "bar"});

        expect(initSpy).toHaveBeenCalledWith({foo: "bar"});
      });

      context("Constructor attributtes", function () {
        context("when dependencies are explicit", function () {
          it("should add attributes to my class", function () {
            var MyClass = {
                  dependencies: ['myAttr']
                },
                MyBase = Drone.Base(MyClass);
                baseInstance = MyBase({myAttr: "myAttr"}),
                baseInstance2 = MyBase({myAttr: "myAttr2"});

            expect(baseInstance.myAttr).toEqual("myAttr");
            expect(baseInstance2.myAttr).toEqual("myAttr2");
          });

          it("should not clone deep objects", function () {
            var MyObject = {attr: "base"},
                MyBase = Drone.Base({
                  dependencies: ['myObj']
                }),
                baseInstance = MyBase({myObj: MyObject});

            MyObject.attr = "new base";

            expect(baseInstance.myObj.attr).toEqual("new base");
          });

          context("when the class is inicialized without a dependence", function () {
            it("should throw an error", function () {
              var MyClass = {
                    dependencies: ['myAttr']
                  },
                  MyBase = function () {
                    Drone.Base(MyClass)();
                  };
                 

              expect(MyBase).toThrow({
                name: "Attribute not found",
                message: "Required attribute 'myAttr' not found"
              });
            });
          });
        });

        context("when dependencies aren't explicit", function () {
          it("should do nothing", function () {
            var MyClass = mock(),
                MyBase = Drone.Base(MyClass);
                baseInstance = MyBase({myAttr: "myAttr"}),
                baseInstance2 = MyBase({myAttr: "myAttr2"});

            expect(baseInstance.myAttr).toBeUndefined();
            expect(baseInstance2.myAttr).toBeUndefined();
          });
        });
      });

      context("Include Drone instance methods", function () {
        context("#proxy", function () {
          it("should include as an instance method", function () {
            var baseInstance = Drone.Base({})();
            expect(baseInstance.proxy).toBeDefined();
          });

          it("should change the 'this' attribute value to instance", function () {
            var myEventHandler = function () { return this; },
                baseInstance = Drone.Base({})();

            expect(baseInstance.proxy(myEventHandler)()).toEqual(baseInstance);
          });
        });
      });
    });
  });
});
