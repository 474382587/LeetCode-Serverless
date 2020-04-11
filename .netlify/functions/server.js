exports.handler = function(event, context, callback) {
    // your server-side functionality
    const {httpMethod, headers, path, queryStringParameters} = event
    // const body = JSON.parse(event.body || {})
    callback(null, {
        statusCode: 200,
        body: `http method: ${httpMethod}
        path: ${path}`
    })
}
/**
 * event looks like this:
 * {
    "path": "Path parameter",
    "httpMethod": "Incoming request's method name"
    "headers": {Incoming request headers}
    "queryStringParameters": {query string parameters }
    "body": "A JSON string of the request payload."
    "isBase64Encoded": "A boolean flag to indicate if the applicable request payload is Base64-encode"
}
 */