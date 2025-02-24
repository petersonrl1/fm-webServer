const express = require("express");
const server = require("http").createServer();
const app = express();
PORT = 3000;

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);
server.listen(PORT, () => {
  console.log("Server started on http://localhost:3000");
});

/** Begin websocket */
const WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({ server: server });

wss.on("connection", function connection(ws) {
  const numClients = wss.clients.size;
  console.log(`Client connected. ${numClients} clients connected.`);

  wss.broadcast(`Current number of clients: ${numClients}`);

  if (ws.readyState === ws.OPEN) {
    ws.send("Welcome to my server!");
  }

  ws.on("close", function close() {
    console.log("Client disconnected");
    wss.broadcast(
      `Client disconnected. Current number of clients: ${numClients}`
    );
  });
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === client.OPEN) {
      client.send(data);
    }
  });
}
