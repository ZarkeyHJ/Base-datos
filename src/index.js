const path = require('path')
const express = require('express')
const http = require('http')

const app = express()
const server = http.createServer(app)

const socketio = require('socket.io')
const io = socketio(server)

const Filter = require('bad-words')

const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection..', Date())

    // socket.on('join', ({ username, room }, callback) => {
    //     const { error, user } = addUser({ id: socket.id, username, room })
    socket.on('join', (options, callback) => {
        const { error, user } = addUser({ id: socket.id, ...options })
        if (error) {
            return callback(error)
        }
        socket.join(user.room)

        socket.emit('message', generateMessage('ADMIN', `Welcome ${user.username}!`))
        socket.broadcast.to(user.room).emit('message', generateMessage('ADMIN', `${user.username} has joined the chat!`))

        //rc95 30/07/2022 09:33 - update user list
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)

        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('Bad words are not allowed in the chat!')
        }

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id)

        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`))

        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('ADMIN', `${user.username} has left the chat!`))
            //rc95 30/07/2022 09:33 - update user list
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})

server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}/`)
})
