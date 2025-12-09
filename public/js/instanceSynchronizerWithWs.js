import { setupAutoRefreshListeners } from "/js/autoRefresh.js";
import { connectChannel, disconnectChannel } from "/js/broadcastChannel.js";
import { connectWebsocket, disconnectWebsocket } from "/js/clientWs.js";

setupAutoRefreshListeners([disconnectWebsocket, disconnectChannel]);

// Initial connections
connectWebsocket();
connectChannel();
