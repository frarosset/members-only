const { debounce, debounceWithMaxWait } = require("../utils/debounce.js");

const broadcast = (wss, message) => {
  console.log("Broadcasting to ", wss.clients.size, "connected clients");
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
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
