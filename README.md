# tonal

[![Build Status](https://travis-ci.org/danigb/tonal.svg?branch=master)](https://travis-ci.org/danigb/tonal)
[![Code Climate](https://codeclimate.com/github/danigb/tonal/badges/gpa.svg)](https://codeclimate.com/github/danigb/tonal)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

Tonal is a library to create and manipulate tonal elements of music (pitches, chords, scales and keys). It deals with abstractions (not actual music) and can be used to develop midi or audio software:

```js
var tonal = require('tonal')

// pitches
tonal.fromMidi(60) // => 'C4'
tonal.midi('A4') // => 69
tonal.fromFreq(220) // => 'A3'
tonal.freq('C') // => ...

// intervals
tonal.tranpose('D4', '2M') // => 'E#4'
tonal.interval('C', 'G') // => '5P'

// collections
['A', 'B', 'C'].map(tonal.transpose('5P'))
tonal('c d e') // => ['C4', 'D4', 'E4']
tonal('c d e').map(tonal.transpose('3M')) // => ['E4', 'F#4', 'G#4']

// scales
tonal.scale('A major') // => ['A4', 'B4', 'C#5', ...]
tonal.scale('A major').map(tonal.transpose('8P')) // => ['A5, 'B5', ...]
tonal.modes(tonal.scale('Bb dorian')) // => [ an array of arrays with 7 scales notes ]
tonal.scaleName('C D E F# G A B') // => ['C lydian']
tonal('A Bb').map(tonal.scale('major')) // => [ ['A', 'B', 'C#', ...], ['Bb', 'C', 'D', ...]

// chords
tonal.chord('CMaj7') // => ['C4', 'E4', 'G4', 'B4']
tonal('Dm7 | G7 | CMaj7').map(tonal.chord) // => [ ['D', 'F', ...], ['G', ...], ['C', ...]]
```

Tonal has a number of characteristics that make it unique:

- In its core (except the `tonal` facade object) all is pure __functional__: no classes, no side effects, no mutations, just data-in-and-out and functions.
- Heavy use of __strings to represent entities__: pitches (`'C#2'`, `'Bb'`, `'G##'`), intevals (`'2M'`, `'-9m'`), chords (`'Cmaj7'`, `'Bb79'`), scales (`'C major'`, `'Bb bebop'`), sequences (`'C D E F'`, `'1P 2M 3M'`, `'Cmaj7 D9m'`), keys (`'C major'`, `'Bb minor'`, `'###'`)
- Extremely __modular__: your can require individual functions not (_a-la-lodash_) so the dependencies are reduced to the minimum. Think each function in tonal like a npm micro-module.
- Advanced features: binary sets, chord and scale detection, ...

_This is still beta software_ For a stable library see [teoria](https://github.com/saebekassebil/teoria)

## Why

Mostly, because I want to [learn](https://github.com/danigb/tonal/blob/master/RESOURCES.md):

> Reinventing the wheel is bad for business, but it’s great for learning
[*](http://philipwalton.com/articles/how-to-become-a-great-front-end-engineer)

## What

The library is divided in a number of modules:

#### [Pitches](https://github.com/danigb/tonal/blob/master/docs/pitch.md)

In tonal, pitches and intervals are just strings (using scientific notation):
```js
tonal.pitch('c') // 'C4'
tonal.pitch('c', '#', 2) // => 'D#2'
tonal.pitch('e', -2, 5) // => 'Ebb5'
tonal.pitch('ebb2') // 'Ebb2'
tonal.pitch('Fx') // => 'F##'
tonal.pitch('Ebbbbb') // => null
```

Work with midi and frequencies:
```js
tonal.midi('A4') // => 69
tonal.fromMidi(60) // => 'C4'
tonal.freq('A4') // => 440
tonal.fromFreq(220) // => 'A3'
```

Distance and transposition:
```js
tonal.transpose('F#2', '2M') // => 'G#2'
tonal.transpose('2M', '2M') // => '3M'
tonal.interval('F2', 'B2') // => '4A'
```

#### [Intervals](https://github.com/danigb/tonal/blob/master/docs/interval.md)

Intervals are also strings:

```js
tonal.interval('M2') // => 'M2'
tonal.interval('-P4') // => '-P4'
tonal.interval('nope') // => null
tonal.semitones('P5') // => 7
```

And can also be manipulated:
```js
tonal.simplify('9m') // => '2m'
tonal.add('2M', '2M') // => '3M'
tonal.invert('2M') // => '7m'
```

#### Collections and pitch sets

```js
// work with collections
tonal('A B C D E').transpose('2M') // => ['B4', 'C#5', 'D5', 'E5', 'F#5']
tonal('1P 2M 3M').transpose('D4') // => ['D4', 'E4', 'F#4']

// pitch class sets
tonal('C4 D4 E6 D5 F2 C5 F6').set() // => ['C', 'D', 'E', 'F']
```

#### [Chords](https://github.com/danigb/tonal/blob/master/docs/chord.md)

#### [Scales](https://github.com/danigb/tonal/blob/master/docs/scale.md)

#### [Key](https://github.com/danigb/tonal/blob/master/docs/key.md)

Take a look to [the source](https://github.com/danigb/tonal/blob/master/lib) or the [documentation](https://github.com/danigb/tonal/tree/master/docs)


## Usage

Install via npm: `npm i --save tonal`

Then you can use the tonal facade:

```js
var tonal = require('tonal')
tonal.transpose(tonal.fromMidi(60), '2M')
```

or require the functions individually:

```js
var transpose = require('tonal/pitch/transpose')
tranpose('5P', 'C')
```

The tonal facade only have a selection of all the available functions.

## Examples

This are the examples from teoria ported to `tonal`:

```js
// Create pitches
pitch('a4') // => { name: 'a4', pitchClass: 'A', midi: 69 ... }
fromMidi(60) // => 'C4'
fromKey(28) // =>

// Create notes from intervals
distance('A4', 'G7') // => '7m'
transpose('A4', '6M') // => 'F#5'
invert(distance('a4', 'bb5')) // => '7M'

// Scales
scale('A aeolian') // => ['A4', 'B4', 'C5', ...]
scale('g5 ionian') // => ['G5', 'A5', ...]
scale('mixolydian') // => ['1P', '2M', '3M', '4P', '5P', '6M', '7m']

// Chords
chord('Asus4') // => [ 'A4', 'B4', 'E5' ]
chord('Bb69M#11') // => [ 'Bb4', 'D5', 'F5', 'G5', 'C5', 'E5' ]

// Tonal doesn't allow crazy chaining:
var note = get('thirth', scale('A4 lidian').map(transpose('2M')))
chord('maj9')(note)
```

Examples ported from MusikKit:

```js
var V7ofV = function(pitch) { chord(transpose(pitch, '5P'), '7') }
V7ofV('D') // => ['A4', 'C#5', 'E5', 'G5']
```

## Documentation and tests

The functions are extensively documented inside the code. The documentation can be read [here](https://github.com/danigb/tonal/blob/master/docs)

To run the tests, clone this repository and run:

```bash
npm install
npm test
```

## Resources and inspiration

This library takes inspiration from lot of places:

- Teoria: https://github.com/saebekassebil/teoria
- Impro-Visor: https://www.cs.hmc.edu/~keller/jazz/improvisor/
- MusicKit: https://github.com/benzguo/MusicKit
- Music21: http://web.mit.edu/music21/doc/index.html

The binary representation of the scales are based on the awesome book [Arpeggio & Scale Resources](https://archive.org/details/ScaleAndArpeggioResourcesAGuitarEncyclopedia) by [Rich Cochrane](http://cochranemusic.com/). Additional scale stuff (like scale spaces) are inspired by the works of [Walter Zettel](http://www.muzuu.org/new_life/pics/simpleblog/scales/scalesadvice.html) and [William Zeitler](http://www.allthescales.org/)

Interval analisys is based on the book [Harmonic Materials of Modern Music](https://archive.org/details/harmonicmaterial00hans) of Howard Hanson.

A Corpus Study of Rock Music:  http://theory.esm.rochester.edu/rock_corpus/index.html
Musical futures: https://www.musicalfutures.org/

Music JSON proposal: https://github.com/soundio/music-json

Staff notation: http://opusmodus.com/omn.html

## License

MIT License
