module.exports = {
    "/api/*": {
        "target": "https://rota.dev.pliant.io",
        "secure": true,
        "logLevel": "debug",
        "headers": {
            "Connection": "keep-alive"
        },
        "changeOrigin": true
    }
}
