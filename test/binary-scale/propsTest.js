var vows = require('vows')
var assert = require('assert')
var props = require('../../lib/binary-scale/props')

vows.describe('binary-scale/props').addBatch({
  'get binary properties': function () {
    assert.deepEqual(props('101011010101'), {
      decimal: 2773,
      length: 7,
      distances: [ 2, 2, 1, 2, 2, 2, 1 ],
      leap: 2
    })
  }
}).export(module)
