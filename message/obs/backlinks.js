var nest = require('depnest')
var computed = require('mutant/computed')

exports.needs = nest({
  'backlinks.obs.for': 'first'
})

exports.gives = nest('message.obs.backlinks', true)

exports.create = function (api) {
  return nest({
    // DEPRECATED: should use backlinks.obs.for
    'message.obs.backlinks': (id) => backlinks(id)
  })

  function backlinks (id) {
    return computed([api.backlinks.obs.for(id)], (msgs) => {
      return msgs.map(map).filter((backlink) => {
        return backlink.type !== 'vote' && backlink.type !== 'about'
      })
    }, {
      // objects coming down this stream will be immutable
      comparer: (a, b) => a === b
    })
  }

  function map (msg) {
    return {
      dest: msg.dest,
      id: msg.key,
      timestamp: msg.timestamp,
      type: msg.value.content.type,
      root: msg.value.content.root,
      branch: msg.value.content.branch,
      author: msg.value.author
    }
  }
}
