import refresh, {
  markForRefresh,
  refreshIfMarkedAndVisible,
} from "/js/autoRefresh.js";

let socket;

function getWebSocketUrl() {
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  const host = window.location.host; // hostname + port
  return `${protocol}://${host}`;
}

function connectWebsocket() {
  // This connection is designed to notify connected clients about
  // new messages sent to the server, not to send messages to clients.
  //
  // - The WebSocket connection is established on page load.
  // - The connection is suspended when page visibility becomes hidden
  //   to save resources.

  socket = new WebSocket(getWebSocketUrl());

  socket.onopen = () => {
    console.log("WebSocket connected");
  };

  socket.onclose = () => {
    console.log("WebSocket closed");
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };

  socket.onmessage = (event) => {
    console.log("WebSocket receives refresh command:", event.data);

    if (event.data === "refreshForDbUpdated") {
      markForRefresh();
      refreshIfMarkedAndVisible();
    }
  };
}

function disconnectWebsocket() {
  socket?.close();
}

export { connectWebsocket, disconnectWebsocket };
