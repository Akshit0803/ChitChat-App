// This is the node server to handle the socket io connections


const io = require('socket.io')(8000); // Using socket io on port 8000

//socket.io server listening to the incoming events

const users={};

// socket.io instance = io.on , listens to various events - ex- some user connected
//socket.on handles what happens to a particular connection (socket.on accepts an event which in this case is user-joined ) 

// new-user-joined, user-joined, send, receive etc are custom events

io.on('connection', socket=>{
    
    // If new user joined in, let other users know
    socket.on('new-user-joined', name=>{
        users[socket.id]=name;
        socket.broadcast.emit('user-joined', name); 
    });

    // If someone sends a message, broadcast it to others
    socket.on('send', message=>{
        socket.broadcast.emit('receive', {message: message, name:users[socket.id]})
    });

    // Disconnect event('built-in' event) fires up when a person leaves the chat. let others know
    socket.on('disconnect', message=>{
        socket.broadcast.emit('user-left',users[socket.id]);
        delete users[socket.id];
    });
})
