const socketIO = require('socket.io');
const express = require('express');
const http = require('http');
const fs = require('fs');
// port
const port = process.env.PORT || 5500

let app = express();

let server = http.createServer(app);
let io = socketIO(server);

app.use(express.static(__dirname + "/../public"));

io.on('connection', (socket) => {
    console.log('nuovo utente');

    let prophecies = JSON.parse(fs.readFileSync('./server/cache/prophecies.json', 'utf-8'));

    socket.emit('updateList', prophecies);

    var views = JSON.parse(fs.readFileSync('./server/cache/views.json', 'utf-8'));

    views.views = views.views + 1;

    fs.writeFileSync('./server/cache/views.json', JSON.stringify(views), (err) => {
        if (err) console.log(err);
    });

    socket.on('emitNew', (obj) => {
        let prophecies = JSON.parse(fs.readFileSync('./server/cache/prophecies.json', 'utf-8'));

        prophecies.prophecies.unshift(obj);

        fs.writeFileSync('./server/cache/prophecies.json', JSON.stringify(prophecies), (err) => {
            if (err) console.log(err);
        });
        
        prophecies = JSON.parse(fs.readFileSync('./server/cache/prophecies.json', 'utf-8'));
        io.emit('updateList', prophecies);
    })
});

server.listen(port, () => {
    console.log('SERVER running on port: ', port);
});