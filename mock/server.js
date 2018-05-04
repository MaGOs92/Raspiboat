const express = require('express');
const expressWs = require('express-ws');

const app = express();
const wsServer = expressWs(app);

// Websocket connection to
app.ws('/motors', (ws, req) => {

    ws.on('message', msg => {
      console.log('Message received : ', msg);
    });

    ws.on('close', () => {
      console.log('WS closed');
    });

    ws.on('error', (err) => {
        console.error('Motors ws error : ', err);
    });

    // Start heartbeat
    // const heartBeat = new Heartbeat(wsServer, ws);
});

app.listen(3000);
