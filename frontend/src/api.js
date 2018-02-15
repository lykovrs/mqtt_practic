import openSocket from 'socket.io-client';
const  socket = openSocket('http://localhost:3001');
function subscribeToMessage(cb) {
    socket.on('chat message', message => cb(null, message));
}

function sendMessage(msg) {
    socket.emit('chat message', msg);
}
export { subscribeToMessage, sendMessage };