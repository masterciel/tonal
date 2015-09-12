'use strict'

var harmonize = require('../sequence/harmonize')
var parse = require('./parse')
var data = require('./chords-all.json')

/**
 * Get chord notes or intervals by its type and (optionally) tonic pitch
 *
 * @param {String} name - the chord name (may include the tonic)
 * @param {String} tonic - (Optional) the tonic pitch
 * @return {Array} an array of intervals or notes (if the tonic is provided)
 */
function chord (name, tonic) {
  var chord = parse(name)
  if (!chord) return null

  chord.tonic = tonic || chord.tonic
  if (!chord.tonic) return data[chord.type]
  else if (chord.type) return harmonize(chord.tonic, data[chord.type])
  else return null
}

module.exports = chord