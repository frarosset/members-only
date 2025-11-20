const WebSocket = require("ws");
const { debouncedWithMaxWaitBroadcast } = require("./broadcast.js");
const notifier = require("../events/notifier.js");

const wssPingInterval = Number(process.env.WSS_PING_INTERVAL_MIN) * 60000;

function heartbeat(ws) {
  ws.isAlive = true;
}

function initWebSocket(server) {
  // This connection is designed to notify connected clients about
  // new messages sent to the server, not to receive messages
  // from clients.

  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log(`Client connected (tot: ${wss.clients.size})`);

    heartbeat(ws);

    // Close client connections if there are too much
    if (wss.clients.size > process.env.MAX_WSS_CLIENTS) {
      ws.destroy(1013, "Server overloaded");
      return;
    }

    ws.on("close", () => {
      console.log(`Client disconnected (tot: ${wss.clients.size})`);
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    ws.on("pong", () => heartbeat(ws));
  });

  // The server emits a simple text to all connected clients only when the database is
  // modified, to trigger page refresh and enabling efficient real-time syncing.
  // This is implemented via a custom EventEmitter.

  // Since the page is just refreshed, the functionality of unread
  // message count would broke (ie, a new message becomes read as soon as the
  // next refresh is issued). This is fixed setting a wsRefresh cookie when such
  // is issued, which prevents the update of last read message id.

  // The cookie is set client side, because once the webSocket connection has been established,
  // it's an open TCP socket and the protocol is no longer http,
  // thus there is no built-in way to exchange cookies.
  // See: https://stackoverflow.com/a/39202006

  const writeMessage = async () => {
    const data = "refreshForDbUpdated";
    debouncedWithMaxWaitBroadcast(wss, data);
  };

  notifier.on("dbUpdated", writeMessage);

  const interval = setInterval(function ping() {
    console.log(`PING: check ws clients (tot: ${wss.clients.size})`);
    wss.clients.forEach((ws) => {
      if (!ws.isAlive) {
        return ws.terminate();
      }

      ws.isAlive = false;
      ws.ping();
    });
  }, wssPingInterval);

  wss.on("close", () => clearInterval(interval));
}

module.exports = initWebSocket;
