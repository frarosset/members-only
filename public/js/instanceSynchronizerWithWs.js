import { setupAutoRefreshListeners } from "/js/autoRefresh.js";
import { connectChannel } from "/js/broadcastChannel.js";
import { connectWebsocket } from "/js/clientWs.js";

setupAutoRefreshListeners();

// Initial connections
connectWebsocket();
connectChannel();
