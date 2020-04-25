
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
mongoose.connect("mongodb+srv://jerkjoe:jinyuhui1994@cluster0-t5mtc.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true });

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
            id,
            content,
            tags,
            username,
            title,
            createdAt,
            likes,
            Comments,
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


    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', async function () {
        // we're connected!
        console.log('I am connected')
        try {
            const response = await Post.findOneAndUpdate({ _id: id }, {
                content,
                tags,
                username,
                title,
                createdAt,
                likes,
                Comments
            })
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    result: {
                        msg: 'Post successfully updated!',
                        response
                    },
                    error: false
                })
            })
        } catch (error) {
            console.log(error)
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
            db.close()
        }

    });

    // 


    // return {
    //     statusCode: 200,
    //     body: `http method: ${httpMethod}
    //     path: ${path}`
    // }
}


