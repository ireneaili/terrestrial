var express = require('express')
var bodyParser = require('body-parser');
var app = express();
const AWS = require('aws-sdk')
const config = require('./config/config')
const isDev = process.env.NODE_ENV !== 'production'

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/fruits', (req, res, next) => {
    // if (isDev) {
    //     AWS.config.update(config.aws_local_config)
    // } else {
    //     AWS.config.update(config.aws_remote_config)
    // }

    AWS.config.update(config.aws_local_config)

    const docClient = new AWS.DynamoDB.DocumentClient()

    const params = {
        TableName: config.aws_table_name
    }

    docClient.scan(params, function(err, data) {
        if (err) {
            res.send({
                success: false,
                message: 'Error: Server error'
            })
        } else {
            const { Items } = data

            res.send({
                success: true,
                message: 'loaded fruits',
                fruits: Items
            })
        }
    })
})

app.get('/fruit', (req, res, next) => {
    // if (isDev) {
    //     AWS.config.update(config.aws_local_config)
    // } else {
    //     AWS.config.update(config.aws_remote_config)
    // }

    AWS.config.update(config.aws_local_config)

    const fruitId = req.query["fruitId"]
    console.log(fruitId)

    const docClient = new AWS.DynamoDB.DocumentClient()

    const params = {
        TableName: config.aws_table_name,
        KeyConditionExpression: 'fruitId = :i',
        ExpressionAttributeValues: {
            ':i': fruitId
        }
    }

    docClient.query(params, function(err, data) {
        if (err) {
            res.send({
                success: false,
                message: 'Error: Server error'
            })
        } else {
            console.log('data', data)
            const { Items } = data

            res.send({
                success: true,
                message: 'Loaded fruits',
                fruits: Items
            })
        }
    })
})

app.post('/fruit', (req, res, next) => {
    // if (isDev) {
    //     AWS.config.update(config.aws_local_config)
    // } else {
    //     AWS.config.update(config.aws_remote_config)
    // }
    AWS.config.update(config.aws_local_config)

    const { type, color } = req.body
    const fruitId = (Math.random() * 1000).toString()

    const docClient = new AWS.DynamoDB.DocumentClient()

    const params = {
        TableName: config.aws_table_name,
        Item: {
            fruitId: fruitId,
            type: type,
            color: color
        }
    }

    docClient.put(params, function(err, data) {
        if (err) {
            res.send({
                success: false,
                message: 'Error: Server error',
                error: err.toString()
            })
        } else {
            console.log('data'. data)
            const { Items } = data

            res.send({
                success: true,
                message: 'Added fruit',
                fruitId: fruitId
            })
        }
    })
})

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
  });