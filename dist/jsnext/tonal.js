var isArr = Array.isArray
function isStr (s) { return typeof s === 'string' }
// the number of fifths to 'C D E F G A B'
var FIFTHS = [0, 2, 4, -1, 1, 3, 5]
/**
 * Create a pitch class from its letter number
 * and it's alteration number
 *
 * @param {Integer} lnum - the letter num (0 is C, 1 is D...)
 * @param {Integer} alt - the alteration number
 */
export function pitchClass (lnum, alt) {
  return [FIFTHS[lnum || 0] + 7 * (alt || 0)]
}
// given a number of fifths, return the octaves it spans
function fifthsOcts (f) { return Math.floor(f * 7 / 12) }
/**
 * Build a pitch from letter number, alteration and octave. If
 * octave is not present, it builds a pitch class.
 *
 * @param {Integer} lnum - the letter number (0-based index)
 * @param {Integer} alt - the pitch accidentals integer
 * @param {Integer} oct - the pitch octave
 * @return {Array} the pitch in coord notation
 */
export function pitch (lnum, alt, oct) {
  var pc = pitchClass(lnum, alt)
  return !oct && oct !== 0
    ? pc : [pc[0], oct - fifthsOcts(pc[0])]
}
/**
 * Test if a given object is a pitch
 */
export function isPitch (p) {
  return isArr(p) && (p.length === 2 || p.length === 1)
}
/**
 * Convert accidental string to alteration number
 * @param {String} acc - the accidental string
 * @return {Integer} the alteration number
 * @example
 * accToAlt('#') // => 1
 * accToAlt('bbb') // => -2
 * accToAlt('') // => 0
 * accToAlt('x') // => 2
 */
export function accToAlt (acc) {
  var alt = acc.replace(/x/g, '##').length
  return acc[0] === 'b' ? -alt : alt
}
export const altToAcc = (alt) => Array(Math.abs(alt) + 1).join(alt < 0 ? 'b' : '#')
export function letterIndex (letter) {
  var cc = letter.charCodeAt(0)
  return (cc > 96 ? cc - 92 : cc - 60) % 7
}
var PITCH_REGEX = /^([a-gA-G])(#{1,}|b{1,}|x{1,}|)(-?\d{0,1})$/
/**
 * Get the a regex to parse pitch in scientific notation
 *
 * After exec against a valid string we get:
 * - 0: the complete string
 * - 1: the letter (in upper or lower case)
 * - 2: the alterations (a list of #, b or x)
 * - 3: an optional octave number
 */
export function pitchRegex () { return PITCH_REGEX }
export function parse (str) {
  var m = PITCH_REGEX.exec(str)
  if (!m) return null
  var li = letterIndex(m[1])
  var alt = accToAlt(m[2])
  var oct = m[3] ? +m[3] : null
  return pitch(li, alt, oct)
}
function tryParser (parser) {
  return (obj) => isStr(obj) ? parser(obj) || obj : obj
}
export const tryPitch = tryParser(parse)
/**
 * Decorate a function with one parameter to accepts
 * pitch in scientific notation
 */
export function prop (fn) {
  return (obj) => fn(tryPitch(obj))
}
export const alt = prop((p) => Math.floor((p[0] + 1) / 7))
// get fifths simplified
function fifthsBase (num) {
  var i = (num + 1) % 7
  return i < 0 ? 7 + i : i
}

const LETTERS = 'FCGDAEB'
export const letter = prop(function (p) {
  return LETTERS[fifthsBase(p[0])]
})
export function accidentals (p) {
  var a = typeof p === 'number' ? p : alt(p)
  return a ? Array(Math.abs(a) + 1).join(a < 0 ? 'b' : '#') : ''
}
// return if pitch has octave or not (is a pitch class)
export function hasOct (p) {
  return p && typeof p[1] !== 'undefined'
}
const octOr = (v) => (p) => hasOct(p) ? p[1] + fifthsOcts(p[0]) : v
const octStr = octOr('')
const octNum = octOr(0)
export var oct = prop(octOr(null))
// get note octave or empty string
// get string from pitch
export function str (p) {
  return letter(p) + accidentals(p) + octStr(p)
}

export var sci = map([str, parse])
sci.str = str
sci.parse = parse
sci.regex = pitchRegex
// build an interval
export function interval (num, alt, oct, dir) {
  return pitch(num, alt, oct).concat(dir)
}
export function isInterval (i) { return isArr(i) && i.length === 3 }

// get interval simplified number (0-based index)
var SIMPLES = [3, 0, 4, 1, 5, 2, 6]
export function simple (i) {
  return isArr(i) ? SIMPLES[fifthsBase(i[0])] : (i - 1) % 7
}

// get interval number from interval (1-based index)
export function number (i) {
  return simple(i) + 1 + 7 * octNum(i)
}

// get interval quality number
export function qNum (i) { return i[0] }

// get interval direction
export function direction (i) { return i[4] }

// get interval type (P = perfectable, M = majorable)
export function type (i) { return TYPES[simple(i)] }

var ALTER = {
  P: ['dddd', 'ddd', 'dd', 'd', 'P', 'A', 'AA', 'AAA', 'AAAA'],
  M: ['ddd', 'dd', 'd', 'm', 'M', 'A', 'AA', 'AAA', 'AAAA']
}
export function quality (i) {
  return ALTER[type(i)][4 + alt(i)]
}

// shorthand tonal notation (with quality after number)
var IVL_TNL = '([-+]?)(\\d+)(d{1,4}|m|M|P|A{1,4}|b{1,4}|#{1,4})'
// standard shorthand notation (with quality before number)
var IVL_STR = '(AA|A|P|M|m|d|dd)([-+]?)(\\d+)'
var COMPOSE = '(?:(' + IVL_TNL + ')|(' + IVL_STR + '))'
var IVL_REGEX = new RegExp('^' + COMPOSE + '$')

// get regexp to parse intervals
export function ivlRegex () { return IVL_REGEX }

var TYPES = 'PMMPPMM'
var QALT = {
  P: { dddd: -4, ddd: -3, dd: -2, d: -1, P: 0, A: 1, AA: 2, AAA: 3, AAAA: 4 },
  M: { ddd: -4, dd: -3, d: -2, m: -1, M: 0, A: 1, AA: 2, AAA: 3, AAAA: 4 }
}

// interval parse quality
function _ipq (simple, q) {
  return q === '' ? 0
    : q[0] === '#' ? q.length
    : q[0] === 'b' ? -q.length
    : QALT[TYPES[simple]][q]
}

export function ivlParse (str) {
  var m = IVL_REGEX.exec(str)
  if (!m) return null
  var num = +(m[3] || m[8])
  var sim = simple(num)
  var alt = _ipq(sim, m[4] || m[6] || '')
  var oct = Math.floor((num - 1) / 7)
  var dir = (m[2] || m[7]) === '-' ? -1 : 1
  return interval(sim, alt, oct, dir)
}

function dirStr (p) {
  return direction(p) === -1 ? '-' : ''
}

function ivlStr (p) {
  return dirStr(p) + number(p) + quality(p)
}

export var ivl = combine([ivlStr, ivlParse])
ivl.parse = ivlParse
ivl.str = ivlStr
ivl.regex = ivlRegex

/* ******** TRANSPOSE ******** */

export var tr = (a) => (b) => {
  var ac = sci.parse(a) || ivl.parse(a) || a
  var bc = sci.parse(b) || ivl.parse(b) || b
  var n = (isInterval(ac) && isPitch(bc)) ? trBy(ac, bc)
    : (isPitch(ac) && isInterval(bc)) ? trBy(bc, ac)
    : null
  return n ? sci.str(n) : null
}

export function trBy (ivl, p) {
  return p.length === 1 ? [ivl[2] * ivl[0] + p[0]]
    : [ivl[2] * ivl[0] + p[0], ivl[2] * ivl[1] + p[1]]
}

var SEP = /\s*\|\s*|\s*,\s*|\s+/
export function split (source) {
  return isArr(source) ? source
    : typeof source === 'string' ? source.trim().split(SEP)
    : (source === null || typeof source === 'undefined') ? []
    : [ source ]
}
function combine (arr) {
  var fns = arr.slice().reverse()
  return function (e) {
    return fns.reduce(function (e, fn) {
      return fn(e)
    }, e)
  }
}
export function map (fn, list) {
  if (arguments.length === 1) return function (l) { return map(fn, l) }
  if (isArr(fn)) fn = combine(fn)
  return split(list).map(fn)
}
export function harmonize (list, tonic) {
  return split(list).map(tr(tonic))
}
