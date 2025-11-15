const broadcast = (wss, message) => {
  console.log("Broadcasting to ", wss.clients.size, "connected clients");
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
};

module.exports = { broadcast };
