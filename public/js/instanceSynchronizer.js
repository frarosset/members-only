import { setupAutoRefreshListeners } from "/js/autoRefresh.js";
import { connectChannel } from "/js/broadcastChannel.js";

setupAutoRefreshListeners();

// Initial connections
connectChannel();
