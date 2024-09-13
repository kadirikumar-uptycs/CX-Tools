let config = {};

if (process.env.NODE_ENV === 'production')
    config.SERVER_BASE_ADDRESS = "https://server-cxtools.uptycs.dev";
else
    config.SERVER_BASE_ADDRESS = "http://localhost:17291";
export default config;