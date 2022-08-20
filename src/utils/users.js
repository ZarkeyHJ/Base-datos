const users = []

//addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
    // clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // validate the data
    if (!username || !room) {
        return {
            error: 'Username and Room are required!'
        }
    }

    // check for existing users
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // validate username
    if (existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    // store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    const existingUser = users.find((user) => {
        return user.id === id
    })

    if (!existingUser) {
        return {
            error: 'User not found!'
        }
    }

    return existingUser
}

const getUsersInRoom = (room) => {
    const existingUsers = users.filter((user) => {
        return user.room === room
    })

    if (existingUsers.length == 0) {
        return {
            error: 'No users at the room!'
        }
    }

    return existingUsers
}

/*
addUser({
    id: 1,
    username: 'Rodrigo',
    room: '123'
})
console.log('users', users)
addUser({
    id: 2,
    username: 'Maria',
    room: '123'
})
console.log('users', users)

const res = addUser({
    id: 33,
    username: '',
    room: ''
})

console.log('res', res)

const removedUser = removeUser(1)
console.log('removedUser', removedUser)
console.log('users', users)

const userMaria = getUser(2)
console.log('userMaria', userMaria)

const userRodrigo = getUser(1)
console.log('userRodrigo', userRodrigo)


const room1 = getUsersInRoom('qwerty')
console.log('room1', room1)

const room2 = getUsersInRoom('123')
console.log('room2', room2)
*/


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}