const generateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime() //agregamos el timestamp..
    }
}

const generateLocationMessage = (username, url) => {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}