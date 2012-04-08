var request = require('request')
  , http = require('http')
  , url = require('url')

var server = http.createServer(function(req, res) {
  var urlobj = url.parse(req.url, true)
  var pathparts = urlobj.pathname.split('/')
  if (pathparts.length < 2) {
    res.writeHead(404)
    res.end('sorry, not index site yet')
  } else if (pathparts[1] === 'run') {
    var target = urlobj.query['target']
    if (typeof target !== 'string') {
      res.writeHead(400)
      return res.end('invalid/missing target')
    }
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'})
    res.write('<!DOCTYPE html><html><head><style>.chunk{font-family:monospace} .time{background-color:#000000;color:#ffffff}</style></head><body><p>')
    var t0 = Date.now()
    var perftestRequest = request({uri: target, encoding: 'utf8'})
    perftestRequest.on('data', function(chunk) {
      res.write('<span class="time">'+(Date.now()-t0)+'ms</span><span class="chunk">'+escapeHTML(chunk)+'</span>')
    })
    perftestRequest.on('end', function() {
      res.end('</p><p class="time">done at '+(Date.now()-t0)+'ms</p></body></html>')
    })
  } else {
    res.writeHead(404)
    res.end('sorry, not found: '+pathparts[1].replace(/[^a-zA-Z]g/, 'X'))
  }
})
server.listen(8375)

function escapeHTML(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
