// Node server which willhandle socket.io connections.

const io = require('socket.io')(8000)

const users = {};

io.on('connection', socket => {
    // if any new user join, let other users connected to the server to know!
    socket.on('new-user-joined', name => {
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    // If someone send the message, broadcast all the other users!
    socket.on('send', message => {
        socket.broadcast.emit('receive', {
            message: message,
            name: users[socket.id]
        });
    });

    // If someone leave the chat, broadcast all the other users!
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})