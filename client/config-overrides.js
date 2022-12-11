module.exports = function override (config, env) {
    console.log('override');

    let loaders = config.resolve;

    loaders.fallback = {
        "stream": require.resolve("stream-browserify"),
        "crypto": require.resolve("crypto-browserify"),
        "os": require.resolve("os-browserify"),
    }
    
    return config
}