var mock = function() {
  var methods_mock = {};
  $(arguments).each(function (index, method) {
    methods_mock[method] = function () {};
  });

  return methods_mock;
}

function eventSource(mock, methodName) {
  var sinonSpy = sinon.spy(mock, methodName);

  return {
    trigger: function(event) {
      var callback = sinonSpy.getCall(0).args[0];
      callback.scope(event)();
    }
  }
}

function resolved(value) {
  var deferred = $.Deferred();
  deferred.resolve(value);
  return deferred.promise();
}

function context (description, specs) {
  describe(description, specs);
}

