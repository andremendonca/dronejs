SharedSpecs["if classObject is a function"] = function (describedClass) {
  var DescribedClass = NamespaceFactory(describedClass);

  it("should use the return as classObject", function () {
    var viewInstance = DescribedClass(function () {
          return {
            attr: "myattr"
          };
        })();

    expect(viewInstance.attr).toBeDefined();
  });

  it("should have unique private attr/methods for each instance of a class", function () {
    var view = DescribedClass(function () {
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

  it("should clone deep objects in my class", function () {
    var MyObject = {attr: "view"},
        MyView = DescribedClass(function () { return {myObj: MyObject}}),
        viewInstance = MyView();

    MyObject.attr = "new view";

    expect(viewInstance.myObj.attr).toEqual("view");

    var viewInstance2 = MyView();
    viewInstance2.myObj.attr = "new view";
    expect(viewInstance.myObj.attr).toEqual("view");
  });
};
