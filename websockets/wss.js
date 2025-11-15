const WebSocket = require("ws");
const { broadcast } = require("./broadcast.js");
const notifier = require("../events/notifier.js");

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

  // The server emits a simple text to all connected clients only when the database is
  // modified, to trigger page refresh and enabling efficient real-time syncing.
  // This is implemented via a custom EventEmitter. A future update will optimize this by sending only the portion of the
  // HTML message list with the new messages, to be prepended to the message list.

  // Note: since the page is just refreshed, the functionality of unread
  // message count is broken (ie, a new message becomes read as soon as the
  // next refresh is issued). This will be fixed later on.

  const writeMessage = async () => {
    const data = "there are new messages"; // await getUpdatedDataForMessageList(); // TODO
    broadcast(wss, data);
  };

  notifier.on("db-updated", writeMessage);
}

module.exports = initWebSocket;
