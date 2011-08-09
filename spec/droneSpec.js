describe("Drone", function () {
  describe("Creating the Controller's/View's constructor", function () {
    it("should return the constructor", function () {
      expect(typeof Drone.View({})).toEqual("function");
    });

    context("executing the constructor", function () {
      it("should create an instance of my class constroller/view", function () {
        var MyView = Drone.View({myAttribute: "view"}),
            viewInstance = MyView();

        expect(viewInstance.myAttribute).toEqual("view");
      });

      it("should create diffenrent instances of my class", function () {
        var MyView = Drone.View({myAttribute: "view"}),
            viewInstance = MyView(),
            viewInstance2 = MyView();

        viewInstance2.myAttribute = "view2";

        expect(viewInstance.myAttribute).toEqual("view");
        expect(viewInstance2.myAttribute).toEqual("view2");
      });

      it("should execute the init method of my class", function () {
        var MyClass = mock('init'),
            initSpy = spyOn(MyClass, 'init'),
            MyView = Drone.View(MyClass);

        MyView();

        expect(initSpy).toHaveBeenCalled();
      });

      it("should add attributes to my class when passed as params", function () {
        var MyClass = mock(),
            MyView = Drone.View(MyClass);
            viewInstance = MyView({myAttr: "myAttr"});
        expect(viewInstance.myAttr).toEqual("myAttr");
      });
    });
  });

  describe("When creating initializers", function () {
    it("should return the passed object", function () {
      var myInitializer = Drone.Initializer({test: function () { return "awesome" }});
      expect(myInitializer.test()).toEqual("awesome");
    });

    it("should call all the own methods on document ready", function () {
      var myClass = mock('myMethod', 'moreMethod'),
          spyMyMethod = spyOn(myClass, "myMethod"),
          spyMoreMethod = spyOn(myClass, "moreMethod"),
          myInitializer = Drone.Initializer(myClass);

      expect(spyMyMethod).toHaveBeenCalled();
      expect(spyMoreMethod).toHaveBeenCalled();
    });
  });
});
