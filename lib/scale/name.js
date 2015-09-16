'use strict'

var pitchSet = require('../set/pitchSet')
var interval = require('../pitch/interval')
var invert = require('../interval/invert')
var data = require('./scales.json')
var keys = null

/**
 * Given a pitch set return the scale name (if any)
 *
 * @param {Array|String} scale - the scale notes
 * ®return {String} the scale name or null if not found
 *
 * @example
 * name('C D E F G A B')
 */
function name (set) {
  keys = keys || Object.keys(data)
  if (!set) return keys

  set = pitchSet(set)
  var tonic = set[0]
  // TODO: find a better solution
  var intervals = set.map(function (pitch) { return interval(tonic, pitch) })
    .map(function (interval) {
      return /-/.test(interval) ? invert(interval, true) : interval
    })
  var name = findByValue(keys, data, intervals.join(' '))
  return name ? tonic + ' ' + name : null
}

function findByValue (keys, hash, value) {
  var key
  for (var i = 0, len = keys.length; i < len; i++) {
    key = keys[i]
    if (hash[key] === value) return key
  }
  return null
}

module.exports = name
