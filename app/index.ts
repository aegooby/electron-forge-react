
import * as Electron from "electron";

import * as path from "path";
import * as fs from "fs";
import * as jszip from "jszip";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

if (require("electron-squirrel-startup"))
    Electron.app.quit();

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

function create_window(): void
{
    const window_preferences =
    {
        width: 800,
        height: 600,
        minHeight: 600,
        minWidth: 800,
        frame: false,
        titleBarStyle: "hiddenInset" as const,
        /** @todo Security flaw. */
        webPreferences:
        {
            contextIsolation: false,
//             nodeIntegration: true
        },
        icon: icon_image,
    };

    const main_window = new Electron.BrowserWindow(window_preferences);
    main_window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
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
