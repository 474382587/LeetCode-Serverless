
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

const mongoose = require('mongoose');
// 连接数据库 - connect databse

var PostSchema = new mongoose.Schema({
    content: String,
    tags: Array,
    username: String,
    title: String,
    createdAt: String,
    likes: Number,
    Comments: Array
})
var Post = mongoose.model('Post', PostSchema)
exports.handler = function (event, context, callback) {
    // your server-side functionality
    const { httpMethod, headers, path, queryStringParameters } = event

    if (httpMethod !== 'POST') {
        callback({
            statusCode: 404,
        })
    }
    try {
        console.log(event.body)
        console.log("++++++++++++++++++++++++++++++++")
        const body = JSON.parse(event.body)
        console.log(body)
        var {
            id
        } = body
    } catch (error) {
        console.log(error)
        callback({
            statusCode: 400,
            body: JSON.stringify({
                error: true,
                msg: 'Please put correct data in the request body',
            })
        })
    }
    console.log('body')

    mongoose.connect("mongodb+srv://jerkjoe:jinyuhui1994@cluster0-t5mtc.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true });
    console.log(12312312312312)
    
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    console.log('db')
    console.log('db: ', db)
    db.once('open', async function () {
        // we're connected!
        console.log('I am connected')

        try {
            const response = await Post.findById(id).exec() || null
            console.log(response)
            if (response) await response.save()
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    result: {
                        msg: 'All Posts successfully returned!',
                        response
                    },
                    error: false
                })
            })
        } catch (error) {
            callback(error, {
                statusCode: 400,
                body: JSON.stringify({
                    error: true,
                    result: {
                        msg: 'Something is wrong',
                    },
                })
            })
        } finally {
            console.log('closed')
            db.close()
        }

    });
    console.log('body3')
    // 


    // return {
    //     statusCode: 200,
    //     body: `http method: ${httpMethod}
    //     path: ${path}`
    // }
}


