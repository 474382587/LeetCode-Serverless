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

    console.log(httpMethod)


    if (httpMethod !== 'POST') {
        callback({
            statusCode: 404,
        })
    }

    console.log(':: ', event.body)
    // const body = JSON.parse( || {})

    try {
        const body = JSON.parse(event.body)
        var {
            username,
            password,
            email
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

        if (res) {
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    result: {
                        msg: 'Please select another user name, the user name you selected is taken'
                    },
                    error: false
                })
            })
            return
        }



        const newUser = new User({
            username,
            password,
            email
        })
        const response = await newUser.save()
        console.log('I am connected 212312312')

        var userToken = ''
        console.log(response)
        jwt.sign(
            { userId: response._id },
            'token',
            {
                expiresIn: 360000
            },
            (err, token) => {
                if (err) {
                    throw err;
                }
                console.log(token)
                userToken = token
                callback(null, {
                    statusCode: 200,
                    body: JSON.stringify({
                        result: {
                            token: userToken,
                            msg: 'User successfully created!'
                        },
                        error: false
                    })
                })
                db.close()
            }
        );

        


        
        console.log(123123133131232131231232)
        
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