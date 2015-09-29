var MD = require('./markdown')

var GITHUB = 'https://github.com/danigb/tonal/tree/master'

module.exports = function (sources) {
  function mdFunctionLink (src) {
    return MD.link(src.name, sources.repo('docs', src.module + '.md' +
      ('#' + src.module + src.name).toLowerCase()))
  }

  function markdownSourceRow (src) {
    var summary = src.jsdoc.description.summary.replace('\n', ' ')
    var examples = src.findTags('example', src.jsdoc)
    var example = examples.length ? examples[0]['string'] : ''
    example = example.split('\n')[0]

    return MD.tbody(
      MD.bold(mdFunctionLink(src)),
      summary + '<br>' + MD.code(example),
      MD.link(src.module, [GITHUB, 'docs', src.module + '.md'].join('/')),
      MD.link(src.name + '.js', [GITHUB, 'lib', src.module, src.name + '.js'].join('/'))
    )
  }

  return MD.lines(
    MD.h3('Function index'),
    MD.thead('name', 'description', 'module', 'source'),
    sources.ordered.map(markdownSourceRow),
    MD.line('Number of functions: ', sources.ordered.length)
  )
}
