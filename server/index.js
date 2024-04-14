require('dotenv').config({ path: '../.env' })

const express = require('express')
const http = require('http')
const { Server } = require("socket.io")
const mongoose = require('mongoose')
const cors = require('cors')
const axios = require('axios')
const moment = require('moment-timezone')

const user = require('./models/user')
const message = require('./models/message')

const userRoutes = require('./routes/userRoutes')
const messageRoutes = require('./routes/messageRoutes')

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
      origin: "http://localhost:9000",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  })
const PORT = process.env.PORT || 3000

const getUserProfile = async (userId) => {
    const url = `https://api.line.me/v2/bot/profile/${userId}`
    const headers = {
        'Authorization': `Bearer ${process.env.LINE_ACCESS_TOKEN}`
    }

    try {
        const response = await axios.get(url, { headers: headers })
        console.log('User Profile:', response.data)
        return response.data
    } catch (error) {
        console.error('Failed to get user profile:', error)
        return null
    }
};

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('connected MongoDB'))
    .catch(err => console.error('error connected MongoDB:', err))

app.use(cors())

app.use(express.json())

app.get('/', (req, res) => {
    res.send('Running server')
})

io.on('connection', (socket) => {
    console.log('link:', socket.id)

    socket.on('disconnect', () => {
        console.log('unlink:', socket.id)
    })

    socket.on('chatMessage', (msg) => {
        io.emit('chatMessage', msg); 
    })

    socket.on('sendMessage', (data) => {
        sendMessageToLineUser(data.userId, data.text)
    });
});

app.post('/webhook', async (req, res) => {
    const events = req.body.events
    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        console.log('LINE message:', event.message.text)
        const userProfile = await getUserProfile(event.source.userId)
        const currentTime = moment.utc().tz("Asia/Tokyo").format("YYYY-MM-DD HH:mm:ss")
  
        if (userProfile) {
            const existingUser = await user.findOne({ userId: userProfile.userId })
        
            if (!existingUser) {
            const newUser = new user({
                userId: userProfile.userId,
                nickname: userProfile.displayName,
                profilePictureUrl: userProfile.pictureUrl,
                createdAt: currentTime
            })
            await newUser.save()
            } else {
                console.log('Already existing users:', userProfile.userId)
            }
        
            const newMessage = new message({
                userId: userProfile.userId, 
                sendType: 'send',
                message: event.message.text,
                nickname: userProfile.displayName,
                profilePictureUrl: userProfile.pictureUrl,
                createdAt: currentTime
            });
            await newMessage.save()
        
            io.emit('message', {
                userId: event.source.userId,
                text: event.message.text,
                nickname: userProfile.displayName,
                profilePictureUrl: userProfile.pictureUrl,
                timestamp: currentTime
            })
        } else {
            io.emit('message', {
                userId: event.source.userId,
                text: event.message.text,
                timestamp: currentTime
            })
        }
      }
    }
    res.status(200).send('Success')
  });
  


const sendMessageToLineUser = async (userId, text) => {
    console.log(userId, text)
    const url = 'https://api.line.me/v2/bot/message/push';
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LINE_ACCESS_TOKEN}`
    };
    const body = {
        to: userId,
        messages: [
            {
                type: 'text',
                text: text
            }
        ]
    };

    try {
        const response = await axios.post(url, body, { headers: headers })
        const currentTime = moment.utc().tz("Asia/Tokyo").format("YYYY-MM-DD HH:mm:ss");
        const newMessage = new message({
            userId: userId,
            sendType: 'receive',
            message: text,
            nickname: null,
            profilePictureUrl: null,
            createdAt: currentTime
        });
        await newMessage.save()
    } catch (error) {
        if (error.response) {
            console.log("data:", error.response.data)
            console.log("status:", error.response.status)
            console.log("header:", error.response.headers)
        } else if (error.request) {
            console.log("error request:", error.request)
        } else {
            console.log("error message:", error.message)
        }
    }
}

// api status
app.use('/api/users', userRoutes)
app.use('/api/messages', messageRoutes)


server.listen(PORT, () => {
    console.log(`port number: ${PORT} `)
});
