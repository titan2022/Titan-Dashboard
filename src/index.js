const { app, BrowserWindow, webContents } = require("electron");
const { join } = require("path");
const UDPServer = require("./networking/UDPServer");

const loadGenPage = false;

if (require("electron-squirrel-startup")) {
	app.quit();
}

const createWindow = () => {
	const mainWindow = new BrowserWindow({
		width: !loadGenPage?800:1280,
		height: !loadGenPage?600:800,
        autoHideMenuBar: true,
        resizable: true,
		title: "Titan Dashboard",
		webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
			preload: join(__dirname, "preload.js"),
		},
	});

	if (!loadGenPage){
		mainWindow.loadFile(join(__dirname, "index.html"));
	} else {
		mainWindow.loadFile(join(__dirname, "gen/index.html"));
	}

	mainWindow.webContents.on('did-finish-load', function () {
		let client = new UDPServer();
		client.start();

		client.on("pose", (pos, rot) => {
			try {
				mainWindow.webContents.send("pos", pos);
				mainWindow.webContents.send("rot", rot);
			} catch (err) {
				console.log(err);
			}
		});

		client.on("prepose", (pos, rot) => {
			try {
				mainWindow.webContents.send("prepos", pos);
				mainWindow.webContents.send("prerot", pos);
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