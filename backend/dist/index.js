import { WebSocketServer, WebSocket } from "ws";
const server = new WebSocketServer({ port: 8080 });
server.on('connection', (socket) => {
    socket.send('HI from the ws server');
    socket.on('message', (msg) => {
        server.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(msg.toString());
            }
        });
    });
});
//# sourceMappingURL=index.js.map