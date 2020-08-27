
import * as isSquirrel from "electron-squirrel-startup";
import * as unzip from "unzip-crx-3";
import * as electron from "electron";
import * as path from "path";
import * as fs from "fs";

const fsAsync = fs.promises;

if (isSquirrel) electron.app.quit();

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

const reactDevtoolsCrx = path.join(__dirname, "../../extensions/react-devtools.crx");
const reactDevtools = path.join(__dirname, "../../extensions/react-devtools");

const iconPath = path.join(__dirname, "icon.png");
var iconImage = electron.nativeImage.createFromPath(iconPath);
iconImage.isMacTemplateImage = true;
electron.app.dock.setIcon(iconImage);

let mainWindow;

async function unzipCrx()
{
    try { await unzip(reactDevtoolsCrx, reactDevtools); }
    catch (error) { console.error(error); }
}

async function createWindow()
{
    try
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
        mainWindow = new electron.BrowserWindow(windowPreferences);
        mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

        await electron.session.defaultSession.loadExtension(reactDevtools);
    }
    catch (error) { console.error(error); }
}

async function ready()
{
    try
    {
        await fsAsync.access(reactDevtools);
        createWindow();
    }
    catch (error)
    {
        await unzipCrx();
        createWindow();
    }
};

electron.app.on("ready", ready);

function windowAllClosed()
{
    if (process.platform !== "darwin")
        electron.app.quit();
}

electron.app.on("window-all-closed", windowAllClosed);

function activate()
{
    if (electron.BrowserWindow.getAllWindows().length === 0)
        createWindow();
}

electron.app.on("activate", activate);
