var test = require("tape")
var h = require("hyperscript")
var DOMEvent = require("synthetic-dom-events")
var setImmediate = require("timers").setImmediate
var document = require("global/document")
var EventSinks = require("event-sinks/geval")

var Delegator = require("../index.js")
var event = require("../event.js")

function createEvent(type, attrs) {
    attrs = attrs || {}
    attrs.bubbles = true

    return DOMEvent(type, attrs)
}

test("can listen to events through data-", function (assert) {
    var d = Delegator()
    var events = EventSinks(d.id, ["foo"])
    var sinks = events.sinks
    var tuples = []

    var elem = h("div", {
        "data-click": event(sinks.foo, { bar: "baz" })
    })
    document.body.appendChild(elem)

    events.foo(function (tuple) {
        tuples.push(tuple)
    })

    var ev = createEvent("click")
    elem.dispatchEvent(ev)

    setImmediate(function () {
        assert.equal(tuples.length, 1)
        assert.equal(tuples[0].value.bar, "baz")

        document.body.removeChild(elem)
        assert.end()
    })
})

test("can write different data on sink", function (assert) {
    var d = Delegator()
    var events = EventSinks(d.id, ["foo"])
    var sinks = events.sinks
    var tuples = []

    var elem = h(".foo", [
        h(".bar", {
            "data-click": event(sinks.foo, { type: "bar" })
        }),
        h(".baz", {
            "data-click": event(sinks.foo, { type: "baz" })
        })
    ])
    document.body.appendChild(elem)

    events.foo(function (tuple) {
        tuples.push(tuple)
    })

    var ev = createEvent("click")
    elem.querySelector(".bar").dispatchEvent(ev)

    var ev2 = createEvent("click")
    elem.querySelector(".baz").dispatchEvent(ev2)

    setImmediate(function () {
        assert.equal(tuples.length, 2)
        assert.equal(tuples[0].value.type, "bar")
        assert.equal(tuples[1].value.type, "baz")

        document.body.removeChild(elem)
        assert.end()
    })
})

test("can register multiple sinks", function (assert) {
    var d = Delegator()
    var events = EventSinks(d.id, ["bar", "baz"])
    var sinks = events.sinks
    var hash = {}

    var elem = h(".foo", [
        h(".bar", {
            "data-click": event(sinks.bar, { type: "baz" })
        }),
        h(".baz", {
            "data-click": event(sinks.baz, { type: "bar" })
        })
    ])
    document.body.appendChild(elem)

    events.bar(function (tuple) {
        hash.bar = tuple
    })

    events.baz(function (tuple) {
        hash.baz = tuple
    })

    var ev = createEvent("click")
    elem.querySelector(".bar").dispatchEvent(ev)

    var ev2 = createEvent("click")
    elem.querySelector(".baz").dispatchEvent(ev2)

    setImmediate(function () {
        assert.ok("bar" in hash)
        assert.ok("baz" in hash)
        assert.equal(hash.bar.value.type, "baz")
        assert.equal(hash.baz.value.type, "bar")

        document.body.removeChild(elem)
        assert.end()
    })
})
