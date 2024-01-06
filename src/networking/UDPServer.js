const { EventEmitter } = require("stream");
const dgram = require("dgram");

/**
 * UDP server for quick debugging and development purposes
 */
module.exports =  class UDPServer extends EventEmitter {
    constructor() {
        super();
        this.server;
    }

    /**
     * Starts UDP server
     */
    start() {
        console.log("Starting server...");
        this.server = dgram.createSocket("udp4");

        this.server.bind(5800, () => {
            console.log("Server binded");
        });

        this.server.on("listening", () => {
            console.log(`Server started at localhost:${this.server.address().port}`);
        });

        this.server.on("message", (msg, info) => {
            console.log(msg)
            this.handleData(msg);
        });
    }

    handleData(msg) {
        const type = String.fromCharCode(msg[0]);
        
        switch (type) {
            case 'd':
                this.handleVector(msg);
                break;
        }
    }

    handleVector(msg) {
        const x = msg.readDoubleLE(8);
        const y = msg.readDoubleLE(16);
        const z = msg.readDoubleLE(24);
        let name = msg.slice(40, msg.length);
        name = name.toString().slice(0, name.indexOf("\n")).replace(/\W/g, "");
        
        this.emit(name, [x, y, z]);
    }
}