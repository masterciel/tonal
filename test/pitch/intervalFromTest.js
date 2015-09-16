var vows = require('vows')
var assert = require('assert')
var intervalFrom = require('../../lib/pitch/intervalFrom')

vows.describe('pitch/intervalFrom').addBatch({
  'intervalFrom': function () {
    var notes = 'C D E F G A B C5'.split(' ')
    assert.deepEqual(notes.map(intervalFrom('C4')),
      ['1P', '2M', '3M', '4P', '5P', '6M', '7M', '8P'])
    assert.deepEqual(notes.map(intervalFrom('C3')),
      ['8P', '9M', '10M', '11P', '12P', '13M', '14M', '15P'])
  }
}).export(module)
