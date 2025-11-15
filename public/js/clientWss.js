(() => {
  let socket;

  const messageList = document.querySelector(".messages_list");

  function getWebSocketUrl() {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const host = window.location.host; // hostname + port
    return `${protocol}://${host}`;
  }

  function connectSocket() {
    // This connection is designed to notify connected clients about
    // new messages sent to the server, not to send messages to clients.
    //
    // - The WebSocket connection is established on page load.
    // - The connection is suspended when page visibility becomes hidden
    //   to save resources.
    // - Incoming HTML replaces the message list dynamically, avoiding full
    //   page reloads (TODO).

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
      console.log("WebSocket receives updated messages list");
      location.reload(); /* temporary */
      //   const dataObj = JSON.parse(event.data);  /* TODO */
      //   messageList.innerHTML = dataObj.messageListHtml;  /* TODO */
      //   dateFormatter();  /* TODO */
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
      location.reload();
    }
  };

  connectSocket(); // Initial connection
})();
