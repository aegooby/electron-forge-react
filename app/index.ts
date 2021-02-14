
import * as Electron from "electron";

import * as path from "path";
import * as fs from "fs";
import * as jszip from "jszip";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

/** @todo Minor security issue. */
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

function squirrel(): void
{
    {
        if (process.platform !== "win32")
            return;

        const squirrelCommand: string = process.argv[1];
        switch (squirrelCommand)
        {
            case "--squirrel-install":
                Electron.app.quit();
                break;
            case "--squirrel-updated":
                Electron.app.quit();
                break;
            case '--squirrel-uninstall':
                Electron.app.quit();
                break;
            case '--squirrel-obsolete':
                Electron.app.quit();
                break;
        }
    }
}

squirrel();

const iconPath = path.join(__dirname, "icon.png");
const iconImage = Electron.nativeImage.createFromPath(iconPath);
iconImage.isMacTemplateImage = true;
Electron.app.dock.setIcon(iconImage);

const extensionsDir = path.join(__dirname, "../../extensions");
const reactDevtoolsZip = path.join(extensionsDir, "react-devtools.zip");
const reactDevtoolsDir = path.join(extensionsDir, "react-devtools");

async function unzipDevtools(): Promise<void>
{
    const buffer = await fs.promises.readFile(path.resolve(reactDevtoolsZip));
    const zip = await jszip.loadAsync(buffer);
    const keys = Object.keys(zip.files);
    async function unzip(filename: string): Promise<void>
    {
        const isFile = !zip.files[filename].dir;
        const fullPath = path.join(extensionsDir, filename);
        const directory = isFile && path.dirname(fullPath) || fullPath;
        const content = await zip.files[filename].async("nodebuffer");

        await fs.promises.mkdir(directory, { recursive: true });
        if (isFile)
            await fs.promises.writeFile(fullPath, content);
    }
    await Promise.all(keys.map(unzip));
}

async function ready(): Promise<void>
{
    try { await fs.promises.access(reactDevtoolsDir); }
    catch (error) { await unzipDevtools(); }
    try
    {
        createWindow();
        await Electron.session.defaultSession.loadExtension(reactDevtoolsDir);
    }
    catch (error) { console.log(error); }
}

function createWindow(): Electron.BrowserWindow
{
    const windowPreferences =
    {
        width: 1366,
        height: 768,
        minWidth: 1024,
        minHeight: 576,
        frame: false,
        titleBarStyle: "hiddenInset" as const,
        webPreferences:
        {
            contextIsolation: true,
            nodeIntegration: false,
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY
        },
        icon: iconImage,
    };

    const mainWindow = new Electron.BrowserWindow(windowPreferences);
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    function fullScreen(): void
    {
        mainWindow.webContents.send("full-screen");
    }
    mainWindow.on("enter-full-screen", fullScreen);
    mainWindow.on("leave-full-screen", fullScreen);

    return mainWindow;
}

Electron.app.on("ready", ready);

function windowAllClosed(): void
{
    if (process.platform !== "darwin")
        Electron.app.quit();
}
Electron.app.on("window-all-closed", windowAllClosed);

function activate(): void
{
    if (Electron.BrowserWindow.getAllWindows().length === 0)
        createWindow();
}
Electron.app.on("activate", activate);
