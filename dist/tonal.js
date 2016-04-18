'use strict';

const isArr = Array.isArray
const isStr = (s) => typeof s === 'string'
// The number of fifths required to get C, D, E, F, G, A and B from C
const FIFTHS = [0, 2, 4, -1, 1, 3, 5]
// get the number of fifths for a letter index and alteration
// letter is 0 for C, 1 for D, 2 for E ... and 6 for B
// alt is 0 for unaltered, positive for sharps and negative for flats
const fifths = (letter, alt) => FIFTHS[letter] + 7 * alt
// given a number of fiths, return the octaves they span
const fifthsOcts = (f) => Math.floor(f * 7 / 12)
// encode the octaves required for a pitch
function octaves (letter, alt, oct) {
  return oct - fifthsOcts(FIFTHS[letter]) - 4 * alt
}
/**
 * Build a pitch from letter index, alteration and octave. If
 * octave is not present, it builds a pitch class.
 *
 * @param {Integer} letter - the letter number (0-based index)
 * @param {Integer} alt - the pitch accidentals integer
 * @param {Integer} oct - the pitch octave
 * @return {Array} the pitch in coord notation
 */
function pitch (letter, alt, oct) {
  return !oct && oct !== 0 ? [ fifths(letter, alt) ]
    : [ fifths(letter, alt), octaves(letter, alt, oct) ]
}
// test if the given object is a pitch in array notation
const isPitchArr = (p) => isArr(p) && (p.length === 2 || p.length === 1)
// test if the given object is a pitch class in array notation
const isPitchClassArr = (p) => isArr(p) && p.length === 1
var PITCH_REGEX = /^([a-gA-G])(#{1,}|b{1,}|x{1,}|)(-?\d{0,1})$/
/**
 * Get the a regex to parse pitch in scientific notation
 *
 * @return {Regex} the regex
 *
 * After exec against a valid string we get:
 * - 0: the complete string
 * - 1: the letter (in upper or lower case)
 * - 2: the alterations (a list of #, b or x)
 * - 3: an optional octave number
 * @example
 * pitchRegex().exec('C#2') // => ['C#2', 'C', '#', '2']
 */
const pitchRegex = () => PITCH_REGEX
/**
 * Given a pitch letter string, return it's letter index.
 * @param {String} letter - the pitch letter
 * @return {Integer} the letter index
 */
const letterIndex = (l) => 'CDEFGAB'.indexOf(l.toUpperCase())
/**
 * Convert accidental string to alteration number
 * @function
 * @param {String} acc - the accidental string
 * @return {Integer} the alteration number
 * @example
 * accToAlt('#') // => 1
 * accToAlt('bbb') // => -2
 * accToAlt('') // => 0
 * accToAlt('x') // => 2
 */
function accToAlt (acc) {
  var alt = acc.replace(/x/g, '##').length
  return acc[0] === 'b' ? -alt : alt
}
// parse a string with a pitch in scientific notation
function parseSci (str) {
  var m = PITCH_REGEX.exec(str)
  if (!m) return null
  var li = letterIndex(m[1])
  var alt = accToAlt(m[2])
  var oct = m[3] ? +m[3] : null
  return pitch(li, alt, oct)
}
// decorate a parser to cache results
function cache(parser) {
  var cache = {}
  return function (str) {
    if (typeof str !== 'string') return null
    return cache[str] || (cache[str] = parser(str))
  }
}
/**
 * Given a pitch string in scientific notation, get the pitch in array notation
 * @function
 * @param {String} str - the string to parse
 * @return {Array} the pitch in array notation or null if not valid string
 * @example
 * pitchParse('C2') // => [2, 1]
 * pitchParse('bla') // => null
 */
const pitchParse = cache(parseSci)
// try to parse using a parser or do nothing if parser fails
function tryParser (parser) {
  return (obj) => isStr(obj) ? parser(obj) || obj : obj
}

/**
 * Given an object, try to parse as if it were a pitch in scientific notation. If success, return the parsed pitch, otherwise return the unmodified object.
 *
 * @function
 * @param {Object} obj - the object to parse
 * @return {Array|Object} the parsed pitch or the object if not valid pitch string
 * @example
 * tryPitch('G3') // => [1, 3]
 * tryPitch([1, 3]) // => [1, 3]
 * tryPitch(3) // => 2
 */
const tryPitch = tryParser(pitchParse)
/**
 * Decorate a function with one parameter to accepts
 * pitch in scientific notation
 * @param {Function} fn - the function to decorate
 * @return {Function} a function with one parameter that can be a pitch in scientific notation or anything else.
 */
const prop = (fn) => (obj) => fn(tryPitch(obj))
/**
 * Get alteration of a pitch.
 *
 * The alteration is an integer indicating the number of sharps or flats
 *
 * @name alt
 * @function
 * @param {Array|String} pitch - the pitch (either in scientific notation or array notation)
 * @return {Integer} the alteration
 * @example
 * alt('C#2') // => 2
 */
const alt = prop((p) => Math.floor((p[0] + 1) / 7))
// remove accidentals to a pitch class
// it gets an array and return a number of fifths
function unaltered (p) {
  var i = (p[0] + 1) % 7
  return i < 0 ? 7 + i : i
}
const LETTERS = 'FCGDAEB'
/**
 * Get the pitch letter. It accepts scientific or array notation.
 *
 * @name letter
 * @function
 * @param {Array|String} pitch - the pitch to get the letter from
 * @return {String} the letter
 * @example
 * letter('C#2') // => 'C'
 * letter([-7, 2]) // => 'C'
 */
const letter = prop((p) => LETTERS[unaltered(p)])
/**
 * Convert alteration number to accidentals
 * @function
 * @param {Integer} alt - the alteration number
 * @return {String} the accidentals string
 * @example
 * altToAcc(2) // => '##'
 * altToAcc(-2) // => 'bb'
 */
const altToAcc = (alt) => Array(Math.abs(alt) + 1).join(alt < 0 ? 'b' : '#')
/**
 * Get accidentals string from a pitch. It accepts pitches in scientific and array notation.
 *
 * @function
 * @param {Array|String} pitch - the pitch to get the accidentals from
 * @return {String} the accidentals string
 * @example
 * accidentals('C##2') // => '##'
 * accidentals([-7]) // => 'b'
 */
const accidentals = (p) => altToAcc(alt(p))
// return if pitch has octave or not (is a pitch class)
function hasOct (p) {
  return isArr(p) && typeof p[1] !== 'undefined'
}
// returns the pitch octave or `v` if not octave present
const octOr = (v) => (p) => hasOct(p) ? p[1] + fifthsOcts(p[0]) : v
// return the octave or ''
const octStr = octOr('')
// return the octave or 0
const octNum = octOr(0)
/**
 * Get the octave from pitch. The pitch can be in array or scientific notation
 * @name oct
 * @function
 * @param {Array|String} pitch - the pitch to get the octave from
 * @return {Integer} the octave or null if it's a pitch class or not a valid pitch
 * @example
 * oct('C#2') // => 2
 * oct('C') // => null
 */
var oct = prop(octOr(null))
/**
 * Convert a pitch in array notation to pitch in scientific notation (string)
 *
 * @param {Array} pitch - the pitch to convert
 * @return {String} the pitch in scientific notation
 * @example
 * pitchStr([2, 1]) // => 'D2'
 */
function pitchStr (p) {
  return letter(p) + accidentals(p) + octStr(p)
}
// get pitch height
const height = (p) => p[0] * 7 + 12 * p[1]
/**
 * Test if the given number is a valid midi note number
 * @function
 * @param {Object} num - the number to test
 * @return {Boolean} true if it's a valid midi note number
 */
const isMidi = (m) => !isArr(m) && m > 0 && m < 129
/**
 * Get midi number for a pitch
 * @function
 * @param {Array|String} pitch - the pitch
 * @return {Integer} the midi number or null if not valid pitch
 * @example
 * midi('C4') // => 60
 */
const midi = prop(function (p) {
  return hasOct(p) ? height(p) + 12
    : isMidi(p) ? +p
    : null
})
var CHROMATIC = [ 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B' ]
function fromMidi (num) {
  var midi = +num
  return (isNaN(midi) || midi < 0 || midi > 127) ? null
    : CHROMATIC[midi % 12] + (Math.floor(midi / 12) - 1)
}
/**
 * Get a frequency calculator function that uses well temperament and a tuning reference.
 * @function
 * @param {Float} ref - the tuning reference
 * @return {Function} the frequency calculator. It accepts a pitch in array or scientific notation and returns the frequency in herzs.
 */
const wellTempered = (ref) => (pitch) => {
  var m = midi(pitch)
  return m ? Math.pow(2, (m - 69) / 12) * ref : null
}
/**
 * Get the frequency of a pitch using well temperament scale and A4 equal to 440Hz
 * @function
 * @param {Array|String} pitch - the pitch to get the frequency from
 * @return {Float} the frequency in herzs
 * @example
 * toFreq('C4') // => 261.6255653005986
 */
const toFreq = wellTempered(440)
/**
 * Create an interval from interval simplified number, interval alteration, interval octave and direction
 *
 * @param {Integer} sim - the simplified interval number 0-based index
 * @param {Integer} alteration - the interval alteration
 * @param {Integer} oct - how many octaves the interval spans
 * @param {Integer} dir - the direction (1 ascending, -1 descending)
 * @return {Array} an interval in array notation
 */
function interval (sim, alt, oct, dir) {
  return pitch(sim, alt, oct).concat(dir)
}
/**
 * Return if the given object is an interval
 * @function
 * @param {Object} obj - the object to check
 * @return {Boolean} true if the object is an interval object
 * @example
 * isInterval([0,3,1]) // => true
 */
const isInterval = (i) => isArr(i) && i.length === 3
// get a simplified index from an interval number. Basically:
// unison is 0, second is 1, thirth is 2, ...
const simplifiedIndex = (n) => (n - 1) % 7
// To get the type: TYPES[simplifiedIndex]
var TYPES = 'PMMPPMM'
/**
 * Get an alteration number from an interval quality string.
 * It accepts the standard `dmMPA` but also sharps and flats.
 *
 * @param {String} type - the interval type ('P' or 'M')
 * @param {String} quality - the quality string
 * @return {Integer} the interval alteration
 * @example
 * qualityToAlt('M', 'm') // => -1 (for majorables, 'm' is -1)
 * qualityToAlt('P', 'A') // => 1 (for perfectables, 'A' means 1)
 * qualityToAlt('M', 'P') // => null (majorables can't be perfect)
 */
function qualityToAlt (type, q) {
  if (type === 'P') {
    if (q === 'P') return 0
    else if (q[0] === 'A') return q.length
    else if (q[0] === 'd') return -q.length
  } else if (type === 'M') {
    if (q === 'M') return 0
    else if (q === 'm') return -1
    else if (q[0] === 'A') return q.length
    else if (q[0] === 'd') return -(q.length + 1)
  }
  return null
}
// shorthand tonal notation (with quality after number)
var IVL_TNL = '([-+]?)(\\d+)(d{1,4}|m|M|P|A{1,4})'
// standard shorthand notation (with quality before number)
var IVL_STR = '(AA|A|P|M|m|d|dd)([-+]?)(\\d+)'
var COMPOSE = '(?:(' + IVL_TNL + ')|(' + IVL_STR + '))'
var IVL_REGEX = new RegExp('^' + COMPOSE + '$')

/**
 * Get regex to parse intervals in shorthand notation
 * @return {Regex} the regex
 *
 * After executing the regex, we will have an array-like object with:
 * - 0: the complete string
 */
function ivlRegex () { return IVL_REGEX }
/**
 * Parse a string with an interval in shorthand notation. It support two types: standard shorthand interval notation `quality+[direction]+number` or the tonal shorthand notation `[direction]+number+quality`
 * @function
 * @param {String} str - the string to parse
 * @return {Array} the interval in array notation or null if not valid interval string
 * @example
 * ivlParse('3M') // => [ 4, -2, 1 ]
 * ivlParse('-3M') // => [ 4, -2, -1 ]
 * ivlParse('M3') // => [ 4, -2, 1 ]
 * ivlParse('M-3') // => [ 4, -2, -1 ]
 */
const ivlParse = cache(function (str) {
  var m = IVL_REGEX.exec(str)
  if (!m) return null
  var num = +(m[3] || m[8])
  var sim = simplifiedIndex(num)
  var alt = qualityToAlt(TYPES[sim], m[4] || m[6])
  var oct = Math.floor((num - 1) / 7)
  var dir = (m[2] || m[7]) === '-' ? -1 : 1
  return interval(sim, alt, oct, dir)
})
const tryIvl = tryParser(ivlParse)
/**
 * Decorate a function to accept intervals in array of shorthand notation. It only works with 1-parameter functions.
 *
 * @param {Function} fn - the function to be decorated
 * @return {Function} the decorated function
 */
const ivlProp = (fn) => (obj) => fn(tryIvl(obj))
// the simplified number against the number of fifths
var SIMPLES = [3, 0, 4, 1, 5, 2, 6]
/**
 * Get the simplified interval number (in 1-based index)
 *
 * @function
 * @param {Array|String} ivl - the interval to get the number from
 * @return {Integer} the simplified interval number
 */
const simpleNum = ivlProp((i) => SIMPLES[unaltered(i)])
/**
 * Get the interval number
 * @function
 * @param {Array|String} ivl - the interval to get the number from
 * @return {Integer} a integer greater than 0 or null if not valid interval
 * @example
 * number('P8') // => 8
 */
const number = ivlProp((i) => simpleNum(i) + 1 + 7 * octNum(i))
/**
 * Get the interval type
 * @function
 * @param {Array|String} ivl - the interval
 * @param {String} 'P' if it's perfectable, 'M' if it's majorable
 */
const ivlType = (i) => TYPES[simpleNum(i)]
var ALTER = {
  P: ['dddd', 'ddd', 'dd', 'd', 'P', 'A', 'AA', 'AAA', 'AAAA'],
  M: ['ddd', 'dd', 'd', 'm', 'M', 'A', 'AA', 'AAA', 'AAAA']
}
/**
 * Get interval quality
 * @function
 * @param {Array|String} ivl - the interval
 * @return {String} the quality string
 * @example
 * quality('3M') // => 'M'
 */
const quality = ivlProp((i) => ALTER[ivlType(i)][4 + alt(i)])
/*
 * get interval direction
 * @function
 * @param {Array|String} ivl - the interval
 * @return {Integer}
 */
const direction = (i) => { return i[4] }
const dirStr = (p) => direction(p) === -1 ? '-' : ''
/**
 * Convert an interval in array notation to shorthand notation
 * @function
 * @param {Array} ivl - the interval in array notation
 * @return {String} the interval in shorthand notation
 */
function ivlStr (p) {
  return dirStr(p) + number(p) + quality(p)
}
// transpose a note by an interval
function trBy (ivl, p) {
  // is a pitch class
  return p.length === 1
    // build a pitch class
    ? [ivl[2] * ivl[0] + p[0]]
    // build a pitch
    : [ivl[2] * ivl[0] + p[0], ivl[2] * ivl[1] + p[1]]
}
// parse a pitch or an interval or return the object itself
const pitchOrIvl = (o) => pitchParse(o) || ivlParse(o) || o
/**
 * Transpose a pitch by an interval
 * This function is currified, and aliased as `tr`
 * @function
 * @param {Array|String} a - the pitch or interval
 * @param {Array|String} b - the pitch or interval
 * @return {String} the pitch transposed by the interval
 * @example
 * transpose('C2', 'm3') // => 'Eb2'
 * transpose('C', '6m') // => 'Ab'
 */
function transpose (a, b) {
  // if only one argument, partial application
  if (arguments.length === 1) return (b) => transpose(a, b)
  var ac = pitchOrIvl(a)
  var bc = pitchOrIvl(b)
  // if its an interval and a pitch
  var n = (isInterval(ac) && isPitchArr(bc)) ? trBy(ac, bc)
    // it its a pitch and an interval
    : (isPitchArr(ac) && isInterval(bc)) ? trBy(bc, ac)
    // anything else is not valid
    : null
  // convert back to a pitch string
  return n ? pitchStr(n) : null
}
/**
 * An alias for `transpose`
 * @function
 */
const tr = transpose
// items can be separated by spaces, bars and commas
var SEP = /\s*\|\s*|\s*,\s*|\s+/
/**
 * Split a string by spaces (or commas or bars). Always returns an array, even if its empty
 * @param {String|Array|Object} source - the thing to get an array from
 * @return {Array} the object as an array
 */
function split (source) {
  return isArr(source) ? source
    : typeof source === 'string' ? source.trim().split(SEP)
    : (source === null || typeof source === 'undefined') ? []
    : [ source ]
}
function map (fn, list) {
  if (arguments.length === 1) return function (l) { return map(fn, l) }
  return split(list).map(fn)
}
function harmonize (list, tonic) {
  return split(list).map(tr(tonic))
}

exports.pitch = pitch;
exports.pitchRegex = pitchRegex;
exports.letterIndex = letterIndex;
exports.accToAlt = accToAlt;
exports.pitchParse = pitchParse;
exports.tryPitch = tryPitch;
exports.prop = prop;
exports.alt = alt;
exports.letter = letter;
exports.altToAcc = altToAcc;
exports.accidentals = accidentals;
exports.oct = oct;
exports.pitchStr = pitchStr;
exports.isMidi = isMidi;
exports.midi = midi;
exports.fromMidi = fromMidi;
exports.wellTempered = wellTempered;
exports.toFreq = toFreq;
exports.interval = interval;
exports.isInterval = isInterval;
exports.simplifiedIndex = simplifiedIndex;
exports.qualityToAlt = qualityToAlt;
exports.ivlRegex = ivlRegex;
exports.ivlParse = ivlParse;
exports.ivlProp = ivlProp;
exports.simpleNum = simpleNum;
exports.number = number;
exports.ivlType = ivlType;
exports.quality = quality;
exports.direction = direction;
exports.ivlStr = ivlStr;
exports.transpose = transpose;
exports.tr = tr;
exports.split = split;
exports.map = map;
exports.harmonize = harmonize;