var SharedSpecs = {};
var describedClass = function (klass) {
  var returnObject = {
    shouldBehavesLike: function (sharedSpec) {
      SharedSpecs[sharedSpec](klass);
      return this;
    }
  };

  return returnObject;
};
