import http from 'http';
import express from 'express';

const app = express();
app.server = http.createServer(app);

app.get('/health', (req, res) => res.send('OK!'));

app.server.listen(8080);