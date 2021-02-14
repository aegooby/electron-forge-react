
import * as Electron from "electron";

import * as path from "path";
import * as fs from "fs";
import * as jszip from "jszip";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

function squirrel(): void
{
    {
        if (process.platform !== "win32")
            return;

        const squirrel_command: string = process.argv[1];
        switch (squirrel_command)
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

/** @todo Minor security issue. */
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";


const icon_path = path.join(__dirname, "icon.png");
const icon_image = Electron.nativeImage.createFromPath(icon_path);
icon_image.isMacTemplateImage = true;
Electron.app.dock.setIcon(icon_image);

const extensions_dir = path.join(__dirname, "../../extensions");
const react_devtools_zip = path.join(extensions_dir, "react-devtools.zip");
const react_devtools_dir = path.join(extensions_dir, "react-devtools");

async function unzip_devtools(): Promise<void>
{
    const buffer = await fs.promises.readFile(path.resolve(react_devtools_zip));
    const zip = await jszip.loadAsync(buffer);
    const keys = Object.keys(zip.files);
    async function unzip(filename: string): Promise<void>
    {
        const is_file = !zip.files[filename].dir;
        const full_path = path.join(extensions_dir, filename);
        const directory = is_file && path.dirname(full_path) || full_path;
        const content = await zip.files[filename].async("nodebuffer");

        await fs.promises.mkdir(directory, { recursive: true });
        if (is_file)
            await fs.promises.writeFile(full_path, content);
    }
    await Promise.all(keys.map(unzip));
}

async function ready(): Promise<void>
{
    try { await fs.promises.access(react_devtools_dir); }
    catch (error) { await unzip_devtools(); }
    try
    {
        create_window();
        await Electron.session.defaultSession.loadExtension(react_devtools_dir);
    }
    catch (error) { console.log(error); }
}

function create_window(): Electron.BrowserWindow
{
    const window_preferences =
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
        icon: icon_image,
    };

    const main_window = new Electron.BrowserWindow(window_preferences);
    main_window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    function full_screen(): void
    {
        main_window.webContents.send("full-screen");
    }
    main_window.on("enter-full-screen", full_screen);
    main_window.on("leave-full-screen", full_screen);

    return main_window;
}

Electron.app.on("ready", ready);

function window_all_closed(): void
{
    if (process.platform !== "darwin")
        Electron.app.quit();
}
Electron.app.on("window-all-closed", window_all_closed);

function activate(): void
{
    if (Electron.BrowserWindow.getAllWindows().length === 0)
        create_window();
}
Electron.app.on("activate", activate);
