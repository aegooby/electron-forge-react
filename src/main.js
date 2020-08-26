
import isSquirrel from "electron-squirrel-startup";
import unzip from "unzip-crx-3";
import { app, BrowserWindow, session, nativeImage } from "electron";
import path from "path";
import fs from "fs";

if (isSquirrel) app.quit();

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

const reactDevtoolsCrx = path.join(__dirname, "../../extensions/react-devtools.crx");
const reactDevtools = path.join(__dirname, "../../extensions/react-devtools");

const iconPath = path.join(__dirname, "icon.png");
var iconImage = nativeImage.createFromPath(iconPath);
iconImage.isMacTemplateImage = true;
app.dock.setIcon(iconImage);

let mainWindow;

async function createWindow()
{
    const windowPreferences =
    {
        width: 800,
        height: 600,
        minHeight: 600,
        minWidth: 800,
        frame: false,
        webPreferences: { nodeIntegration: true },
        titleBarStyle: "hiddenInset",
        icon: iconImage,
    };
    mainWindow = new BrowserWindow(windowPreferences);
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

    await session.defaultSession.loadExtension(reactDevtools);
}

function ready()
{
    function unzipCrx()
    {
        unzip(reactDevtoolsCrx, reactDevtools)
            .then(function() { createWindow(); })
            .catch(function(error) { console.error(error); });
    }
    function accessHandler(error)
    {
        if (error)
            unzipCrx();
        else
            createWindow();
    }
    fs.access(reactDevtools, accessHandler);
};

app.on("ready", ready);

function windowAllClosed()
{
    if (process.platform !== "darwin")
        app.quit();
}

app.on("window-all-closed", windowAllClosed);

function activate()
{
    if (BrowserWindow.getAllWindows().length === 0)
        createWindow();
}

app.on("activate", activate);
