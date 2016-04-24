# tonal [![npm](https://img.shields.io/npm/v/_.svg)](https://www.npmjs.com/package/tonal) [![Build Status](https://travis-ci.org/danigb/_.svg?branch=master)](https://travis-ci.org/danigb/tonal) [![Code Climate](https://codeclimate.com/github/danigb/tonal/badges/gpa.svg)](https://codeclimate.com/github/danigb/tonal) [![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard) [![license](https://img.shields.io/npm/l/_.svg)](https://www.npmjs.com/package/tonal)

`tonal` is a functional music theory library. It provides functions to manipulate tonal elements of music (pitches, chords, scales, keys). It deals with abstractions (not actual music).

__This library is under active development__.

## Example

```js
var _ = require('tonal')

// notes and intervals
_.midi('A4') // => 69
_.fromMidi(60) // => 'C4'
_.freq('C2') // => 65.40639132514966
_.fromFreq(220) // => 'A3'
_.semitones('P8') // => 12

// transposition and distances
_.tranpose('D4', '2M') // => 'E#4'
_.interval('C', 'G') // => '5P'

// work with collections
_.map(_.transpose('3M'), 'c d e') // => ['E4', 'F#4', 'G#4']
var maj7 = _.harmonizer('P1 M3 P5 M7')
maj7('C2') // => ['C2', 'E2', 'G2', 'B2']
_.sort('F G a D C') // => ['C', 'D', 'F', 'G', 'A']
_.max('C4 C#3 A4') // => 'A4'

// scales and chords
_.scale('C major') // => ['C', 'D', 'E', 'F', 'G', 'A', 'B']

// ranges
_.range(_.chromatic(), 'C3', 'G5')
// => ['C3', 'Db3', 'D3', 'Eb3', ... 'G5']
_.take(_.chromatic(), 'A4', 24)
// => ['A4', 'Bb4', 'B4', 'C5', ... 'A6']
_.range('C E G', 'C3', 'C5')
// => ['C3', 'E3', 'G3', 'C4', 'E4', 'G5', 'C5']

// scales and chords
var major = _.harmonizer('P1 M2 M3 P4 P5 M6 M7')
major('A') // => ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#']
var maj7 = _.harmonizer('P1 M3 P5 M7')

// keys
key('###') // => 'A major'
key.signature('A major') // => '###'
key.altNotes('A major') // => ['F#', 'C#']
key.relative('minor', 'A major') // => 'F minor'
```

## Features

Although `tonal` is a work in progress, currently is implemented (but not all released):

- Note, intervals, transposition, distances, enharmonics
- Midi and frequency conversion
- Scales, chords, dictionaries
- Work with collection of notes: gamut, harmonizer
- Pitch sets and binary representations
- Keys, keys signatures, key scales and chords, key detection

## Philosophy

This library is evolving with this ideas in mind:

- Notes and intervals are represented with strings, instead of objects. Easy and concise code.
- Functional: no classes, no side effects, no mutations. Just functions, data-in data-out. Most of the functions has the data to operate on as last argument and lot of functions are currified.
- [Small](https://rawgit.com/danigb/tonal/master/dist/disc.html) and fast
- Modular: [lot of modules](https://www.npmjs.com/browse/keyword/tonal) (all integrated in tonal). You can require exactly the functions you need, or get the [whole thing](https://www.npmjs.com/package/tonal).
- Different notations: scientific notation by default. Helmholtz coming. Change it easily.
- Documented: all public functions are documented inside the code. Aside the generated documentation (in API.md file) a 'usage' guides are provided for each module.
- Learneable: since all the modules share the same philosophy is easy to work with them.
- Tested: carefully tested with coverage support.
- Advanced features: chord and scale detection, binary sets, chord progressions, key signatures...

## Why

First of all, because I want to learn:

> Reinventing the wheel is bad for business, but it’s great for learning
[*](http://philipwalton.com/articles/how-to-become-a-great-front-end-engineer)

Also, I want a complete library, where I can model all what I learn, with some (for me) esoteric features like interval classes, binary scales and other weird stuff.

## License

MIT License
