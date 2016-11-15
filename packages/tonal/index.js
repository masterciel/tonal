
export {
  /* note, */noteName, chroma, pc, enharmonics, enh, simpleEnh
} from 'tonal-note'

import * as Note from 'tonal-note'
export function note (str) { return Note.noteName(str) }
Object.assign(note, Note)

export {
  ivlName, semitones, fromSemitones, ic, itype, invert, simplify
} from 'tonal-interval'

export {
  isMidiNum, toMidi, fromMidi, fromMidiS
} from 'tonal-midi'

export {
  toEqualTemp, toFreq, midiFromFreq, fromFreq, cents, fromEqualTemp
} from 'tonal-freq'

export {
  transpose, tr, trFifths
} from 'tonal-transpose'

export {
  distance, interval, distInSemitones
} from 'tonal-distance'

export {
  scaleFilter
} from 'tonal-filter'

export {
  asArr, map, filter, listFn, harmonizer, harmonize, harmonics,
  rotate, rotateAsc, select, sort, shuffle, compact, cMap
} from 'tonal-array'

export {
  range, chromatic, cycleOfFifths, scaleRange
} from 'tonal-range'

import * as Scale from 'tonal-scale'
export var scale = Scale
