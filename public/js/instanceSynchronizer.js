import { setupAutoRefreshListeners } from "/js/autoRefresh.js";
import { connectChannel, disconnectChannel } from "/js/broadcastChannel.js";

setupAutoRefreshListeners([disconnectChannel]);

// Initial connections
connectChannel();
