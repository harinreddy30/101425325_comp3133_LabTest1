const GroupMessage = require('../models/GroupMessage');
const PrivateMessage = require('../models/PrivateMessage');

const users = new Map();

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('New user connected:', socket.id);

        // Handle user joining a room
        socket.on('joinRoom', ({ username, room }) => {
            socket.join(room);
            users.set(socket.id, { username, room });

            // Notify the user that they have joined
            socket.emit('message', { user: 'admin', text: `Welcome, ${username}!` });

            // Broadcast to other users in the room
            socket.broadcast.to(room).emit('message', { 
                user: 'admin', 
                text: `${username} has joined the chat.` 
            });
        });

        // Handle sending messages
        socket.on('chatMessage', async ({ message, room }) => {
            const user = users.get(socket.id);
            if (user) {
                const newMessage = new GroupMessage({
                    username: user.username,
                    room: room,
                    message: message,
                    timestamp: new Date()
                });

                await newMessage.save();

                io.to(room).emit('message', { user: user.username, text: message });
            }
        });

        // Handle private messaging
        socket.on('privateMessage', async ({ recipient, message }) => {
            const sender = users.get(socket.id);
            if (!sender) return;

            const recipientSocketId = [...users.entries()]
                .find(([_, user]) => user.username === recipient)?.[0];

            if (recipientSocketId) {
                io.to(recipientSocketId).emit('privateMessage', { 
                    sender: sender.username, 
                    text: message 
                });

                const newPrivateMessage = new PrivateMessage({
                    sender: sender.username,
                    recipient: recipient,
                    message: message,
                    timestamp: new Date()
                });

                await newPrivateMessage.save();
            }
        });

        // Handle user disconnect
        socket.on('disconnect', () => {
            const user = users.get(socket.id);
            if (user) {
                io.to(user.room).emit('message', { 
                    user: 'admin', 
                    text: `${user.username} has left the chat.` 
                });
                users.delete(socket.id);
            }
            console.log('User disconnected:', socket.id);
        });
    });
};
