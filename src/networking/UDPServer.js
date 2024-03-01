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
            // console.log(msg)
            this.handleData(msg);
        });
    }

    handleData(msg) {
        const type = String.fromCharCode(msg[0]);
        
        switch (type) {
            case 'v':
                this.handleVector(msg);
                break;
            case 'p':
                this.handlePose(msg);
                break;
            case 't':
                this.handleVector(msg);
                break;
            default:
                break;
        }
    }

    handleVector(msg) {
        let name = msg.slice(1, 16);
        name = name.toString().slice(0, name.indexOf("\n")).replace(/\W/g, "");
        const x = msg.readDoubleLE(16);
        const y = msg.readDoubleLE(24);
        const z = msg.readDoubleLE(32);
        
        this.emit(name, [x, y, z]);
    }

    handlePose(msg) {
        let name = msg.slice(1, 16);
        name = name.toString().slice(0, name.indexOf("\n")).replace(/\W/g, "");
        const x = msg.readDoubleLE(16);
        const y = msg.readDoubleLE(24);
        const z = msg.readDoubleLE(32);
        const roll = msg.readDoubleLE(40);
        const pitch = msg.readDoubleLE(48);
        const yaw = msg.readDoubleLE(56);
        
        this.emit(name, [x, y, z], [roll, pitch, yaw]);
    }

    handleTag(msg) {

    }
}