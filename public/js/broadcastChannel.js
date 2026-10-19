import {
  markForRefresh,
  refreshIfMarked,
  refreshIfMarkedAndVisible,
} from "/js/autoRefresh.js";

// Multitab logout
// https://dev.to/highflyer910/the-multi-tab-logout-problem-nobody-warned-you-about-2jil
// https://www.linkedin.com/pulse/broadcastchannel-react-how-sync-logout-across-multiple-akila-nilusha-apl6c

let channel;
const allowedMessagesActions = {
  "user-signed-up": "deferToVisible",
  "user-logged-in": "deferToVisible",
  "user-logged-out": "immediate",
  "user-db-updated": "deferToVisible",
};
const allowedMessages = Object.keys(allowedMessagesActions);

function postMessageOnDOMContentLoadedHandler() {
  window.removeEventListener(
    "DOMContentLoaded",
    postMessageOnDOMContentLoadedHandler,
  );

  // Determine if a specific flash message state exists from the window object
  let message = String(window.userFlashAction) || null;

  if (allowedMessages.includes(message)) {
    postMessage(message);
  }
}

function postMessage(message) {
  if (message) {
    // Broadcast the custom message
    channel.postMessage(message);
  }
}

function connectChannel() {
  channel = new BroadcastChannel("user-tabs");

  // Listen for custom messages from other tabs
  channel.onmessage = (event) => {
    const action = allowedMessagesActions[event.data];

    // Handle different broadcast types
    switch (action) {
      case "immediate":
        markForRefresh();
        refreshIfMarked();
        break;
      case "deferToVisible":
        markForRefresh();
        refreshIfMarkedAndVisible();
        break;
      default:
        break;
    }
  };

  // On load, if needed, broadcast to others
  window.addEventListener(
    "DOMContentLoaded",
    postMessageOnDOMContentLoadedHandler,
  );
}

function disconnectChannel() {
  channel?.close();
}

export { connectChannel, disconnectChannel };
