const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const port = process.env.PORT || 5000;

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});

app.get('/', (req, res) => {
    res.send('<h1>Socket.IO Server is running!</h1>');
});

io.on('connection', (socket) => {
    console.log(`A user connected:${socket.id}`)

    socket.on('send_message', (data) => {

        const messageWithSender = {
            message: data.message,
            senderId: socket.id,
        };
        console.log(`Message received on server:${data}`);
        io.emit('receive_message', messageWithSender)
    })

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);

    })
})

server.listen(port, () => {
    console.log('Server is running on port :',port);

});