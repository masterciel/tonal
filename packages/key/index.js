/**
 * [![npm version](https://img.shields.io/npm/v/tonal-key.svg?style=flat-square)](https://www.npmjs.com/package/tonal-key)
 * [![tonal](https://img.shields.io/badge/tonal-key-yellow.svg?style=flat-square)](https://www.npmjs.com/browse/keyword/tonal)
 *
 * `tonal-key` is a collection of functions to query about tonal keys.
 *
 * This is part of [tonal](https://www.npmjs.com/package/tonal) music theory library.
 *
 * @example
 * const key = require('tonal-key')
 * key.scale('E mixolydian') // => [ 'E', 'F#', 'G#', 'A', 'B', 'C#', 'D' ]
 * key.relative('minor', 'C major') // => 'A minor'
 *
 * @module key
 */
import { rotate, range } from "tonal-array";
import { tokenize as split, altToAcc } from "tonal-note";
import { trFifths, fifths, interval, transpose } from "tonal-distance";

const MODES = "major dorian phrygian lydian mixolydian minor locrian ionian aeolian".split(
  " "
);
const NUMS = [0, 1, 2, 3, 4, 5, 6, 0, 5];
const NOTES = "C D E F G A B".split(" ");
const CHORDS = "Maj7 m7 m7 Maj7 7 m7 m7b5".split(" ");
const DEGREES = "I II III IV V VI VII".split(" ");
const FIFTHS = [0, 2, 4, -1, 1, 3, 5, 0, 3];

const modenum = mode => NUMS[MODES.indexOf(mode)];

/**
 * Get a list of valid mode names. The list of modes will be always in
 * increasing order (ionian to locrian)
 *
 * @function
 * @param {Boolean} alias - true to get aliases names
 * @return {Array} an array of strings
 * @example
 * key.modes() // => [ 'ionian', 'dorian', 'phrygian', 'lydian',
 * // 'mixolydian', 'aeolian', 'locrian' ]
 * key.modes(true) // => [ 'ionian', 'dorian', 'phrygian', 'lydian',
 * // 'mixolydian', 'aeolian', 'locrian', 'major', 'minor' ]
 */
export const modeNames = aliases =>
  aliases === true ? MODES.slice() : MODES.slice(0, 7);

/**
 * Create a major key from alterations
 * 
 * @function
 * @param {Integer} alt - the alteration number (positive sharps, negative flats)
 * @return {Key} the key object
 * @example
 * var key = require('tonal-key')
 * key.fromAlter(2) // => 'D major'
 */
export const fromAlter = i => trFifths("C", i) + " major";

export const names = (alt = 4) => {
  alt = Math.abs(alt);
  const result = [];
  for (let i = -alt; i <= alt; i++) result.push(fromAlter(i));
  return result;
};

const NO_KEY = Object.freeze({
  name: null,
  tonic: null,
  mode: null,
  modenum: null,
  intervals: [],
  scale: [],
  alteration: null,
  accidentals: null
});

const properties = name => {
  const p = tokenize(name);
  if (p[0] === null) return NO_KEY;
  const k = { tonic: p[0], mode: p[1] };
  k.name = k.tonic + " " + k.mode;
  k.modenum = modenum(k.mode);
  const cs = rotate(k.modenum, NOTES);
  k.intervals = cs.map(interval(cs[0]));
  k.scale = k.intervals.map(transpose(k.tonic));
  k.alteration = fifths("C", k.tonic) - FIFTHS[MODES.indexOf(k.mode)];
  k.accidentals = altToAcc(k.alteration);
  return Object.freeze(k);
};

const memo = (fn, cache = {}) => str => cache[str] || (cache[str] = fn(str));

/**
 * Return the a key properties object with the following information:
 *
 * - name: name
 * - tonic: key tonic
 * - mode: key mode
 * - modenum: mode number (0 major, 1 dorian, ...)
 * - intervals: the scale intervals
 * - scale: the scale notes
 * - alteration: alteration number
 * - accidentals: accidentals 
 *
 * @function
 * @param {String} name - the key name
 * @return {Object} the key properties object or null if not a valid key
 * @example
 * var key = require('tonal-key')
 * key.props('C3 dorian') // => { tonic: 'C', mode: 'dorian', ... }
 */
export const props = memo(properties);

/**
 * Get scale of a key
 *
 * @function
 * @param {String|Object} key
 * @return {Array} the key scale
 * @example
 * key.scale('A major') // => [ 'A', 'B', 'C#', 'D', 'E', 'F#', 'G#' ]
 * key.scale('Bb minor') // => [ 'Bb', 'C', 'Db', 'Eb', 'F', 'Gb', 'Ab' ]
 * key.scale('C dorian') // => [ 'C', 'D', 'Eb', 'F', 'G', 'A', 'Bb' ]
 * key.scale('E mixolydian') // => [ 'E', 'F#', 'G#', 'A', 'B', 'C#', 'D' ]
 */
export const scale = str => props(str).scale;

/**
 * Get key alteration. The alteration is a number indicating the number of
 * sharpen notes (positive) or flaten notes (negative)
 * 
 * @function
 * @param {String|Integer} key
 * @return {Integer}
 * @example
 * var key = require('tonal-keys')
 * key.alteration('A major') // => 3
 */
export const alteration = str => props(str).alteration;

/**
 * Get key accidentals: a string with sharps or flats
 * 
 * @function
 * @param {String} key
 * @return {String}
 * @example
 * import * as key from 'tonal-keys'
 * key.accidentals('A major') // => "###"
 */
export const accidentals = str => props(str).accidentals;

/**
 * Get a list of key scale degrees
 * @param {String} keyName
 * @return {Array}
 * @example
 * tonal.key.degrees('C major') => ["I", "ii", "iii", "IV", "V", "vi", "vii"]
 */
export const degrees = str => {
  const p = props(str);
  if (p.name === null) return [];
  const chords = rotate(p.modenum, CHORDS);
  return chords.map((chord, i) => {
    const deg = DEGREES[i];
    return chord[0] === "m" ? deg.toLowerCase() : deg;
  });
};

/**
 * Get a list of the altered notes of a given key. The notes will be in
 * the same order than in the key signature.
 * 
 * @function
 * @param {String} key - the key name
 * @return {Array}
 * @example
 * var key = require('tonal-keys')
 * key.alteredNotes('Eb major') // => [ 'Bb', 'Eb', 'Ab' ]
 */
export const alteredNotes = name => {
  const alt = props(name).alteration;
  if (alt === null) return null;
  return alt === 0
    ? []
    : alt > 0
      ? range(1, alt).map(trFifths("B"))
      : range(-1, alt).map(trFifths("F"));
};

/**
 * Get key chords
 * 
 * @function
 * @param {String} name - the key name
 * @return {Array}
 * @example
 * key.chords("A major") // => ["AMaj7", "Bm7", "C#m7", "DMaj7", ..,]
 */
export const chords = str => {
  const p = props(str);
  if (!p.name) return [];
  const chords = rotate(p.modenum, CHORDS);
  return p.scale.map((tonic, i) => tonic + chords[i]);
};

/**
 * Get secondary dominant key chords
 * 
 * @function
 * @param {String} name - the key name
 * @return {Array}
 * @example
 * key.secDomChords("A major") // => ["E7", "F#7", ...]
 */

export const secDomChords = name => {
  const p = props(name);
  if (!p.name) return [];
  return p.scale.map(t => transpose(t, "P5") + "7");
};

/**
 * Get relative of a key. Two keys are relative when the have the same
 * key signature (for example C major and A minor)
 *
 * It can be partially applied.
 *
 * @function
 * @param {String} mode - the relative destination
 * @param {String} key - the key source
 * @example
 * key.relative('dorian', 'B major') // => 'C# dorian'
 * // partial application
 * var minor = key.relative('minor')
 * minor('C major') // => 'A minor'
 * minor('E major') // => 'C# minor'
 */
export const relative = (mode, key) => {
  if (arguments.length === 1) return key => relative(mode, key);
  const num = modenum(mode.toLowerCase());
  if (num === undefined) return null;
  const k = props(key);
  if (k.name === null) return null;
  return trFifths(k.tonic, FIFTHS[num] - FIFTHS[k.modenum]) + " " + mode;
};

/**
 * Split the key name into its components (pitch class tonic and mode name)
 * 
 * @function
 * @param {String} name 
 * @return {Array} an array in the form [tonic, key]
 * @example
 * key.tokenize('C major') // => ['C', 'major']
 */
export const tokenize = name => {
  const p = split(name);
  p[3] = p[3].toLowerCase();
  if (p[0] === "" || MODES.indexOf(p[3]) === -1) return [null, null];
  return [p[0] + p[1], p[3]];
};
