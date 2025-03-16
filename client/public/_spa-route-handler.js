// This file is used by some hosting providers to handle SPA routing
// It's a simple script that redirects all requests to index.html

exports.handler = function(event, context, callback) {
  return {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: require('fs').readFileSync('./index.html', 'utf-8')
  };
}; 