/* global describe it */
var assert = require('assert')
var dictionary = require('..')

describe('music-dictionary properties', function () {
  it('no aliases', function () {
    var d = dictionary({'m': ['1 3b 5'], 'M': ['1 3 5']})
    assert.deepEqual(d.names, ['m', 'M'])
    assert.deepEqual(d.aliases, ['m', 'M'])
  })
  describe('data', function () {
    var chords = dictionary({'Maj7': ['1 3 5 7', ['maj7', 'M7']]})
    it('get by name', function () {
      assert.deepEqual(chords.data['Maj7'], {
        name: 'Maj7',
        intervals: [ '1', '3', '5', '7' ],
        steps: [ [ 0, 0 ], [ 4, -2 ], [ 1, 0 ], [ 5, -2 ] ],
        aliases: [ 'maj7', 'M7' ],
        binary: '100010010001',
        decimal: 2193
      })
    })
    it('get by alias', function () {
      assert.deepEqual(chords['maj7'], chords['Maj7'])
      assert.deepEqual(chords['M7'], chords['Maj7'])
    })
    it('get names', function () {
      assert.deepEqual(chords.names, [ 'Maj7' ])
    })
    it('get names with aliases', function () {
      assert.deepEqual(chords.aliases, [ 'Maj7', 'maj7', 'M7' ])
    })
  })
})
