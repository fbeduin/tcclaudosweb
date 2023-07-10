module.exports = {
    devServer: {
        host: 'localhost',
        hot: true,
        disableHostCheck: true,
        proxy: {
            '/api': {
                target: 'http://localhost:8001/',
                ws: true,
                changeOrigin: true
            }
        }
    }
}