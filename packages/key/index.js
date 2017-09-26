/**
 * _Key_ refers to the tonal system based on the major and minor scales. This is
 * is the most common tonal system, but tonality can be present in music
 * based in other scales or concepts.
 *
 * This is a collection of functions related to keys.
 *
 * @example
 * const key = require('tonal-key')
 * key.scale('E mixolydian') // => [ 'E', 'F#', 'G#', 'A', 'B', 'C#', 'D' ]
 * key.relative('minor', 'C major') // => 'A minor'
 *
 * @module key
 */
import { rotate, range } from "tonal-array/index";
import { tokenize as split, altToAcc } from "tonal-note/index";
import { trFifths, fifths, interval, transpose } from "tonal-distance/index";

const MODES = "major dorian phrygian lydian mixolydian minor locrian ionian aeolian".split(
  " "
);
const NUMS = [0, 1, 2, 3, 4, 5, 6, 0, 5];
const NOTES = "C D E F G A B".split(" ");
const CHORDS = "Maj7 m7 m7 Maj7 7 m7 m7b5".split(" ");
const FIFTHS = [0, 2, 4, -1, 1, 3, 5, 0, 3];

const modenum = mode => NUMS[MODES.indexOf(mode)];

export const modeNames = aliases =>
  aliases === true ? MODES.slice() : MODES.slice(0, 7);

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
  signature: null
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

export const props = memo(properties);

export const scale = str => props(str).scale;
export const alteration = str => props(str).alteration;

export const alteredNotes = name => {
  const alt = props(name).alteration;
  if (alt === null) return null;
  return alt === 0
    ? []
    : alt > 0
      ? range(1, alt).map(trFifths("B"))
      : range(-1, alt).map(trFifths("F"));
};

export const chords = str => {
  const p = props(str);
  if (!p.name) return [];
  const chords = rotate(p.modenum, CHORDS);
  return p.scale.map((tonic, i) => tonic + chords[i]);
};

export const secDomChords = name => {
  const p = props(name);
  if (!p.name) return [];
  return p.scale.map(t => transpose(t, "P5") + "7");
};

export const relative = (mode, key) => {
  const num = modenum(mode.toLowerCase());
  if (num === undefined) return null;
  const k = props(key);
  if (k.name === null) return null;
  return trFifths(k.tonic, FIFTHS[num] - FIFTHS[k.modenum]) + " " + mode;
};

export const tokenize = name => {
  const p = split(name);
  p[3] = p[3].toLowerCase();
  if (p[0] === "" || MODES.indexOf(p[3]) === -1) return [null, null];
  return [p[0] + p[1], p[3]];
};
