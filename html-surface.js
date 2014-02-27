var DOMSurface = require('dom-delegator/dom-surface')
var DataSet = require('data-set')

var getListener = require('./get-listener.js')

var HTMLSurface = {
    is: DOMSurface.is,
    defaultTarget: DOMSurface.defaultTarget,
    allEvents: DOMSurface.allEvents,
    addListener: DOMSurface.addListener,
    getParent: DOMSurface.getParent,
    getListener: getListener,
    fetchAttr: fetchAttr
}

module.exports = HTMLSurface

function fetchAttr(target, type) {
    return DataSet(target)[type]
}
