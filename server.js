const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let clientCount = 0;
const events = [];

wss.on('connection', (ws) => {
  clientCount++;
  console.log('New client connected. Total clients:', clientCount);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ clientCount }));
    }
  });

  events.forEach((event) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(event));
    }
  });

  ws.on('message', (message) => {
    const eventData = JSON.parse(message);
    events.push(eventData);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(eventData));
      }
    });
  });

  ws.on('close', () => {
    clientCount--;
    console.log('Client disconnected. Total clients:', clientCount);

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ clientCount }));
      }
    });
  });
});

console.log('WebSocket server is running on ws://localhost:8080');
