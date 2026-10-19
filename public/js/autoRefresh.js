let refreshTimeout;
let needsRefresh = document.hidden;

function refresh() {
  if (refreshTimeout) return;
  refreshTimeout = setTimeout(() => {
    document.cookie = "autoRefresh=true;path=/";
    location.reload();
    refreshTimeout = null; // reset after reload attempt
  }, 100);
}

// Handle tab visibility and connection status

// When tab is not visible, the ws connection and broadcast channel connections
// are kept alive, so that new messages or events are still captured. This allows
// mark a tab to be reloaded, and: 1) reload immediately if the tab is visible,
// or 2) reload it as soon as it becomes visible again

// Instead, if connection is lost, reload to page to fetch any event
// that might have been occurred while offline

// Refresh also if page is reloaded from bfcache (there might be a new state)
// See: https://neuraldemy.com/handling-bfcache-with-active-websocket-connections-in-react/
//

function setupAutoRefreshListeners() {
  document.onvisibilitychange = () => {
    refreshIfMarkedAndVisible();
  };

  document.addEventListener("online", refresh);
  window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
      // The page was restored from the bfcache: re-fetch data
      refresh();
    }
  });
}

// Trigger when data is modified or invalidated
function markForRefresh() {
  needsRefresh = true;
  console.log("marked for refresh");
}

function refreshIfVisible() {
  if (!document.hidden) {
    refresh();
  }
}

function refreshIfMarkedAndVisible() {
  if (needsRefresh) refreshIfVisible();
}

function refreshIfMarked() {
  if (needsRefresh) refresh();
}

export default refresh;
export {
  setupAutoRefreshListeners,
  markForRefresh,
  refreshIfVisible,
  refreshIfMarkedAndVisible,
  refreshIfMarked,
};
