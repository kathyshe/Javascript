//////////////////////////////////////////////////////
//
// Write an HTTP server that serves JSON data when it 
// receives a GET request to the path '/api/parsetime'. 
//
//////////////////////////////////////////////////////
var http = require('http')
var url = require('url')

// - Expect the request to contain a query 
//   string with a key 'iso' and an ISO-format time as 
//   the value. For example
//     /api/parsetime?iso=2013-08-10T12:10:15.474Z
// - The JSON response should contain only 'hour', 'minute' 
//   and 'second' properties. For example:
// 
//     {
//       "hour": 14,
//       "minute": 23,
//       "second": 15
//     }
// 

function parse_currenttime () {
        var d = new Date()
        return {
                year: d.getYear(),
                month: d.getMonth(),
                date: d.getDate(),
                hour: d.getHours(),
                minute: d.getMinutes()
        }
}

function parsetime (time) {
  return {
    hour: time.getHours(),
    minute: time.getMinutes(),
    second: time.getSeconds()
  }
}

// Add second endpoint for the path '/api/unixtime' which 
// accepts the same query string but returns UNIX epoch 
// time under the property 'unixtime'. For example:
// 
//     { "unixtime": 1376136615474 }

function unix_currenttime() {
        var d = new Date()
        return { unixtime : d.getTime() }
}

function unixtime (time) {
  return { unixtime : time.getTime() }
}

var server = http.createServer(function (req, res) {
  // req.url = /api/parsetime?iso=2013-08-10T12:10:15.474Z
  //        or
  // req.url = /api/unixtime?iso=2013-08-10T12:10:15.474Z
  var parsedUrl = url.parse(req.url, true)

  // time = 2013-08-10T12:10:15.474Z
  var time = new Date(parsedUrl.query.iso)
  var result
  
  // match req.url with the string /api/parsetime
    // e.g., of time "2013-08-10T12:10:15.474Z"
  if (/^\/api\/parse_currenttime/.test(req.url))
    result = parse_currenttime()
  // match req.url with the string /api/unixtime
  else if (/^\/api\/unix_currenttime/.test(req.url))
    result = unix_currenttime()

  if (result) {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(result))
  } else {
    res.writeHead(404)
    res.end()
  }
})
server.listen(Number(process.argv[2]))
