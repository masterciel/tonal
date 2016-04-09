/* global describe it */
var assert = require('assert')
var tonal = require('..')

describe('tonal', function () {
  it('has notation', function () {
    assert(tonal.notation)
    assert(tonal.note)
    assert(tonal.note.regex)
    assert(tonal.note.parse)
    assert(tonal.note.str)
    assert(tonal.interval.regex)
    assert(tonal.interval.parse)
    assert(tonal.interval.str)
    assert(tonal.pitch.parse)
    assert(tonal.pitch.str)
    assert(tonal.roman.regex)
    assert(tonal.roman.parse)
  })
  it('note and midi support', function () {
    assert(tonal.midi)
    assert(tonal.midi.freq)
    assert(tonal.midi.note)
    assert(tonal.note.midi)
    assert(tonal.note.fromMidi)
    assert(tonal.note.enharmonics)
    assert(tonal.note.freq)
    assert(tonal.pitchClass)
    assert(tonal.interval.simplify)
  })

  it('has transpose and interval', function () {
    assert(tonal.transpose)
    assert(tonal.note.transpose)
    assert(tonal.note.interval)
  })

  it('collection of notes', function () {
    assert(tonal.gamut)
    assert(tonal.harmonizer)
    assert(tonal.sort)
    assert(tonal.sortAsc)
    assert(tonal.sortDesc)
  })

  it('has chords and scales support', function () {
    assert(tonal.dictionary)
    assert(tonal.scale)
    assert(tonal.scale.name)
    assert(tonal.chord)
    assert(tonal.chord.name)
  })
})
