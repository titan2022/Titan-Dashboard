const { app, BrowserWindow, webContents } = require("electron");
const { join } = require("path");
const UDPServer = require("./networking/UDPServer");

if (require("electron-squirrel-startup")) {
  	app.quit();
}

const createWindow = () => {
  	const mainWindow = new BrowserWindow({
    	width: 800,
    	height: 600,
        autoHideMenuBar: true,
        resizable: true,
		title: "Titan Dashboard",
    	webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
    	  	preload: join(__dirname, "preload.js"),
    	},
  	});

  	mainWindow.loadFile(join(__dirname, "index.html"));

	

	mainWindow.webContents.on('did-finish-load', function () {
		let client = new UDPServer();
		client.start();

		client.on("pose", (pos, rot) => {
			// console.log(2, pos, rot)
			try {
				mainWindow.webContents.send("pos", pos);
				mainWindow.webContents.send("rot", rot);
			} catch (err) {
				console.log(err);
			}
		});
	});
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  	if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  	if (BrowserWindow.getAllWindows().length === 0) createWindow();
});