let config = {};

// config.SERVER_BASE_ADDRESS = "http://3.92.96.200:17291";

if (process.env.NODE_ENV === 'production')
    config.SERVER_BASE_ADDRESS = "https://server-cxtools.uptycs.dev";
else
    config.SERVER_BASE_ADDRESS = "http://localhost:17291";
export default config;