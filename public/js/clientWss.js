(() => {
  let socket, channel;

  function getWebSocketUrl() {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = window.location.host; // hostname + port
    return `${protocol}://${host}`;
  }

  function refresh() {
    document.cookie = "wsRefresh=true;path=/";
    sessionStorage.setItem("suppressBroadcast", true); // suppress broadcast to other tabs (see BroadcastChannel)
    location.reload();
  }

  function refreshOtherTabs() {
    if (sessionStorage.getItem("suppressBroadcast")) {
      sessionStorage.removeItem("suppressBroadcast");
    } else {
      channel.postMessage("refresh-other-tabs");
    }
  }

  function connectSocket() {
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

      refresh();
    };
  }

  function connectChannel() {
    // Refresh other tabs if one gets updated...to update them too

    channel = new BroadcastChannel("user-tabs");

    // Listen for refresh requests from other tabs
    channel.onmessage = (event) => {
      if (
        event.data === "refresh-other-tabs" &&
        !sessionStorage.getItem("suppressBroadcast") // avoid infinite loops
      ) {
        sessionStorage.setItem("suppressBroadcast", true);
        refresh();
      }
    };

    // On load, if not suppressed, broadcast to others
    window.addEventListener("DOMContentLoaded", refreshOtherTabs);
  }

  function disconnectChannel() {
    window.removeEventListener("DOMContentLoaded", refreshOtherTabs);
    channel?.close();
  }

  // Handle tab visibility
  document.onvisibilitychange = () => {
    console.log("Tab is", document.visibilityState);

    if (document.visibilityState === "hidden") {
      socket?.close();
      disconnectChannel();
    } else {
      // if (socket?.readyState !== WebSocket.OPEN) {
      // No: connectSocket();
      // new messages might have been posted while tab was not visible
      // and not connected to server via WebSockets: reload the page
      // to fetch them.
      refresh();
    }
  };

  connectSocket(); // Initial connection
  connectChannel();
})();
