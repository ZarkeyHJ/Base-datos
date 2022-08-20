const socket = io()

// socket.on('countUpdated', (count) => {
//     console.log('The count has been updated: ' + count, Date())
// })

// document.querySelector('#btnIncrement').addEventListener('click', () => {
//     console.log('Clicked', Date())
//     socket.emit('increment')
// })

//Elements
// const $frmMessage = document.querySelector('#frmMessage')
// const $txtMessage = $frmMessage.elements.txtMessage
// const $btnSend = $frmMessage.querySelector('#btnSend')
// const $btnSendLocation = document.querySelector('#btnSendLocation')
// const $divMessages = document.querySelector('#messages')

const $frmMessage = document.querySelector('#message-form')
const $txtMessage = $frmMessage.querySelector('input')
const $btnSend = $frmMessage.querySelector('button')
const $btnSendLocation = document.querySelector('#send-location')
const $divMessages = document.querySelector('#messages')
const $divSidebar = document.querySelector('#sidebar')

//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // new message element
    const $newMessage = $divMessages.lastElementChild

    // height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // console.log(newMessageStyles)
    // console.log(newMessageMargin)

    //visible height
    const visibleHeight = $divMessages.offsetHeight

    //Height of messages container
    const containerHeight = $divMessages.scrollHeight

    //how far have i scrolled?
    // const srollOffset = $divMessages.scrollTop //nos arroja la distancia scrolleada desde donde estamos y el TOP
    const scrollOffset = $divMessages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $divMessages.scrollTop = $divMessages.scrollHeight

        //comentario, solo con esta 1 linea de arriba podríamos hacer el scroll al final.
        // pero con cada mensaje entrante estaríamos scrolleando..
        // si el usuario estaba mirando mensajes anteriores, le estaremos moviendo el scroll
        // y esto definitivamente va a afectar la experiencia del ususario..
    }
}

socket.on('message', (message) => {
    console.log('Message: ' + message, Date())//esto sale en la consola del navegador
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('DD/MM/YYYY HH:mm:ss')

    })
    $divMessages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

//rc95 29/07/2022 22:06
socket.on('locationMessage', (message) => {
    console.log('message', message)//esto sale en la consola del navegador

    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('DD/MM/YYYY HH:mm:ss')
    })
    $divMessages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

//rc95 30/07/2022 09:33 - update user list
socket.on('roomData', ({ room, users }) => {
    // console.log('room', room)
    // console.log('users', users)

    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    $divSidebar.innerHTML = html
})

// document.querySelector('#btnSend').addEventListener('click', () => {
// document.querySelector('#frmMessage').addEventListener('submit', (e) => {
$frmMessage.addEventListener('submit', (e) => {
    e.preventDefault()

    $btnSend.setAttribute('disabled', 'disabled')

    console.log('Clicked', Date())
    // const txtMessage = document.querySelector('#txtMessage')
    // const txtMessage = e.target.elements.txtMessage

    // socket.emit('sendMessage', txtMessage.value)
    // 159 - Event Acknowledgements - rc95 27/07/2022 01:26
    // socket.emit('sendMessage', txtMessage.value, (error) => {
    socket.emit('sendMessage', $txtMessage.value, (error) => {
        if (error) {
            return console.log(error, Date())
        }
        console.log('The message was delivered!', Date())

        $btnSend.removeAttribute('disabled')
    })

    // txtMessage.value = ''
    $txtMessage.value = ''
    $txtMessage.focus()
})

// 158 - Sharing your location - rc95 27/07/2022 01:11
// mdn geolocation
// document.querySelector('#btnSendLocation').addEventListener('click', () => {
$btnSendLocation.addEventListener('click', () => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser!')
    }
    $btnSendLocation.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        console.log('geolocation:', position)
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            console.log('The location was delivered!', Date())
            $btnSendLocation.removeAttribute('disabled')
        })

    })

    $txtMessage.focus()
})


// 159 - Event Acknowledgements - rc95 27/07/2022 01:26
// server (emit) -> client (receive) --acknowledgement--> server  
// client (emit) -> server (receive) --acknowledgement--> client  


// 160 - Form and Button States - rc95 27/07/2022 01:41

// 161 - Rendering Messages - rc95 27/07/2022 01:54
// https://gist.github.com/andrewjmead/3e3e310aea27f10f7f1ce506b39dfcbe
// hasta aqui dejé..


// 162 - Rendering Location Messages - rc95 29/07/2022 22:04 

// 163. Working with time //rc95 29/07/2022 22:19
const now = new Date
//esto sale en la consola del navegador
console.log('now', now)
console.log('now.toString()', now.toString())
console.log('now.getDate()', now.getDate())
console.log('now.getMonth()', now.getMonth())
console.log('now.getYear()', now.getYear())
console.log('now.getTime() (TIMESTAMP)', now.getTime())


// 164. timestamps for location messages.. //rc95 29/07/2022 22:41
// 165. styling the chat app

// 166. Join Page.. //rc95 30/07/2022 00:31

// 167. Socket.io Rooms.. //rc95 30/07/2022 01:09
console.log('location.search', location.search)

// socket.emit('join', { username, room })

// 168. Storing users: part 1 //rc95 30/07/2022 01:24

// 169. Storing users: part 2 - challenge //rc95 30/07/2022 01:41

// 170. Tracking users joining and leaving.. //rc95 30/07/2022 01:49
socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})

// 171. Sending messages to Rooms.. //rc95 30/07/2022 02:33
//FIN.. 30/07/2022 02:51

// 172. Rendering user list //rc95 30/07/2022 09:33

// 173. automatic scrolling //rc95 30/07/2022 09:47