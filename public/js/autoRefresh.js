let refreshTimeout;

function refresh() {
  if (refreshTimeout) return;
  refreshTimeout = setTimeout(() => {
    document.cookie = "wsRefresh=true;path=/";
    sessionStorage.setItem("suppressBroadcast", true); // suppress broadcast to other tabs (see BroadcastChannel)
    location.reload();
    refreshTimeout = null; // reset after reload attempt
  }, 100);
}

// Handle tab visibility and connection status

// When tab is not visible, there is no need, eg, to keep the ws connection
// alive so disconnect it. New messages might have been posted while tab
// was not visible and not connected to server via WebSockets: reload the
// page to fetch them.

// Specify the connections to be disconnected as an array disconnectFns

// Similarly, if connection is lost, reload to page to fetch any updated data

function setupAutoRefreshListeners(disconnectFns) {
  document.onvisibilitychange = () => {
    if (document.visibilityState === "hidden") {
      disconnectFns.forEach((fn) => fn());
    } else {
      refresh();
    }
  };

  document.addEventListener("online", refresh);
}

export default refresh;
export { setupAutoRefreshListeners };
