export default class Heartbeat {

    HEARTBEAT_INTERVAL = 5000;

    constructor(private wsServer: any, private ws: any) {
        this.ws.isAlive = true;
        this.ws.on('pong', this.heartbeat);
        this.startBeat();
    }

    startBeat() {
        setInterval(() => {
            this.wsServer.getWss().clients.forEach((ws) => {
                if (ws.isAlive === false) {
                    return ws.terminate();
                }
                this.ws.isAlive = false;
                ws.ping('', false, true);
            });
        }, this.HEARTBEAT_INTERVAL);
    }

    heartbeat() {
        this.ws.isAlive = true;
    }
}
