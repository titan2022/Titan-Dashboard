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
        this.server = dgram.createSocket("udp4");

        this.server.bind(5800, () => {
            console.log("Server binded");
        });

        this.server.on("listening", () => {
            console.log(`Server started at localhost:${this.server.address().port}`);
        });

        this.server.on("message", (msg, info) => {
            this.handleData(msg);
        });
    }

    handleData(msg) {
        
    }
}