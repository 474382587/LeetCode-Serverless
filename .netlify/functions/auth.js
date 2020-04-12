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
    
    const token = headers['x-auth-token'] || ''
    
    
    const decoded = jwt.decode(token, 'token')
    console.log('+++++++++++++++++++++++++++++++++')
    console.log(decoded)
    const userId = decoded && decoded.userId

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', async function () {
        // we're connected!
        console.log('I am connected')

        const res = await User.findOne({
            _id: userId
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
            db.close()
            return
        } else {
            
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    result: {
                        msg: 'Found such user!'
                    },
                    error: false
                })
            })
            db.close()
        }
    });
    
    console.log(headers['x-auth-token'])
}