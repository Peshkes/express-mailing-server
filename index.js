const server = require('./api/server.js');

const HOST = 'localhost';
const PORT = process.env.PORT || 49152;

server.listen(PORT, () => {
    console.log(`Server started at ${HOST}:${PORT}`);
})