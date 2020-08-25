const { app, BrowserWindow, session, nativeImage } = require("electron");
const path = require("path");

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

const reactDevtools = path.join(__dirname, "../../react-devtools");

const iconPath = path.join(__dirname, "icon.png");
var iconImage = nativeImage.createFromPath(iconPath);
iconImage.isMacTemplateImage = true;
app.dock.setIcon(iconImage);

let mainWindow;

if (require("electron-squirrel-startup"))
    app.quit();

async function ready()
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
