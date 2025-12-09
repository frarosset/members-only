import refresh from "/js/autoRefresh.js";

let channel;

function refreshOtherTabs() {
  window.removeEventListener("DOMContentLoaded", refreshOtherTabs);
  if (sessionStorage.getItem("suppressBroadcast")) {
    sessionStorage.removeItem("suppressBroadcast");
  } else {
    channel.postMessage("refresh-other-tabs");
  }
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
  channel?.close();
}

export { connectChannel, disconnectChannel };
