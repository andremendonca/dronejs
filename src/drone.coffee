Drone =
  methods: (classInstance) ->
    proxy: (fn) ->
      ->
        fn.apply(classInstance, arguments)

  helpers:
    views:
      createEventsBinds: (events) ->
        binds = {}
        $.each events, (i, b) ->
          $.each events[i], (j) ->
            binds[events[i][j]] = (handler) ->
              $(i)[j] handler

        binds

    controllers:
      bindEventHandlers: (handlers) ->
        $.each handlers, @proxy (i, handler) ->
          @view[handler] @[handler + "Handler"]

Drone.Base = (classObject) ->
  (attributes) ->
    F = ->
      $.extend( @, Drone.methods @ )

    newClassObject = $.extend true, {}, classObject, attributes
    F.prototype = newClassObject

    instance = new F()
    instance.init() if instance.init
    instance

Drone.View = (classObject) ->
  events = classObject.events or []
  binds = Drone.helpers.views.createEventsBinds events

  $.extend classObject, binds

  delete classObject.events
  Drone.Base classObject

Drone.Controller = (classObject) ->
  handlers = classObject.eventHandlers or []

  customInit = classObject.init
  classObject.init = ->
    Drone.helpers.controllers.bindEventHandlers.call @, handlers

    customInit.call @ if customInit

  delete classObject.eventHandlers
  Drone.Base classObject

Drone.Initializer = (classObject, autoexec) ->
  classObject.exec = ->
    for key in classObject
      key() if key?

  if autoexec is true
    $ -> classObject.exec()

  classObject

window.Drone = Drone
