const WebSocket = require("ws");
const { broadcast } = require("./broadcast.js");

function initWebSocket(server) {
  // This connection is designed to notify connected clients about
  // new messages sent to the server, not to receive messages
  // from clients.

  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log(`Client connected (tot: ${wss.clients.size})`);

    ws.on("close", () => {
      console.log(`Client disconnected (tot: ${wss.clients.size})`);
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  });

  // Currently, the server broadcasts a simple text to all connected clients
  // on a periodic interval, to trigger page refresh. A future update will
  // optimize this by broadcasting only when the message list has changed, and
  // by sending only the portion of the HTML message list with the new messages,
  // to be prepended to the message list.

  // Note: since the page is just refreshed, the functionality of unread
  // message count is broken (ie, a new message becomes read as soon as the
  // next refresh is issued). This will be fixed later on.

  const writeMessage = async () => {
    const data = "there are new messages"; // await getUpdatedDataForMessageList(); // TODO
    broadcast(wss, data);
  };

  setInterval(writeMessage, 10000);
}

module.exports = initWebSocket;
