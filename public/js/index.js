const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const post = 8080;
const publicPath = path.join(__dirname, 'public');

const server = http.createServer((req, res) => {
    let file = path.basename(req.url);
    if(!file) {
        file = '/chatroom.html';
    }
    const filePath = path.join(publicPath, file);
    if(path.extname(filePath) === '.html') {
        res.setHeader('content-type', 'text/html; charset=utf-8');
    }
    if(!fs.existsSync(filePath)) {
        res.statusCode = 404;
        res.end();
        return;
    }
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if(err) {
            res.statusCode = 500;
            res.end();
            return;
        }
        res.end(data);
    });
});

server.listen(post, hostname, () => {
    console.log(`Server running at http://${hostname}:${post}`);
});