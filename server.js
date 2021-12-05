const koa = require('koa');
const http = require('http');
const serve = require('koa-static');
const path = require('path');
const socketIO = require('socket.io');

const hostname = '127.0.0.1';
const post = 8080;
const publicPath = path.join(__dirname, 'public');

const app = new koa();
const server = http.createServer(app.callback());
const io = socketIO(server);
const users = new Map();
const history = [];

io.on('connection', (socket) => {
    const name = socket.handshake.query.name;
    users.set(name, socket);
    console.log(`${name} connected`);
    io.sockets.emit('online', [...users.keys()]);
    socket.on('sendMessage', (content) => {
        console.log('receive a message', name, content);
        const message = {
            time: Date.now(),
            sender: name,
            content
        };
        history.push(message);
        socket.broadcast.emit('receiveMessage', message);
    });
    socket.on('getHistory', (fn) => {
        fn(history);
    });
    socket.on('disconnect', (socket) => {
        users.delete(name, socket);
        console.log(`${name} disconnected`);
        io.sockets.emit('online', [...users.keys()]);
    });
});

io.use((socket, next) => {
    const { name, password } = socket.handshake.query;
    if(!name) {
        return next(new Error('No username'));
    }
    if(password !== '15928') {
        return next(new Error('Worse password'));
    }
    next();
})

app.use(serve(publicPath));

server.listen(post, hostname, () => {
    console.log(`server running at http://${hostname}:${post}`);
});