var getField = require("dom-delegator/symbol/get-field")

var DELIMINATOR = require("./constants/deliminator.js")
var ID_SEPERATOR = require("./constants/id-seperator.js")
var SINK_MAP = require("./constants/sink-map.js")


module.exports = getListener

function getListener(surface, id, target, type) {
    if (target === null) {
        return null
    }

    var events = getField(target, id)
    var tuple = events && events[type]

    // try parsing from data- attributes
    if (!tuple) {
        var value = surface.fetchAttr(target, type)
        tuple = unpackAttrValue(id, value)
    }

    if (!tuple) {
        return getListener(surface, id,
            surface.getParent(target), type)
    }

    return {
        currentTarget: target,
        data: tuple[0],
        sink: tuple[1]
    }
}

function unpackAttrValue(delId, value) {
    if (!value) {
        return null
    }

    var parts = value.split(DELIMINATOR)
    var head = parts[0]
    var headParts = head.split(ID_SEPERATOR)
    var key = headParts[0]
    var id = headParts[1]

    if (delId !== id) {
        return null
    }

    var sinks = SINK_MAP[id]
    if (!sinks) {
        return null
    }

    var sink = sinks[key]

    if (!sink) {
        return null
    }

    var rest = parts.slice(1).join(DELIMINATOR)
    var data = parseOrUndefined(rest)

    return [data, sink]
}

function parseOrUndefined(data) {
    var json
    try {
        json = JSON.parse(data)
    } catch (err) {
        json = undefined
    }

    return json
}
