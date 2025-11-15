(() => {
  let socket;

  function getWebSocketUrl() {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = window.location.host; // hostname + port
    return `${protocol}://${host}`;
  }

  function refresh() {
    document.cookie = "wsRefresh=true;path=/";
    location.reload();
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

  // Handle tab visibility
  document.onvisibilitychange = () => {
    console.log("Tab is", document.visibilityState);

    if (document.visibilityState === "hidden") {
      socket?.close();
    } else if (socket?.readyState !== WebSocket.OPEN) {
      // No: connectSocket();
      // new messages might have been posted while tab was not visible
      // and not connected to server via WebSockets: reload the page
      // to fetch them.
      refresh();
    }
  };

  connectSocket(); // Initial connection
})();
