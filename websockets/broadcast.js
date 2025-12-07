const { debounce, debounceWithMaxWait } = require("../utils/debounce.js");

const readyFcn = (ws) => ws.readyState === WebSocket.OPEN;

const broadcast = (wss, message, allowFcn) => {
  console.log("Broadcasting (", wss.clients.size, "connected clients)");

  const allow = (ws) =>
    allowFcn ? readyFcn(ws) && allowFcn(ws) : readyFcn(ws);

  for (const ws of wss.clients) {
    if (allow(ws)) {
      ws.send(message);
    }
  }
};

const debouncedBroadcast = debounce(broadcast, 500); // 500ms debounce

const debouncedWithMaxWaitBroadcast = debounceWithMaxWait(broadcast, 500, 5000); // 500ms debounce, issue every 5 s

module.exports = {
  broadcast,
  debouncedBroadcast,
  debouncedWithMaxWaitBroadcast,
};
