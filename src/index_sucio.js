// 152. Creating the chat app project - rc95 26/07/2022 01:04
const path = require('path')
const express = require('express')
// 154- getting started with socket.io - rc95 27/07/2022 00:23
// https://www.npmjs.com/package/socket.io
// https://socket.io/
// npm i socket.io
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

// io.on('connection', () => {
//     console.log('New WebSocket connection..', Date())
// })

// 155 - Socket.io Events - rc95 27/07/2022 00:34
// server (emit) -> client (receive) - countUpdated
// client (emit) -> server (receive) - increment

// let count = 0
// io.on('connection', (socket) => {
//     console.log('New WebSocket connection..', Date())

//     // count++
//     socket.emit('countUpdated', count)

//     socket.on('increment', () => {
//         count++
//         // socket.emit('countUpdated', count) //esto sirve solo para una conexión, queremos para todas..
//         io.emit('countUpdated', count)
//     })
// })

// 156 - Socket.io Events Challenge - rc95 27/07/2022 00:50
io.on('connection', (socket) => {
    console.log('New WebSocket connection..', Date())

    // count++
    // socket.emit('message', 'Welcome!')
    // socket.emit('message', {
    //     text: 'Welcome!',
    //     createdAt: new Date().getTime() //agregamos el timestamp..
    // })
    //para reutilizar codigo, cremos /src/utils/messages.js
    // socket.emit('message', generateMessage('Welcome!'))

    // 157 - Broadcasting Events - rc95 27/07/2022 01:06
    // socket.broadcast.emit('message', 'A new user has joined the chat!') //esto enviará a todos menos al que ingresó recien..
    // socket.broadcast.emit('message', generateMessage('A new user has joined the chat!')) //esto enviará a todos menos al que ingresó recien..

    // socket.on('sendMessage', (message) => {
    //     io.emit('message', message)
    // })

    //rc95 30/07/2022 01:15
    socket.on('join', ({ username, room }) => {
        socket.join(room)

        // io.to.emit               //equivalente a io.emit (para el usuario)
        // socket.broadcast.to.emit //equivalente a socket.broadcast.emit (para los demás usuarios)

        socket.emit('message', generateMessage(`Welcome ${username}!`))
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined the chat!`))
    })

    // 159 - Event Acknowledgements - rc95 27/07/2022 01:26
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('Bad words are not allowed in the chat!')
        }

        // io.emit('message', message)
        io.emit('message', generateMessage(message))
        // callback('Delivered!')
        callback()
        // npm i bad-words
    })

    // socket.on('sendLocation', (coords) => {
    //     // io.emit('message', `The user location: ${coords.latitude}, ${coords.longitude}`)
    //     // https://www.google.com/maps?q=0,0
    //     io.emit('message', `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`)
    // })

    socket.on('sendLocation', (coords, callback) => {
        // io.emit('message', `The user location: ${coords.latitude}, ${coords.longitude}`)
        // https://www.google.com/maps?q=0,0
        // io.emit('message', `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`)
        // callback()

        //rc95 29/07/2022 22:06
        // io.emit('locationMessage', `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`)
        io.emit('locationMessage', generateLocationMessage(`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`))

        callback()
    })

    socket.on('disconnect', (message) => {
        // io.emit('message', 'A user has left the chat!')
        io.emit('message', generateMessage('A user has left the chat!'))
    })

    // 159 - Event Acknowledgements - rc95 27/07/2022 01:26
})




// app.listen(port, () => {
server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}/`)
})

//hasta aqui llegué.. 26/07/2022 01:30