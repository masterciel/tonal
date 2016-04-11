'use strict'

var harmonizer = require('note-harmonizer')
var data = require('chord-dictionary')
var regex = require('music-notation/note/regex')

/**
 * Create chords by chord name or chord intervals. The returned chord is an
 * array of notes or intervals (depending if you specified root or not).
 *
 * This function is currified
 *
 * @name chord
 * @function
 * @param {String} source - the chord name, intervals or notes
 * @param {String} tonic - the chord tonic (or false to get intervals)
 * @return {Array} the chord notes
 *
 * @example
 * var chord = require('music-chord')
 * // get chord notes using name
 * chord('Cmaj7') // => ['C', 'E', 'G', 'B']
 * // get chord notes using type and tonic
 * chord('maj7', 'C2') // => ['C2', 'E2', 'G2', 'B2']
 * // get chord intervals (tonic false)
 * chord('maj7', false) // => ['1P', '3M', '5P', '7M']
 * // partially applied
 * var maj7 = chord('maj7')
 * maj7('C') // => ['C', 'E', 'G', 'B']
 * // create chord from intervals
 * chord('1 3 5 m7 m9', 'C') // => ['C', 'E', 'G', 'Bb', 'Db']
 * // part of tonal
 * tonal.chord('C7') // => ['C', 'E', 'G', 'Bb']
 */
function chord (name, tonic) {
  if (arguments.length === 1) {
    var p = regex.exec(name)
    // it's not a complete name: return partially applied
    if (!p) return function (t) { return chord(name, t) }
    // it has note and chord name
    if (p[5]) return chord(p[5], p[1] + p[2] + p[3])
    // doesn't have chord name: the name is the octave (example: 'C7' is dominant)
    else return chord(p[3], p[1] + p[2])
  }
  var intervals = data[name]
  if (typeof intervals === 'string') intervals = data[intervals]
  else if (!intervals) intervals = name
  return intervals ? harmonizer(intervals, tonic) : []
}

var names = null

/**
 * Return the available chord names
 *
 * @name names
 * @memberof chord
 * @function
 * @param {boolean} aliases - true to include aliases
 *
 * @example
 * tonal.chord.names() // => ['maj7', ...]
 */
chord.names = function (aliases) {
  if (aliases) return Object.keys(data)
  if (!names) names = buildNames()
  return names.slice()
}

function buildNames () {
  return Object.keys(data).reduce(function (names, name) {
    if (Array.isArray(data[name])) names.push(name)
    return names
  }, [])
}

if (typeof module === 'object' && module.exports) module.exports = chord
if (typeof window !== 'undefined') window.chord = chord
