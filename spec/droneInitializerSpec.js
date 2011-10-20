describe("Drone.Initializer", function () {
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

      it("should call all methods but not try to execute attributes", function () {
        var myInitializer = Drone.Initializer({attr: ""});
      
        expect(function () {
          myInitializer.exec();
        }).not.toThrow("Property 'attr' of object #<Object> is not a function");
      });
    });
  });
});
