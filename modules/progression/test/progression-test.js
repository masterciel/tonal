var test = require('tape')
var prog = require('..')
function exec (str) { return prog.romanRegex().exec(str).slice(0, 4) }

test('build progression', function (t) {
  t.deepEqual(prog.build('I IIm7 V7', 'C'), ['C', 'Dm7', 'G7'])
  t.deepEqual(prog.build('Imaj7 2 IIIm7', 'C'), [ 'Cmaj7', null, 'Em7' ])
  t.end()
})

test('roman regex', function (t) {
  var nums = 'I II III IV V VI VII'.split(' ')
  nums.forEach(function (n) {
    t.deepEqual(exec(n), [n, '', n, ''])
    var l = n.toLowerCase()
    t.deepEqual(exec(l), [l, '', l, ''])
  })

  nums.forEach(function (n) {
    '# ## b bb'.split(' ').forEach(function (alt) {
      t.deepEqual(exec(alt + n), [alt + n, alt, n, ''])
    })
  })

  t.deepEqual(exec('bVImaj7'), ['bVImaj7', 'b', 'VI', 'maj7'])
  t.deepEqual(exec('III dom'), ['III dom', '', 'III', 'dom'])
  t.end()
})
