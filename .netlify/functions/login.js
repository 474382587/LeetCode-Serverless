const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
// 连接数据库 - connect databse
mongoose.connect("mongodb+srv://jerkjoe:jinyuhui1994@cluster0-t5mtc.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true });

var UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    username: String
})
var User = mongoose.model('User', UserSchema)

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
            username,
            password,
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

        const res = await User.findOne({
            username
        })
        console.log(res)
        if (!res) {
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    result: {
                        msg: 'No such user found!'
                    },
                    error: false
                })
            })
            return
        } else {
            if (res.password === password) {
                var userToken = ''
                console.log(res)
                jwt.sign(
                    { userId: res._id },
                    'token',
                    {
                        expiresIn: 360000
                    },
                    (err, token) => {
                        if (err) {
                            db.close()
                            throw err;
                        }
                        console.log(token)
                        userToken = token
                        callback(null, {
                            statusCode: 200,
                            body: JSON.stringify({
                                result: {
                                    token: userToken,
                                    msg: 'User successfully logged in!'
                                },
                                error: false
                            })
                        })
                        db.close()
                    }
                );
                return
            } else {
                callback(null, {
                    statusCode: 400,
                    body: JSON.stringify({
                        result: {
                            msg: 'User credential not match!'
                        },
                        error: false
                    })
                })
                db.close()
            }
        }
    });

    // 


    // return {
    //     statusCode: 200,
    //     body: `http method: ${httpMethod}
    //     path: ${path}`
    // }
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