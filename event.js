var DELIMINATOR = require("./constants/deliminator.js")
var ID_SEPERATOR = require("./constants/id-seperator.js")
var SINK_MAP = require("./constants/sink-map.js")

module.exports = event

function event(sink, data) {
    var id = sink.id, key = sink.key

    var sinks = SINK_MAP[id]
    if (!sinks) {
        sinks = SINK_MAP[id] = {}
    }

    sinks[key] = sink
    sink.dispatch = dispatch

    return key + ID_SEPERATOR + id + DELIMINATOR +
        JSON.stringify(data)
}

function dispatch(listener, ev) {
    var sink = listener.sink

    sink.write({
        value: listener.data,
        ev: null
    })
}
