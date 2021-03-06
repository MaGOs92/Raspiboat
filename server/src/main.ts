import * as express from 'express';
import * as expressWs from 'express-ws';
import * as path from 'path';

import Heartbeat from './heartbeat';
import ServoController from './servo';
import ESCController from './esc';
import MotorController from './motor';

const app = express();
const wsServer = expressWs(app);

// Serve the webapp
const webappPath = path.join(__dirname, '..', '..', 'dist');

app.use(express.static(webappPath));

app.get('/', (req, res) => {
    res.sendFile(path.join(webappPath, 'index.html'));
});

// Websocket connection to
app.ws('/motors', (ws, req) => {

    const servoController = new ServoController();
    const escController = new ESCController();

    servoController.calibrate();
    escController.calibrate();

    ws.on('message', msg => {
        const data = JSON.parse(msg);
        escController.setPwm(data.speed);
        servoController.setPwm(data.direction);
    });

    ws.on('close', () => {
        servoController.calibrate();
        escController.calibrate();
    });

    ws.on('error', (err) => {
        console.error('Motors ws error : ', err);
    });

    // Start heartbeat
    // FIXME : /home/pi/raspiboat/server/lib/heartbeat.js:24
    // this.ws.isAlive = true; => TypeError: Cannot set property 'isAlive' of undefined
    // const heartBeat = new Heartbeat(wsServer, ws);
});

app.listen(3000);
