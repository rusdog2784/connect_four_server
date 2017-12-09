var app = require("express")();
var http = require("http").Server(app);
var io = require('socket.io')(http);
var queue = [];
var first = true;

app.get('/', function(req, res) {
    res.send('<h1>Hello, World</h1>');
});

io.on('connection', function(socket) {
    socket.on('disconnect', function(nickname) {
        console.log("a user left");
        io.emit('user-left', {user: nickname, event: 'left'});
    });

    socket.on('queue', function(nickname) {
        queue.push(nickname);
        if (queue.length == 2) {
            io.emit('start-game', {player1: queue[0], player2: queue[1], event: 'start'});
            queue = [];
        }
    });

    socket.on('add-move', function(data) {
        io.emit('move', {column: data.column, username: data.username, piece: data.piece});
    });

    console.log("a user connected");
});

http.listen(3000, function() {
    console.log("Listening on port 3000");
});