var mqtt = require('mqtt')
const mysql = require('mysql');
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
app.use(express.static('web'));
var options = {
    port: 1883,
    host: 'mqtt.wuys.me',
    clientId: 'baitaplonmcb',
    username: 'dai',
    password: '09042001',
}
const client = mqtt.connect(options);
client.on('connect', () => {
    console.log('MQTT connected!!');
});
var sensors = 'esp32datasnsor'
const led1Topic = 'LED1s'
const led2Topic = 'LED2s'
client.subscribe(sensors, () => {
    client.on('message', (topic, message, packet) => {
        console.log(message.toString());
        io.sockets.emit('data-sensors', message.toString().split(' '))
        insertTB(`'${topic}', ${message.toString().split(' ')}`);
    });
});
io.on('connection', socket => {
    console.log(`user ${socket.id} connected`)
});

io.on('connection', socket => {
    socket.on('led1control', msg => {
        io.sockets.emit('led1control', msg);
        msg === 'on' && client.publish(led1Topic, msg)
        msg === 'off' && client.publish(led1Topic, msg)
    });
    socket.on('led2control', msg => {
        io.sockets.emit('led2control', msg);
        msg === 'on' && client.publish(led2Topic, msg)
        msg === 'off' && client.publish(led2Topic, msg)
    })
})

server.listen(6060, () => {
    console.log('listening on *:3000')
});
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'datass',
});

conn.connect(err => {
    if (err) throw err;
    console.log('Connected!');
    const sqlCreateTB = `CREATE TABLE datasensors (
        ID int(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        topic char(50),
        temp int(10),
        hum int(10),
        light int(10),
        currentTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );`;
    conn.query(sqlCreateTB, function (err, result) {
        if (err) throw err;
        console.log('Table created');
    });
});
function insertTB(msg) {
     const sqlInsert = `INSERT INTO datasensors (topic, temp, hum, light) VALUES (${msg})`;
     conn.query(sqlInsert, (err, results) => {
       if (err) throw err;
    });
}