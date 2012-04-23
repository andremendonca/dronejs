describe("Drone.Model", function () {
  it("should be an alias to Drone.Base", function () {
    var modelMock = {attr: "drone"};
    spyOn(Drone, "Base").andReturn("drone base");

    var modelInstance = Drone.Model(modelMock);
    expect(modelInstance).toEqual("drone base");
    expect(Drone.Base).toHaveBeenCalledWith(modelMock);
  });
});
